// 博客路由：文章 CRUD、批量删除、侧边栏
import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import {
  getPosts, getPostById, publishPost, editPost, removePost, removePosts,
  getBlogSidebar, editSidebar,
} from '../services/blogService.js';

const router = Router();

// 公开：获取文章列表
router.get('/posts', (_req, res) => {
  res.json(getPosts());
});

// 公开：获取单篇文章详情
router.get('/posts/:id', (req, res) => {
  res.json(getPostById(req.params.id));
});

// 管理：发布新文章
router.post('/posts', authMiddleware, (req, res) => {
  res.status(201).json(publishPost(req.body || {}));
});

// 管理：编辑文章
router.put('/posts/:id', authMiddleware, (req, res) => {
  res.json(editPost(req.params.id, req.body || {}));
});

// 管理：删除单篇文章
router.delete('/posts/:id', authMiddleware, (req, res) => {
  removePost(req.params.id);
  res.json({ ok: true });
});

// 管理：批量删除文章
router.post('/posts/batch-delete', authMiddleware, (req, res) => {
  const deleted = removePosts((req.body || {}).ids);
  res.json({ ok: true, deleted });
});

// 公开：获取侧边栏信息（名称、格言、头像等）
router.get('/sidebar', (_req, res) => {
  res.json(getBlogSidebar());
});

// 管理：更新侧边栏信息
router.put('/sidebar', authMiddleware, (req, res) => {
  res.json(editSidebar(req.body || {}));
});

export default router;
