import { getDb } from '../db.js';

export function getConfig(key) {
  const row = getDb().prepare('SELECT value FROM ai_config WHERE key = ?').get(key);
  return row ? row.value : null;
}

export function setConfig(key, value) {
  getDb().prepare(`
    INSERT INTO ai_config (key, value) VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(key, value);
  return { key, value };
}

export function getAllConfig() {
  const rows = getDb().prepare('SELECT key, value FROM ai_config ORDER BY key').all();
  const map = {};
  for (const r of rows) {
    map[r.key] = r.value;
  }
  return map;
}
