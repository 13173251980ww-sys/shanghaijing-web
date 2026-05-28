// 网易云音乐 API：二维码登录、歌单/喜欢列表、歌曲导入
import { nodeHttp } from '@/services/http/http.js';

export function getQrKey(success, fail) {
  nodeHttp.get('/admin/netease/qr-key', {}, success, fail);
}

export function checkQrStatus(key, success, fail) {
  nodeHttp.get('/admin/netease/qr-check', { key }, success, fail);
}

export function getLoginStatus(success, fail) {
  nodeHttp.get('/admin/netease/status', {}, success, fail);
}

export function getLikelist(success, fail) {
  nodeHttp.get('/admin/netease/likelist', {}, success, fail);
}

export function getPlaylists(success, fail) {
  nodeHttp.get('/admin/netease/playlists', {}, success, fail);
}

export function getPlaylistSongs(id, success, fail) {
  nodeHttp.get(`/admin/netease/playlist/${id}/songs`, {}, success, fail);
}

export function importSongs(songs, success, fail) {
  nodeHttp.post('/admin/netease/import', { songs }, success, fail);
}

export function neteaseLogout(success, fail) {
  nodeHttp.post('/admin/netease/logout', {}, success, fail);
}
