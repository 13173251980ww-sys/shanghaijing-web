# AI 工作入口（先读我）

山海经主题个人网站 — Vue3 前台 + Express 后台 + SQLite 持久化。

读完本文即可开始编码。详细信息见 `project-overview.md`，编码规则见 `coding-rules.md`。

## 一句话架构

```
前端 Vue3 (apps/web) ──HTTP──▶ Express (apps/api) ──SQL──▶ SQLite (.db 文件)
```

## 启动

```bash
# 后端（:3000）
cd apps/api && npm run dev

# 前端（:5173，/api 自动代理到 :3000）
npx vite apps/web
```

## 前端两个 SPA

| 入口 | 路由前缀 | 目录 |
|------|----------|------|
| 前台（公开） | `/`, `/blog`, `/about`, ... | `apps/web/src/client/` |
| 后台（需登录） | `/admin`, `/admin/gallery`, ... | `apps/web/src/admin/` |

## 后端三层

```
routes/ ──▶ services/ ──▶ data/repositories/
(HTTP)      (业务逻辑)      (SQL)
```

**铁律：路由层不写 SQL，不写校验逻辑。**

## 统一响应

```json
// 成功
{ "code": "00000", "data": { ... } }

// 失败
{ "code": "A0002", "message": "账号或密码错误" }
```

## HTTP 调用（前端）

全项目用回调，不用 async/await：

```js
import { getGallery } from '@/services/api/gallery.js';

getGallery(
  (res) => { /* res.data 即后端 data 字段 */ },
  () => {}  // 失败时 http.js 拦截器已弹 toast
);
```

## 必备操作（每次任务后）

1. `npx vite build apps/web` — 验证通过
2. 写迭代记录 → `E:\个人网站\shanghaijing-web\迭代记录\`
3. `git commit` + `git push`
