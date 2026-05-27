import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { getMusicList, createMusic, editMusic, deleteMusic } from '../services/musicService.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(getMusicList());
});

router.post('/', authMiddleware, (req, res) => {
  res.status(201).json(createMusic(req.body || {}));
});

router.put('/:id', authMiddleware, (req, res) => {
  res.json(editMusic(req.params.id, req.body || {}));
});

router.delete('/:id', authMiddleware, (req, res) => {
  deleteMusic(req.params.id);
  res.json({ ok: true });
});

export default router;
