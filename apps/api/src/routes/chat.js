import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { streamChat } from '../services/chatService.js';

const router = Router();

router.post('/stream', authMiddleware, async (req, res) => {
  const { message, sessionId } = req.body || {};
  const sid = sessionId || 'default';

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  let closed = false;
  req.on('close', () => { closed = true; });

  try {
    for await (const chunk of streamChat(message, sid)) {
      if (closed) break;
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }
  } catch (err) {
    if (!closed) {
      res.write(`data: ${JSON.stringify({ error: err.message || 'AI 服务暂时不可用' })}\n\n`);
    }
  }

  if (!closed) res.end();
});

export default router;
