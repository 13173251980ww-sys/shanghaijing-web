import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { prepareChat, detectEmotion } from '../services/chatService.js';
import { saveMessage, listMessagesBySession } from '../data/repositories/chat.js';

const DEEPSEEK_BASE = 'https://api.deepseek.com/v1/chat/completions';

const router = Router();

router.post('/stream', authMiddleware, async (req, res) => {
  const { message, sessionId } = req.body || {};
  const sid = sessionId || 'default';

  saveMessage('user', message, sid);

  const history = listMessagesBySession(sid, 10);
  const historyMessages = history.slice(0, -1).map(m => ({ role: m.role, content: m.content }));

  const { apiKey, model, systemPrompt } = prepareChat(message);

  res.status(200);
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();

  // Establish SSE channel before calling fetch() — required for Node.js undici compat
  res.write(':ok\n\n');

  let closed = false;
  req.on('close', () => { closed = true; });

  let fullText = '';

  try {
    // Use response.text() — ReadableStream reader iteration hangs in Express context
    const response = await fetch(DEEPSEEK_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...historyMessages,
          { role: 'user', content: message },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      res.write(`data: ${JSON.stringify({ error: 'AI 服务请求失败' })}\n\n`);
      if (!closed) res.end();
      return;
    }

    const bodyText = await response.text();

    const lines = bodyText.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data: ')) continue;

      const dataStr = trimmed.slice(6);
      if (dataStr === '[DONE]') break;

      let json;
      try { json = JSON.parse(dataStr); } catch { continue; }

      const delta = json.choices?.[0]?.delta?.content;
      if (delta) {
        fullText += delta;
        if (!closed) {
          res.write(`data: ${JSON.stringify({ text: fullText, emotion: detectEmotion(delta), done: false })}\n\n`);
        }
      }
    }

    if (fullText && !closed) {
      saveMessage('assistant', fullText, sid);
    }
    res.write(`data: ${JSON.stringify({ text: fullText, emotion: detectEmotion(fullText), done: true })}\n\n`);
  } catch (err) {
    console.error('[chat] stream error:', err.message || err);
    if (!closed) {
      res.write(`data: ${JSON.stringify({ error: err.message || 'AI 服务暂时不可用' })}\n\n`);
    }
  }

  if (!closed) res.end();
});

export default router;
