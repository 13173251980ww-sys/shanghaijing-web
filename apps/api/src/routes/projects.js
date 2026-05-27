import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { store, newId } from '../data/store.js';
import { BadRequestError, NotFoundError } from '../errors/AppError.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(store.projects);
});

router.post('/', authMiddleware, (req, res) => {
  const { name, desc, url } = req.body || {};
  if (!name || !desc || !url) throw new BadRequestError('NAME_DESC_URL_REQUIRED');
  const item = { id: newId(), name, desc, url };
  store.projects.push(item);
  res.status(201).json(item);
});

router.put('/:id', authMiddleware, (req, res) => {
  const item = store.projects.find((p) => p.id === req.params.id);
  if (!item) throw new NotFoundError('PROJECT_NOT_FOUND');
  const { name, desc, url } = req.body || {};
  if (name !== undefined) item.name = name;
  if (desc !== undefined) item.desc = desc;
  if (url !== undefined) item.url = url;
  res.json(item);
});

router.delete('/:id', authMiddleware, (req, res) => {
  const idx = store.projects.findIndex((p) => p.id === req.params.id);
  if (idx === -1) throw new NotFoundError('PROJECT_NOT_FOUND');
  store.projects.splice(idx, 1);
  res.json({ ok: true });
});

export default router;
