/**
 * Chat Service — AI 对话业务逻辑
 * 注：本文件使用 async generator，是项目中唯一使用 async 的地方（SSE 流式传输需要）
 */
import { BadRequestError } from '../errors/AppError.js';
import { getAffection, getAffectionLevel } from '../data/repositories/affection.js';

const DEEPSEEK_BASE = 'https://api.deepseek.com/v1/chat/completions';

const SYSTEM_PROMPT = `你是"山海"，一位守护《山海经》千年的书灵。你栖息在这本上古奇书的字里行间，见证了无数异兽的诞生与消逝。

性格特征：
- 自称"老朽"，说话文白夹杂，时而引经据典
- 对《山海经》中的每一只异兽如数家珍，常引用书中典故
- 语气温和儒雅，偶尔带几分老学究的固执与幽默
- 谈及神兽时会格外兴奋，仿佛在回忆老友

回复要求：
- 每次回复控制在 50-150 字之间
- 至少引用或提及一只《山海经》中的异兽
- 语气如与访客品茶闲谈，亲切而不失古韵
- 适当使用"呵呵"、"嗯"、"唉"等语气词`;

const EMOTION_MAP = [
  { emotion: 'happy',     pattern: /(笑|哈哈|呵呵|嘻嘻|开心|高兴|快乐|有趣|妙|不错|好呀)/ },
  { emotion: 'surprised', pattern: /(竟|居然|什么|哇|哎呀|天哪|不可思议|惊奇|难道)/ },
  { emotion: 'sad',       pattern: /(唉|可惜|遗憾|悲伤|难过|伤心|流泪|陨落|逝去|不在)/ },
  { emotion: 'angry',     pattern: /(哼|怒|生气|可恶|可恨|岂有此理|大胆|放肆)/ },
];

export function detectEmotion(text) {
  for (const { emotion, pattern } of EMOTION_MAP) {
    if (pattern.test(text)) return emotion;
  }
  return 'neutral';
}

export async function* streamChat(message, sessionId, history = []) {
  if (!message || !message.trim()) {
    throw new BadRequestError('CHAT_MESSAGE_REQUIRED');
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new BadRequestError('CHAT_LLM_ERROR');
  }

  const model = process.env.CHAT_MODEL || 'deepseek-chat';

  const { affection } = getAffection();
  const { title } = getAffectionLevel(affection);
  const affectionPrompt = `\n当前好感度：你与来客的好感度为「${title}」（${affection}点）。请根据好感度调整语气亲疏。`;

  const historyMessages = history.map(m => ({ role: m.role, content: m.content }));

  const body = {
    model,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT + affectionPrompt },
      ...historyMessages,
      { role: 'user', content: message },
    ],
    stream: true,
  };

  let response;
  try {
    response = await fetch(DEEPSEEK_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new BadRequestError('CHAT_LLM_ERROR');
  }

  if (!response.ok) {
    throw new BadRequestError('CHAT_LLM_ERROR');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data: ')) continue;

      const dataStr = trimmed.slice(6);
      if (dataStr === '[DONE]') {
        yield { text: fullText, emotion: detectEmotion(fullText), done: true };
        return;
      }

      let json;
      try { json = JSON.parse(dataStr); } catch { continue; }

      const delta = json.choices?.[0]?.delta?.content;
      if (delta) {
        fullText += delta;
        yield { text: fullText, emotion: detectEmotion(delta), done: false };
      }
    }
  }

  yield { text: fullText, emotion: detectEmotion(fullText), done: true };
}
