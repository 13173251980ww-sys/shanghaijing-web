# AI 工作入口（先读我）

山海经主题个人网站 — **Figma 原型设计 + AI 生图 + Claude Code 全流程 AI 编程**，Vue3 前台 + Express 后台 + SQLite 持久化。

读完本文即可编码。详情见 [project-overview.md](project-overview.md)，规则见 [coding-rules.md](coding-rules.md)。

---

## 项目技术全景

### 设计层

| 技术 | 说明 |
|------|------|
| **Figma 原型** | 全站 1440×900 桌面端 UI 在 Figma 中完成原型设计与迭代 |
| **AI 生图（image-2）** | 山海经主题水墨插画、卷轴背景、印章等视觉素材由 AI 生成 |
| **山海经统一主题** | 墨色 `#3a2f28`、朱砂红 `#C41E1E`、宣纸底 `rgba(245,240,232,...)`，古卷轴动画背景，全站统一水墨风格，前后台视觉一致 |

### 前端

| 技术 | 说明 |
|------|------|
| **Vue 3** (Composition API) | 纯 JS，非 TypeScript |
| **Vite 6** | 构建工具，npm workspace monorepo |
| **前后台分离** | `client/` 前台 SPA（公开访问）+ `admin/` 后台 SPA（JWT 认证），同一项目内路由隔离 |
| **Pinia** | 状态管理 |
| **Vue Router** | 懒加载路由 + `meta.requiresAuth` 路由守卫 |
| **回调风格 HTTP** | 全项目统一 `nodeHttp.get(url, params, success, fail)` 回调模式，**禁用 async/await** |
| **消息提示窗** | http.js 响应拦截器统一弹 toast：401 自动清 token 跳登录，其他错误自动展示后端 message |
| **CSS Container Queries** | 弹性缩放适配不同桌面分辨率 |

### 后端

| 技术 | 说明 |
|------|------|
| **Express 5.1** | ES Module（`"type": "module"`），端口 3000 |
| **SQLite** (better-sqlite3) | WAL 模式，文件即数据库，零配置部署 |
| **JWT 认证** | 7 天过期，localStorage 持久化，Bearer Token 方式 |
| **Multer** | 图片上传到 `public/uploads/` |

### 后端三层架构

```
routes/ ──调用──▶ services/ ──调用──▶ data/repositories/
(HTTP 参数提取)    (校验+业务逻辑)       (SQL + 字段映射)
```

| 层 | 职责 | 禁止 |
|----|------|------|
| **Routes** | 提取 HTTP 参数 → 调 service → 返回 JSON | 写 SQL、写 if/else 校验、直接 require repository |
| **Services** | 参数校验 + 业务逻辑 + 抛异常 | 碰 req/res、直接写 SQL |
| **Repositories** | 纯数据访问，SQL + snake_case→camelCase 映射 | 抛业务异常、参数校验、访问 req/res |

### 自定义错误异常体系

统一在 `errors/AppError.js` 定义 **错误码字典**（20+ 条目），按类别编码：

| 前缀 | 类别 | 示例 |
|------|------|------|
| `A` | 认证 | `A0001` 未登录、`A0002` 密码错误 |
| `B` | 业务 | `B0001` 参数校验、`B0002` 资源不存在 |

```js
// 异常类自动从字典读取 code/status/message
throw new BadRequestError('TITLE_REQUIRED');
throw new NotFoundError('POST_NOT_FOUND');
```

**全局异常处理器** `middlewares/errorHandler.js` 捕获所有异常，统一格式化为 `{ code, message }` 返回，路由层零 try-catch。

### AI 驱动的开发与维护

| 机制 | 说明 |
|------|------|
| **Claude Code AI 编程** | 全站代码由 Claude Code 在用户指导下生成，AI 负责从架构设计到具体实现的完整流程 |
| **AI 自动 Git 提交推送** | 每次任务完成后 AI 自动执行 `git commit` + `git push`，不攒批，确保工作不丢失 |
| **Markdown 项目规范文档** | `重要！(If you are a AI,Please read me)/` 目录存放项目全貌、编码规则、迭代模板，新 AI 会话读完后即可无缝接手维护 |

---

## 一句话架构

```
Vue3 (apps/web) ──HTTP──▶ Express (apps/api) ──SQL──▶ SQLite (.db 文件)
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
| 前台（公开） | `/`, `/blog`, `/about`, `/friends`, `/messages`, `/projects`, `/map` | `apps/web/src/client/` |
| 后台（需登录） | `/admin`, `/admin/gallery`, `/admin/blog`, ... | `apps/web/src/admin/` |

## 统一响应格式

```json
// 成功
{ "code": "00000", "data": { ... } }

// 失败
{ "code": "A0002", "message": "账号或密码错误" }
```

## HTTP 调用（前端）

```js
import { getGallery } from '@/services/api/gallery.js';

getGallery(
  (res) => { gallery.value = res.data; },  // res.data 即后端 data 字段
  () => {}  // 失败时 http.js 拦截器已弹 toast，无需额外处理
);
```

## 必备操作（每次任务后）

1. `npx vite build apps/web` — 验证构建通过
2. 写迭代记录到 `E:\个人网站\shanghaijing-web\迭代记录\`
3. `git commit` + `git push` — 不攒批

---

## 设计到代码工作流

```
Figma 原型 → AI 生成视觉素材(image-2) → Claude Code 编码实现 → git push → 宝塔部署上线
```

## 相关文档

- [project-overview.md](project-overview.md) — 完整目录树、路由表、API 表、数据库表
- [coding-rules.md](coding-rules.md) — 三层架构、错误码、HTTP 风格、视觉规范等全部编码规则
- [iteration-template.md](iteration-template.md) — 迭代记录模板
