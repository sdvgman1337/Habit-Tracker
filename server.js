import express from 'express';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = process.env.DB_PATH || 'habits.db';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Database Setup
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    initDb();
  }
});

function initDb() {
  db.run(`CREATE TABLE IF NOT EXISTS habits (
    id TEXT PRIMARY KEY,
    telegram_id INTEGER,
    title TEXT,
    streak INTEGER DEFAULT 0,
    stage INTEGER DEFAULT 0,
    total_completions INTEGER DEFAULT 0,
    last_completed_date TEXT
  )`);
}

// Helpers
const getTodayString = () => new Date().toISOString().split('T')[0];

const daysBetween = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// API Endpoints

// GET /api/habits - Fetch habits and apply degradation logic
app.get('/api/habits', (req, res) => {
  const telegramId = req.headers['x-telegram-user-id'];

  if (!telegramId) {
    return res.status(400).json({ error: 'Missing X-Telegram-User-ID header' });
  }

  const query = `SELECT * FROM habits WHERE telegram_id = ?`;
  
  db.all(query, [telegramId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const today = getTodayString();
    const updates = [];
    const habits = rows.map(habit => {
      // Check for missed days
      if (habit.last_completed_date && habit.last_completed_date !== today) {
        const diff = daysBetween(today, habit.last_completed_date);
        
        // If missed more than 1 day (i.e., didn't do it yesterday), degrade
        if (diff > 1) {
          let newStage = habit.stage - 1;
          if (newStage < 0) newStage = 0; // Seed is min
          
          if (habit.stage !== newStage || habit.streak !== 0) {
            habit.stage = newStage;
            habit.streak = 0;
            
            updates.push(new Promise((resolve) => {
              db.run(
                `UPDATE habits SET stage = ?, streak = 0 WHERE id = ?`,
                [newStage, habit.id],
                (e) => resolve()
              );
            }));
          }
        }
      }
      return habit;
    });

    Promise.all(updates).then(() => {
      res.json(habits);
    });
  });
});

// POST /api/habits - Add new habit
app.post('/api/habits', (req, res) => {
  const telegramId = req.headers['x-telegram-user-id'];
  const { title } = req.body;

  if (!telegramId || !title) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const id = Date.now().toString();
  const stmt = db.prepare(`INSERT INTO habits (id, telegram_id, title, streak, stage, total_completions, last_completed_date) VALUES (?, ?, ?, 0, 0, 0, NULL)`);
  
  stmt.run([id, telegramId, title], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    
    res.json({
      id,
      telegram_id: parseInt(telegramId),
      title,
      streak: 0,
      stage: 0,
      total_completions: 0,
      last_completed_date: null
    });
  });
  stmt.finalize();
});

// POST /api/habits/:id/complete - Complete a habit
app.post('/api/habits/:id/complete', (req, res) => {
  const telegramId = req.headers['x-telegram-user-id'];
  const { id } = req.params;

  if (!telegramId) return res.status(400).json({ error: 'Missing ID header' });

  // First get the habit
  db.get(`SELECT * FROM habits WHERE id = ? AND telegram_id = ?`, [id, telegramId], (err, habit) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!habit) return res.status(404).json({ error: 'Habit not found' });

    const today = getTodayString();

    if (habit.last_completed_date === today) {
      return res.json(habit); // Already completed
    }

    // Logic: Grow plant
    let newStage = habit.stage + 1;
    if (newStage > 3) newStage = 3; // Max stage Big Tree
    
    const newStreak = habit.streak + 1;
    const newTotal = habit.total_completions + 1;

    db.run(
      `UPDATE habits SET streak = ?, stage = ?, total_completions = ?, last_completed_date = ? WHERE id = ?`,
      [newStreak, newStage, newTotal, today, id],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        
        res.json({
          ...habit,
          streak: newStreak,
          stage: newStage,
          total_completions: newTotal,
          last_completed_date: today
        });
      }
    );
  });
});

// DELETE /api/habits/:id
app.delete('/api/habits/:id', (req, res) => {
  const telegramId = req.headers['x-telegram-user-id'];
  const { id } = req.params;

  db.run(`DELETE FROM habits WHERE id = ? AND telegram_id = ?`, [id, telegramId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// SPA Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
