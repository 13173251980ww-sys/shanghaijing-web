<template>
  <Teleport to="body">
    <div
      class="ct"
      :class="{ 'ct--covering': phase === 'covering', 'ct--revealing': phase === 'revealing' }"
      :style="phase === 'idle' ? { display: 'none' } : {}"
    >
      <!-- 雾粒子层 -->
      <div class="ct__mist ct__mist--1" />
      <div class="ct__mist ct__mist--2" />
      <div class="ct__mist ct__mist--3" />

      <!-- 云雾团块 -->
      <div class="ct__cloud ct__cloud--1" />
      <div class="ct__cloud ct__cloud--2" />
      <div class="ct__cloud ct__cloud--3" />
      <div class="ct__cloud ct__cloud--4" />
      <div class="ct__cloud ct__cloud--5" />
      <div class="ct__cloud ct__cloud--6" />
      <div class="ct__cloud ct__cloud--7" />

      <!-- 水墨飞白纹理 -->
      <div class="ct__ink ct__ink--1" />
      <div class="ct__ink ct__ink--2" />
      <div class="ct__ink ct__ink--3" />
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';

const phase = ref('idle');

/**
 * 云雾覆盖 — 返回 Promise，云雾完全遮挡屏幕时 resolve
 */
function cover() {
  return new Promise((resolve) => {
    phase.value = 'covering';
    // CSS animation 约 700ms
    setTimeout(resolve, 720);
  });
}

/**
 * 云雾散开 — 返回 Promise，云雾完全消散时 resolve
 */
function reveal() {
  return new Promise((resolve) => {
    phase.value = 'revealing';
    setTimeout(() => {
      phase.value = 'idle';
      resolve();
    }, 900);
  });
}

defineExpose({ cover, reveal });
</script>

<style scoped>
.ct {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  overflow: hidden;
}

/* ── 雾粒子 — 微粒浮动层 ── */
.ct__mist {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.ct--covering .ct__mist,
.ct--revealing .ct__mist {
  opacity: 1;
}

.ct__mist--1 {
  background:
    radial-gradient(ellipse 30% 20% at 20% 30%, rgba(245,240,232,0.5), transparent),
    radial-gradient(ellipse 25% 15% at 70% 60%, rgba(232,217,190,0.4), transparent),
    radial-gradient(ellipse 35% 18% at 50% 80%, rgba(250,245,238,0.45), transparent),
    radial-gradient(ellipse 20% 25% at 10% 70%, rgba(218,200,165,0.35), transparent),
    radial-gradient(ellipse 28% 22% at 85% 20%, rgba(245,240,232,0.5), transparent);
  animation: mistDrift1 4s ease-in-out infinite;
}

.ct__mist--2 {
  background:
    radial-gradient(ellipse 22% 18% at 60% 20%, rgba(232,217,190,0.45), transparent),
    radial-gradient(ellipse 32% 20% at 30% 50%, rgba(245,240,232,0.5), transparent),
    radial-gradient(ellipse 18% 28% at 80% 40%, rgba(250,245,238,0.4), transparent),
    radial-gradient(ellipse 26% 16% at 45% 85%, rgba(218,200,165,0.35), transparent);
  animation: mistDrift2 5s ease-in-out infinite;
}

.ct__mist--3 {
  background:
    radial-gradient(ellipse 15% 30% at 90% 80%, rgba(245,240,232,0.4), transparent),
    radial-gradient(ellipse 20% 12% at 15% 15%, rgba(232,217,190,0.45), transparent),
    radial-gradient(ellipse 30% 24% at 55% 45%, rgba(250,245,238,0.35), transparent);
  animation: mistDrift3 6s ease-in-out infinite;
}

@keyframes mistDrift1 {
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(2%, -1.5%); }
  66% { transform: translate(-1%, 1%); }
}

@keyframes mistDrift2 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-1.5%, -1%); }
}

@keyframes mistDrift3 {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(1%, 1.5%); }
  75% { transform: translate(-2%, -0.5%); }
}

/* ── 云雾团块 ── */
.ct__cloud {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.ct--covering .ct__cloud,
.ct--revealing .ct__cloud {
  opacity: 1;
}

/* 云1 — 左上大团 */
.ct__cloud--1 {
  width: min(70vw, 70vh);
  height: min(50vw, 50vh);
  top: -20%;
  left: -15%;
  background: rgba(245, 240, 232, 0.92);
  border-radius: 42% 58% 55% 45% / 48% 45% 55% 52%;
}

.ct--covering .ct__cloud--1 {
  animation: cloud1Cover 0.72s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
}

.ct--revealing .ct__cloud--1 {
  animation: cloud1Reveal 0.88s cubic-bezier(0.55, 0.06, 0.68, 0.19) forwards;
  animation-delay: 0.05s;
}

@keyframes cloud1Cover {
  0%   { transform: translate(-30%, -30%) scale(0.3); opacity: 0; }
  100% { transform: translate(15%, 20%) scale(1.25); opacity: 1; }
}

@keyframes cloud1Reveal {
  0%   { transform: translate(15%, 20%) scale(1.25); opacity: 1; }
  100% { transform: translate(-80%, -60%) scale(0.2); opacity: 0; }
}

/* 云2 — 右上 */
.ct__cloud--2 {
  width: min(60vw, 60vh);
  height: min(45vw, 45vh);
  top: -15%;
  right: -10%;
  background: rgba(240, 234, 224, 0.9);
  border-radius: 55% 42% 48% 58% / 45% 52% 48% 55%;
}

.ct--covering .ct__cloud--2 {
  animation: cloud2Cover 0.68s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
  animation-delay: 0.06s;
}

.ct--revealing .ct__cloud--2 {
  animation: cloud2Reveal 0.85s cubic-bezier(0.55, 0.06, 0.68, 0.19) forwards;
}

@keyframes cloud2Cover {
  0%   { transform: translate(30%, -30%) scale(0.3); opacity: 0; }
  100% { transform: translate(-10%, 15%) scale(1.3); opacity: 1; }
}

@keyframes cloud2Reveal {
  0%   { transform: translate(-10%, 15%) scale(1.3); opacity: 1; }
  100% { transform: translate(80%, -50%) scale(0.2); opacity: 0; }
}

/* 云3 — 左下 */
.ct__cloud--3 {
  width: min(65vw, 65vh);
  height: min(48vw, 48vh);
  bottom: -25%;
  left: -10%;
  background: rgba(242, 236, 226, 0.88);
  border-radius: 48% 52% 42% 58% / 55% 48% 52% 45%;
}

.ct--covering .ct__cloud--3 {
  animation: cloud3Cover 0.75s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
  animation-delay: 0.03s;
}

.ct--revealing .ct__cloud--3 {
  animation: cloud3Reveal 0.9s cubic-bezier(0.55, 0.06, 0.68, 0.19) forwards;
  animation-delay: 0.08s;
}

@keyframes cloud3Cover {
  0%   { transform: translate(-20%, 30%) scale(0.25); opacity: 0; }
  100% { transform: translate(10%, -25%) scale(1.2); opacity: 1; }
}

@keyframes cloud3Reveal {
  0%   { transform: translate(10%, -25%) scale(1.2); opacity: 1; }
  100% { transform: translate(-70%, 60%) scale(0.15); opacity: 0; }
}

/* 云4 — 右下 */
.ct__cloud--4 {
  width: min(55vw, 55vh);
  height: min(42vw, 42vh);
  bottom: -20%;
  right: -8%;
  background: rgba(238, 230, 218, 0.9);
  border-radius: 52% 48% 58% 42% / 42% 55% 45% 58%;
}

.ct--covering .ct__cloud--4 {
  animation: cloud4Cover 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
  animation-delay: 0.08s;
}

.ct--revealing .ct__cloud--4 {
  animation: cloud4Reveal 0.82s cubic-bezier(0.55, 0.06, 0.68, 0.19) forwards;
  animation-delay: 0.04s;
}

@keyframes cloud4Cover {
  0%   { transform: translate(25%, 25%) scale(0.3); opacity: 0; }
  100% { transform: translate(-8%, -20%) scale(1.28); opacity: 1; }
}

@keyframes cloud4Reveal {
  0%   { transform: translate(-8%, -20%) scale(1.28); opacity: 1; }
  100% { transform: translate(75%, 55%) scale(0.18); opacity: 0; }
}

/* 云5 — 正上方飘入 */
.ct__cloud--5 {
  width: min(50vw, 50vh);
  height: min(38vw, 38vh);
  top: -30%;
  left: 30%;
  background: rgba(248, 243, 234, 0.85);
  border-radius: 45% 55% 50% 50% / 55% 45% 50% 50%;
}

.ct--covering .ct__cloud--5 {
  animation: cloud5Cover 0.65s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
  animation-delay: 0.1s;
}

.ct--revealing .ct__cloud--5 {
  animation: cloud5Reveal 0.78s cubic-bezier(0.55, 0.06, 0.68, 0.19) forwards;
}

@keyframes cloud5Cover {
  0%   { transform: translate(0, -40%) scale(0.2); opacity: 0; }
  100% { transform: translate(0, 10%) scale(1.35); opacity: 1; }
}

@keyframes cloud5Reveal {
  0%   { transform: translate(0, 10%) scale(1.35); opacity: 1; }
  100% { transform: translate(0, -90%) scale(0.1); opacity: 0; }
}

/* 云6 — 左侧横飘 */
.ct__cloud--6 {
  width: min(45vw, 45vh);
  height: min(55vw, 55vh);
  top: 20%;
  left: -25%;
  background: rgba(235, 226, 212, 0.87);
  border-radius: 50% 50% 45% 55% / 48% 52% 52% 48%;
}

.ct--covering .ct__cloud--6 {
  animation: cloud6Cover 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
  animation-delay: 0.12s;
}

.ct--revealing .ct__cloud--6 {
  animation: cloud6Reveal 0.86s cubic-bezier(0.55, 0.06, 0.68, 0.19) forwards;
  animation-delay: 0.02s;
}

@keyframes cloud6Cover {
  0%   { transform: translate(-40%, 0) scale(0.2); opacity: 0; }
  100% { transform: translate(25%, 0) scale(1.22); opacity: 1; }
}

@keyframes cloud6Reveal {
  0%   { transform: translate(25%, 0) scale(1.22); opacity: 1; }
  100% { transform: translate(-90%, 0) scale(0.1); opacity: 0; }
}

/* 云7 — 中心最后一团，最白 */
.ct__cloud--7 {
  width: min(40vw, 40vh);
  height: min(40vw, 40vh);
  top: 30%;
  left: 30%;
  background: rgba(252, 250, 245, 0.95);
  border-radius: 48% 52% 52% 48% / 52% 48% 48% 52%;
}

.ct--covering .ct__cloud--7 {
  animation: cloud7Cover 0.45s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
  animation-delay: 0.3s;
}

.ct--revealing .ct__cloud--7 {
  animation: cloud7Reveal 0.6s cubic-bezier(0.55, 0.06, 0.68, 0.19) forwards;
}

@keyframes cloud7Cover {
  0%   { transform: scale(0); opacity: 0; }
  100% { transform: scale(1.8); opacity: 1; }
}

@keyframes cloud7Reveal {
  0%   { transform: scale(1.8); opacity: 1; }
  100% { transform: scale(0); opacity: 0; }
}

/* ── 水墨飞白纹理 — 云雾中的笔触 ── */
.ct__ink {
  position: absolute;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.ct--covering .ct__ink,
.ct--revealing .ct__ink {
  opacity: 1;
}

.ct__ink--1 {
  width: min(35vw, 35vh);
  height: 4px;
  top: 40%;
  left: 15%;
  background: linear-gradient(90deg, transparent, rgba(58,47,40,0.06) 20%, rgba(58,47,40,0.1) 50%, rgba(58,47,40,0.06) 80%, transparent);
  border-radius: 2px;
  filter: blur(2px);
  transform: rotate(-8deg);
  animation: inkSway1 3s ease-in-out infinite;
}

.ct__ink--2 {
  width: min(28vw, 28vh);
  height: 3px;
  top: 55%;
  right: 18%;
  background: linear-gradient(90deg, transparent, rgba(58,47,40,0.04) 30%, rgba(58,47,40,0.08) 60%, rgba(58,47,40,0.04) 90%, transparent);
  border-radius: 1.5px;
  filter: blur(1.5px);
  transform: rotate(5deg);
  animation: inkSway2 4s ease-in-out infinite;
}

.ct__ink--3 {
  width: min(40vw, 40vh);
  height: 2px;
  top: 68%;
  left: 25%;
  background: linear-gradient(90deg, transparent, rgba(58,47,40,0.03) 25%, rgba(58,47,40,0.06) 55%, rgba(58,47,40,0.03) 85%, transparent);
  border-radius: 1px;
  filter: blur(1px);
  transform: rotate(-3deg);
  animation: inkSway3 5s ease-in-out infinite;
}

@keyframes inkSway1 {
  0%, 100% { transform: rotate(-8deg) translateY(0); }
  50% { transform: rotate(-6deg) translateY(-8px); }
}

@keyframes inkSway2 {
  0%, 100% { transform: rotate(5deg) translateY(0); }
  50% { transform: rotate(7deg) translateY(6px); }
}

@keyframes inkSway3 {
  0%, 100% { transform: rotate(-3deg) translateY(0); }
  50% { transform: rotate(-4deg) translateY(-10px); }
}
</style>
