import { v4 as uuid } from 'uuid';
import { getDb } from '../db.js';

export function listMusic() {
  return getDb().prepare('SELECT * FROM music ORDER BY sort_order, created_at').all();
}

export function addMusic({ title, artist, url, cover, sortOrder, neteaseId }) {
  const item = {
    id: uuid(),
    title: title || '',
    artist: artist || '',
    url: url || '',
    cover: cover || '',
    sort_order: sortOrder ?? 0,
    netease_id: neteaseId || '',
    created_at: new Date().toISOString(),
  };
  getDb().prepare(`
    INSERT INTO music (id, title, artist, url, cover, sort_order, netease_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(item.id, item.title, item.artist, item.url, item.cover, item.sort_order, item.netease_id, item.created_at);
  return item;
}

export function updateMusic(id, fields) {
  const existing = getDb().prepare('SELECT id FROM music WHERE id = ?').get(id);
  if (!existing) return null;
  const setters = [];
  const vals = [];
  for (const f of ['title', 'artist', 'url', 'cover']) {
    if (fields[f] !== undefined) { setters.push(`${f} = ?`); vals.push(fields[f]); }
  }
  if (fields.sort_order !== undefined) { setters.push('sort_order = ?'); vals.push(fields.sort_order); }
  if (setters.length) {
    vals.push(id);
    getDb().prepare(`UPDATE music SET ${setters.join(', ')} WHERE id = ?`).run(...vals);
  }
  return getDb().prepare('SELECT * FROM music WHERE id = ?').get(id);
}

export function removeMusic(id) {
  const existing = getDb().prepare('SELECT id FROM music WHERE id = ?').get(id);
  if (!existing) return false;
  getDb().prepare('DELETE FROM music WHERE id = ?').run(id);
  return true;
}
