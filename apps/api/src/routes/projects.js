import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { getProjects, createProject, editProject, deleteProject } from '../services/projectsService.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(getProjects());
});

router.post('/', authMiddleware, (req, res) => {
  const { name, desc, url } = req.body || {};
  res.status(201).json(createProject(name, desc, url));
});

router.put('/:id', authMiddleware, (req, res) => {
  res.json(editProject(req.params.id, req.body || {}));
});

router.delete('/:id', authMiddleware, (req, res) => {
  deleteProject(req.params.id);
  res.json({ ok: true });
});

export default router;
