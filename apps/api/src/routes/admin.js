import { Router } from 'express';
import { generateToken, authMiddleware } from '../middlewares/auth.js';
import { UnauthorizedError, errorCodeRegistry } from '../errors/AppError.js';

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'shanhaijing2026';

const router = Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    throw new UnauthorizedError('INVALID_CREDENTIALS');
  }
  res.json({ token: generateToken() });
});

router.get('/api-docs', authMiddleware, (_req, res) => {
  const endpoints = [
    { method: 'POST', path: '/api/admin/login', auth: false, desc: '管理员登录', errors: ['A0002'] },
    { method: 'GET', path: '/api/admin/check', auth: true, desc: '验证 token 有效性', errors: ['A0001'] },
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
  ];
  res.json({ endpoints, errorCodes: errorCodeRegistry });
});

router.get('/check', authMiddleware, (_req, res) => {
  res.json({ ok: true });
});

export default router;
