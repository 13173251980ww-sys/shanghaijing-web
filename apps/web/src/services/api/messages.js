// 留言板 API：留言的获取、提交与删除
import { nodeHttp } from '@/services/http/http.js';

export function getMessages(success, fail) {
  nodeHttp.get('/messages', {}, success, fail);
}

export function addMessage(data, success, fail) {
  nodeHttp.post('/messages', data, success, fail);
}

export function deleteMessage(id, success, fail) {
  nodeHttp.delete(`/admin/messages/${id}`, {}, success, fail);
}
