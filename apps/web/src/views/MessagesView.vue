<template>
  <div class="page">
    <div class="scene">
      <img :src="bg" alt="" class="scene__bg" />
      <div class="scene__header">
        <SiteHeader active-page="messages" />
      </div>

      <!-- 留言板 -->
      <div class="board">
        <!-- 留言展示区 -->
        <div class="board__messages">
          <div class="board__empty">
            <span class="board__empty-icon" aria-hidden="true">&#x2009;</span>
            <p>尚无留言，不妨留下第一笔</p>
          </div>
        </div>

        <!-- 笔触分割线 -->
        <hr class="board__rule" />

        <!-- 输入区 -->
        <div class="board__input">
          <input
            v-model="author"
            type="text"
            class="board__field board__field--name"
            placeholder="署名"
            maxlength="20"
          />
          <div class="board__field-row">
            <textarea
              v-model="content"
              class="board__field board__field--content"
              placeholder="留一言于此…"
              maxlength="500"
              rows="1"
            />
            <button class="board__submit" :disabled="!canSend" @click="send">寄</button>
          </div>
        </div>
      </div>

      <router-link to="/" class="map-btn" title="回到地图">
        <img :src="mapIcon" alt="地图" />
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import SiteHeader from '../components/SiteHeader.vue';
import bg from '../assets/images/messages-bg.png';
import mapIcon from '../assets/images/map-icon.png';

const author = ref('');
const content = ref('');

const canSend = computed(() => content.value.trim().length > 0);

function send() {
  if (!canSend.value) return;
  // TODO: connect to API
  author.value = '';
  content.value = '';
}
</script>

<style scoped>
.page {
  position: fixed;
  inset: 0;
  background:
    repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(160,140,110,0.08) 3px, rgba(160,140,110,0.08) 6px),
    linear-gradient(180deg, rgba(120,100,70,0.3) 0%, rgba(235,215,185,0.05) 25%, rgba(248,238,218,0.05) 75%, rgba(120,100,70,0.3) 100%),
    linear-gradient(90deg, rgba(120,100,70,0.35) 0%, transparent 6%, transparent 94%, rgba(120,100,70,0.35) 100%),
    #E8D9BE;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scene {
  container-type: size;
  position: relative;
  aspect-ratio: 1440 / 900;
  width: min(100vw, calc(100vh * 1440 / 900));
  overflow: hidden;
}

.scene__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.scene__header {
  position: absolute;
  top: 2.22%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

/* ── board ── */
.board {
  position: absolute;
  left: 7.92%;
  top: 11.33%;
  width: 37.71%;
  height: 85.56%;
  display: flex;
  flex-direction: column;
}

/* 卷轴卡纸背景 */
.board::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(245, 240, 232, 0.88);
  border: 1px solid rgba(58, 47, 40, 0.22);
  border-radius: var(--radius-16);
  box-shadow:
    0 0 0 4px rgba(58, 47, 40, 0.025),
    2px 3px 12px rgba(58, 47, 40, 0.1);
  pointer-events: none;
}

/* ── message list area ── */
.board__messages {
  position: relative;
  flex: 1;
  padding: 5% 6%;
  overflow-y: auto;
}

.board__empty {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3%;
  font-family: var(--font-ink);
  font-size: 1.11cqi;
  color: rgba(58, 47, 40, 0.45);
  letter-spacing: 0.04em;
  pointer-events: none;
}

/* ── brush-stroke divider ── */
.board__rule {
  position: relative;
  width: 100%;
  height: 1px;
  border: 0;
  margin: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(58, 47, 40, 0.08) 10%,
    rgba(58, 47, 40, 0.18) 50%,
    rgba(58, 47, 40, 0.08) 90%,
    transparent 100%
  );
}

/* ── input area ── */
.board__input {
  position: relative;
  padding: 3% 5% 4%;
  display: flex;
  flex-direction: column;
  gap: 2.5%;
}

.board__field {
  font-family: var(--font-ink);
  font-size: 1.11cqi;
  font-weight: 500;
  color: #2a2018;
  background: transparent;
  border: none;
  outline: none;
  line-height: 1.6;
  letter-spacing: 0.03em;
}

.board__field::placeholder {
  color: rgba(58, 47, 40, 0.35);
}

.board__field--name {
  width: 40%;
  border-bottom: 1px solid rgba(58, 47, 40, 0.18);
  padding-bottom: 1.5%;
  transition: border-color 0.3s;
}

.board__field--name:focus {
  border-bottom-color: rgba(58, 47, 40, 0.4);
}

.board__field-row {
  display: flex;
  align-items: flex-end;
  gap: 2%;
}

.board__field--content {
  flex: 1;
  resize: none;
  border-bottom: 1px solid rgba(58, 47, 40, 0.18);
  padding-bottom: 1%;
  min-height: 1.6em;
  max-height: 8em;
  transition: border-color 0.3s;
}

.board__field--content:focus {
  border-bottom-color: rgba(58, 47, 40, 0.4);
}

/* 寄字按钮 — 如朱砂印 */
.board__submit {
  flex-shrink: 0;
  width: 4.5cqi;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-ink);
  font-size: 1.39cqi;
  font-weight: 600;
  color: #C41E1E;
  background: none;
  border: 1.5px solid rgba(196, 30, 30, 0.3);
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.3s ease;
  line-height: 1;
}

.board__submit:hover:not(:disabled) {
  background: #C41E1E;
  color: #fff;
  border-color: #C41E1E;
}

.board__submit:disabled {
  opacity: 0.25;
  cursor: default;
}

/* ── map button ── */
.map-btn {
  position: absolute;
  right: 3.19%;
  bottom: 3%;
  width: 12.01%;
  aspect-ratio: 1;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  filter: drop-shadow(0 0.28cqi 0.28cqi rgba(0,0,0,0.25));
  transition: transform 0.3s ease;
  display: block;
}

.map-btn:hover { transform: scale(1.05); }
.map-btn img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
</style>
