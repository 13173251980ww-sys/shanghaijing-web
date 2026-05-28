// SQLite 数据库初始化与连接管理
import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 确保 data 目录存在
const dbDir = path.join(__dirname, '..', '..', 'data');
fs.mkdirSync(dbDir, { recursive: true });

// 创建 / 打开 SQLite 数据库文件
const db = new Database(path.join(dbDir, 'shanghaijing.db'));

// 启用 WAL 模式提升并发性能，开启外键约束
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── 建表语句（全部使用 IF NOT EXISTS，保证幂等）──
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

  -- 用户好感度表，单行记录
  CREATE TABLE IF NOT EXISTS user_affection (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    affection INTEGER NOT NULL DEFAULT 0,
    last_login_date TEXT NOT NULL DEFAULT ''
  );

  -- 聊天消息记录表
  CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    session_id TEXT NOT NULL DEFAULT 'default',
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
  );

  -- AI 配置键值对表
  CREATE TABLE IF NOT EXISTS ai_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL DEFAULT ''
  );

  -- 音乐曲目表
  CREATE TABLE IF NOT EXISTS music (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL DEFAULT '',
    artist TEXT NOT NULL DEFAULT '',
    url TEXT NOT NULL DEFAULT '',
    cover TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT '',
    netease_id TEXT NOT NULL DEFAULT ''
  );
`);

// 兼容性迁移：为已有 music 表补充 netease_id 列
try { db.exec('ALTER TABLE music ADD COLUMN netease_id TEXT NOT NULL DEFAULT \'\''); } catch {}

/** 获取数据库实例，供仓库层使用 */
export function getDb() {
  return db;
}

/** 获取所有表的结构信息和行数，供管理后台"数据库"页展示 */
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
