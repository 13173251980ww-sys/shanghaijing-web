import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import * as neteaseService from '../services/neteaseService.js';

const router = Router();

router.get('/qr-key', authMiddleware, async (req, res, next) => {
  try {
    res.json(await neteaseService.getQrKey());
  } catch (err) { next(err); }
});

router.get('/qr-check', authMiddleware, async (req, res, next) => {
  try {
    const key = req.query.key;
    if (!key) return res.json({ code: 800 });
    res.json(await neteaseService.checkQrStatus(key));
  } catch (err) { next(err); }
});

router.get('/status', authMiddleware, async (req, res, next) => {
  try {
    res.json(await neteaseService.getLoginStatus());
  } catch (err) { next(err); }
});

router.get('/likelist', authMiddleware, async (req, res, next) => {
  try {
    res.json(await neteaseService.getLikelist());
  } catch (err) { next(err); }
});

router.get('/playlists', authMiddleware, async (req, res, next) => {
  try {
    res.json(await neteaseService.getUserPlaylists());
  } catch (err) { next(err); }
});

router.get('/playlist/:id/songs', authMiddleware, async (req, res, next) => {
  try {
    res.json(await neteaseService.getPlaylistSongs(req.params.id));
  } catch (err) { next(err); }
});

router.post('/import', authMiddleware, async (req, res, next) => {
  try {
    res.json(await neteaseService.importSongs((req.body || {}).songs || []));
  } catch (err) { next(err); }
});

router.post('/logout', authMiddleware, (_req, res) => {
  res.json(neteaseService.clearCookie());
});

export default router;
