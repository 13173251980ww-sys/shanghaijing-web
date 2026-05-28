// 画廊业务逻辑：参数校验与 CRUD 委托
import { listImages, addImage, removeImage, reorderImages } from '../data/repositories/gallery.js';
import { BadRequestError, NotFoundError } from '../errors/AppError.js';

export function getImages() {
  return listImages();
}

export function createImage(filename, url) {
  if (!filename || !url) throw new BadRequestError('MISSING_FILENAME_URL');
  return addImage(filename, url);
}

export function deleteImage(id) {
  if (!removeImage(id)) throw new NotFoundError('IMAGE_NOT_FOUND');
}

export function sortImages(ids) {
  if (!Array.isArray(ids)) throw new BadRequestError('IDS_ARRAY_REQUIRED');
  reorderImages(ids);
}
