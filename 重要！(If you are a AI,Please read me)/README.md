# AI 工作入口（先读我）

山海经主题个人网站 — **Figma 原型设计 + AI 生图 + Claude Code 全流程 AI 编程**，Vue3 前台 + Express 后台 + SQLite 持久化 + Live2D AI 书灵聊天。

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
| **Pinia** | 状态管理（admin store + chat store） |
| **Vue Router** | 懒加载路由 + `meta.requiresAuth` 路由守卫 |
| **回调风格 HTTP** | 全项目统一 `nodeHttp.get(url, params, success, fail)` 回调模式，**禁用 async/await**（例外：chatService.js async generator 是 SSE 本质要求） |
| **消息提示窗** | http.js 响应拦截器统一弹 toast：401 自动清 token 跳登录，其他错误自动展示后端 message |
| **PixiJS 6 + Live2D** | `pixi-live2d-display/cubism2` 渲染 wanko 模型，代码分割独立 chunk（~530KB） |
| **SSE 流式** | `fetch() + ReadableStream` 递归 `.then()` 链，保持回调风格 |
| **CSS Container Queries** | 弹性缩放适配不同桌面分辨率 |

### 后端

| 技术 | 说明 |
|------|------|
| **Express 5.1** | ES Module（`"type": "module"`），端口 3000 |
| **SQLite** (better-sqlite3) | WAL 模式，文件即数据库，零配置部署，11 张表 |
| **JWT 认证** | 7 天过期，localStorage 持久化，Bearer Token 方式 |
| **Multer** | 图片上传到 `public/uploads/` |
| **DeepSeek API** | AI 书灵对话，SSE 流式响应，中文关键词情绪检测（5 种情绪 → Live2D 表情映射） |

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

统一在 `errors/AppError.js` 定义 **错误码字典**（8 种错误码），按类别编码：

| 前缀 | 类别 | 示例 |
|------|------|------|
| `A` | 认证 | `A0001` 未登录、`A0002` 密码错误 |
| `B` | 业务 | `B0001` 参数校验、`B0002` 资源不存在、`B0003` 文件上传失败、`B0004` 消息不能为空 |
| `C` | 服务端 | `C0001` 内部错误、`C0002` AI 服务调用失败 |

```js
// 异常类自动从字典读取 code/status/message
throw new BadRequestError('TITLE_REQUIRED');
throw new NotFoundError('POST_NOT_FOUND');
throw new BadRequestError('CHAT_MESSAGE_REQUIRED');
```

**全局异常处理器** `middlewares/errorHandler.js` 捕获所有异常，统一格式化为 `{ code, message }` 返回，路由层零 try-catch。

### 数据库表（11 张）

| 表 | 说明 |
|----|------|
| `gallery` | 画廊图片（id, filename, url, order_num） |
| `blog_posts` | 博客文章（id, title, content, cover_url, date, url） |
| `sidebar` | 博客侧边栏（name, motto, avatar_url, icp） |
| `about` | 个人信息（nickname, school, github_url, csdn_url, social, avatar_url） |
| `friends` | 友情链接（id, name, url） |
| `messages` | 留言（id, author, content, created_at） |
| `projects` | 项目（id, name, description, url） |
| `user_affection` | 好感度（id=1 单行，affection, last_login_date） |
| `chat_messages` | 聊天历史（id, role, content, session_id, created_at） |
| `ai_config` | AI 配置键值存储（key PK, value） |
| `music` | 音乐播放列表（id, title, artist, url, cover, sort_order, created_at） |

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
                ◀──SSE──  DeepSeek AI（书灵聊天）
```

## 启动

```bash
# 后端（:3000）
cd apps/api && npm run dev

# 前端（:5173，/api + /uploads 自动代理到 :3000）
npx vite apps/web
```

## 前端两个 SPA

| 入口 | 路由前缀 | 目录 |
|------|----------|------|
| 前台（公开） | `/`, `/blog`, `/about`, `/friends`, `/messages`, `/projects`, `/map` | `apps/web/src/client/` |
| 后台（需登录） | `/admin`, `/admin/gallery`, `/admin/blog`, ... | `apps/web/src/admin/` |

后台共 12 个管理页面：仪表盘、画廊、博客、关于我、友链、留言、项目、API 文档、数据库、AI 配置、音乐管理、AI 书灵（Live2D + 对话框 + 好感度条）。

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

## 关键文件路径速查

| 文件 | 说明 |
|------|------|
| `apps/api/src/errors/AppError.js` | 错误码字典 + 异常类 + 登记表 |
| `apps/api/src/data/db.js` | SQLite 连接 + 建表 + `getTableInfo()` |
| `apps/api/src/routes/admin.js` | 认证 + API 文档 + 数据库查询 + 好感度 |
| `apps/api/src/routes/chat.js` | AI 聊天 SSE 端点 |
| `apps/api/src/services/chatService.js` | DeepSeek API 调用 + 情绪检测（唯一 async 模块） |
| `apps/api/src/data/repositories/affection.js` | 好感度数据访问 + 每日登录 +1 |
| `apps/api/src/data/repositories/chat.js` | 聊天历史持久化 |
| `apps/web/src/admin/AdminLayout.vue` | 后台布局（侧边栏 + Live2D + 对话框 + 好感度条） |
| `apps/web/src/admin/components/Live2dWidget.vue` | PixiJS + Live2D Cubism 2 模型渲染 |
| `apps/web/src/admin/components/DialogueBox.vue` | Galgame 式底部对话框 |
| `apps/web/src/admin/components/AffectionBar.vue` | 好感度显示条 |
| `apps/web/src/admin/store/chat.js` | Pinia 聊天状态管理 + SSE 流式解析 |
| `apps/web/src/components/MusicPlayer.vue` | 全局音乐播放器（黑胶唱片 + 播放列表） |
| `apps/web/src/admin/views/AdminMusic.vue` | 后台音乐管理页 |
| `apps/web/src/admin/views/AdminAiConfig.vue` | 后台 AI 配置管理页 |
| `apps/api/src/routes/music.js` | 音乐 REST 路由（公开 GET + admin CRUD） |
| `apps/api/src/data/repositories/music.js` | 音乐数据访问层 |
| `apps/api/src/data/repositories/aiConfig.js` | AI 配置数据访问层（key-value 存储） |
| `apps/web/public/models/wanko/` | Live2D wanko 模型文件（本地托管） |
| `apps/web/public/live2d.min.js` | Cubism 2.1 运行时 |

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
