import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { getMessages, createMessage, deleteMessage } from '../services/messagesService.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(getMessages());
});

router.post('/', (req, res) => {
  const { author, content } = req.body || {};
  res.status(201).json(createMessage(author, content));
});

router.delete('/:id', authMiddleware, (req, res) => {
  deleteMessage(req.params.id);
  res.json({ ok: true });
});

export default router;
