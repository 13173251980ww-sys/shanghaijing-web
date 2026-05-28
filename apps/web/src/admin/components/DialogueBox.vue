<template>
  <transition name="dialogue">
    <div v-if="store.isPanelOpen" class="dialogue-box" @click="onBoxClick">
      <div class="dialogue-box__name-tag">
        <span class="dialogue-box__name">山海</span>
        <span v-if="store.affectionTitle" class="dialogue-box__title">· {{ store.affectionTitle }}</span>
      </div>

      <div class="dialogue-box__content">
        <p class="dialogue-box__text">
          <span>{{ displayedText }}</span>
          <span v-if="isTyping" class="dialogue-box__cursor">|</span>
        </p>
      </div>

      <div v-if="!isTyping && hasMessages" class="dialogue-box__indicator">
        &#x25BC;
      </div>

      <div v-if="showInput" class="dialogue-box__input-row">
        <input
          ref="inputRef"
          v-model="inputText"
          class="dialogue-box__input"
          placeholder="与书灵说些什么..."
          @keydown.enter="onSend"
          @click.stop
        />
        <button class="dialogue-box__send-btn" @click.stop="onSend" :disabled="store.isStreaming">
          言
        </button>
      </div>

      <div v-if="!hasMessages && !showInput" class="dialogue-box__greetings">
        <button
          v-for="g in greetings"
          :key="g"
          class="dialogue-box__greeting-btn"
          @click.stop="onGreeting(g)"
        >{{ g }}</button>
      </div>
    </div>
  </transition>
</template>

<script setup>
// AI 书灵对话气泡：打字机效果、表情同步、好感度显示
import { ref, computed, watch, nextTick } from 'vue';
import { useChatStore } from '../store/chat.js';

const store = useChatStore();

const inputText = ref('');
const inputRef = ref(null);
const showInput = ref(false);
const typewriterTimer = ref(null);
const typewriterIndex = ref(0);

const greetings = [
  '给我讲讲九尾狐的故事',
  '山海经里最厉害的异兽是什么？',
  '老朽今日心情如何？',
];

const hasMessages = computed(() => store.messages.length > 0);

const lastAssistantMsg = computed(() => {
  for (let i = store.messages.length - 1; i >= 0; i--) {
    if (store.messages[i].role === 'assistant') return store.messages[i];
  }
  return null;
});

const fullText = computed(() => lastAssistantMsg.value?.content || '');

const isTyping = computed(() => store.isStreaming || typewriterIndex.value < fullText.value.length);

const displayedText = computed(() => {
  if (store.isStreaming) return fullText.value;
  return fullText.value.slice(0, typewriterIndex.value);
});

watch(() => store.isPanelOpen, (open) => {
  if (open) {
    typewriterIndex.value = 0;
    showInput.value = false;
    nextTick(() => {
      if (!hasMessages.value) {
        showInput.value = true;
        nextTick(() => inputRef.value?.focus());
      }
    });
  }
});

watch(fullText, (text) => {
  if (store.isStreaming) return;
  if (text) {
    typewriterIndex.value = 0;
    showInput.value = false;
    runTypewriter(text);
  }
});

function runTypewriter(text) {
  if (typewriterTimer.value) clearTimeout(typewriterTimer.value);
  typewriterIndex.value = 0;
  const speed = Math.max(20, Math.min(60, text.length > 100 ? 20 : 50));

  const tick = () => {
    if (typewriterIndex.value >= text.length) {
      typewriterTimer.value = null;
      return;
    }
    typewriterIndex.value++;
    typewriterTimer.value = setTimeout(tick, speed);
  };
  tick();
}

function onBoxClick() {
  if (store.isStreaming) return;
  if (typewriterIndex.value < fullText.value.length) {
    typewriterIndex.value = fullText.value.length;
    if (typewriterTimer.value) clearTimeout(typewriterTimer.value);
    return;
  }
  if (!showInput.value) {
    showInput.value = true;
    nextTick(() => inputRef.value?.focus());
  }
}

function onSend() {
  const text = inputText.value.trim();
  if (!text || store.isStreaming) return;
  store.sendMessage(text,
    () => {
      inputText.value = '';
      showInput.value = false;
    },
    () => {}
  );
}

function onGreeting(text) {
  showInput.value = false;
  store.sendMessage(text,
    () => {},
    () => {}
  );
}
</script>

<style scoped>
.dialogue-box {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
  padding: 40px 60px 28px;
  background: linear-gradient(transparent, rgba(20, 16, 12, 0.82) 30%, rgba(20, 16, 12, 0.92));
  font-family: var(--font-ink);
  cursor: pointer;
  user-select: none;
}

.dialogue-box__name-tag {
  position: absolute;
  top: 12px;
  left: 60px;
  background: rgba(196, 30, 30, 0.9);
  color: #f5f0e8;
  padding: 4px 16px;
  border-radius: 2px;
  font-size: 15px;
  letter-spacing: 0.08em;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.dialogue-box__name {
  font-weight: 700;
}

.dialogue-box__title {
  font-size: 12px;
  opacity: 0.85;
  margin-left: 2px;
}

.dialogue-box__content {
  max-width: 880px;
  margin: 0 auto;
  min-height: 80px;
  display: flex;
  align-items: center;
}

.dialogue-box__text {
  font-size: 20px;
  line-height: 1.8;
  color: #e8dcc8;
  letter-spacing: 0.06em;
  margin: 0;
  width: 100%;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.dialogue-box__cursor {
  animation: blink 0.8s infinite;
  color: #C41E1E;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.dialogue-box__indicator {
  text-align: right;
  color: #e8dcc8;
  font-size: 16px;
  margin-top: 8px;
  animation: floatDown 1.2s ease-in-out infinite;
  opacity: 0.7;
}

@keyframes floatDown {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}

.dialogue-box__input-row {
  display: flex;
  gap: 12px;
  max-width: 880px;
  margin: 16px auto 0;
}

.dialogue-box__input {
  flex: 1;
  background: rgba(245, 240, 232, 0.12);
  border: 1px solid rgba(232, 220, 200, 0.25);
  border-radius: 4px;
  padding: 10px 16px;
  font-family: var(--font-ink);
  font-size: 15px;
  color: #e8dcc8;
  letter-spacing: 0.04em;
  outline: none;
  transition: border-color 0.2s;
}

.dialogue-box__input::placeholder {
  color: rgba(232, 220, 200, 0.35);
}

.dialogue-box__input:focus {
  border-color: rgba(196, 30, 30, 0.5);
}

.dialogue-box__send-btn {
  padding: 10px 20px;
  background: rgba(196, 30, 30, 0.8);
  color: #f5f0e8;
  border: none;
  border-radius: 4px;
  font-family: var(--font-ink);
  font-size: 16px;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: background 0.2s;
}

.dialogue-box__send-btn:hover {
  background: rgba(196, 30, 30, 1);
}

.dialogue-box__send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.dialogue-box__greetings {
  display: flex;
  gap: 12px;
  max-width: 880px;
  margin: 20px auto 0;
  flex-wrap: wrap;
}

.dialogue-box__greeting-btn {
  padding: 8px 18px;
  background: rgba(245, 240, 232, 0.1);
  border: 1px solid rgba(232, 220, 200, 0.2);
  border-radius: 4px;
  color: rgba(232, 220, 200, 0.7);
  font-family: var(--font-ink);
  font-size: 14px;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all 0.2s;
}

.dialogue-box__greeting-btn:hover {
  background: rgba(245, 240, 232, 0.18);
  color: #e8dcc8;
  border-color: rgba(232, 220, 200, 0.35);
}

.dialogue-enter-active,
.dialogue-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.dialogue-enter-from,
.dialogue-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
