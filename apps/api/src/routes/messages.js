import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { store, newId } from '../data/store.js';
import { BadRequestError, NotFoundError } from '../errors/AppError.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(store.messages);
});

router.post('/', (req, res) => {
  const { author, content } = req.body || {};
  if (!author || !content) throw new BadRequestError('AUTHOR_CONTENT_REQUIRED');
  const msg = {
    id: newId(),
    author,
    content,
    createdAt: new Date().toISOString(),
  };
  store.messages.unshift(msg);
  res.status(201).json(msg);
});

router.delete('/:id', authMiddleware, (req, res) => {
  const idx = store.messages.findIndex((m) => m.id === req.params.id);
  if (idx === -1) throw new NotFoundError('MESSAGE_NOT_FOUND');
  store.messages.splice(idx, 1);
  res.json({ ok: true });
});

export default router;
