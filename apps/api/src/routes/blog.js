import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import {
  getPosts, getPostById, publishPost, editPost, removePost, removePosts,
  getBlogSidebar, editSidebar,
} from '../services/blogService.js';

const router = Router();

router.get('/posts', (_req, res) => {
  res.json(getPosts());
});

router.get('/posts/:id', (req, res) => {
  res.json(getPostById(req.params.id));
});

router.post('/posts', authMiddleware, (req, res) => {
  res.status(201).json(publishPost(req.body || {}));
});

router.put('/posts/:id', authMiddleware, (req, res) => {
  res.json(editPost(req.params.id, req.body || {}));
});

router.delete('/posts/:id', authMiddleware, (req, res) => {
  removePost(req.params.id);
  res.json({ ok: true });
});

router.post('/posts/batch-delete', authMiddleware, (req, res) => {
  const deleted = removePosts((req.body || {}).ids);
  res.json({ ok: true, deleted });
});

router.get('/sidebar', (_req, res) => {
  res.json(getBlogSidebar());
});

router.put('/sidebar', authMiddleware, (req, res) => {
  res.json(editSidebar(req.body || {}));
});

export default router;
