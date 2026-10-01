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
  fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
}

function readDb() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data) || [];
  } catch (err) {
    console.error('Error reading movie-munchies-db:', err);
    return [];
  }
}

function writeDb(records) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(records, null, 2), 'utf-8');
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
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = reqUrl.pathname;

  // ==========================================
  // API: movie-munchies-db Endpoints
  // ==========================================
  if (pathname === '/api/pairings') {
    if (req.method === 'GET') {
      const records = readDb();
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

          const records = readDb();
          const filtered = records.filter(r => r.id !== newRecord.id);
          const updated = [newRecord, ...filtered];
          writeDb(updated);

          const confirmation = {
            success: true,
            databaseName: 'movie-munchies-db',
            recordId: newRecord.id,
            timestamp: new Date().toLocaleTimeString(),
            movieTitle: newRecord.movie?.title || 'Unknown Film',
            category: (newRecord.movie?.genres || []).join(', '),
            runtime: `${newRecord.movie?.runtime || 0}m (${newRecord.movie?.runtimeCategory || 'standard'})`,
            savedBy: newRecord.savedBy || 'User 1'
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
      writeDb([]);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'All pairings cleared from movie-munchies-db' }));
      return;
    }
  }

  // DELETE /api/pairings/:id
  if (pathname.startsWith('/api/pairings/') && req.method === 'DELETE') {
    const id = pathname.replace('/api/pairings/', '');
    const records = readDb();
    const updated = records.filter(r => r.id !== id);
    writeDb(updated);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, deletedId: id }));
    return;
  }

  // GET /api/health
  if (pathname === '/api/health') {
    const records = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      database: 'movie-munchies-db',
      totalRecords: records.length,
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
