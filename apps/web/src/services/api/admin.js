// 管理后台 API：登录、认证、上传、数据库查询、AI 配置
import { nodeHttp } from '@/services/http/http.js';

export function login(data, success, fail) {
  nodeHttp.post('/admin/login', data, success, fail);
}

export function checkAuth(success, fail) {
  nodeHttp.get('/admin/check', {}, success, fail);
}

export function getApiDocs(success, fail) {
  nodeHttp.get('/admin/api-docs', {}, success, fail);
}

export function getDbInfo(success, fail) {
  nodeHttp.get('/admin/db-info', {}, success, fail);
}

export function getDbTable(table, success, fail) {
  nodeHttp.get(`/admin/db-query/${table}`, {}, success, fail);
}

export function uploadImage(formData, success, fail) {
  nodeHttp.post('/admin/upload', formData, success, fail, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function getAiConfig(success, fail) {
  nodeHttp.get('/admin/ai-config', {}, success, fail);
}

export function setAiConfig(key, value, success, fail) {
  nodeHttp.put('/admin/ai-config', { key, value }, success, fail);
}

