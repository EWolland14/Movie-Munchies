import { SavedPairing, UserProfile } from '../types';

export const DB_NAME = 'movie-munchies-db';
export const STORE_NAME = 'saved_pairings';
export const USERS_STORE_NAME = 'users';
export const DB_VERSION = 2;

const USERS_CACHE_KEY = 'movie_munchies_db_users_v2';
const BROADCAST_CHANNEL_NAME = 'movie_munchies_db_sync_channel';

// Cross-tab real-time event bus
export const dbBroadcast = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel(BROADCAST_CHANNEL_NAME)
  : null;

export interface DatabaseWriteConfirmation {
  success: boolean;
  databaseName: string;
  recordId: string;
  timestamp: string;
  movieTitle: string;
  category: string;
  runtime: string;
  savedBy?: string;
  savedByAvatar?: string;
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
      if (!db.objectStoreNames.contains(USERS_STORE_NAME)) {
        db.createObjectStore(USERS_STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ==========================================
// USER ACCOUNTS in movie-munchies-db
// ==========================================

export async function getAllUsersFromDatabase(): Promise<UserProfile[]> {
  // 1. Fetch live registered accounts from server with cache-busting
  try {
    const res = await fetch(`/api/users?_t=${Date.now()}`, { cache: 'no-store' });
    if (res.ok) {
      const users: UserProfile[] = await res.json();
      if (Array.isArray(users)) {
        try {
          localStorage.setItem(USERS_CACHE_KEY, JSON.stringify(users));
        } catch {
          // Ignore
        }
        return users;
      }
    }
  } catch (err) {
    console.warn('[movie-munchies-db] Server users fetch failed, reading cache:', err);
  }

  // 2. Fallback to localStorage cache
  try {
    const cached = localStorage.getItem(USERS_CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  } catch {
    return [];
  }
}

export async function createUserInDatabase(username: string, emoji = '🍿'): Promise<UserProfile> {
  const trimmed = username.trim();
  if (!trimmed) throw new Error('Username is required');

  // 1. Call server API
  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: trimmed, emoji }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.user) {
        // Update local cache
        const currentUsers = await getAllUsersFromDatabase();
        const updated = [...currentUsers.filter(u => u.username.toLowerCase() !== trimmed.toLowerCase()), data.user];
        try {
          localStorage.setItem(USERS_CACHE_KEY, JSON.stringify(updated));
        } catch {
          // Ignore
        }
        dbBroadcast?.postMessage({ type: 'USERS_UPDATED', user: data.user });
        return data.user;
      }
    }
  } catch (err) {
    console.warn('[movie-munchies-db] Server user creation failed, creating local offline user:', err);
  }

  // 2. Offline fallback
  const fallbackUser: UserProfile = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    username: trimmed,
    emoji,
    createdAt: new Date().toISOString(),
  };

  try {
    const cachedRaw = localStorage.getItem(USERS_CACHE_KEY) || '[]';
    const cached: UserProfile[] = JSON.parse(cachedRaw);
    const updated = [...cached.filter(u => u.username.toLowerCase() !== trimmed.toLowerCase()), fallbackUser];
    localStorage.setItem(USERS_CACHE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore
  }

  dbBroadcast?.postMessage({ type: 'USERS_UPDATED', user: fallbackUser });
  return fallbackUser;
}

// ==========================================
// PAIRINGS in movie-munchies-db
// ==========================================

export async function savePairingToDatabase(pairing: SavedPairing): Promise<DatabaseWriteConfirmation> {
  const recordWithMeta: SavedPairing = {
    ...pairing,
    databaseName: DB_NAME,
    savedBy: pairing.savedBy || 'Guest',
    savedByAvatar: pairing.savedByAvatar || '🍿',
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

  // Notify other tabs via broadcast
  dbBroadcast?.postMessage({ type: 'PAIRINGS_UPDATED', pairing: recordWithMeta });

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
    savedByAvatar: recordWithMeta.savedByAvatar,
  };
}

export async function getAllPairingsFromDatabase(userFilter?: string): Promise<SavedPairing[]> {
  // 1. Fetch live shared pairings from movie-munchies-db server with strict anti-caching
  try {
    const query = new URLSearchParams();
    query.set('_t', Date.now().toString());
    if (userFilter && userFilter !== 'all') {
      query.set('user', userFilter);
    }
    const res = await fetch(`/api/pairings?${query.toString()}`, { cache: 'no-store' });
    if (res.ok) {
      const liveRecords: SavedPairing[] = await res.json();
      if (Array.isArray(liveRecords)) {
        // Cache to localStorage if fetching all
        if (!userFilter || userFilter === 'all') {
          try {
            localStorage.setItem(DB_NAME, JSON.stringify(liveRecords));
          } catch {
            // Ignore
          }
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
        let results = (req.result as SavedPairing[]) || [];
        if (userFilter && userFilter !== 'all') {
          results = results.filter((p) => p.savedBy?.toLowerCase() === userFilter.toLowerCase());
        }
        results.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
        resolve(results);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    // 3. Fallback to localStorage
    try {
      const stored = localStorage.getItem(DB_NAME);
      if (!stored) return [];
      let list: SavedPairing[] = JSON.parse(stored);
      if (userFilter && userFilter !== 'all') {
        list = list.filter((p) => p.savedBy?.toLowerCase() === userFilter.toLowerCase());
      }
      return list;
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

  dbBroadcast?.postMessage({ type: 'PAIRINGS_UPDATED', deletedId: id });
  return true;
}

export async function clearAllPairingsFromDatabase(userFilter?: string): Promise<boolean> {
  // 1. Clear on server
  try {
    const url = userFilter && userFilter !== 'all'
      ? `/api/pairings?user=${encodeURIComponent(userFilter)}`
      : '/api/pairings';
    await fetch(url, { method: 'DELETE' });
  } catch (err) {
    console.warn('[movie-munchies-db] Server clear failed:', err);
  }

  // 2. Clear in IndexedDB / localStorage
  if (!userFilter || userFilter === 'all') {
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

    try {
      localStorage.removeItem(DB_NAME);
    } catch {
      // Ignore
    }
  } else {
    try {
      const stored = localStorage.getItem(DB_NAME);
      if (stored) {
        const list: SavedPairing[] = JSON.parse(stored);
        localStorage.setItem(DB_NAME, JSON.stringify(list.filter((p) => p.savedBy?.toLowerCase() !== userFilter.toLowerCase())));
      }
    } catch {
      // Ignore
    }
  }

  dbBroadcast?.postMessage({ type: 'PAIRINGS_UPDATED', cleared: true });
  return true;
}

