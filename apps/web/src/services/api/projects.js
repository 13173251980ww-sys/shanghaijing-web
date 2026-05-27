import { nodeHttp } from '@/services/http/http.js';

export function getProjects(success, fail) {
  nodeHttp.get('/projects', {}, success, fail);
}

export function addProject(data, success, fail) {
  nodeHttp.post('/admin/projects', data, success, fail);
}

export function updateProject(id, data, success, fail) {
  nodeHttp.put(`/admin/projects/${id}`, data, success, fail);
}

export function deleteProject(id, success, fail) {
  nodeHttp.delete(`/admin/projects/${id}`, {}, success, fail);
}
