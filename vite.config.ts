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
      fs.writeFileSync(DB_FILE, JSON.stringify({ databaseName: 'movie-munchies-db', users: [], pairings: [] }, null, 2), 'utf-8');
    }
  };

  const readDb = () => {
    ensureDb();
    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      if (Array.isArray(data)) {
        return { databaseName: 'movie-munchies-db', users: [], pairings: data };
      }
      return {
        databaseName: 'movie-munchies-db',
        users: Array.isArray(data.users) ? data.users : [],
        pairings: Array.isArray(data.pairings) ? data.pairings : [],
      };
    } catch {
      return { databaseName: 'movie-munchies-db', users: [], pairings: [] };
    }
  };

  const writeDb = (dbData: any) => {
    ensureDb();
    const payload = {
      databaseName: 'movie-munchies-db',
      users: dbData.users || [],
      pairings: dbData.pairings || [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf-8');
  };

  return {
    name: 'movie-munchies-db-dev-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const fullUrl = req.url || '';
        const [pathname, searchStr] = fullUrl.split('?');
        const searchParams = new URLSearchParams(searchStr || '');

        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        // User Accounts in movie-munchies-db
        if (pathname === '/api/users' && req.method === 'GET') {
          const db = readDb();
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(db.users));
          return;
        }

        if (pathname === '/api/users' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body);
              const username = (payload.username || '').trim();
              if (!username) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Username is required' }));
                return;
              }
              const db = readDb();
              const existing = db.users.find((u: any) => u.username.toLowerCase() === username.toLowerCase());
              if (existing) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, user: existing, alreadyExisted: true }));
                return;
              }
              const newUser = {
                id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                username,
                emoji: payload.emoji || '🍿',
                createdAt: new Date().toISOString(),
              };
              db.users.push(newUser);
              writeDb(db);
              res.statusCode = 201;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, user: newUser, databaseName: 'movie-munchies-db' }));
            } catch {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
            }
          });
          return;
        }

        if (pathname === '/api/pairings' && req.method === 'GET') {
          const db = readDb();
          const userFilter = searchParams.get('user');
          let records = db.pairings;
          if (userFilter) {
            records = records.filter((r: any) => r.savedBy?.toLowerCase() === userFilter.toLowerCase());
          }
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(records));
          return;
        }

        if (pathname === '/api/pairings' && req.method === 'POST') {
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
              if (newRecord.savedBy) {
                const hasUser = db.users.some((u: any) => u.username.toLowerCase() === newRecord.savedBy.toLowerCase());
                if (!hasUser) {
                  db.users.push({
                    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                    username: newRecord.savedBy,
                    emoji: newRecord.savedByAvatar || '🍿',
                    createdAt: new Date().toISOString(),
                  });
                }
              }

              const filtered = db.pairings.filter((r: any) => r.id !== newRecord.id);
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

        if (pathname === '/api/pairings' && req.method === 'DELETE') {
          const userFilter = searchParams.get('user');
          const db = readDb();
          if (userFilter) {
            db.pairings = db.pairings.filter((p: any) => p.savedBy?.toLowerCase() !== userFilter.toLowerCase());
          } else {
            db.pairings = [];
          }
          writeDb(db);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, message: 'All pairings cleared from movie-munchies-db' }));
          return;
        }

        if (pathname.startsWith('/api/pairings/') && req.method === 'DELETE') {
          const id = pathname.replace('/api/pairings/', '');
          const db = readDb();
          db.pairings = db.pairings.filter((r: any) => r.id !== id);
          writeDb(db);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, deletedId: id }));
          return;
        }

        if (pathname === '/api/health') {
          const db = readDb();
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            status: 'healthy',
            database: 'movie-munchies-db',
            totalUsers: db.users.length,
            totalPairings: db.pairings.length
          }));
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
