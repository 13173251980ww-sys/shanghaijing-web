import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import adminRouter from './routes/admin.js';
import galleryRouter from './routes/gallery.js';
import blogRouter from './routes/blog.js';
import aboutRouter from './routes/about.js';
import friendsRouter from './routes/friends.js';
import messagesRouter from './routes/messages.js';
import projectsRouter from './routes/projects.js';
import uploadRouter from './routes/upload.js';
import chatRouter from './routes/chat.js';
import musicRouter from './routes/music.js';
import neteaseRouter from './routes/netease.js';
import errorHandler from './middlewares/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// wrap all successful responses with { code: '00000', data: ... }
app.use((_req, res, next) => {
  const orig = res.json.bind(res);
  res.json = (body) => {
    if (body && typeof body === 'object' && 'code' in body) return orig(body);
    return orig({ code: '00000', data: body });
  };
  next();
});

app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

app.use('/api/admin', adminRouter);
app.use('/api/admin/upload', uploadRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/admin/gallery', galleryRouter);
app.use('/api/blog', blogRouter);
app.use('/api/admin/blog', blogRouter);
app.use('/api/about', aboutRouter);
app.use('/api/admin/about', aboutRouter);
app.use('/api/friends', friendsRouter);
app.use('/api/admin/friends', friendsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/admin/messages', messagesRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/admin/projects', projectsRouter);
app.use('/api/admin/chat', chatRouter);
app.use('/api/music', musicRouter);
app.use('/api/admin/music', musicRouter);
app.use('/api/admin/netease', neteaseRouter);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'api' });
});

app.use(errorHandler);

export default app;
