import { SavedPairing } from '../types';

export const DB_NAME = 'movie-munchies-db';
export const STORE_NAME = 'saved_pairings';
export const DB_VERSION = 1;

export interface DatabaseWriteConfirmation {
  success: boolean;
  databaseName: string;
  recordId: string;
  timestamp: string;
  movieTitle: string;
  category: string;
  runtime: string;
  savedBy?: string;
}

export function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in current environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('movieTitle', 'movie.title', { unique: false });
        store.createIndex('savedAt', 'savedAt', { unique: false });
        store.createIndex('runtime', 'movie.runtime', { unique: false });
        store.createIndex('category', 'movie.genres', { unique: false, multiEntry: true });
        store.createIndex('savedBy', 'savedBy', { unique: false });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function savePairingToDatabase(pairing: SavedPairing): Promise<DatabaseWriteConfirmation> {
  const recordWithMeta: SavedPairing = {
    ...pairing,
    databaseName: DB_NAME,
    savedBy: pairing.savedBy || 'User 1',
  };

  // 1. Primary write to shared movie-munchies-db REST API (accessible to both users)
  let serverConfirmation: DatabaseWriteConfirmation | null = null;
  try {
    const res = await fetch('/api/pairings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recordWithMeta),
    });
    if (res.ok) {
      serverConfirmation = await res.json();
    }
  } catch (err) {
    console.warn('[movie-munchies-db] Server API write failed, falling back to local storage:', err);
  }

  // 2. Also persist to IndexedDB for client caching
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(recordWithMeta);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[movie-munchies-db] IndexedDB cache write failed:', err);
  }

  // 3. Also synchronize to localStorage for immediate resilience
  try {
    const existingRaw = localStorage.getItem(DB_NAME) || '[]';
    const existing: SavedPairing[] = JSON.parse(existingRaw);
    const filtered = existing.filter((p) => p.id !== pairing.id);
    localStorage.setItem(DB_NAME, JSON.stringify([recordWithMeta, ...filtered]));
  } catch (e) {
    console.error('Failed to sync to local storage backup:', e);
  }

  if (serverConfirmation) {
    return serverConfirmation;
  }

  const categoryStr = pairing.movie.genres.join(', ');
  const runtimeStr = `${pairing.movie.runtime} mins (${pairing.movie.runtimeCategory.toUpperCase()})`;

  return {
    success: true,
    databaseName: DB_NAME,
    recordId: pairing.id,
    timestamp: new Date().toLocaleTimeString(),
    movieTitle: pairing.movie.title,
    category: categoryStr,
    runtime: runtimeStr,
    savedBy: recordWithMeta.savedBy,
  };
}

export async function getAllPairingsFromDatabase(): Promise<SavedPairing[]> {
  // 1. Fetch live shared pairings from movie-munchies-db server
  try {
    const res = await fetch('/api/pairings');
    if (res.ok) {
      const liveRecords: SavedPairing[] = await res.json();
      if (Array.isArray(liveRecords)) {
        // Cache to localStorage
        try {
          localStorage.setItem(DB_NAME, JSON.stringify(liveRecords));
        } catch {
          // Ignore
        }
        return liveRecords.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
      }
    }
  } catch (err) {
    console.warn('[movie-munchies-db] Server fetch failed, reading from local cache:', err);
  }

  // 2. Fallback to IndexedDB if offline or server is unreachable
  try {
    const db = await openDatabase();
    return await new Promise<SavedPairing[]>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const results = (req.result as SavedPairing[]) || [];
        results.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
        resolve(results);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    // 3. Fallback to localStorage
    try {
      const stored = localStorage.getItem(DB_NAME);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}

export async function deletePairingFromDatabase(id: string): Promise<boolean> {
  // 1. Delete on server
  try {
    await fetch(`/api/pairings/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.warn('[movie-munchies-db] Server delete failed:', err);
  }

  // 2. Delete in IndexedDB
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Ignore
  }

  // 3. Delete in localStorage
  try {
    const stored = localStorage.getItem(DB_NAME);
    if (stored) {
      const list: SavedPairing[] = JSON.parse(stored);
      localStorage.setItem(DB_NAME, JSON.stringify(list.filter((p) => p.id !== id)));
    }
  } catch {
    // Ignore
  }

  return true;
}

export async function clearAllPairingsFromDatabase(): Promise<boolean> {
  // 1. Clear on server
  try {
    await fetch('/api/pairings', { method: 'DELETE' });
  } catch (err) {
    console.warn('[movie-munchies-db] Server clear failed:', err);
  }

  // 2. Clear in IndexedDB
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Ignore
  }

  // 3. Clear in localStorage
  try {
    localStorage.removeItem(DB_NAME);
  } catch {
    // Ignore
  }

  return true;
}

