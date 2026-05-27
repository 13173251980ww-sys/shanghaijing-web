import {
  login_qr_key, login_qr_check, login_status,
  user_playlist, playlist_track_all, likelist, song_detail,
} from 'NeteaseCloudMusicApi';
import { getConfig, setConfig } from '../data/repositories/aiConfig.js';
import { addMusic } from '../data/repositories/music.js';
import { getDb } from '../data/db.js';
import { BadRequestError, AppError } from '../errors/AppError.js';

function getCookie() {
  const cookie = getConfig('netease_cookie');
  if (!cookie) throw new BadRequestError('NETEASE_NOT_LOGGED_IN');
  return cookie;
}

export async function getQrKey() {
  try {
    const { body } = await login_qr_key();
    const unikey = body.data.unikey;
    const loginUrl = `https://music.163.com/login?codekey=${unikey}`;
    const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(loginUrl)}`;
    return { key: unikey, qrDataUrl, qrUrl: loginUrl };
  } catch {
    throw new AppError('NETEASE_API_ERROR');
  }
}

export async function checkQrStatus(key) {
  try {
    const { body } = await login_qr_check({ key });
    if (body.code === 803) {
      setConfig('netease_cookie', body.cookie);
      return { code: body.code, cookie: body.cookie };
    }
    return { code: body.code };
  } catch {
    throw new AppError('NETEASE_API_ERROR');
  }
}

export async function getLoginStatus() {
  try {
    const cookie = getConfig('netease_cookie');
    if (!cookie) return { loggedIn: false };
    const { body } = await login_status({ cookie });
    if (body.data && body.data.profile) {
      return { loggedIn: true, profile: { userId: body.data.profile.userId, nickname: body.data.profile.nickname, avatarUrl: body.data.profile.avatarUrl } };
    }
    return { loggedIn: false };
  } catch {
    return { loggedIn: false };
  }
}

export async function getUserPlaylists() {
  try {
    const cookie = getCookie();
    const { body } = await login_status({ cookie });
    const uid = body.data.profile.userId;
    const { body: plBody } = await user_playlist({ uid, cookie });
    const playlists = (plBody.playlist || []).map(p => ({
      id: String(p.id), name: p.name, trackCount: p.trackCount, coverImgUrl: p.coverImgUrl,
    }));
    return { playlists };
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError('NETEASE_API_ERROR');
  }
}

export async function getPlaylistSongs(playlistId) {
  try {
    const cookie = getCookie();
    const { body } = await playlist_track_all({ id: playlistId, cookie, limit: 500 });
    const songs = (body.songs || []).map(s => {
      const artists = (s.ar || []).map(a => a.name).join(' / ');
      return {
        id: String(s.id),
        title: s.name || '',
        artist: artists,
        cover: (s.al && s.al.picUrl) || '',
      };
    });
    return { songs };
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError('NETEASE_API_ERROR');
  }
}

export async function getLikelist() {
  try {
    const cookie = getCookie();
    const { body: stBody } = await login_status({ cookie });
    const uid = stBody.data.profile.userId;
    const { body } = await likelist({ uid, cookie });
    const ids = body.ids || [];
    if (ids.length === 0) return { songs: [] };
    // song_detail from NetEase API requires the function — use /song/detail endpoint
    const idStr = ids.join(',');
    const { body: detailBody } = await song_detail({ ids: idStr, cookie });
    const songs = (detailBody.songs || []).map(s => {
      const artists = (s.ar || []).map(a => a.name).join(' / ');
      return {
        id: String(s.id),
        title: s.name || '',
        artist: artists,
        cover: (s.al && s.al.picUrl) || '',
      };
    });
    return { songs };
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError('NETEASE_API_ERROR');
  }
}

export function importSongs(songs) {
  if (!Array.isArray(songs) || songs.length === 0) {
    throw new BadRequestError('IDS_NON_EMPTY_ARRAY');
  }
  let imported = 0;
  for (const s of songs) {
    if (!s.title) continue;
    const existing = getDb().prepare(
      'SELECT id FROM music WHERE title = ? AND artist = ?'
    ).get(s.title, s.artist || '');
    if (existing) continue;

    let url = s.url || '';
    // If a neteaseId is provided and no URL yet, store as reference
    if (!url && s.neteaseId) {
      url = `netease://${s.neteaseId}`;
    }

    addMusic({
      title: s.title,
      artist: s.artist || '',
      url,
      cover: s.cover || '',
      sortOrder: imported,
    });
    imported++;
  }
  return { imported };
}

export function clearCookie() {
  setConfig('netease_cookie', '');
  return { ok: true };
}
