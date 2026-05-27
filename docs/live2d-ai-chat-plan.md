# Live2D 看板娘 + AI 书灵聊天 — 实现计划

## Context

用户希望在后台管理页面添加一个 Live2D 看板娘角色，并结合 AI 对话功能。角色定位为"山海经守护书灵"，用户点击可与其对话。技术约束：Vue 3 + Express 5 + SQLite，水墨风格，不引入第三方 UI 库，前端统一回调风格。

## 架构概览

```
AdminLayout.vue
  ├── AdminSidebar.vue          (已有)
  ├── <router-view />           (已有)
  ├── Live2dWidget.vue          (新增) ← 全屏居中，渲染 Live2D 角色
  ├── DialogueBox.vue           (新增) ← 底部 Galgame 式对话框（名字+逐字文本+"继续"按钮）
  └── AffectionBar.vue          (新增) ← 好感度显示（心形图标+等级）

交互流程：
  登录后台 → 每日好感度自动+1 → 角色显示问候语（对话框弹出）
  点击角色 → 对话框弹出输入框 → 发送消息 → 逐字流式显示 AI 回复 → 点击继续/自动消失

前端 fetch() + ReadableStream ←──SSE──→ Express POST /api/admin/chat/stream
                                           └── DeepSeek API (外部代理，OpenAI 兼容)
```

## 技术选型

| 层 | 选型 | 理由 |
|----|------|------|
| Live2D 渲染 | `pixi.js@6.5.10` + `pixi-live2d-display@0.4.0` | 完全编程控制表情/动作/嘴部，PixiJS 6 是 pixi-live2d-display 的唯一兼容版本 |
| 模型 | `live2d-widget-model-wanko`（CDN 加载） | 免费、~2MB、表情丰富、社区最流行 |
| 流式协议 | **SSE**（Server-Sent Events） | 单向推送足够，比 WebSocket 简单，HTTP/2 友好 |
| AI API | **DeepSeek**（OpenAI 兼容接口） | 便宜、中文友好、后端代理保护 API Key、支持 streaming |
| 情绪检测 | 后端关键词匹配 | 轻量零依赖，无需 ML 模型 |
| 聊天存储 | SQLite `chat_messages` + `user_affection` 表 | 持久化对话历史 + 好感度 |

## 实现步骤

### Step 1: 后端 — 错误码 + 环境变量

**修改 `apps/api/src/errors/AppError.js`**
- 新增 `CHAT_MESSAGE_REQUIRED`（B0004）、`CHAT_LLM_ERROR`（C0002）

**修改 `apps/api/.env.example`**
- 新增 `DEEPSEEK_API_KEY`、`CHAT_MODEL`（默认 `deepseek-chat`）

### Step 2: 后端 — Chat 路由 + Service（三层架构）

**新建 `apps/api/src/services/chatService.js`**（Service 层）
- `streamChat(message, sessionId)` — async generator，逐块 yield SSE 数据
- 系统提示词：山海经书灵"山海"人设（文白夹杂、自称老朽、引用典故）
- `detectEmotion(text)` — 中文关键词正则匹配 → happy/sad/surprised/angry/neutral
- 调用 DeepSeek API（`https://api.deepseek.com/v1/chat/completions`，OpenAI 兼容格式），每次 delta 返回 `{ text, emotion, done }`

**新建 `apps/api/src/routes/chat.js`**（Route 层）
- `POST /api/admin/chat/stream`（authMiddleware 保护）
- 设置 SSE headers，`for await` 消费 service generator，`res.write()` 每个 chunk
- 处理客户端断开（`req.on('close')`）

**修改 `apps/api/src/app.js`**
- `app.use('/api/admin/chat', chatRouter)`

> 注：chat route 使用 `for await...of` + async generator，是项目中唯一使用 async 的地方，由 SSE 流式传输的本质决定。

### Step 3: 后端 — 好感度系统（每日登录 +1）

**修改 `apps/api/src/data/db.js`**
- 新增 `user_affection` 表

```sql
CREATE TABLE IF NOT EXISTS user_affection (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  affection INTEGER NOT NULL DEFAULT 0,
  last_login_date TEXT NOT NULL DEFAULT ''
);
```

**新建 `apps/api/src/data/repositories/affection.js`**（Repository 层）
- `getAffection()` → `{ affection, lastLoginDate }`
- `addDailyAffection()` — 若 `last_login_date` ≠ 今天，affection+1 更新日期，返回新值
- `getAffectionLevel(affection)` — 数值→等级

**好感度等级表：**

| 好感度 | 称号 | AI 语气变化 |
|--------|------|------------|
| 0-5 | 初识 | 客气疏离，多引用经典 |
| 6-15 | 相识 | 温和亲近，偶尔玩笑 |
| 16-30 | 熟络 | 轻松随意，聊起往事 |
| 31-50 | 知己 | 推心置腹，分享隐秘 |
| 51+ | 莫逆 | 千年第一位真正的朋友 |

**修改 `apps/api/src/services/chatService.js`**
- 系统提示词注入好感度：`你与来客的好感度为「称号」（X点）`

**修改 `apps/api/src/routes/admin.js`**（已有路由）
- 登录校验时自动调 `addDailyAffection()`
- 新增 `GET /api/admin/affection` → `{ affection, level, title }`

### Step 4: 后端 — 聊天历史持久化

**修改 `apps/api/src/data/db.js`**
- 新增 `chat_messages` 表（id, role, content, session_id, created_at）

**新建 `apps/api/src/data/repositories/chat.js`**（Repository 层）
- `listMessagesBySession(sessionId, limit)` — 查最近 N 条历史
- `saveMessage(role, content, sessionId)` — 插入消息

### Step 5: 前端 — 依赖安装

```bash
npm install --workspace apps/web pixi.js@6.5.10 pixi-live2d-display@0.4.0
```

Live2D 模型从 jsDelivr CDN 加载，无需安装。

### Step 6: 前端 — Chat Store

**新建 `apps/web/src/admin/store/chat.js`**（Pinia）
- State: `messages[]`、`isStreaming`、`isPanelOpen`、`currentEmotion`
- Actions:
  - `togglePanel()` / `openPanel()` / `closePanel()`
  - `sendMessage(text)` — `fetch()` + `ReadableStream` 读取 SSE，递归 `.then()` 链（保持回调风格），逐 chunk 追加到 assistant 消息
  - `clearMessages()` — 中断 AbortController + 清空消息
- `loadAffection(success, fail)` — 获取当前好感度

### Step 7: 前端 — Live2dWidget 组件

**新建 `apps/web/src/admin/components/Live2dWidget.vue`**
- `<canvas ref>` → `onMounted` 中初始化 `PIXI.Application({ view: canvas, transparent: true })`
- `Live2DModel.from(CDN_URL)` 加载 wanko 模型
- Idle 循环：定时随机播放动作
- `watch(chatStore.currentEmotion)` → 切换模型表情（f01~f04）
- 模型加载失败时 canvas 显示"书灵沉睡中..."占位提示
- 定位：`position: fixed; right: 20px; bottom: 20px; z-index: 1000`
- 可拖拽移动角色位置

### Step 8: 前端 — DialogueBox Galgame 式对话框

**新建 `apps/web/src/admin/components/DialogueBox.vue`**
- 定位：屏幕底部居中，横跨底部区域，Galgame 视觉小说经典样式
- **半透明渐变背景**：底部深色渐变到透明，文字区域宣纸纹理
- **角色名标签**：左上角显示"山海" + 好感度称号（如"山海 · 莫逆"）
- **文本区域**：居中大字逐字显示 AI 回复（typewriter 效果），字号 20px
- **继续指示器**：文本显示完毕后右下角闪烁 ▼ 三角箭头（Galgame 经典提示）
- **输入模式**：底部输入框，用户打字时自动聚焦
- 古风样式：墨色文字 `#3a2f28` + 朱砂红名字标签 `#C41E1E` + 宣纸底
- 流式文本通过 store 驱动，每个 SSE chunk 追加到当前文本
- 点击任意位置或按 Enter → 若文本已完成则关闭对话框，若还在流式输出则无事
- 非对话时 hover 角色显示招呼语

**交互流程（Galgame 风格）：**
```
打开后台 → 每日好感度自动+1（静默）
点击角色 → 角色居中放大 → 底部弹出对话框
         → 用户输入消息（或点击预设问候语）
         → 对话框逐字显示 AI 回复（typewriter）
         → 文本完成 → ▼ 闪烁提示可继续
         → 点击继续 → 可输入下一条消息
         → 点击角色或按 Esc → 对话框收起，角色回到右下角
```

### Step 9: 前端 — AffectionBar 好感度显示

**新建 `apps/web/src/admin/components/AffectionBar.vue`**
- 固定在屏幕右上角或角色旁边
- 显示心形图标 + 好感度数值 + 等级称号
- 悬停显示进度条（到下一级还需 X 天）
- 动画：登录时好感度+1 飘字效果（"+1" 从心形上浮消失）
- 样式：朱砂红心形 + 墨色数字 + 宣纸底色圆角卡片

### Step 10: 前端 — 集成到 AdminLayout

**修改 `apps/web/src/admin/AdminLayout.vue`**
- 在 template 中添加 `<Live2dWidget />`、`<DialogueBox />`、`<AffectionBar />`

### Step 11: 可选 — Vite 配置

**修改 `apps/web/vite.config.js`**
- 如果 PixiJS 6 与 Vite 6 预构建冲突，添加：
```js
optimizeDeps: { include: ['pixi.js', 'pixi-live2d-display'] }
```

## 文件变更清单

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

## 情绪映射表

| 后端 emotion | Live2D 表情 ID | 视觉效果 |
|-------------|---------------|---------|
| `neutral` | `null`（重置） | 默认表情 |
| `happy` | `f01` | 微笑、弯眼 |
| `surprised` | `f02` | 睁眼、张嘴 |
| `angry` | `f03` | 皱眉 |
| `sad` | `f04` | 微微垂眼 |

## 验证步骤

1. `npx vite build apps/web` — 确认 PixiJS 6 与 Vite 6 无冲突
2. 后端添加 `.env` 中的 `DEEPSEEK_API_KEY`，启动后端
3. 登录后台 → 好感度自动 +1，AffectionBar 显示飘字动画
4. 右下角出现 Live2D 角色，悬停显示招呼语
5. 点击角色 → 底部弹出 Galgame 式对话框
6. 输入 "给我讲讲九尾狐" → 对话框逐字流式显示 AI 回复
7. 文本完成后 ▼ 闪烁提示，点击继续可发下一条
8. 按 Esc 或再次点击角色 → 对话框收起，角色回到右下角
9. 最终 `npx vite build apps/web` 构建通过

## 风险与对策

| 风险 | 对策 |
|------|------|
| pixi.js@6 与 Vite 6 不兼容 | 加 `optimizeDeps.include`；若仍不行，用 `oh-my-live2d` 替代（纯 JS，无 PixiJS 依赖） |
| CDN 模型加载慢/失败 | 预下载模型到 `public/models/`，本地引用 + loading 提示 |
| DeepSeek API 不可用 | API 兼容 OpenAI 格式，可无缝切换到其他兼容提供商（硅基流动、通义千问等） |
| 2GB 服务器内存不足 | AI 调用走外部 API 代理，不跑本地模型，内存压力为零 |

## 不做的事项

- 不做语音对话（ASR/TTS）—— 文本聊天已满足需求
- 不在前台页面显示看板娘 —— 仅后台
- 不做本地 LLM 部署 —— 2GB 内存不够，走 API 代理
- 不做移动端适配 —— 桌面端优先
- 不引入第三方 UI 库 —— 聊天 UI 全部手写 CSS
