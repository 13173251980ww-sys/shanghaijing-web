import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { getImages, createImage, deleteImage, sortImages } from '../services/galleryService.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(getImages());
});

router.post('/', authMiddleware, (req, res) => {
  const { filename, url } = req.body || {};
  res.status(201).json(createImage(filename, url));
});

router.delete('/:id', authMiddleware, (req, res) => {
  deleteImage(req.params.id);
  res.json({ ok: true });
});

router.put('/reorder', authMiddleware, (req, res) => {
  const { ids } = req.body || {};
  sortImages(ids);
  res.json({ ok: true });
});

export default router;
