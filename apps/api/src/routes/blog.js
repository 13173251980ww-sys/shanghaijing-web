import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { store, newId } from '../data/store.js';
import { BadRequestError, NotFoundError } from '../errors/AppError.js';

const router = Router();

router.get('/posts', (_req, res) => {
  res.json(store.blogPosts);
});

router.get('/posts/:id', (req, res) => {
  const post = store.blogPosts.find((p) => p.id === req.params.id);
  if (!post) throw new NotFoundError('POST_NOT_FOUND');
  res.json(post);
});

router.post('/posts', authMiddleware, (req, res) => {
  const { title, desc, content, coverUrl } = req.body || {};
  if (!title) throw new BadRequestError('TITLE_REQUIRED');
  const post = {
    id: newId(),
    title,
    desc: desc || '',
    content: content || '',
    coverUrl: coverUrl || '',
    date: new Date().toISOString().slice(0, 10),
    url: '#',
  };
  store.blogPosts.unshift(post);
  res.status(201).json(post);
});

router.put('/posts/:id', authMiddleware, (req, res) => {
  const post = store.blogPosts.find((p) => p.id === req.params.id);
  if (!post) throw new NotFoundError('POST_NOT_FOUND');
  const { title, desc, content, coverUrl } = req.body || {};
  if (title !== undefined) post.title = title;
  if (desc !== undefined) post.desc = desc;
  if (content !== undefined) post.content = content;
  if (coverUrl !== undefined) post.coverUrl = coverUrl;
  res.json(post);
});

router.delete('/posts/:id', authMiddleware, (req, res) => {
  const idx = store.blogPosts.findIndex((p) => p.id === req.params.id);
  if (idx === -1) throw new NotFoundError('POST_NOT_FOUND');
  store.blogPosts.splice(idx, 1);
  res.json({ ok: true });
});

router.post('/posts/batch-delete', authMiddleware, (req, res) => {
  const { ids } = req.body || {};
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new BadRequestError('IDS_NON_EMPTY_ARRAY');
  }
  store.blogPosts = store.blogPosts.filter((p) => !ids.includes(p.id));
  res.json({ ok: true, deleted: ids.length });
});

router.get('/sidebar', (_req, res) => {
  res.json(store.sidebar);
});

router.put('/sidebar', authMiddleware, (req, res) => {
  const { name, motto, avatarUrl, icp } = req.body || {};
  if (name !== undefined) store.sidebar.name = name;
  if (motto !== undefined) store.sidebar.motto = motto;
  if (avatarUrl !== undefined) store.sidebar.avatarUrl = avatarUrl;
  if (icp !== undefined) store.sidebar.icp = icp;
  res.json(store.sidebar);
});

export default router;
