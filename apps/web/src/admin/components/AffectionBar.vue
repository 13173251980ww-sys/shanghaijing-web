<template>
  <div class="affection-bar" @mouseenter="showProgress = true" @mouseleave="showProgress = false">
    <div class="affection-bar__icon">&#x2665;</div>
    <div class="affection-bar__info">
      <span class="affection-bar__number">{{ store.affection }}</span>
      <span class="affection-bar__title">{{ store.affectionTitle }}</span>
    </div>

    <transition name="float">
      <div v-if="plusOneAnim" class="affection-bar__plus-one">+1</div>
    </transition>

    <transition name="dropdown">
      <div v-if="showProgress" class="affection-bar__progress-popup">
        <div class="affection-bar__progress-text">
          距下一级还需 {{ daysToNext }} 天
        </div>
        <div class="affection-bar__progress-track">
          <div class="affection-bar__progress-fill" :style="{ width: progressPct + '%' }" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
// 好感度显示条：等级进度、+1 动画、距下一级天数
import { ref, computed, onMounted } from 'vue';
import { useChatStore } from '../store/chat.js';

const store = useChatStore();
const showProgress = ref(false);
const plusOneAnim = ref(false);

const LEVEL_THRESHOLDS = [0, 6, 16, 31, 51, Infinity];

const daysToNext = computed(() => {
  const aff = store.affection;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (aff < LEVEL_THRESHOLDS[i]) {
      return LEVEL_THRESHOLDS[i] - aff;
    }
  }
  return 0;
});

const progressPct = computed(() => {
  const aff = store.affection;
  for (let i = 0; i < LEVEL_THRESHOLDS.length - 1; i++) {
    if (aff >= LEVEL_THRESHOLDS[i] && aff < LEVEL_THRESHOLDS[i + 1]) {
      const range = LEVEL_THRESHOLDS[i + 1] - LEVEL_THRESHOLDS[i];
      const pos = aff - LEVEL_THRESHOLDS[i];
      return Math.round((pos / range) * 100);
    }
  }
  return 100;
});

function triggerPlusOne() {
  plusOneAnim.value = true;
  setTimeout(() => { plusOneAnim.value = false; }, 2000);
}

onMounted(() => {
  store.loadAffection(
    (res) => {
      if (res.data && res.data.affection) {
        const prevAffection = store.affection;
        if (res.data.affection > prevAffection && prevAffection > 0) {
          triggerPlusOne();
        }
      }
    },
    () => {}
  );
});

defineExpose({ triggerPlusOne });
</script>

<style scoped>
.affection-bar {
  position: fixed;
  top: 100px;
  right: 24px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(245, 240, 232, 0.88);
  border: 1px solid rgba(58, 47, 40, 0.12);
  border-radius: 8px;
  padding: 8px 16px;
  box-shadow: 0 2px 12px rgba(58, 47, 40, 0.06);
  font-family: var(--font-ink);
  cursor: default;
}

.affection-bar__icon {
  color: #C41E1E;
  font-size: 22px;
  animation: heartPulse 2s ease-in-out infinite;
}

@keyframes heartPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.12); }
}

.affection-bar__info {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.affection-bar__number {
  font-size: 16px;
  font-weight: 700;
  color: #3a2f28;
}

.affection-bar__title {
  font-size: 12px;
  color: #C41E1E;
  letter-spacing: 0.06em;
}

.affection-bar__plus-one {
  position: absolute;
  top: -8px;
  right: -4px;
  color: #C41E1E;
  font-size: 16px;
  font-weight: 700;
  pointer-events: none;
  text-shadow: 0 1px 2px rgba(196, 30, 30, 0.3);
}

.float-enter-active {
  animation: floatUp 2s ease-out forwards;
}

.float-leave-active {
  animation: fadeOut 0.3s ease forwards;
}

@keyframes floatUp {
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-28px); }
}

@keyframes fadeOut {
  0% { opacity: 0.5; }
  100% { opacity: 0; }
}

.affection-bar__progress-popup {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: rgba(245, 240, 232, 0.95);
  border: 1px solid rgba(58, 47, 40, 0.15);
  border-radius: 6px;
  padding: 10px 14px;
  min-width: 160px;
  box-shadow: 0 4px 16px rgba(58, 47, 40, 0.1);
}

.affection-bar__progress-text {
  font-size: 12px;
  color: rgba(58, 47, 40, 0.6);
  margin-bottom: 6px;
  letter-spacing: 0.04em;
}

.affection-bar__progress-track {
  height: 4px;
  background: rgba(58, 47, 40, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.affection-bar__progress-fill {
  height: 100%;
  background: #C41E1E;
  border-radius: 2px;
  transition: width 0.4s ease;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
