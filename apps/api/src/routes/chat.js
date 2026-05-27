import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { streamChat } from '../services/chatService.js';
import { saveMessage, listMessagesBySession } from '../data/repositories/chat.js';

const router = Router();

router.post('/stream', authMiddleware, async (req, res) => {
  const { message, sessionId } = req.body || {};
  const sid = sessionId || 'default';

  saveMessage('user', message, sid);

  const history = listMessagesBySession(sid, 10);

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  let closed = false;
  req.on('close', () => { closed = true; });

  let fullText = '';

  try {
    for await (const chunk of streamChat(message, sid, history)) {
      if (closed) break;
      fullText = chunk.text;
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }
    if (fullText && !closed) {
      saveMessage('assistant', fullText, sid);
    }
  } catch (err) {
    if (!closed) {
      res.write(`data: ${JSON.stringify({ error: err.message || 'AI 服务暂时不可用' })}\n\n`);
    }
  }

  if (!closed) res.end();
});

export default router;
