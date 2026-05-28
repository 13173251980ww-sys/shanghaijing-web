// 画廊数据仓库：SQLite 图片记录的增删改查与排序
import { v4 as uuid } from 'uuid';
import { getDb } from '../db.js';

export function listImages() {
  const rows = getDb().prepare('SELECT * FROM gallery ORDER BY order_num').all();
  return rows.map((r) => ({ id: r.id, filename: r.filename, url: r.url, order: r.order_num }));
}

export function addImage(filename, url) {
  const maxOrder = getDb().prepare('SELECT COALESCE(MAX(order_num), -1) + 1 as next FROM gallery').get().next;
  const item = { id: uuid(), filename, url, order: maxOrder };
  getDb().prepare('INSERT INTO gallery (id, filename, url, order_num) VALUES (?, ?, ?, ?)')
    .run(item.id, item.filename, item.url, item.order);
  return item;
}

export function removeImage(id) {
  const existing = getDb().prepare('SELECT id FROM gallery WHERE id = ?').get(id);
  if (!existing) return false;
  getDb().prepare('DELETE FROM gallery WHERE id = ?').run(id);
  return true;
}

// 按给定 ID 顺序重排图片
export function reorderImages(ids) {
  const stmt = getDb().prepare('UPDATE gallery SET order_num = ? WHERE id = ?');
  getDb().transaction((idList) => {
    idList.forEach((id, i) => stmt.run(i, id));
  })(ids);
}
