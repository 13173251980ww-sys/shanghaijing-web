# 项目全貌

## 技术栈

| 层 | 选型 | 备注 |
|----|------|------|
| 前端框架 | Vue 3 (Composition API) | JS，非 TS |
| 构建 | Vite 6 | npm workspace monorepo |
| 后端 | Express 5.1 | ES Module (`"type": "module"`) |
| 数据库 | SQLite (better-sqlite3) | WAL 模式，文件即数据库 |
| 认证 | JWT | 7 天过期，localStorage 持久化 |
| 设计尺寸 | 1440×900 | 桌面端优先 |

## 完整目录树

```
shanghaijing-web/
├── apps/
│   ├── web/                          # 前端
│   │   ├── public/uploads/
│   │   ├── src/
│   │   │   ├── admin/                # 后台管理 SPA
│   │   │   │   ├── AdminLayout.vue
│   │   │   │   ├── router.js
│   │   │   │   ├── store.js
│   │   │   │   ├── components/AdminSidebar.vue
│   │   │   │   └── views/
│   │   │   │       ├── AdminLoginView.vue
│   │   │   │       ├── AdminDashboard.vue
│   │   │   │       ├── AdminGallery.vue
│   │   │   │       ├── AdminBlog.vue
│   │   │   │       ├── AdminAbout.vue
│   │   │   │       ├── AdminFriends.vue
│   │   │   │       ├── AdminMessages.vue
│   │   │   │       ├── AdminProjects.vue
│   │   │   │       ├── AdminApiDocs.vue
│   │   │   │       └── AdminDatabase.vue
│   │   │   ├── client/               # 前台 SPA
│   │   │   │   ├── router.js
│   │   │   │   ├── store.js
│   │   │   │   ├── components/SiteHeader.vue
│   │   │   │   └── views/
│   │   │   │       ├── GalleryView.vue
│   │   │   │       ├── BlogView.vue
│   │   │   │       ├── AboutView.vue
│   │   │   │       ├── FriendLinksView.vue
│   │   │   │       ├── MessagesView.vue
│   │   │   │       ├── ProjectsView.vue
│   │   │   │       └── MapView.vue
│   │   │   ├── components/common/    # 共享组件
│   │   │   ├── services/
│   │   │   │   ├── http/             # axios + 拦截器
│   │   │   │   └── api/              # 按模块 API 封装
│   │   │   ├── App.vue
│   │   │   └── main.js
│   │   ├── vite.config.js            # /api → :3000 代理
│   │   └── .env
│   │
│   └── api/                          # 后端
│       ├── data/                     # .db 文件（gitignore）
│       └── src/
│           ├── data/
│           │   ├── db.js             # 连接 + 建表
│           │   └── repositories/     # 数据访问层
│           │       ├── gallery.js
│           │       ├── blog.js
│           │       ├── about.js
│           │       ├── friends.js
│           │       ├── messages.js
│           │       └── projects.js
│           ├── services/             # 业务逻辑层
│           │   ├── galleryService.js
│           │   ├── blogService.js
│           │   ├── aboutService.js
│           │   ├── friendsService.js
│           │   ├── messagesService.js
│           │   └── projectsService.js
│           ├── routes/               # HTTP 路由层
│           │   ├── admin.js
│           │   ├── upload.js
│           │   ├── gallery.js
│           │   ├── blog.js
│           │   ├── about.js
│           │   ├── friends.js
│           │   ├── messages.js
│           │   └── projects.js
│           ├── errors/AppError.js
│           ├── middlewares/
│           │   ├── auth.js
│           │   └── errorHandler.js
│           ├── app.js
│           └── server.js
│
├── 重要！(If you are a AI,Please read me)/
│   ├── README.md              # 总入口
│   ├── project-overview.md    # 本文件
│   ├── coding-rules.md        # 编码规则
│   └── iteration-template.md  # 迭代记录模板
├── 迭代记录/
├── package.json
└── pnpm-workspace.yaml
```

## 前端路由

### 前台

| 路径 | 组件 | 说明 |
|------|------|------|
| `/` | GalleryView | 画廊 |
| `/blog` | BlogView | 博客 |
| `/about` | AboutView | 关于我 |
| `/friends` | FriendLinksView | 友情链接 |
| `/messages` | MessagesView | 留言 |
| `/projects` | ProjectsView | 项目 |
| `/map` | MapView | 山海图 |

### 后台（`meta: { requiresAuth: true }` 路由守卫）

| 路径 | 组件 | 说明 |
|------|------|------|
| `/admin/login` | AdminLoginView | 登录页 |
| `/admin` | AdminDashboard | 仪表盘 |
| `/admin/gallery` | AdminGallery | 画廊管理 |
| `/admin/blog` | AdminBlog | 博客管理 |
| `/admin/about` | AdminAbout | 关于我管理 |
| `/admin/friends` | AdminFriends | 友链管理 |
| `/admin/messages` | AdminMessages | 留言管理 |
| `/admin/projects` | AdminProjects | 项目管理 |
| `/admin/api-docs` | AdminApiDocs | API 文档 |
| `/admin/database` | AdminDatabase | 数据库管理 |

## 后端 API（全量）

| 方法 | 路径 | 认证 | 说明 |
|------|------|------|------|
| POST | `/api/admin/login` | — | 管理员登录 |
| GET | `/api/admin/check` | 是 | 验证 token |
| GET | `/api/admin/api-docs` | 是 | 接口文档 |
| GET | `/api/admin/db-info` | 是 | 数据库表结构 |
| GET | `/api/admin/db-query/:table` | 是 | 查询表数据 |
| POST | `/api/admin/upload` | 是 | 上传图片 |
| GET | `/api/gallery` | — | 画廊列表 |
| POST | `/api/admin/gallery` | 是 | 添加图片 |
| DELETE | `/api/admin/gallery/:id` | 是 | 删除图片 |
| PUT | `/api/admin/gallery/reorder` | 是 | 排序 |
| GET | `/api/blog/posts` | — | 文章列表 |
| GET | `/api/blog/posts/:id` | — | 文章详情 |
| POST | `/api/admin/blog/posts` | 是 | 发布 |
| PUT | `/api/admin/blog/posts/:id` | 是 | 编辑 |
| DELETE | `/api/admin/blog/posts/:id` | 是 | 删除 |
| POST | `/api/admin/blog/posts/batch-delete` | 是 | 批量删除 |
| GET | `/api/blog/sidebar` | — | 侧边栏信息 |
| PUT | `/api/admin/blog/sidebar` | 是 | 更新侧边栏 |
| GET | `/api/about` | — | 个人信息 |
| PUT | `/api/admin/about` | 是 | 更新个人信息 |
| GET | `/api/friends` | — | 友链列表 |
| POST | `/api/admin/friends` | 是 | 添加友链 |
| PUT | `/api/admin/friends/:id` | 是 | 编辑友链 |
| DELETE | `/api/admin/friends/:id` | 是 | 删除友链 |
| GET | `/api/messages` | — | 留言列表 |
| POST | `/api/messages` | — | 提交留言 |
| DELETE | `/api/admin/messages/:id` | 是 | 删除留言 |
| GET | `/api/projects` | — | 项目列表 |
| POST | `/api/admin/projects` | 是 | 添加项目 |
| PUT | `/api/admin/projects/:id` | 是 | 编辑项目 |
| DELETE | `/api/admin/projects/:id` | 是 | 删除项目 |

## 数据库表

| 表 | 说明 | 关键字段 |
|----|------|----------|
| gallery | 画廊图片 | id, filename, url, order_num |
| blog_posts | 博客文章 | id, title, description, content, cover_url, date |
| sidebar | 博客侧边栏 | id=1, name, motto, avatar_url, icp |
| about | 个人信息 | id=1, nickname, school, github_url, csdn_url, social, avatar_url |
| friends | 友情链接 | id, name, url |
| messages | 留言 | id, author, content, created_at |
| projects | 项目 | id, name, description, url |

DB 字段 snake_case，repositories 层映射为 camelCase 返回前端。
