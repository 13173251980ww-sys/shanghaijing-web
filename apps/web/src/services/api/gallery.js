import { nodeHttp } from '@/services/http/http.js';

export function getGallery(success, fail) {
  nodeHttp.get('/gallery', {}, success, fail);
}

export function addGallery(data, success, fail) {
  nodeHttp.post('/admin/gallery', data, success, fail);
}

export function deleteGallery(id, success, fail) {
  nodeHttp.delete(`/admin/gallery/${id}`, {}, success, fail);
}

export function reorderGallery(ids, success, fail) {
  nodeHttp.put('/admin/gallery/reorder', { ids }, success, fail);
}
