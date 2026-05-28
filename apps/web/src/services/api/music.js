// 音乐 API：曲目的增删改查
import { nodeHttp } from '@/services/http/http.js';

export function getMusic(success, fail) {
  nodeHttp.get('/music', {}, success, fail);
}

export function addMusic(data, success, fail) {
  nodeHttp.post('/admin/music', data, success, fail);
}

export function updateMusic(id, data, success, fail) {
  nodeHttp.put(`/admin/music/${id}`, data, success, fail);
}

export function deleteMusic(id, success, fail) {
  nodeHttp.delete(`/admin/music/${id}`, {}, success, fail);
}
