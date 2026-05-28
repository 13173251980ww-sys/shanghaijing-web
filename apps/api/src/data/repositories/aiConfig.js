// AI 配置数据仓库：键值对存储（API Key、模型名等）
import { getDb } from '../db.js';

// 读取指定 key 的配置值
export function getConfig(key) {
  const row = getDb().prepare('SELECT value FROM ai_config WHERE key = ?').get(key);
  return row ? row.value : null;
}

// 设置或更新配置（UPSERT）
export function setConfig(key, value) {
  getDb().prepare(`
    INSERT INTO ai_config (key, value) VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(key, value);
  return { key, value };
}

// 获取所有配置，返回键值对对象
export function getAllConfig() {
  const rows = getDb().prepare('SELECT key, value FROM ai_config ORDER BY key').all();
  const map = {};
  for (const r of rows) {
    map[r.key] = r.value;
  }
  return map;
}
