import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { getFriends, createFriend, editFriend, deleteFriend } from '../services/friendsService.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(getFriends());
});

router.post('/', authMiddleware, (req, res) => {
  const { name, url } = req.body || {};
  res.status(201).json(createFriend(name, url));
});

router.put('/:id', authMiddleware, (req, res) => {
  res.json(editFriend(req.params.id, req.body || {}));
});

router.delete('/:id', authMiddleware, (req, res) => {
  deleteFriend(req.params.id);
  res.json({ ok: true });
});

export default router;
