import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { store, newId } from '../data/store.js';
import { BadRequestError, NotFoundError } from '../errors/AppError.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(store.friends);
});

router.post('/', authMiddleware, (req, res) => {
  const { name, url } = req.body || {};
  if (!name || !url) throw new BadRequestError('NAME_URL_REQUIRED');
  const link = { id: newId(), name, url };
  store.friends.push(link);
  res.status(201).json(link);
});

router.put('/:id', authMiddleware, (req, res) => {
  const link = store.friends.find((f) => f.id === req.params.id);
  if (!link) throw new NotFoundError('FRIEND_NOT_FOUND');
  const { name, url } = req.body || {};
  if (name !== undefined) link.name = name;
  if (url !== undefined) link.url = url;
  res.json(link);
});

router.delete('/:id', authMiddleware, (req, res) => {
  const idx = store.friends.findIndex((f) => f.id === req.params.id);
  if (idx === -1) throw new NotFoundError('FRIEND_NOT_FOUND');
  store.friends.splice(idx, 1);
  res.json({ ok: true });
});

export default router;
