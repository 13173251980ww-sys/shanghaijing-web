import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { getAboutInfo, editAbout } from '../services/aboutService.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(getAboutInfo());
});

router.put('/', authMiddleware, (req, res) => {
  res.json(editAbout(req.body || {}));
});

export default router;
