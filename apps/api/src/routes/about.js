import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { store } from '../data/store.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(store.about);
});

router.put('/', authMiddleware, (req, res) => {
  const { nickname, school, githubUrl, csdnUrl, social, avatarUrl } = req.body || {};
  if (nickname !== undefined) store.about.nickname = nickname;
  if (school !== undefined) store.about.school = school;
  if (githubUrl !== undefined) store.about.githubUrl = githubUrl;
  if (csdnUrl !== undefined) store.about.csdnUrl = csdnUrl;
  if (social !== undefined) store.about.social = social;
  if (avatarUrl !== undefined) store.about.avatarUrl = avatarUrl;
  res.json(store.about);
});

export default router;
