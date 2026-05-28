/**
 * AI 对话服务
 * prepareChat —— 准备 API Key、模型和系统提示词
 * detectEmotion —— 基于关键词检测情绪，供 Live2D 表情切换
 * 注：实际 fetch 调用在 chat 路由层完成（SSE 兼容性要求）
 */
import { BadRequestError } from '../errors/AppError.js';
import { getAffection, getAffectionLevel } from '../data/repositories/affection.js';
import { getConfig } from '../data/repositories/aiConfig.js';

// 书灵"山海"的系统提示词：设定角色性格、说话风格、引用异兽
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

// 情绪关键词匹配表：检测 AI 回复内容 → 映射到 Live2D 表情
const EMOTION_MAP = [
  { emotion: 'happy',     pattern: /(笑|哈哈|呵呵|嘻嘻|开心|高兴|快乐|有趣|妙|不错|好呀)/ },
  { emotion: 'surprised', pattern: /(竟|居然|什么|哇|哎呀|天哪|不可思议|惊奇|难道)/ },
  { emotion: 'sad',       pattern: /(唉|可惜|遗憾|悲伤|难过|伤心|流泪|陨落|逝去|不在)/ },
  { emotion: 'angry',     pattern: /(哼|怒|生气|可恶|可恨|岂有此理|大胆|放肆)/ },
];

/** 根据文本中的关键词检测表情情绪 */
export function detectEmotion(text) {
  for (const { emotion, pattern } of EMOTION_MAP) {
    if (pattern.test(text)) return emotion;
  }
  return 'neutral';
}

/** 准备聊天请求参数：校验消息、读取 API 配置、拼接好感度提示词 */
export function prepareChat(message) {
  if (!message || !message.trim()) {
    throw new BadRequestError('CHAT_MESSAGE_REQUIRED');
  }

  const apiKey = getConfig('deepseek_api_key') || process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new BadRequestError('CHAT_LLM_ERROR');
  }

  const model = getConfig('deepseek_model') || process.env.CHAT_MODEL || 'deepseek-chat';

  const { affection } = getAffection();
  const { title } = getAffectionLevel(affection);
  const affectionPrompt = `\n当前好感度：你与来客的好感度为「${title}」（${affection}点）。请根据好感度调整语气亲疏。`;

  return { apiKey, model, systemPrompt: SYSTEM_PROMPT + affectionPrompt };
}
