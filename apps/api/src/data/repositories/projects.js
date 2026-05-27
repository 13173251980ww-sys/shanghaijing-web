import { v4 as uuid } from 'uuid';
import { getDb } from '../db.js';

function projectRow(r) {
  return { id: r.id, name: r.name, desc: r.description, url: r.url };
}

export function listProjects() {
  return getDb().prepare('SELECT * FROM projects').all().map(projectRow);
}

export function addProject(name, desc, url) {
  const item = { id: uuid(), name, description: desc, url };
  getDb().prepare('INSERT INTO projects (id, name, description, url) VALUES (?, ?, ?, ?)')
    .run(item.id, item.name, item.description, item.url);
  return projectRow(item);
}

export function updateProject(id, fields) {
  const existing = getDb().prepare('SELECT id FROM projects WHERE id = ?').get(id);
  if (!existing) return null;
  if (fields.name !== undefined) getDb().prepare('UPDATE projects SET name = ? WHERE id = ?').run(fields.name, id);
  if (fields.desc !== undefined) getDb().prepare('UPDATE projects SET description = ? WHERE id = ?').run(fields.desc, id);
  if (fields.url !== undefined) getDb().prepare('UPDATE projects SET url = ? WHERE id = ?').run(fields.url, id);
  return getDb().prepare('SELECT * FROM projects WHERE id = ?').get(id);
}

export function removeProject(id) {
  const existing = getDb().prepare('SELECT id FROM projects WHERE id = ?').get(id);
  if (!existing) return false;
  getDb().prepare('DELETE FROM projects WHERE id = ?').run(id);
  return true;
}
