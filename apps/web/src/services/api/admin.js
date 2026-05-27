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

