import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbDir = path.join(__dirname, '..', '..', 'data');
fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(path.join(dbDir, 'shanghaijing.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS gallery (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    url TEXT NOT NULL,
    order_num INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS blog_posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    cover_url TEXT NOT NULL DEFAULT '',
    date TEXT NOT NULL,
    url TEXT NOT NULL DEFAULT '#'
  );

  CREATE TABLE IF NOT EXISTS sidebar (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    name TEXT NOT NULL DEFAULT '',
    motto TEXT NOT NULL DEFAULT '',
    avatar_url TEXT NOT NULL DEFAULT '',
    icp TEXT NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS about (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    nickname TEXT NOT NULL DEFAULT '',
    school TEXT NOT NULL DEFAULT '',
    github_url TEXT NOT NULL DEFAULT '',
    csdn_url TEXT NOT NULL DEFAULT '',
    social TEXT NOT NULL DEFAULT '',
    avatar_url TEXT NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS friends (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    url TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS user_affection (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    affection INTEGER NOT NULL DEFAULT 0,
    last_login_date TEXT NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    session_id TEXT NOT NULL DEFAULT 'default',
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
  );
`);

export function getDb() {
  return db;
}

export function getTableInfo() {
  const tables = db.prepare(`
    SELECT name FROM sqlite_master
    WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
    ORDER BY name
  `).all().map((r) => r.name);

  return tables.map((name) => {
    const count = db.prepare(`SELECT COUNT(*) as c FROM "${name}"`).get().c;
    const columns = db.prepare(`PRAGMA table_info("${name}")`).all().map((c) => ({
      name: c.name,
      type: c.type,
      notnull: !!c.notnull,
      pk: !!c.pk,
    }));
    return { name, count, columns };
  });
}
