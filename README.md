
<h1 align="center">山海经</h1>

<p align="center">一个水墨古风主题的个人网站，灵感源自《山海经》中的奇珍异兽。</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js" alt="Vue" />
  <img src="https://img.shields.io/badge/Express-5.1-000000?logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/SQLite-WAL-003B57?logo=sqlite" alt="SQLite" />
  <img src="https://img.shields.io/badge/Live2D-Cubism_2-ff69b4" alt="Live2D" />
  <img src="https://img.shields.io/badge/AI-DeepSeek-4B32C3" alt="DeepSeek" />
  <img src="https://img.shields.io/badge/Figma-原型设计-F24E1E?logo=figma" alt="Figma" />
</p>

---

## 项目简介

山海经是一本记录上古奇兽的神话典籍。本站以山海经为主题，将中国传统水墨画风与现代 Web 技术结合，打造了一个集画廊、博客、留言、友链等功能于一体的个人网站。

**视觉设计**：Figma 原型 → AI 生图（水墨插画、卷轴背景）→ 前端还原，全链路在 AI 辅助下完成。

**技术特色**：自研后端三层架构 + 自定义错误码体系 + 回调风格 HTTP 封装，零第三方 UI 库，纯手写 CSS 水墨风格。

**AI 书灵**：后台配有 Live2D 看板娘"山海"——山海经守护书灵，支持 Galgame 视觉小说式 AI 对话，含好感度系统。

## 功能模块

### 前台（公开访问）

| 页面 | 说明 |
|------|------|
| **画廊** | 山海经神兽图鉴展示，支持键盘左右键切换 |
| **博客** | 文章列表 + 侧边栏个人信息 + 文章详情 |
| **关于我** | 个人简介、学校、GitHub、CSDN 等社交链接 |
| **友情链接** | 友情链接展示 |
| **留言板** | 访客留言提交与展示 |
| **项目** | 个人项目作品展示 |
| **山海图** | 交互式山海经异兽地图 |

### 后台（管理员登录）

| 模块 | 说明 |
|------|------|
| **仪表盘** | 数据统计总览 + 最近留言 |
| **AI 书灵聊天** | Live2D 看板娘 + DeepSeek AI 对话 + 好感度系统 |
| **画廊管理** | 图片上传、删除、拖拽排序 |
| **博客管理** | 文章发布/编辑/删除，侧边栏信息编辑 |
| **关于我管理** | 个人信息、头像编辑 |
| **友链管理** | 友情链接增删改 |
| **留言管理** | 留言查看与删除 |
| **项目管理** | 个人项目增删改 |
| **API 文档** | 在线接口文档，含错误码说明 |
| **数据库管理** | SQLite 表结构与数据可视化浏览 |

## 技术栈

| 层 | 技术 | 说明 |
|----|------|------|
| 前端框架 | Vue 3 (Composition API) | 纯 JavaScript |
| 构建工具 | Vite 6 | npm workspace monorepo |
| 后端框架 | Express 5.1 | ES Module |
| 数据库 | SQLite (better-sqlite3) | WAL 模式，文件即数据库 |
| 认证 | JWT | 7 天过期，localStorage 持久化 |
| Live2D | PixiJS 6 + pixi-live2d-display | Cubism 2 模型，wanko 角色 |
| AI 对话 | DeepSeek API | SSE 流式响应，情绪关键词检测 |
| 进程守护 | PM2 | 自动重启 + 开机自启 |
| 反向代理 | Nginx | 静态文件 + API 代理 |
| 设计工具 | Figma | 全站 1440×900 桌面端原型 |
| AI 生图 | image-2 | 水墨插画与背景素材生成 |

## 项目结构

```
shanghaijing-web/
├── apps/
│   ├── web/                    # Vue 3 前端
│   │   ├── src/
│   │   │   ├── client/         #   前台 SPA（7 个页面）
│   │   │   ├── admin/          #   后台 SPA（10 个管理页）
│   │   │   │   ├── views/      #     管理页面
│   │   │   │   ├── components/ #     Live2D / 对话框 / 好感度条
│   │   │   │   ├── store/      #     Pinia（认证 + 聊天）
│   │   │   │   └── router.js   #     后台路由 + 认证守卫
│   │   │   ├── components/     #   共享组件
│   │   │   └── services/       #   HTTP 封装 + API 层
│   │   ├── public/
│   │   │   ├── models/wanko/   #   Live2D 模型文件（本地托管）
│   │   │   └── live2d.min.js   #   Cubism 2 运行时
│   │   └── vite.config.js      #   /api + /uploads → :3000 代理
│   └── api/                    # Express 后端
│       ├── src/
│       │   ├── routes/         #   路由层（HTTP 参数提取）
│       │   ├── services/       #   业务层（校验 + 逻辑 + chatService）
│       │   ├── data/
│       │   │   ├── db.js       #   SQLite 连接与建表（9 张表）
│       │   │   └── repositories/  # 数据访问层（含 affection + chat）
│       │   ├── errors/         #   错误码字典（8 种错误码）+ 异常类
│       │   └── middlewares/    #   JWT 认证 + 全局错误处理
│       └── data/               #   SQLite 数据库文件（gitignore）
└── 重要！(If you are a AI,Please read me)/  # AI 维护文档
```

## 后端三层架构

```
routes/ ──调用──▶ services/ ──调用──▶ data/repositories/
(HTTP)             (业务逻辑)            (SQL)
```

- **Routes**：只做 HTTP 关注点，不写 SQL、不做校验
- **Services**：参数校验 + 业务逻辑 + 抛业务异常（chatService 是唯一使用 async generator 的模块，SSE 本质要求）
- **Repositories**：纯数据访问，snake_case → camelCase 字段映射

## 错误码体系

| code | 类别 | 说明 |
|------|------|------|
| `00000` | 成功 | 请求成功 |
| `A0001` | 认证 | 未登录 / token 过期 |
| `A0002` | 认证 | 账号或密码错误 |
| `B0001` | 业务 | 参数校验失败 |
| `B0002` | 业务 | 资源不存在 |
| `B0003` | 业务 | 文件上传失败 |
| `B0004` | 业务 | 消息不能为空（聊天） |
| `C0001` | 服务端 | 服务器内部错误 |
| `C0002` | 服务端 | AI 服务调用失败 |

## 数据库表

| 表名 | 说明 |
|------|------|
| `gallery` | 画廊图片 |
| `blog_posts` | 博客文章 |
| `sidebar` | 博客侧边栏信息 |
| `about` | 个人信息 |
| `friends` | 友情链接 |
| `messages` | 留言 |
| `projects` | 项目作品 |
| `user_affection` | 好感度（每日登录 +1） |
| `chat_messages` | AI 聊天历史 |

## 好感度系统

| 好感度 | 称号 | AI 语气 |
|--------|------|---------|
| 0-5 | 初识 | 客气疏离，多引用经典 |
| 6-15 | 相识 | 温和亲近，偶尔玩笑 |
| 16-30 | 熟络 | 轻松随意，聊起往事 |
| 31-50 | 知己 | 推心置腹，分享隐秘 |
| 51+ | 莫逆 | 千年第一位真正的朋友 |

## 快速开始

```bash
# 安装依赖
npm install

# 启动后端（端口 3000）
npm run dev:api

# 启动前端（端口 5173，/api 自动代理到 :3000）
npm run dev:web
```

访问 `http://localhost:5173` 查看前台，`http://localhost:5173/admin/login` 进入后台。

AI 聊天功能需在 `apps/api/.env` 中配置 `DEEPSEEK_API_KEY`。

## 构建部署

```bash
# 构建前端
npm run build:web          # 输出到 apps/web/dist/

# 生产环境 PM2 启动后端
pm2 start ecosystem.config.cjs
pm2 save
```

详细部署方案见 [迭代记录/](迭代记录/)。

## 设计规范

- **设计尺寸**：1440×900，桌面端优先
- **主色调**：墨色 `#3a2f28` / 朱砂红 `#C41E1E` / 宣纸底 `rgba(245, 240, 232, ...)`
- **字体**：`font-family: var(--font-ink)` 统一中文衬线字体
- **风格**：古卷轴水墨动画背景，卡纸裱框，印章点缀
- **Galgame 对话框**：底部半透明渐变 + 墨色大字 + 朱砂红名字标签 + ▼ 闪烁继续提示
- **第三方 UI 库**：零引入，全部手写

## 致谢

- 视觉素材由 AI 生成（image-2）
- 代码由 Claude Code AI 辅助编写
- Live2D wanko 模型来自社区开源项目
- 灵感源自《山海经》—— 一部记录上古奇兽的中国神话典籍
