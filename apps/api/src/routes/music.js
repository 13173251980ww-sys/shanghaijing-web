// 音乐路由：曲目 CRUD + 网易云流媒体代理
import { Router } from 'express';
// 使用 createRequire 加载 CJS 模块 NeteaseCloudMusicApi
import { createRequire } from 'node:module';
import { authMiddleware } from '../middlewares/auth.js';
import { getMusicList, createMusic, editMusic, deleteMusic } from '../services/musicService.js';
import { getDb } from '../data/db.js';
import { getConfig } from '../data/repositories/aiConfig.js';

const require = createRequire(import.meta.url);
const { song_url } = require('NeteaseCloudMusicApi');

const router = Router();

// 公开：获取曲目列表
router.get('/', (_req, res) => {
  res.json(getMusicList());
});

/**
 * 流媒体代理端点
 * 网易云歌曲 URL 有时效性，此端点实时获取新鲜 URL 后 302 重定向
 * 本地歌曲直接重定向到存储的 URL
 */
router.get('/:id/stream', (req, res) => {
  const song = getDb().prepare('SELECT * FROM music WHERE id = ?').get(req.params.id);
  if (!song) return res.status(404).json({ error: 'MUSIC_NOT_FOUND' });

  const redirect = (url) => {
    if (!url) return res.status(404).json({ error: 'MUSIC_NO_URL' });
    res.redirect(302, url);
  };

  // 从 netease_id 列或 netease:// URL 前缀提取网易云 ID
  const neteaseId = song.netease_id
    || ((song.url && song.url.startsWith('netease://')) ? song.url.slice('netease://'.length) : '');

  if (neteaseId) {
    const cookie = getConfig('netease_cookie');
    if (!cookie) return redirect(song.url);
    song_url({ id: neteaseId, cookie })
      .then(({ body }) => {
        const freshUrl = (body.data && body.data[0] && body.data[0].url) || '';
        redirect(freshUrl || song.url);
      })
      .catch(() => redirect(song.url));
  } else {
    redirect(song.url);
  }
});

// 管理：添加音乐
router.post('/', authMiddleware, (req, res) => {
  res.status(201).json(createMusic(req.body || {}));
});

// 管理：编辑音乐
router.put('/:id', authMiddleware, (req, res) => {
  res.json(editMusic(req.params.id, req.body || {}));
});

// 管理：删除音乐
router.delete('/:id', authMiddleware, (req, res) => {
  deleteMusic(req.params.id);
  res.json({ ok: true });
});

export default router;
