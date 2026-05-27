# 10-Live2D 书灵对话 SSE 修复

**日期**: 2026-05-27  
**摘要**: 修复 Live2D 书灵 AI 聊天接口 SSE 流式响应挂起问题 — async generator + ReadableStream reader 模式在 Express SSE 上下文中事件循环死锁，改用 `response.text()` 直接读取后逐行解析。

---

## 变更清单

| 操作 | 文件 | 说明 |
|------|------|------|
| 修改 | `apps/api/src/routes/chat.js` | 路由层直接调用 fetch → response.text()，替代 async generator 委托 |
| 修改 | `apps/api/src/services/chatService.js` | 移除 `async function* streamChat()`，改为无状态 `prepareChat()` 工具函数 |

---

## 技术要点

### 问题根因

Node.js v24 内置 fetch（undici）返回的 `ReadableStream` 在 Express 5 SSE 上下文中存在兼容问题：

1. **`response.body.getReader()` 在 async generator 内调用** → 第一次 `reader.read()` 的 `await` 挂起整个事件循环
2. **即使绕开 reader，`for await (const value of response.body)` 也迭代零次** → ReadableStream 在 SSE 的 HTTP 通道上看似为空
3. **`fetch()` 在首次 `res.write()` 之前调用** → SSE HTTP 通道未建立，undici 内部缓冲导致请求卡住

### 修复方案

| 问题 | 修复 |
|------|------|
| SSE 通道未建立就调 fetch | `res.write(':ok\n\n')` 在 fetch 前发送 SSE 心跳建立通道 |
| ReadableStream reader 不可用 | 改用 `response.text()` 一次性读取全部响应体，再按 `\n` 分割逐行解析 SSE 帧 |
| Express 5 `res.writeHead()` 兼容 | 改用 `res.set()` + `res.status()` + `res.flushHeaders()` |
| 当前用户消息在 history 中重复 | `history.slice(0, -1)` 排除刚存入的当前消息 |

### 核心代码变更

**route 层（chat.js）** — async generator 委托 → 直接 fetch：

```js
// Before: async generator（事件循环死锁）
for await (const chunk of streamChat(message, sid, history)) {
  res.write(`data: ${JSON.stringify(chunk)}\n\n`);
}

// After: response.text() 直接解析
res.write(':ok\n\n'); // 建立 SSE 通道
const response = await fetch(DEEPSEEK_BASE, { ... });
const bodyText = await response.text();
for (const line of bodyText.split('\n')) {
  // 逐行解析 SSE data: 帧...
}
```

**service 层（chatService.js）** — async generator → 无状态工具函数：

```js
// Before
export async function* streamChat(message, sessionId, history) { ... }

// After
export function prepareChat(message) {
  // 校验、读配置、组装 systemPrompt
  return { apiKey, model, systemPrompt };
}
```

---

## 验证

- curl 测试 SSE 端点：心跳 `:ok` 正常，DeepSeek AI 返回完整回复内容，emotion 检测（happy/sad/surprised/angry/neutral）正常工作
- 前端构建通过（`vite build` — 276 modules, 1.79s）
- Redis/数据库无变更，零依赖新增
