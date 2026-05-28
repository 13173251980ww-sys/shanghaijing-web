// 博客 API：文章列表/详情、发布/编辑/删除、侧边栏
import { nodeHttp } from '@/services/http/http.js';

export function getPosts(success, fail) {
  nodeHttp.get('/blog/posts', {}, success, fail);
}

export function getPost(id, success, fail) {
  nodeHttp.get(`/blog/posts/${id}`, {}, success, fail);
}

export function createPost(data, success, fail) {
  nodeHttp.post('/admin/blog/posts', data, success, fail);
}

export function updatePost(id, data, success, fail) {
  nodeHttp.put(`/admin/blog/posts/${id}`, data, success, fail);
}

export function deletePost(id, success, fail) {
  nodeHttp.delete(`/admin/blog/posts/${id}`, {}, success, fail);
}

export function batchDeletePosts(ids, success, fail) {
  nodeHttp.post('/admin/blog/posts/batch-delete', { ids }, success, fail);
}

export function getSidebar(success, fail) {
  nodeHttp.get('/blog/sidebar', {}, success, fail);
}

export function updateSidebar(data, success, fail) {
  nodeHttp.put('/admin/blog/sidebar', data, success, fail);
}
