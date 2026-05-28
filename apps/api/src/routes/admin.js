// 管理后台路由：登录、token 验证、数据库查看、好感度、AI 配置、API 文档
import { Router } from 'express';
import { generateToken, authMiddleware } from '../middlewares/auth.js';
import { UnauthorizedError, errorCodeRegistry } from '../errors/AppError.js';
import { getDb, getTableInfo } from '../data/db.js';
import { addDailyAffection, getAffection, getAffectionLevel } from '../data/repositories/affection.js';
import { getAllConfig, setConfig } from '../data/repositories/aiConfig.js';

// 管理员账号，生产环境通过环境变量注入
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'shanhaijing2026';

const router = Router();

// 管理员登录：验证账号密码，返回 JWT token 和当日好感度加成
router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    throw new UnauthorizedError('INVALID_CREDENTIALS');
  }
  const affectionResult = addDailyAffection();
  res.json({ token: generateToken(), affection: affectionResult });
});

// 完整的 API 文档：列出所有端点及其认证要求、可能返回的错误码
router.get('/api-docs', authMiddleware, (_req, res) => {
  const endpoints = [
    { method: 'POST', path: '/api/admin/login', auth: false, desc: '管理员登录', errors: ['A0002'] },
    { method: 'GET', path: '/api/admin/check', auth: true, desc: '验证 token 有效性', errors: ['A0001'] },
    { method: 'GET', path: '/api/admin/db-info', auth: true, desc: '获取数据库表结构与行数', errors: ['A0001'] },
    { method: 'GET', path: '/api/admin/db-query/:table', auth: true, desc: '查询指定表全部数据', errors: ['A0001'] },
    { method: 'POST', path: '/api/admin/upload', auth: true, desc: '上传图片', errors: ['A0001', 'B0003'] },

    { method: 'GET', path: '/api/gallery', auth: false, desc: '获取画廊图片列表', errors: [] },
    { method: 'POST', path: '/api/admin/gallery', auth: true, desc: '添加画廊图片', errors: ['A0001', 'B0001'] },
    { method: 'DELETE', path: '/api/admin/gallery/:id', auth: true, desc: '删除画廊图片', errors: ['A0001', 'B0002'] },
    { method: 'PUT', path: '/api/admin/gallery/reorder', auth: true, desc: '调整画廊图片顺序', errors: ['A0001', 'B0001'] },

    { method: 'GET', path: '/api/blog/posts', auth: false, desc: '获取文章列表', errors: [] },
    { method: 'GET', path: '/api/blog/posts/:id', auth: false, desc: '获取单篇文章', errors: ['B0002'] },
    { method: 'POST', path: '/api/admin/blog/posts', auth: true, desc: '发布文章', errors: ['A0001', 'B0001'] },
    { method: 'PUT', path: '/api/admin/blog/posts/:id', auth: true, desc: '编辑文章', errors: ['A0001', 'B0002'] },
    { method: 'DELETE', path: '/api/admin/blog/posts/:id', auth: true, desc: '删除文章', errors: ['A0001', 'B0002'] },
    { method: 'POST', path: '/api/admin/blog/posts/batch-delete', auth: true, desc: '批量删除文章', errors: ['A0001', 'B0001'] },
    { method: 'GET', path: '/api/blog/sidebar', auth: false, desc: '获取侧边栏信息', errors: [] },
    { method: 'PUT', path: '/api/admin/blog/sidebar', auth: true, desc: '更新侧边栏信息', errors: ['A0001'] },

    { method: 'GET', path: '/api/about', auth: false, desc: '获取个人信息', errors: [] },
    { method: 'PUT', path: '/api/admin/about', auth: true, desc: '更新个人信息', errors: ['A0001'] },

    { method: 'GET', path: '/api/friends', auth: false, desc: '获取友链列表', errors: [] },
    { method: 'POST', path: '/api/admin/friends', auth: true, desc: '添加友链', errors: ['A0001', 'B0001'] },
    { method: 'PUT', path: '/api/admin/friends/:id', auth: true, desc: '编辑友链', errors: ['A0001', 'B0002'] },
    { method: 'DELETE', path: '/api/admin/friends/:id', auth: true, desc: '删除友链', errors: ['A0001', 'B0002'] },

    { method: 'GET', path: '/api/messages', auth: false, desc: '获取留言列表', errors: [] },
    { method: 'POST', path: '/api/messages', auth: false, desc: '提交留言', errors: ['B0001'] },
    { method: 'DELETE', path: '/api/admin/messages/:id', auth: true, desc: '删除留言', errors: ['A0001', 'B0002'] },

    { method: 'GET', path: '/api/projects', auth: false, desc: '获取项目列表', errors: [] },
    { method: 'POST', path: '/api/admin/projects', auth: true, desc: '添加项目', errors: ['A0001', 'B0001'] },
    { method: 'PUT', path: '/api/admin/projects/:id', auth: true, desc: '编辑项目', errors: ['A0001', 'B0002'] },
    { method: 'DELETE', path: '/api/admin/projects/:id', auth: true, desc: '删除项目', errors: ['A0001', 'B0002'] },

    { method: 'POST', path: '/api/admin/chat/stream', auth: true, desc: 'AI 书灵对话（SSE 流式）', errors: ['A0001', 'B0004', 'C0002'] },
    { method: 'GET', path: '/api/admin/affection', auth: true, desc: '查询好感度', errors: ['A0001'] },
    { method: 'GET', path: '/api/admin/ai-config', auth: true, desc: '获取 AI 配置（密钥脱敏）', errors: ['A0001'] },
    { method: 'PUT', path: '/api/admin/ai-config', auth: true, desc: '更新 AI 配置', errors: ['A0001', 'B0001'] },

    { method: 'GET', path: '/api/music', auth: false, desc: '获取音乐列表', errors: [] },
    { method: 'POST', path: '/api/admin/music', auth: true, desc: '添加音乐', errors: ['A0001', 'B0001'] },
    { method: 'PUT', path: '/api/admin/music/:id', auth: true, desc: '编辑音乐', errors: ['A0001', 'B0002'] },
    { method: 'DELETE', path: '/api/admin/music/:id', auth: true, desc: '删除音乐', errors: ['A0001', 'B0002'] },
  ];
  res.json({ endpoints, errorCodes: errorCodeRegistry });
});

// 验证 token 有效性（前端用于判断是否已登录）
router.get('/check', authMiddleware, (_req, res) => {
  res.json({ ok: true });
});

// 获取数据库表结构概览（供管理后台"数据库"页使用）
router.get('/db-info', authMiddleware, (_req, res) => {
  const tables = getTableInfo();
  res.json({ tables });
});

// 查询指定表全部数据（供管理后台调试）
router.get('/db-query/:table', authMiddleware, (req, res) => {
  const { table } = req.params;
  const tables = getTableInfo().map((t) => t.name);
  if (!tables.includes(table)) {
    return res.status(400).json({ code: 'B0001', message: `表 "${table}" 不存在` });
  }
  const rows = getDb().prepare(`SELECT * FROM "${table}"`).all();
  const columns = getDb().prepare(`PRAGMA table_info("${table}")`).all().map((c) => c.name);
  res.json({ table, columns, rows, count: rows.length });
});

// 查询用户好感度
router.get('/affection', authMiddleware, (_req, res) => {
  const { affection } = getAffection();
  const { level, title } = getAffectionLevel(affection);
  res.json({ affection, level, title });
});

// 获取 AI 配置（密钥字段脱敏显示）
router.get('/ai-config', authMiddleware, (_req, res) => {
  const config = getAllConfig();
  const masked = {};
  for (const [k, v] of Object.entries(config)) {
    if (k.includes('api_key') || k.includes('secret') || k.includes('token')) {
      masked[k] = v ? v.slice(0, 4) + '****' + v.slice(-4) : '';
    } else {
      masked[k] = v;
    }
  }
  res.json(masked);
});

// 更新 AI 配置的指定键值
router.put('/ai-config', authMiddleware, (req, res) => {
  const { key, value } = req.body || {};
  if (!key || value === undefined || value === null) {
    return res.status(400).json({ code: 'B0001', message: 'key 和 value 不能为空' });
  }
  setConfig(key, value);
  res.json({ ok: true, key });
});

export default router;
