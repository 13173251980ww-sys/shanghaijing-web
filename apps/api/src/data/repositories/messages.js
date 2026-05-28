// 留言数据仓库：留言的增删查
import { v4 as uuid } from 'uuid';
import { getDb } from '../db.js';

function msgRow(r) {
  return { id: r.id, author: r.author, content: r.content, createdAt: r.created_at };
}

export function listMessages() {
  return getDb().prepare('SELECT * FROM messages ORDER BY created_at DESC').all().map(msgRow);
}

export function addMessage(author, content) {
  const msg = { id: uuid(), author, content, created_at: new Date().toISOString() };
  getDb().prepare('INSERT INTO messages (id, author, content, created_at) VALUES (?, ?, ?, ?)')
    .run(msg.id, msg.author, msg.content, msg.created_at);
  return msgRow(msg);
}

export function removeMessage(id) {
  const existing = getDb().prepare('SELECT id FROM messages WHERE id = ?').get(id);
  if (!existing) return false;
  getDb().prepare('DELETE FROM messages WHERE id = ?').run(id);
  return true;
}
