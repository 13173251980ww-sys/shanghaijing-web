// 留言路由：留言板消息的获取、提交与删除
import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { getMessages, createMessage, deleteMessage } from '../services/messagesService.js';

const router = Router();

// 公开：获取留言列表
router.get('/', (_req, res) => {
  res.json(getMessages());
});

// 公开：提交留言
router.post('/', (req, res) => {
  const { author, content } = req.body || {};
  res.status(201).json(createMessage(author, content));
});

// 管理：删除留言
router.delete('/:id', authMiddleware, (req, res) => {
  deleteMessage(req.params.id);
  res.json({ ok: true });
});

export default router;
