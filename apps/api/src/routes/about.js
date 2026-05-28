// 关于页路由：获取和编辑个人信息
import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { getAboutInfo, editAbout } from '../services/aboutService.js';

const router = Router();

// 公开：获取个人信息
router.get('/', (_req, res) => {
  res.json(getAboutInfo());
});

// 管理：更新个人信息
router.put('/', authMiddleware, (req, res) => {
  res.json(editAbout(req.body || {}));
});

export default router;
