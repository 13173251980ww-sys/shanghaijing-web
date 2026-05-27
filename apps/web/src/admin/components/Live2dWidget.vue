<template>
  <div
    class="live2d-widget"
    :class="{ 'live2d-widget--dragging': isDragging, 'live2d-widget--loading': isLoading }"
    :style="{ left: x + 'px', top: y + 'px' }"
    @mousedown="onDragStart"
    @click="onClick"
  >
    <div v-if="loadFailed" class="live2d-widget__placeholder">
      <span class="live2d-widget__placeholder-icon">&#x234F;</span>
      <span>书灵沉睡中...</span>
    </div>
    <canvas
      ref="canvasRef"
      class="live2d-widget__canvas"
      :class="{ 'live2d-widget__canvas--hidden': loadFailed }"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useChatStore } from '../store/chat.js';

const MODEL_URL = 'https://cdn.jsdelivr.net/npm/live2d-widget-model-wanko@1.0.5/assets/wanko.model3.json';

const chatStore = useChatStore();

const canvasRef = ref(null);
const isLoading = ref(true);
const loadFailed = ref(false);
const x = ref(window.innerWidth - 300);
const y = ref(window.innerHeight - 420);

let app = null;
let model = null;
let idleTimer = null;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let hasMoved = false;

function onDragStart(e) {
  if (e.target.tagName === 'CANVAS') {
    isDragging = true;
    hasMoved = false;
    dragStartX = e.clientX - x.value;
    dragStartY = e.clientY - y.value;
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
  }
}

function onDragMove(e) {
  if (!isDragging) return;
  const dx = e.clientX - dragStartX;
  const dy = e.clientY - dragStartY;
  if (Math.abs(e.clientX - (dragStartX + x.value)) > 3 || Math.abs(e.clientY - (dragStartY + y.value)) > 3) {
    hasMoved = true;
  }
  x.value = Math.max(0, Math.min(dx, window.innerWidth - 200));
  y.value = Math.max(0, Math.min(dy, window.innerHeight - 200));
}

function onDragEnd() {
  isDragging = false;
  document.removeEventListener('mousemove', onDragMove);
  document.removeEventListener('mouseup', onDragEnd);
}

function onClick() {
  if (!hasMoved && !loadFailed.value) {
    chatStore.togglePanel();
  }
  hasMoved = false;
}

function playRandomMotion() {
  if (!model) return;
  const motions = Object.keys(model.internalModel.motionManager.definitions || {});
  if (motions.length > 0) {
    const name = motions[Math.floor(Math.random() * motions.length)];
    model.motion(name);
  }
  idleTimer = setTimeout(playRandomMotion, 8000 + Math.random() * 12000);
}

watch(() => chatStore.currentEmotion, (emotion) => {
  if (!model) return;
  const exprMap = { happy: 'f01', surprised: 'f02', angry: 'f03', sad: 'f04' };
  const exprId = exprMap[emotion];
  if (exprId) {
    model.expression(exprId);
  } else {
    model.expression(null);
  }
});

onMounted(async () => {
  try {
    const PIXI = await import('pixi.js');
    const { Live2DModel } = await import('pixi-live2d-display');

    app = new PIXI.Application({
      view: canvasRef.value,
      width: 260,
      height: 320,
      transparent: true,
      backgroundAlpha: 0,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    model = await Live2DModel.from(MODEL_URL);

    model.scale.set(0.18);
    model.x = 130;
    model.y = 240;
    model.anchor.set(0.5, 0.5);

    app.stage.addChild(model);
    isLoading.value = false;

    idleTimer = setTimeout(playRandomMotion, 3000);
  } catch {
    isLoading.value = false;
    loadFailed.value = true;
  }
});

onUnmounted(() => {
  if (idleTimer) clearTimeout(idleTimer);
  if (app) {
    try { app.destroy(true, { children: true }); } catch { /* ignore */ }
  }
});
</script>

<style scoped>
.live2d-widget {
  position: fixed;
  z-index: 1000;
  cursor: grab;
  user-select: none;
  transition: opacity 0.4s;
}

.live2d-widget--loading {
  opacity: 0.5;
}

.live2d-widget--dragging {
  cursor: grabbing;
}

.live2d-widget__canvas {
  display: block;
  width: 260px;
  height: 320px;
  pointer-events: auto;
}

.live2d-widget__canvas--hidden {
  display: none;
}

.live2d-widget__placeholder {
  width: 200px;
  height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(245, 240, 232, 0.85);
  border: 1px solid rgba(58, 47, 40, 0.15);
  border-radius: 8px;
  color: rgba(58, 47, 40, 0.5);
  font-family: var(--font-ink);
  font-size: 14px;
  letter-spacing: 0.06em;
}

.live2d-widget__placeholder-icon {
  font-size: 32px;
  opacity: 0.5;
}
</style>
