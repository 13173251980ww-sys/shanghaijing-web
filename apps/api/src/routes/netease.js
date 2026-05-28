// 网易云音乐路由：扫码登录、获取歌单/喜欢列表、导入歌曲
import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import * as neteaseService from '../services/neteaseService.js';

const router = Router();

// 获取二维码登录 key
router.get('/qr-key', authMiddleware, async (req, res, next) => {
  try {
    res.json(await neteaseService.getQrKey());
  } catch (err) { next(err); }
});

// 轮询二维码扫描状态
router.get('/qr-check', authMiddleware, async (req, res, next) => {
  try {
    const key = req.query.key;
    if (!key) return res.json({ code: 800 });
    res.json(await neteaseService.checkQrStatus(key));
  } catch (err) { next(err); }
});

// 查询网易云登录状态
router.get('/status', authMiddleware, async (req, res, next) => {
  try {
    res.json(await neteaseService.getLoginStatus());
  } catch (err) { next(err); }
});

// 获取"我喜欢"歌单
router.get('/likelist', authMiddleware, async (req, res, next) => {
  try {
    res.json(await neteaseService.getLikelist());
  } catch (err) { next(err); }
});

// 获取用户歌单列表
router.get('/playlists', authMiddleware, async (req, res, next) => {
  try {
    res.json(await neteaseService.getUserPlaylists());
  } catch (err) { next(err); }
});

// 获取指定歌单的歌曲列表
router.get('/playlist/:id/songs', authMiddleware, async (req, res, next) => {
  try {
    res.json(await neteaseService.getPlaylistSongs(req.params.id));
  } catch (err) { next(err); }
});

// 将选中的歌曲导入本地曲库
router.post('/import', authMiddleware, async (req, res, next) => {
  try {
    res.json(await neteaseService.importSongs((req.body || {}).songs || []));
  } catch (err) { next(err); }
});

// 退出网易云登录（清除 cookie）
router.post('/logout', authMiddleware, (_req, res) => {
  res.json(neteaseService.clearCookie());
});

export default router;
