// 关于页 API：个人信息的获取与更新
import { nodeHttp } from '@/services/http/http.js';

export function getAbout(success, fail) {
  nodeHttp.get('/about', {}, success, fail);
}

export function updateAbout(data, success, fail) {
  nodeHttp.put('/admin/about', data, success, fail);
}
