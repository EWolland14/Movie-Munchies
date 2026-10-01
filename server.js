import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '8080', 10);
const DB_FILE = path.join(__dirname, 'data', 'movie-munchies-db.json');
const DIST_DIR = path.join(__dirname, 'dist');

// Ensure database file exists
if (!fs.existsSync(path.dirname(DB_FILE))) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
}
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ databaseName: 'movie-munchies-db', users: [], pairings: [] }, null, 2), 'utf-8');
}

function readDb() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return {
        databaseName: 'movie-munchies-db',
        users: [],
        pairings: parsed,
      };
    }
    return {
      databaseName: 'movie-munchies-db',
      users: Array.isArray(parsed.users) ? parsed.users : [],
      pairings: Array.isArray(parsed.pairings) ? parsed.pairings : [],
    };
  } catch (err) {
    console.error('Error reading movie-munchies-db:', err);
    return {
      databaseName: 'movie-munchies-db',
      users: [],
      pairings: [],
    };
  }
}

function writeDb(dbData) {
  try {
    const payload = {
      databaseName: 'movie-munchies-db',
      users: dbData.users || [],
      pairings: dbData.pairings || [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing movie-munchies-db:', err);
    return false;
  }
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
};

const server = http.createServer((req, res) => {
  // CORS & Strict Anti-Caching Headers for movie-munchies-db
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = reqUrl.pathname;

  // ==========================================
  // API: User Accounts in movie-munchies-db
  // ==========================================
  if (pathname === '/api/users') {
    if (req.method === 'GET') {
      const db = readDb();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(db.users));
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body);
          const username = (payload.username || '').trim();
          if (!username) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Username is required' }));
            return;
          }

          const db = readDb();
          const existing = db.users.find(u => u.username.toLowerCase() === username.toLowerCase());
          if (existing) {
            // Already created; return it
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, user: existing, alreadyExisted: true }));
            return;
          }

          const newUser = {
            id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            username: username,
            emoji: payload.emoji || '🍿',
            createdAt: new Date().toISOString(),
          };

          db.users.push(newUser);
          writeDb(db);

          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, user: newUser, databaseName: 'movie-munchies-db' }));
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
        }
      });
      return;
    }
  }

  // DELETE /api/users/:id
  if (pathname.startsWith('/api/users/') && req.method === 'DELETE') {
    const id = pathname.replace('/api/users/', '');
    const db = readDb();
    db.users = db.users.filter(u => u.id !== id && u.username !== id);
    writeDb(db);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, deletedId: id }));
    return;
  }

  // ==========================================
  // API: Pairings in movie-munchies-db
  // ==========================================
  if (pathname === '/api/pairings') {
    if (req.method === 'GET') {
      const db = readDb();
      const userFilter = reqUrl.searchParams.get('user');
      let records = db.pairings;
      if (userFilter) {
        records = records.filter(r => r.savedBy?.toLowerCase() === userFilter.toLowerCase());
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(records));
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const newRecord = JSON.parse(body);
          if (!newRecord.id) {
            newRecord.id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
          }
          newRecord.savedAt = newRecord.savedAt || new Date().toISOString();
          newRecord.databaseName = 'movie-munchies-db';

          const db = readDb();
          
          // Auto-register user if they don't exist yet
          if (newRecord.savedBy) {
            const hasUser = db.users.some(u => u.username.toLowerCase() === newRecord.savedBy.toLowerCase());
            if (!hasUser) {
              db.users.push({
                id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                username: newRecord.savedBy,
                emoji: newRecord.savedByAvatar || '🍿',
                createdAt: new Date().toISOString(),
              });
            }
          }

          const filtered = db.pairings.filter(r => r.id !== newRecord.id);
          db.pairings = [newRecord, ...filtered];
          writeDb(db);

          const confirmation = {
            success: true,
            databaseName: 'movie-munchies-db',
            recordId: newRecord.id,
            timestamp: new Date().toLocaleTimeString(),
            movieTitle: newRecord.movie?.title || newRecord.movieTitle || 'Unknown Film',
            category: (newRecord.movie?.genres || []).join(', ') || newRecord.genre || newRecord.category || '',
            runtime: newRecord.movie?.runtime ? `${newRecord.movie.runtime}m (${newRecord.movie.runtimeCategory || 'standard'})` : (newRecord.runtime || 'Standard'),
            savedBy: newRecord.savedBy || 'Guest',
            savedByAvatar: newRecord.savedByAvatar || '🍿'
          };

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(confirmation));
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
        }
      });
      return;
    }

    if (req.method === 'DELETE') {
      const userFilter = reqUrl.searchParams.get('user');
      const db = readDb();
      if (userFilter) {
        db.pairings = db.pairings.filter(p => p.savedBy?.toLowerCase() !== userFilter.toLowerCase());
      } else {
        db.pairings = [];
      }
      writeDb(db);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Pairings cleared from movie-munchies-db' }));
      return;
    }
  }

  // DELETE /api/pairings/:id
  if (pathname.startsWith('/api/pairings/') && req.method === 'DELETE') {
    const id = pathname.replace('/api/pairings/', '');
    const db = readDb();
    db.pairings = db.pairings.filter(r => r.id !== id);
    writeDb(db);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, deletedId: id }));
    return;
  }

  // GET /api/health
  if (pathname === '/api/health') {
    const db = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      database: 'movie-munchies-db',
      totalUsers: db.users.length,
      totalPairings: db.pairings.length,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // ==========================================
  // Static File Serving (from ./dist)
  // ==========================================
  let filePath = path.join(DIST_DIR, pathname === '/' ? 'index.html' : pathname);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA routing
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🎬 Movie & Munchies Server running on http://0.0.0.0:${PORT}`);
  console.log(`💾 Database: movie-munchies-db (${DB_FILE})`);
});
