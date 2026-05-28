// 项目展示路由：项目增删改查
import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { getProjects, createProject, editProject, deleteProject } from '../services/projectsService.js';

const router = Router();

// 公开：获取项目列表
router.get('/', (_req, res) => {
  res.json(getProjects());
});

// 管理：添加新项目
router.post('/', authMiddleware, (req, res) => {
  const { name, desc, url } = req.body || {};
  res.status(201).json(createProject(name, desc, url));
});

// 管理：编辑项目
router.put('/:id', authMiddleware, (req, res) => {
  res.json(editProject(req.params.id, req.body || {}));
});

// 管理：删除项目
router.delete('/:id', authMiddleware, (req, res) => {
  deleteProject(req.params.id);
  res.json({ ok: true });
});

export default router;
