// 音乐业务逻辑：曲目 CRUD 与参数校验
import { listMusic, addMusic, updateMusic, removeMusic } from '../data/repositories/music.js';
import { BadRequestError, NotFoundError } from '../errors/AppError.js';

export function getMusicList() {
  return listMusic();
}

export function createMusic(body) {
  const { title, url } = body || {};
  if (!title || !url) throw new BadRequestError('MUSIC_TITLE_URL_REQUIRED');
  return addMusic(body);
}

export function editMusic(id, fields) {
  const item = updateMusic(id, fields);
  if (!item) throw new NotFoundError('MUSIC_NOT_FOUND');
  return item;
}

export function deleteMusic(id) {
  if (!removeMusic(id)) throw new NotFoundError('MUSIC_NOT_FOUND');
}
