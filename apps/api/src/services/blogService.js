import {
  listPosts, getPost, createPost, updatePost, deletePost, batchDeletePosts,
  getSidebar, updateSidebar,
} from '../data/repositories/blog.js';
import { BadRequestError, NotFoundError } from '../errors/AppError.js';

export function getPosts() {
  return listPosts();
}

export function getPostById(id) {
  const post = getPost(id);
  if (!post) throw new NotFoundError('POST_NOT_FOUND');
  return post;
}

export function publishPost(fields) {
  if (!fields.title) throw new BadRequestError('TITLE_REQUIRED');
  return createPost(fields);
}

export function editPost(id, fields) {
  const post = updatePost(id, fields);
  if (!post) throw new NotFoundError('POST_NOT_FOUND');
  return post;
}

export function removePost(id) {
  if (!deletePost(id)) throw new NotFoundError('POST_NOT_FOUND');
}

export function removePosts(ids) {
  if (!Array.isArray(ids) || ids.length === 0) throw new BadRequestError('IDS_NON_EMPTY_ARRAY');
  return batchDeletePosts(ids);
}

export function getBlogSidebar() {
  return getSidebar();
}

export function editSidebar(fields) {
  return updateSidebar(fields);
}
