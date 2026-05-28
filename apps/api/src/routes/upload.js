// 文件上传路由：使用 multer 处理图片上传
import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { authMiddleware } from '../middlewares/auth.js';
import { BadRequestError } from '../errors/AppError.js';

// 上传目标目录
const uploadDir = path.resolve('public/uploads');

// 配置 multer 磁盘存储：按时间戳+随机数生成唯一文件名
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

// multer 实例：限制 10MB，仅允许图片格式
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const allowed = /\.(png|jpe?g|gif|webp|svg)$/i;
    cb(null, allowed.test(path.extname(file.originalname)));
  },
});

const router = Router();

// 管理：上传图片，返回可访问的 URL
router.post('/', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) throw new BadRequestError('INVALID_IMAGE_FILE');
  res.json({ filename: req.file.filename, url: '/uploads/' + req.file.filename });
});

export default router;
