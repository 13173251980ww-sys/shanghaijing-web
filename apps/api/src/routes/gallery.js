import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { store, newId } from '../data/store.js';
import { BadRequestError, NotFoundError } from '../errors/AppError.js';

const router = Router();

router.get('/', (_req, res) => {
  const sorted = [...store.gallery].sort((a, b) => a.order - b.order);
  res.json(sorted);
});

router.post('/', authMiddleware, (req, res) => {
  const { filename, url } = req.body || {};
  if (!filename || !url) {
    throw new BadRequestError('MISSING_FILENAME_URL');
  }
  const item = {
    id: newId(),
    filename,
    url,
    order: store.gallery.length,
  };
  store.gallery.push(item);
  res.status(201).json(item);
});

router.delete('/:id', authMiddleware, (req, res) => {
  const idx = store.gallery.findIndex((g) => g.id === req.params.id);
  if (idx === -1) throw new NotFoundError('IMAGE_NOT_FOUND');
  store.gallery.splice(idx, 1);
  res.json({ ok: true });
});

router.put('/reorder', authMiddleware, (req, res) => {
  const { ids } = req.body || {};
  if (!Array.isArray(ids)) throw new BadRequestError('IDS_ARRAY_REQUIRED');
  ids.forEach((id, i) => {
    const g = store.gallery.find((x) => x.id === id);
    if (g) g.order = i;
  });
  res.json({ ok: true });
});

export default router;
