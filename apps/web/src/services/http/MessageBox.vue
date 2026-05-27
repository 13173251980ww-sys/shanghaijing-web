<template>
  <div
    class="message-container"
    ref="container"
    role="status"
    aria-live="polite"
  ></div>
</template>

<!--
  MessageBox.vue —— 全局消息弹窗组件
  支持 success / error / warning / info 四种类型，自动消失 + 悬停暂停倒计时
  通过 createVNode 动态渲染，全局单例

  暴露方法:
    Message.success(text, duration)   -- 成功提示
    Message.error(text, duration)     -- 错误提示
    Message.warning(text, duration)   -- 警告提示
    Message.info(text, duration)      -- 信息提示
    Message.setPosition(placement, offset) -- 设置弹出位置
-->
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const container = ref(null);

const typeStyles = {
  success: { accent: "#10b981", text: "#065f46" },
  error: { accent: "#ef4444", text: "#7f1d1d" },
  warning: { accent: "#f59e0b", text: "#78350f" },
  info: { accent: "#165dff", text: "#1e3a8a" },
};

let messageId = 0;
// { id, element, timer, createdAt, duration, remaining }
const messageQueue = [];

const reduceMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/* ================= 固定位置：右上角 ================= */
const defaultOffset = { top: 20, right: 20 };
let offsetState = { ...defaultOffset };

function applyPosition(offset = defaultOffset) {
  const el = container.value;
  if (!el) return;
  offsetState = { ...offsetState, ...(offset || {}) };

  el.style.top = `${offsetState.top}px`;
  el.style.right = `${offsetState.right}px`;
  el.style.left = "";
  el.style.bottom = "";
  el.style.transform = "";
  el.style.alignItems = "flex-end";
}

function setPosition(offset) {
  applyPosition(offset);
}

/* =================================================== */

function createMessageElement(text, type, duration) {
  const id = messageId++;
  const style = typeStyles[type] || typeStyles.info;
  const now = Date.now();

  const el = document.createElement("div");
  el.id = `message-${id}`;
  el.className = "message-item";
  el.style.cssText = `
    position: relative;
    display: flex; align-items: center; gap: 12px;
    pointer-events: auto;

    padding: 16px 20px 14px 20px;            /* 更大内边距 */
    margin-bottom: 12px;
    border-radius: 10px;
    border: 1px solid rgba(0,0,0,.06);
    background: rgba(255,255,255,.78);

    color: ${style.text};
    font-size: 15px;                          /* 更大字体 */
    line-height: 22px;
    box-shadow: 0 10px 36px rgba(0,0,0,.10), 0 4px 12px rgba(0,0,0,.08);
    backdrop-filter: saturate(160%) blur(10px);
    -webkit-backdrop-filter: saturate(160%) blur(10px);

    writing-mode: horizontal-tb; white-space: normal;

    opacity: 0;
    transform: ${reduceMotion ? "translateX(0)" : "translateX(20px) scale(.98)"};
    transition: ${
      reduceMotion
        ? "opacity .15s ease, transform .15s ease"
        : "opacity .30s ease, transform .30s cubic-bezier(.22,1,.36,1)"
    };
    z-index: 9999; overflow: hidden; cursor: default;
  `;

  // 图标（略大）
  const iconEl = document.createElement("span");
  iconEl.textContent = iconFor(type);
  iconEl.style.cssText = `
    flex: 0 0 auto;
    display:inline-flex;align-items:center;justify-content:center;
    width:26px;height:26px;border-radius:999px;           /* 更大图标圆点 */
    background: ${hexToRgba(style.accent, 0.12)};
    color:${style.accent};font-weight:700;font-size:14px;
  `;

  // 文本
  const textEl = document.createElement("span");
  textEl.className = "message-text";
  textEl.textContent = text;
  textEl.style.cssText = `
    flex: 1 1 auto; min-width: 0; display: block; color: inherit;
    overflow-wrap: anywhere; word-break: break-word; line-break: auto;
  `;

  el.appendChild(iconEl);
  el.appendChild(textEl);

  const entry = {
    id,
    element: el,
    timer: null,
    createdAt: now,
    duration,
    remaining: duration,
  };

  // 悬停暂停自动关闭
  el.onmouseenter = () => {
    if (entry.timer) clearTimeout(entry.timer);
    const elapsed = Date.now() - entry.createdAt;
    entry.remaining = Math.max(0, entry.duration - elapsed);
    el.style.transform = reduceMotion
      ? "translateX(0)"
      : "translateX(0) scale(1.02)";
    el.style.boxShadow =
      "0 12px 42px rgba(0,0,0,.12), 0 6px 16px rgba(0,0,0,.10)";
  };

  el.onmouseleave = () => {
    // 若已到期则立刻关闭，避免“停表”
    if (entry.remaining <= 0) {
      removeMessage(id);
    } else {
      // 继续倒计时
      entry.createdAt = Date.now();
      if (entry.timer) clearTimeout(entry.timer);
      entry.timer = setTimeout(() => removeMessage(id), entry.remaining);
    }

    el.style.boxShadow =
      "0 10px 36px rgba(0,0,0,.10), 0 4px 12px rgba(0,0,0,.08)";
    el.style.transform = "translateX(0) scale(1)";
  };

  // 可选：点击整卡立即关闭（如不需要，删掉下一行）
  el.onclick = () => removeMessage(id);

  entry.timer = setTimeout(() => removeMessage(id), duration);
  messageQueue.push(entry);

  return el;
}

// 替换 removeMessage
function removeMessage(id) {
  // 取最新 entry，避免依赖过期的下标
  const entry = messageQueue.find((m) => m.id === id);
  if (!entry) return;

  const { element } = entry;
  if (entry.timer) {
    clearTimeout(entry.timer);
    entry.timer = null;
  }

  element.style.opacity = "0";
  element.style.transform = reduceMotion
    ? "translateX(0)"
    : "translateX(20px) scale(.98)";

  const ANIM_MS = reduceMotion ? 150 : 300;
  setTimeout(() => {
    try {
      element.remove();
    } catch (e) {
      console.log(e);
    }

    // 这里再次按 id 查找下标，确保删对对象
    const idx = messageQueue.findIndex((m) => m.id === id);
    if (idx !== -1) messageQueue.splice(idx, 1);
  }, ANIM_MS);
}

function showMessage(text, type = "info", duration = 3000) {
  if (!container.value) return;
  const el = createMessageElement(text, type, Math.max(0, duration || 0));
  container.value.appendChild(el);
  requestAnimationFrame(() => {
    el.style.opacity = "1";
    el.style.transform = "translateX(0) scale(1)";
  });
}

// 仅右上角 API
const Message = {
  success: (t, d) => showMessage(t, "success", d),
  error: (t, d) => showMessage(t, "error", d),
  warning: (t, d) => showMessage(t, "warning", d),
  info: (t, d) => showMessage(t, "info", d),
  setPosition: (_placement = "top-right", offset) =>
    setPosition(_placement, offset),
};

defineExpose({ Message, showMessage, removeMessage, setPosition });

onMounted(() => {
  applyPosition(defaultOffset);
});

onBeforeUnmount(() => {
  messageQueue.forEach((m) => {
    try {
      clearTimeout(m.timer);
      m.element.remove();
    } catch (e) {
      console.log(e);
    }
  });
  messageQueue.length = 0;
});

// 工具函数
function iconFor(type) {
  if (type === "success") return "✓";
  if (type === "error") return "✕";
  if (type === "warning") return "⚠";
  return "i";
}

function hexToRgba(hex, a = 1) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  const r = h.length === 3 ? ((bigint >> 8) & 0xf) * 17 : (bigint >> 16) & 255;
  const g = h.length === 3 ? ((bigint >> 4) & 0xf) * 17 : (bigint >> 8) & 255;
  const b = h.length === 3 ? (bigint & 0xf) * 17 : bigint & 255;
  return `rgba(${r},${g},${b},${a})`;
}
</script>

<style>
/* 容器更宽一些 */
.message-container {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 350px; /* 更大的卡片容器宽度 */
  max-width: calc(100% - 40px);
  z-index: 9999;
  pointer-events: none; /* 容器透点，但卡片可点 */
}

@media (max-width: 540px) {
  .message-container {
    width: auto;
    max-width: calc(100% - 32px);
    right: 16px;
    top: 16px;
  }
}
</style>
