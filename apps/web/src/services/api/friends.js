import { nodeHttp } from '@/services/http/http.js';

export function getFriends(success, fail) {
  nodeHttp.get('/friends', {}, success, fail);
}

export function addFriend(data, success, fail) {
  nodeHttp.post('/admin/friends', data, success, fail);
}

export function updateFriend(id, data, success, fail) {
  nodeHttp.put(`/admin/friends/${id}`, data, success, fail);
}

export function deleteFriend(id, success, fail) {
  nodeHttp.delete(`/admin/friends/${id}`, {}, success, fail);
}
