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
`);

const row = db.prepare('SELECT COUNT(*) as c FROM gallery').get();
if (row.c === 0) {
  const seed = db.transaction(() => {
    db.prepare(`INSERT INTO gallery VALUES ('1', 'gallery-art.png', '/uploads/gallery-art.png', 0)`).run();

    const posts = [
      ['1', '山海经异兽考', '应龙、白泽与九尾狐的传说溯源', '', '', '2026-05-20', '#'],
      ['2', '水墨渲染算法笔记', '基于 WebGL 的实时水墨扩散模拟', '', '', '2026-05-15', '#'],
      ['3', '前端动画性能优化', '从 30fps 到 60fps 的逐帧分析', '', '', '2026-05-10', '#'],
      ['4', '聊城大学游记', '东昌湖畔的四年春秋', '', '', '2026-04-28', '#'],
      ['5', 'Live2D 技术调研', 'Cubism SDK 在 Web 端的集成方案', '', '', '2026-04-15', '#'],
      ['6', '古诗词数据集构建', '十万首唐诗宋词的清洗与标注', '', '', '2026-04-02', '#'],
      ['7', 'Vue3 组合式 API 实践', '从 Options 到 Composition 的迁移总结', '', '', '2026-03-20', '#'],
      ['8', '个人网站开发手记', '从设计到上线的全流程记录', '', '', '2026-03-10', '#'],
      ['9', 'CSS Container Queries 入门', '现代响应式布局的新范式', '', '', '2026-02-28', '#'],
      ['10', 'JavaScript 闭包深入理解', '从作用域链到内存管理的完整解析', '', '', '2026-02-15', '#'],
      ['11', 'Web Worker 多线程实践', '主线程卡顿的终极解决方案', '', '', '2026-02-01', '#'],
      ['12', 'Canvas 实现粒子特效', '从零搭建烟花粒子系统', '', '', '2026-01-18', '#'],
      ['13', 'Git 工作流最佳实践', '从 feature branch 到 CI/CD', '', '', '2026-01-05', '#'],
      ['14', 'HTTP/3 与 QUIC 协议浅析', '新一代传输协议的技术内幕', '', '', '2025-12-20', '#'],
      ['15', 'TypeScript 类型体操入门', '从泛型到条件类型的进阶之路', '', '', '2025-12-08', '#'],
      ['16', '2025 年度技术总结', '这一年的成长与收获', '', '', '2025-12-01', '#'],
    ];
    const insertPost = db.prepare('INSERT INTO blog_posts VALUES (?, ?, ?, ?, ?, ?, ?)');
    for (const p of posts) insertPost.run(...p);

    db.prepare(`INSERT INTO sidebar VALUES (1, 'Amadeus', '笔落惊风雨，诗成泣鬼神', '', '666666666666')`).run();
    db.prepare(`INSERT INTO about VALUES (1, 'Amadeus', '聊城大学', 'https://github.com/13173251980ww-sys', 'https://blog.csdn.net/amadeusCristina', 'B站 / QQ 1685736247', '')`).run();
    db.prepare(`INSERT INTO friends VALUES ('1', '派大星工作室', '#')`).run();
    db.prepare(`INSERT INTO projects VALUES ('1', 'Live2d面试官', '智能虚拟面试官', '#')`).run();
  });
  seed();
}

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
