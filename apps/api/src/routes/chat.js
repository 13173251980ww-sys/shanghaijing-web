// AI 书灵对话路由：SSE 流式聊天，整合 DeepSeek API
import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { prepareChat, detectEmotion } from '../services/chatService.js';
import { saveMessage, listMessagesBySession } from '../data/repositories/chat.js';

// DeepSeek API 地址
const DEEPSEEK_BASE = 'https://api.deepseek.com/v1/chat/completions';

const router = Router();

/**
 * SSE 流式对话端点
 * 接收用户消息 → 拼接历史上下文 → 调用 DeepSeek 流式 API → 实时 SSE 推送回复
 * 每条 delta 推送 detectEmotion 表情标签，前端据此切换 Live2D 表情
 */
router.post('/stream', authMiddleware, async (req, res) => {
  const { message, sessionId } = req.body || {};
  const sid = sessionId || 'default';

  // 保存用户消息到数据库
  saveMessage('user', message, sid);

  // 获取最近 10 条历史消息作为上下文
  const history = listMessagesBySession(sid, 10);
  const historyMessages = history.slice(0, -1).map(m => ({ role: m.role, content: m.content }));

  // 准备 API Key、模型名和系统提示词
  const { apiKey, model, systemPrompt } = prepareChat(message);

  // 设置 SSE 响应头
  res.status(200);
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();

  // 建立 SSE 通道（Node.js undici 兼容要求）
  res.write(':ok\n\n');

  let closed = false;
  req.on('close', () => { closed = true; });

  let fullText = '';

  try {
    // 调用 DeepSeek 流式 API，使用 response.text() 避免 ReadableStream 在 Express 中挂起
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

    // 逐行解析 SSE 数据流
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

    // 保存 AI 回复到数据库
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
