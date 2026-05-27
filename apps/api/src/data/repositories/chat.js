import { getDb } from '../db.js';

export function listMessagesBySession(sessionId, limit = 20) {
  const rows = getDb().prepare(
    'SELECT id, role, content, session_id, created_at FROM chat_messages WHERE session_id = ? ORDER BY created_at DESC LIMIT ?'
  ).all(sessionId, limit);
  return rows.reverse().map(r => ({
    id: r.id,
    role: r.role,
    content: r.content,
    sessionId: r.session_id,
    createdAt: r.created_at,
  }));
}

export function saveMessage(role, content, sessionId) {
  return getDb().prepare(
    'INSERT INTO chat_messages (role, content, session_id) VALUES (?, ?, ?)'
  ).run(role, content, sessionId);
}
