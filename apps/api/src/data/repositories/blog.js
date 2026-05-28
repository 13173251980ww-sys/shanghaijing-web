// 博客数据仓库：文章、侧边栏的 SQLite CRUD
import { v4 as uuid } from 'uuid';
import { getDb } from '../db.js';

// 将数据库行映射为驼峰命名的对象
function postRow(r) {
  return {
    id: r.id, title: r.title, desc: r.description,
    content: r.content, coverUrl: r.cover_url, date: r.date, url: r.url,
  };
}

export function listPosts() {
  return getDb().prepare('SELECT * FROM blog_posts ORDER BY date DESC').all().map(postRow);
}

export function getPost(id) {
  const row = getDb().prepare('SELECT * FROM blog_posts WHERE id = ?').get(id);
  return row ? postRow(row) : null;
}

export function createPost({ title, desc, content, coverUrl }) {
  const post = {
    id: uuid(), title, description: desc || '', content: content || '',
    cover_url: coverUrl || '', date: new Date().toISOString().slice(0, 10), url: '#',
  };
  getDb().prepare('INSERT INTO blog_posts (id, title, description, content, cover_url, date, url) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(post.id, post.title, post.description, post.content, post.cover_url, post.date, post.url);
  return postRow(post);
}

export function updatePost(id, fields) {
  const existing = getDb().prepare('SELECT id FROM blog_posts WHERE id = ?').get(id);
  if (!existing) return null;
  if (fields.title !== undefined) getDb().prepare('UPDATE blog_posts SET title = ? WHERE id = ?').run(fields.title, id);
  if (fields.desc !== undefined) getDb().prepare('UPDATE blog_posts SET description = ? WHERE id = ?').run(fields.desc, id);
  if (fields.content !== undefined) getDb().prepare('UPDATE blog_posts SET content = ? WHERE id = ?').run(fields.content, id);
  if (fields.coverUrl !== undefined) getDb().prepare('UPDATE blog_posts SET cover_url = ? WHERE id = ?').run(fields.coverUrl, id);
  return getPost(id);
}

export function deletePost(id) {
  const existing = getDb().prepare('SELECT id FROM blog_posts WHERE id = ?').get(id);
  if (!existing) return false;
  getDb().prepare('DELETE FROM blog_posts WHERE id = ?').run(id);
  return true;
}

// 事务内批量删除文章
export function batchDeletePosts(ids) {
  const stmt = getDb().prepare('DELETE FROM blog_posts WHERE id = ?');
  getDb().transaction((idList) => { for (const id of idList) stmt.run(id); })(ids);
  return ids.length;
}

export function getSidebar() {
  const row = getDb().prepare('SELECT * FROM sidebar WHERE id = 1').get();
  return row ? { name: row.name, motto: row.motto, avatarUrl: row.avatar_url, icp: row.icp } : {};
}

// 使用 UPSERT 更新侧边栏（单行记录，id 恒为 1）
export function updateSidebar(fields) {
  const current = getDb().prepare('SELECT * FROM sidebar WHERE id = 1').get() || {};
  getDb().prepare(`
    INSERT INTO sidebar (id, name, motto, avatar_url, icp)
    VALUES (1, ?, ?, ?, ?)
    ON CONFLICT (id) DO UPDATE SET
      name = COALESCE(excluded.name, sidebar.name),
      motto = COALESCE(excluded.motto, sidebar.motto),
      avatar_url = COALESCE(excluded.avatar_url, sidebar.avatar_url),
      icp = COALESCE(excluded.icp, sidebar.icp)
  `).run(
    fields.name !== undefined ? fields.name : current.name || '',
    fields.motto !== undefined ? fields.motto : current.motto || '',
    fields.avatarUrl !== undefined ? fields.avatarUrl : current.avatar_url || '',
    fields.icp !== undefined ? fields.icp : current.icp || '',
  );
  return getSidebar();
}
