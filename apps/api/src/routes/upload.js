import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { authMiddleware } from '../middlewares/auth.js';
import { BadRequestError } from '../errors/AppError.js';

const uploadDir = path.resolve('public/uploads');

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname) || '.png';
    const name = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const allowed = /\.(png|jpe?g|gif|webp|svg)$/i;
    cb(null, allowed.test(path.extname(file.originalname)));
  },
});

const router = Router();

router.post('/', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) throw new BadRequestError('INVALID_IMAGE_FILE');
  res.json({ filename: req.file.filename, url: '/uploads/' + req.file.filename });
});

export default router;
