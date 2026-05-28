// 项目展示业务逻辑：校验与 CRUD 委托
import { listProjects, addProject, updateProject, removeProject } from '../data/repositories/projects.js';
import { BadRequestError, NotFoundError } from '../errors/AppError.js';

export function getProjects() {
  return listProjects();
}

export function createProject(name, desc, url) {
  if (!name || !desc || !url) throw new BadRequestError('NAME_DESC_URL_REQUIRED');
  return addProject(name, desc, url);
}

export function editProject(id, fields) {
  const item = updateProject(id, fields);
  if (!item) throw new NotFoundError('PROJECT_NOT_FOUND');
  return item;
}

export function deleteProject(id) {
  if (!removeProject(id)) throw new NotFoundError('PROJECT_NOT_FOUND');
}
