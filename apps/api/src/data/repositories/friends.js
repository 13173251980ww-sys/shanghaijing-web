import { v4 as uuid } from 'uuid';
import { getDb } from '../db.js';

export function listFriends() {
  return getDb().prepare('SELECT * FROM friends').all();
}

export function addFriend(name, url) {
  const link = { id: uuid(), name, url };
  getDb().prepare('INSERT INTO friends (id, name, url) VALUES (?, ?, ?)').run(link.id, link.name, link.url);
  return link;
}

export function updateFriend(id, fields) {
  const existing = getDb().prepare('SELECT id FROM friends WHERE id = ?').get(id);
  if (!existing) return null;
  if (fields.name !== undefined) getDb().prepare('UPDATE friends SET name = ? WHERE id = ?').run(fields.name, id);
  if (fields.url !== undefined) getDb().prepare('UPDATE friends SET url = ? WHERE id = ?').run(fields.url, id);
  return getDb().prepare('SELECT * FROM friends WHERE id = ?').get(id);
}

export function removeFriend(id) {
  const existing = getDb().prepare('SELECT id FROM friends WHERE id = ?').get(id);
  if (!existing) return false;
  getDb().prepare('DELETE FROM friends WHERE id = ?').run(id);
  return true;
}
