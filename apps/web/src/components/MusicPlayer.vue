<template>
  <div class="music-player" :class="{ 'music-player--open': isOpen, 'music-player--playing': isPlaying }">
    <button class="music-player__record" :title="isPlaying ? '暂停' : '播放'" @click="togglePanel">
      <span class="music-player__disc">
        <span class="music-player__disc-groove" />
        <span class="music-player__disc-label">乐</span>
      </span>
    </button>

    <transition name="panel">
      <div v-if="isOpen" class="music-player__panel">
        <div class="music-player__panel-header">
          <span class="music-player__panel-title">山海乐坊</span>
          <span v-if="current" class="music-player__now-playing">{{ current.title }} — {{ current.artist }}</span>
        </div>

        <div class="music-player__list">
          <div v-if="songs.length === 0" class="music-player__empty">曲库空空，等待知音添曲</div>
          <button
            v-for="(song, i) in songs"
            :key="song.id"
            class="music-player__song"
            :class="{ 'music-player__song--active': currentIndex === i }"
            @click="play(i)"
          >
            <span class="music-player__song-index">{{ i + 1 }}</span>
            <span class="music-player__song-info">
              <span class="music-player__song-title">{{ song.title }}</span>
              <span class="music-player__song-artist">{{ song.artist }}</span>
            </span>
            <span v-if="currentIndex === i && isPlaying" class="music-player__song-playing">♪</span>
          </button>
        </div>

        <div class="music-player__controls">
          <button class="music-player__btn" title="上一首" @click="prev">&#x23EE;</button>
          <button class="music-player__btn music-player__btn--play" :title="isPlaying ? '暂停' : '播放'" @click="togglePlay">
            <span v-if="isPlaying">&#x23F8;</span>
            <span v-else>&#x25B6;</span>
          </button>
          <button class="music-player__btn" title="下一首" @click="next">&#x23ED;</button>
        </div>
      </div>
    </transition>

    <audio ref="audioRef" @ended="onEnded" @error="onAudioError" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { getMusic } from '@/services/api/music.js';

const STORAGE_KEY = 'music_player_state';

function streamUrl(song) {
  // NetEase songs always go through the stream proxy for fresh URLs
  if (song.netease_id || (song.url && (song.url.startsWith('netease://') || song.url.includes('music.126.net')))) {
    return `/api/music/${song.id}/stream`;
  }
  return song.url;
}

function onAudioError() {
  const audio = audioRef.value;
  // If direct URL failed, retry through stream proxy (handles expired NetEase URLs)
  if (audio && audio.src && !audio.src.includes('/api/music/') && audio.src.startsWith('http')) {
    const song = current.value;
    if (song) {
      audio.src = `/api/music/${song.id}/stream`;
      audio.load();
      audio.play().then(() => { isPlaying.value = true; hasError.value = false; }).catch(() => {
        hasError.value = true;
        isPlaying.value = false;
      });
      return;
    }
  }
  hasError.value = true;
  isPlaying.value = false;
}

const isOpen = ref(false);
const isPlaying = ref(false);
const songs = ref([]);
const currentIndex = ref(-1);
const audioRef = ref(null);
const hasError = ref(false);

const current = computed(() => {
  if (currentIndex.value < 0 || currentIndex.value >= songs.value.length) return null;
  return songs.value[currentIndex.value];
});

function saveState() {
  const audio = audioRef.value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    songId: current.value ? current.value.id : '',
    time: audio ? audio.currentTime : 0,
  }));
}

function load() {
  getMusic(
    (res) => {
      songs.value = res.data || [];
      restoreState();
    },
    () => {},
  );
}

function restoreState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const state = JSON.parse(raw);
    if (state.songId) {
      const index = songs.value.findIndex((song) => song.id === state.songId);
      if (index === -1) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }

      currentIndex.value = index;
      const audio = audioRef.value;
      if (audio && current.value) {
        audio.src = streamUrl(current.value);
        audio.load();
        if (state.time) audio.currentTime = state.time;
      }
      return;
    }

    if (state.index >= 0 && state.index < songs.value.length) {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function togglePanel() {
  isOpen.value = !isOpen.value;
}

function play(index) {
  hasError.value = false;
  const audio = audioRef.value;
  currentIndex.value = index;
  if (!audio || !current.value) return;
  isOpen.value = false;
  audio.src = streamUrl(current.value);
  audio.load();
  audio.play().then(() => {
    isPlaying.value = true;
    hasError.value = false;
    saveState();
  }).catch(() => {
    hasError.value = true;
  });
}

function togglePlay() {
  if (!current.value) return;
  const audio = audioRef.value;
  if (!audio) return;
  if (isPlaying.value) {
    audio.pause();
    isPlaying.value = false;
  } else {
    audio.play().then(() => {
      isPlaying.value = true;
    }).catch(() => {
      hasError.value = true;
    });
  }
  saveState();
}

function next() {
  if (songs.value.length === 0) return;
  const nextIdx = (currentIndex.value + 1) % songs.value.length;
  play(nextIdx);
}

function prev() {
  if (songs.value.length === 0) return;
  const prevIdx = (currentIndex.value - 1 + songs.value.length) % songs.value.length;
  play(prevIdx);
}

function onEnded() {
  next();
}

// Persist playback time periodically
let saveTimer = null;
watch(isPlaying, (val) => {
  if (val) {
    saveTimer = setInterval(saveState, 3000);
  } else {
    if (saveTimer) { clearInterval(saveTimer); saveTimer = null; }
  }
});

onMounted(load);
</script>

<style scoped>
.music-player {
  position: fixed;
  top: 20px;
  right: 24px;
  z-index: 1001;
  font-family: var(--font-ink);
}

/* ── 唱片按钮 ── */
.music-player__record {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  padding: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s;
}

.music-player__record:hover {
  transform: scale(1.08);
}

.music-player__disc {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: conic-gradient(
    #1a1410 0deg, #2a2218 60deg, #1a1410 120deg, #2a2218 180deg,
    #1a1410 240deg, #2a2218 300deg, #1a1410 360deg
  );
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(58, 47, 40, 0.3), 0 0 0 2px rgba(196, 30, 30, 0.15);
  animation: spin 4s linear infinite;
  animation-play-state: paused;
}

.music-player--playing .music-player__disc {
  animation-play-state: running;
}

.music-player__disc-groove {
  position: absolute;
  inset: 6px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow:
    inset 0 0 0 2px rgba(255, 255, 255, 0.03),
    inset 0 0 0 4px rgba(255, 255, 255, 0.02),
    inset 0 0 0 7px rgba(255, 255, 255, 0.02);
}

.music-player__disc-label {
  position: relative;
  z-index: 1;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #C41E1E;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f5e8d8;
  font-size: 10px;
  font-weight: 700;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
  font-family: var(--font-ink);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* ── 播放列表面板 ── */
.music-player__panel {
  position: absolute;
  top: 56px;
  right: 0;
  width: 280px;
  max-height: 420px;
  background: rgba(245, 240, 232, 0.96);
  border: 1px solid rgba(58, 47, 40, 0.15);
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(58, 47, 40, 0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.music-player__panel-header {
  padding: 14px 16px 10px;
  border-bottom: 1px solid rgba(58, 47, 40, 0.08);
}

.music-player__panel-title {
  font-size: 15px;
  font-weight: 600;
  color: #C41E1E;
  letter-spacing: 0.06em;
}

.music-player__now-playing {
  display: block;
  font-size: 11px;
  color: rgba(58, 47, 40, 0.4);
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.music-player__list {
  flex: 1;
  overflow-y: auto;
  padding: 6px 8px;
}

.music-player__empty {
  padding: 24px 16px;
  text-align: center;
  font-size: 13px;
  color: rgba(58, 47, 40, 0.35);
  letter-spacing: 0.04em;
}

.music-player__song {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 10px;
  border: none;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s;
  font-family: var(--font-ink);
}

.music-player__song:hover {
  background: rgba(196, 30, 30, 0.05);
}

.music-player__song--active {
  background: rgba(196, 30, 30, 0.08);
}

.music-player__song-index {
  font-size: 11px;
  color: rgba(58, 47, 40, 0.25);
  width: 18px;
  text-align: center;
  flex-shrink: 0;
}

.music-player__song-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.music-player__song-title {
  font-size: 13px;
  color: #3a2f28;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.music-player__song-artist {
  font-size: 11px;
  color: rgba(58, 47, 40, 0.4);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.music-player__song-playing {
  color: #C41E1E;
  font-size: 14px;
  flex-shrink: 0;
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.3; }
}

/* ── 控制栏 ── */
.music-player__controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 10px 16px 14px;
  border-top: 1px solid rgba(58, 47, 40, 0.08);
}

.music-player__btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid rgba(58, 47, 40, 0.15);
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  color: #3a2f28;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-family: var(--font-ink);
  line-height: 1;
}

.music-player__btn:hover {
  background: rgba(196, 30, 30, 0.06);
  border-color: rgba(196, 30, 30, 0.2);
  color: #C41E1E;
}

.music-player__btn--play {
  width: 40px;
  height: 40px;
  background: #C41E1E;
  border-color: #C41E1E;
  color: #fff;
  font-size: 16px;
}

.music-player__btn--play:hover {
  background: #a01818;
  color: #fff;
}

/* ── transition ── */
.panel-enter-active,
.panel-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
