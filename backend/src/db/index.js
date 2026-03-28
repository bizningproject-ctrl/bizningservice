import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', '..', 'fixit.db');

let db;
let saveTimer;

// Wrapper to make sql.js look like better-sqlite3 API
class DBWrapper {
  constructor(sqlDb) {
    this._db = sqlDb;
  }

  prepare(sql) {
    const self = this;
    return {
      run(...params) {
        self._db.run(sql, params);
        self._save();
        const lastId = self._db.exec('SELECT last_insert_rowid() AS id')[0]?.values[0][0];
        const changes = self._db.getRowsModified();
        return { lastInsertRowid: lastId, changes };
      },
      get(...params) {
        const stmt = self._db.prepare(sql);
        stmt.bind(params);
        if (stmt.step()) {
          const cols = stmt.getColumnNames();
          const vals = stmt.get();
          stmt.free();
          const row = {};
          cols.forEach((c, i) => row[c] = vals[i]);
          return row;
        }
        stmt.free();
        return undefined;
      },
      all(...params) {
        const rows = [];
        const stmt = self._db.prepare(sql);
        stmt.bind(params);
        while (stmt.step()) {
          const cols = stmt.getColumnNames();
          const vals = stmt.get();
          const row = {};
          cols.forEach((c, i) => row[c] = vals[i]);
          rows.push(row);
        }
        stmt.free();
        return rows;
      }
    };
  }

  exec(sql) {
    this._db.exec(sql);
    this._save();
  }

  pragma(p) {
    try { this._db.exec(`PRAGMA ${p}`); } catch {}
  }

  _save() {
    // Debounce saves
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      const data = this._db.export();
      writeFileSync(DB_PATH, Buffer.from(data));
    }, 100);
  }

  saveNow() {
    clearTimeout(saveTimer);
    const data = this._db.export();
    writeFileSync(DB_PATH, Buffer.from(data));
  }
}

export async function initDB() {
  const SQL = await initSqlJs();

  if (existsSync(DB_PATH)) {
    const buffer = readFileSync(DB_PATH);
    db = new DBWrapper(new SQL.Database(buffer));
  } else {
    db = new DBWrapper(new SQL.Database());
  }

  db.pragma('foreign_keys = ON');
  runMigrations(db);
  db.saveNow();
  return db;
}

export function getDB() {
  return db;
}

function runMigrations(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT,
      role TEXT NOT NULL DEFAULT 'customer' CHECK(role IN ('customer', 'pro', 'admin')),
      avatar_url TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS service_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name_en TEXT NOT NULL,
      name_ru TEXT,
      name_uz TEXT,
      desc_en TEXT,
      desc_ru TEXT,
      desc_uz TEXT,
      short_desc_en TEXT,
      short_desc_ru TEXT,
      short_desc_uz TEXT,
      icon TEXT,
      gradient TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS pro_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      category_id INTEGER NOT NULL REFERENCES service_categories(id),
      specialty TEXT,
      tags TEXT,
      rating REAL DEFAULT 0,
      total_jobs INTEGER DEFAULT 0,
      total_reviews INTEGER DEFAULT 0,
      price_per_hour REAL NOT NULL,
      experience_years INTEGER DEFAULT 0,
      is_verified INTEGER DEFAULT 0,
      is_online INTEGER DEFAULT 0,
      bio TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL REFERENCES users(id),
      pro_id INTEGER REFERENCES pro_profiles(id),
      category_id INTEGER NOT NULL REFERENCES service_categories(id),
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
      preferred_date TEXT NOT NULL,
      preferred_time TEXT,
      address TEXT NOT NULL,
      description TEXT,
      total_price REAL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      category_id INTEGER NOT NULL REFERENCES service_categories(id),
      experience_years INTEGER,
      about TEXT,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER UNIQUE NOT NULL REFERENCES bookings(id),
      customer_id INTEGER NOT NULL REFERENCES users(id),
      pro_id INTEGER NOT NULL REFERENCES pro_profiles(id),
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_pro_profiles_category ON pro_profiles(category_id);
    CREATE INDEX IF NOT EXISTS idx_pro_profiles_rating ON pro_profiles(rating DESC);
    CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_pro ON bookings(pro_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
    CREATE INDEX IF NOT EXISTS idx_reviews_pro ON reviews(pro_id);
    CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
  `);
}
