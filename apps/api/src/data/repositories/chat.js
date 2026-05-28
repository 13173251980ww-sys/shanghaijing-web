// 聊天消息数据仓库：按会话保存和查询对话历史
import { getDb } from '../db.js';

// 查询指定会话最近的消息（倒序取，再反转为正序）
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
