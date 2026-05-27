# 06-Live2D 书灵 AI 聊天实现

**日期**: 2026-05-27

## 变更概述

在后台管理页面添加 Live2D 看板娘角色，结合 DeepSeek AI 对话功能。角色定位为"山海经守护书灵·山海"，Galgame 视觉小说式对话框，包含好感度系统。

## 新增功能

### 后端
- **Chat Service**（`chatService.js`）：SSE 流式 AI 对话，DeepSeek API 集成，情绪关键词检测（5 种情绪），好感度注入系统提示词
- **Chat Route**（`chat.js`）：`POST /api/admin/chat/stream` SSE 端点，JWT 保护，断线处理
- **好感度系统**：每日登录自动 +1，5 级称号（初识→相识→熟络→知己→莫逆），影响 AI 语气
- **聊天历史**：SQLite `chat_messages` 表持久化对话，历史上下文注入 AI 请求
- **新增错误码**：`CHAT_MESSAGE_REQUIRED`（B0004）、`CHAT_LLM_ERROR`（C0002）

### 前端
- **Live2dWidget**：PixiJS 6 + pixi-live2d-display 渲染 wanko 模型，随机动作循环，情绪表情切换，拖拽移动
- **DialogueBox**：Galgame 视觉小说式底部对话框，逐字打字机效果，闪烁 ▼ 继续提示，预设问候语
- **AffectionBar**：心形图标 + 好感度数值 + 等级称号，悬停进度条，"+1" 飘字动画
- **Chat Store**（Pinia）：SSE 流式消息管理（fetch + ReadableStream 递归 .then() 链），好感度状态

## 技术要点

- PixiJS 6 + Live2D Cubism Core 自动代码分割，独立 chunk 加载（~530KB 总计）
- SSE 使用 `fetch() + ReadableStream` 递归 `.then()` 链，保持项目回调风格
- chatService 是项目中唯一使用 async generator 的模块（SSE 本质要求）
- wanko 模型从 jsDelivr CDN 加载，失败时显示占位文案
- Galgame 对话框墨色/朱砂红/半透明渐变，与全站水墨风格统一

## 文件变更

| 操作 | 文件 |
|------|------|
| 新增 | `apps/api/src/services/chatService.js` |
| 新增 | `apps/api/src/routes/chat.js` |
| 新增 | `apps/api/src/data/repositories/chat.js` |
| 新增 | `apps/api/src/data/repositories/affection.js` |
| 新增 | `apps/web/src/admin/store/chat.js` |
| 新增 | `apps/web/src/admin/components/Live2dWidget.vue` |
| 新增 | `apps/web/src/admin/components/DialogueBox.vue` |
| 新增 | `apps/web/src/admin/components/AffectionBar.vue` |
| 修改 | `apps/api/src/errors/AppError.js` |
| 修改 | `apps/api/src/app.js` |
| 修改 | `apps/api/src/data/db.js` |
| 修改 | `apps/api/src/routes/admin.js` |
| 修改 | `apps/api/.env.example` |
| 修改 | `apps/web/src/admin/AdminLayout.vue` |

## 部署注意

- 需在 `.env` 中配置 `DEEPSEEK_API_KEY` 和 `CHAT_MODEL`
- Live2D 模型从 CDN 加载，需服务器可访问 jsDelivr
- 仅后台页面显示，前台不受影响
