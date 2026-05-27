# 04-SQLite 改造与三层架构

**日期**: 2026-05-27  
**提交**: 445028a

## 变更概述

将后端数据存储从内存 JSON 对象（`store.js`）迁移至 SQLite 数据库（`better-sqlite3`），并建立 routes → services → repositories 三层架构。

## 后端目录结构

```
apps/api/src/
├── server.js              # 入口
├── app.js                 # Express 应用配置
├── data/
│   ├── db.js              # SQLite 连接、建表、种子数据
│   └── repositories/      # 数据访问层（纯 SQL + 行映射）
│       ├── gallery.js
│       ├── blog.js
│       ├── about.js
│       ├── friends.js
│       ├── messages.js
│       └── projects.js
├── errors/
│   └── AppError.js        # 错误码字典 + 异常类
├── middlewares/
│   ├── auth.js            # JWT 认证
│   └── errorHandler.js    # 全局错误处理
├── routes/                # HTTP 层（解析请求 → 调 service → 返回响应）
│   ├── admin.js           # 登录、api-docs、db-info、db-query
│   ├── upload.js          # 图片上传
│   ├── gallery.js
│   ├── blog.js
│   ├── about.js
│   ├── friends.js
│   ├── messages.js
│   └── projects.js
└── services/              # 业务逻辑层（校验 + 协调）
    ├── galleryService.js
    ├── blogService.js
    ├── aboutService.js
    ├── friendsService.js
    ├── messagesService.js
    └── projectsService.js
```

## 架构原则

- **Routes**: 只做 HTTP 关注点（提取请求参数、调用 service、返回响应）
- **Services**: 业务逻辑 + 参数校验 + 异常抛出
- **Repositories**: 纯数据访问（SQL 语句 + 数据库行 ↔ API 对象映射）

## 数据库

- **引擎**: SQLite (WAL 模式)
- **文件**: `apps/api/data/shanghaijing.db`（gitignore）
- **表**: gallery, blog_posts, sidebar, about, friends, messages, projects（7 张）
- **种子数据**: 首次启动自动写入（16 篇博客文章等）

## 新增 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/admin/db-info` | 获取所有表结构与行数 |
| GET | `/api/admin/db-query/:table` | 查询指定表全部数据 |

## 前端新增

- **`/admin/database`** — 数据库可视化管理页面（表列表 + 数据浏览）
- 仪表盘新增"数据库表"卡片

## 删除

- `apps/api/src/data/store.js` — 内存 JSON 存储（已废弃）
