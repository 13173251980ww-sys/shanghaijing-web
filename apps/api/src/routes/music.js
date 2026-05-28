import { Router } from 'express';
import { createRequire } from 'node:module';
import { authMiddleware } from '../middlewares/auth.js';
import { getMusicList, createMusic, editMusic, deleteMusic } from '../services/musicService.js';
import { getDb } from '../data/db.js';
import { getConfig } from '../data/repositories/aiConfig.js';

const require = createRequire(import.meta.url);
const { song_url } = require('NeteaseCloudMusicApi');

const router = Router();

router.get('/', (_req, res) => {
  res.json(getMusicList());
});

// Stream proxy for NetEase songs — fetches a fresh URL and 302 redirects
router.get('/:id/stream', (req, res) => {
  const song = getDb().prepare('SELECT * FROM music WHERE id = ?').get(req.params.id);
  if (!song) return res.status(404).json({ error: 'MUSIC_NOT_FOUND' });

  const redirect = (url) => {
    if (!url) return res.status(404).json({ error: 'MUSIC_NO_URL' });
    res.redirect(302, url);
  };

  // Extract netease ID from column or from netease:// URL prefix
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

router.post('/', authMiddleware, (req, res) => {
  res.status(201).json(createMusic(req.body || {}));
});

router.put('/:id', authMiddleware, (req, res) => {
  res.json(editMusic(req.params.id, req.body || {}));
});

router.delete('/:id', authMiddleware, (req, res) => {
  deleteMusic(req.params.id);
  res.json({ ok: true });
});

export default router;
