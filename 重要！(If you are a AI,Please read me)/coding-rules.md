# 编码规则

## 1. 后端三层架构

```
routes/ ──调用──▶ services/ ──调用──▶ data/repositories/
(HTTP 参数提取)    (校验+业务逻辑)       (SQL + 字段映射)
```

### Routes 层 — 只做 HTTP

```js
import { Router } from 'express';
import { getImages, createImage } from '../services/galleryService.js';

router.get('/', (_req, res) => {
  res.json(getImages());  // 调 service，不碰 SQL
});

router.post('/', authMiddleware, (req, res) => {
  const { filename, url } = req.body || {};
  res.status(201).json(createImage(filename, url));  // 不写校验
});
```

**路由层禁止**：写 SQL、写 if/else 参数校验、直接 require repository。

### Services 层 — 校验 + 业务

```js
import { addImage, removeImage } from '../data/repositories/gallery.js';
import { BadRequestError, NotFoundError } from '../errors/AppError.js';

export function createImage(filename, url) {
  if (!filename || !url) throw new BadRequestError('MISSING_FILENAME_URL');
  return addImage(filename, url);
}

export function deleteImage(id) {
  if (!removeImage(id)) throw new NotFoundError('IMAGE_NOT_FOUND');
}
```

### Repositories 层 — 纯数据

```js
import { v4 as uuid } from 'uuid';
import { getDb } from '../db.js';

export function listImages() {
  const rows = getDb().prepare('SELECT * FROM gallery ORDER BY order_num').all();
  return rows.map(r => ({ id: r.id, filename: r.filename, url: r.url, order: r.order_num }));
}  // snake_case → camelCase 映射

export function addImage(filename, url) {
  const id = uuid();
  getDb().prepare('INSERT INTO gallery VALUES (?, ?, ?, ?)').run(id, filename, url, 0);
  return { id, filename, url, order: 0 };
}
```

**Repository 禁止**：抛业务异常、参数校验、访问 req/res。

---

## 2. 错误码体系

统一在 `errors/AppError.js` 定义：

```js
export const ERRORS = {
  NOT_LOGGED_IN:      { code: 'A0001', status: 401, label: '未登录',     message: '未登录，请先登录' },
  INVALID_CREDENTIALS: { code: 'A0002', status: 401, label: '密码错误',   message: '账号或密码错误' },
  TITLE_REQUIRED:      { code: 'B0001', status: 400, label: '参数校验',   message: '标题不能为空' },
  NOT_FOUND:           { code: 'B0002', status: 404, label: '资源不存在', message: '资源不存在' },
  // ... 共 23 个条目
};

// 异常类接受 key，自动从 ERRORS 查 code/status/message
export class AppError extends Error {
  constructor(key) {
    const def = ERRORS[key];
    super(def.message);
    this.code = def.code;
    this.statusCode = def.status;
  }
}
export class BadRequestError extends AppError { constructor(k) { super(k); } }
export class UnauthorizedError extends AppError { constructor(k = 'NOT_LOGGED_IN') { super(k); } }
export class NotFoundError extends AppError { constructor(k = 'NOT_FOUND') { super(k); } }
```

使用：

```js
throw new BadRequestError('TITLE_REQUIRED');
throw new NotFoundError('POST_NOT_FOUND');
// 错误码和 message 从 ERRORS 字典自动获取，不硬编码字符串
```

全局 `middlewares/errorHandler.js` 捕获所有异常，格式化为 `{ code, message }`。

---

## 3. 前端 HTTP 调用

### 统一用回调，不用 async/await

```js
// services/http/http.js 导出
nodeHttp.get(url, params, success, fail)
nodeHttp.post(url, data, success, fail)
nodeHttp.put(url, data, success, fail)
nodeHttp.delete(url, params, success, fail)
```

### API 封装模式

```js
// services/api/gallery.js
import { nodeHttp } from '@/services/http/http.js';

export function getGallery(success, fail) {
  nodeHttp.get('/gallery', {}, success, fail);
}

export function addImage(data, success, fail) {
  nodeHttp.post('/admin/gallery', data, success, fail);
}
```

### 组件中调用

```js
import { getGallery } from '@/services/api/gallery.js';

const gallery = ref([]);

getGallery(
  (res) => { gallery.value = res.data; },  // res.data 是后端的 data 字段
  () => {}  // 失败时 http.js 拦截器已弹 toast
);
```

### http.js 自动行为

- 请求拦截器：自动读 `admin_token`，加 `Authorization: Bearer <token>`
- 响应拦截器：401 → 清 token + 跳登录；其他错误 → 弹 toast（`data?.message || data?.msg`）

---

## 4. 数据库

- SQLite (better-sqlite3)，WAL 模式
- 文件：`apps/api/data/shanghaijing.db`（gitignore）
- 首次启动 `CREATE TABLE IF NOT EXISTS` 建空表，无种子数据
- 后续启动直接读写已有数据
- 字段 snake_case，repositories 映射为 camelCase

---

## 5. 视觉规范

- Figma 设计尺寸：1440×900，仅桌面端
- 墨色 `#3a2f28`，朱砂红 `#C41E1E`，宣纸底 `rgba(245, 240, 232, ...)`
- 字体：`font-family: var(--font-ink)` 所有中文组件
- CSS Container Queries 做弹性缩放
- 古卷轴水墨风格，前后台统一
- **禁止**引入第三方 UI 库（Element Plus / Ant Design）

---

## 6. Git Commit 规范

```
feat:     新功能
fix:      缺陷修复
refactor: 重构（无行为变化）
docs:     文档与记录
chore:    工程维护
```

格式：`type(scope): summary`，如 `feat(api): add SQLite persistence layer`

---

## 7. 强制工作流

```
1. 写代码
2. npx vite build apps/web（验证构建）
3. 写迭代记录到 E:\个人网站\shanghaijing-web\迭代记录\
4. git commit
5. git push
```

**每次任务后 commit + push，不攒批。**

---

## 8. 禁止事项

| 禁止 | 原因 |
|------|------|
| 路由层写 SQL | 架构约束 |
| 硬编码错误码/报错信息 | 用 ERRORS 字典 |
| async/await | 项目统一回调风格 |
| 引入第三方 UI 库 | 破坏水墨风格一致性 |
| 修改 .env BASE_URL | 破坏代理配置 |
| 做完不提交推送 | 丢失工作 |
| 迭代记录写进项目目录 | 应写入 `E:\个人网站\shanghaijing-web\迭代记录\` |
