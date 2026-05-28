// 友链路由：友情链接的增删改查
import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { getFriends, createFriend, editFriend, deleteFriend } from '../services/friendsService.js';

const router = Router();

// 公开：获取友链列表
router.get('/', (_req, res) => {
  res.json(getFriends());
});

// 管理：添加友链
router.post('/', authMiddleware, (req, res) => {
  const { name, url } = req.body || {};
  res.status(201).json(createFriend(name, url));
});

// 管理：编辑友链
router.put('/:id', authMiddleware, (req, res) => {
  res.json(editFriend(req.params.id, req.body || {}));
});

// 管理：删除友链
router.delete('/:id', authMiddleware, (req, res) => {
  deleteFriend(req.params.id);
  res.json({ ok: true });
});

export default router;
