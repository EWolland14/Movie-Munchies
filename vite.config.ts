import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function movieMunchiesDbDevPlugin(): Plugin {
  const DB_FILE = path.resolve(__dirname, 'data', 'movie-munchies-db.json');

  const ensureDb = () => {
    if (!fs.existsSync(path.dirname(DB_FILE))) {
      fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  };

  const readDb = () => {
    ensureDb();
    try {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')) || [];
    } catch {
      return [];
    }
  };

  const writeDb = (records: any[]) => {
    ensureDb();
    fs.writeFileSync(DB_FILE, JSON.stringify(records, null, 2), 'utf-8');
  };

  return {
    name: 'movie-munchies-db-dev-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';

        if (url === '/api/pairings' && req.method === 'GET') {
          const records = readDb();
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(records));
          return;
        }

        if (url === '/api/pairings' && req.method === 'POST') {
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
              const filtered = records.filter((r: any) => r.id !== newRecord.id);
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

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(confirmation));
            } catch {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
            }
          });
          return;
        }

        if (url === '/api/pairings' && req.method === 'DELETE') {
          writeDb([]);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, message: 'All pairings cleared from movie-munchies-db' }));
          return;
        }

        if (url.startsWith('/api/pairings/') && req.method === 'DELETE') {
          const id = url.replace('/api/pairings/', '');
          const records = readDb();
          writeDb(records.filter((r: any) => r.id !== id));
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, deletedId: id }));
          return;
        }

        if (url === '/api/health') {
          const records = readDb();
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status: 'healthy', database: 'movie-munchies-db', totalRecords: records.length }));
          return;
        }

        next();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), movieMunchiesDbDevPlugin()],
  server: {
    port: 3000,
    open: false,
    host: true, // Allow external devices / phones on same local network to connect!
  }
});
