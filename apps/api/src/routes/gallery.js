// 画廊路由：图片的增删改查与排序
import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { getImages, createImage, deleteImage, sortImages } from '../services/galleryService.js';

const router = Router();

// 公开：获取所有画廊图片
router.get('/', (_req, res) => {
  res.json(getImages());
});

// 管理：添加图片
router.post('/', authMiddleware, (req, res) => {
  const { filename, url } = req.body || {};
  res.status(201).json(createImage(filename, url));
});

// 管理：删除图片
router.delete('/:id', authMiddleware, (req, res) => {
  deleteImage(req.params.id);
  res.json({ ok: true });
});

// 管理：调整图片排序
router.put('/reorder', authMiddleware, (req, res) => {
  const { ids } = req.body || {};
  sortImages(ids);
  res.json({ ok: true });
});

export default router;
