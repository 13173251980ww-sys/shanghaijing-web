<template>
  <div class="page" @keydown.left="prev" @keydown.right="next" tabindex="0" ref="pageRef">
    <div class="scene">
      <img :src="bg" alt="" class="scene__bg" />
      <div class="scene__header">
        <SiteHeader active-page="gallery" light />
      </div>
      <div class="art">
        <Transition name="fade" mode="out-in">
          <img :key="currentImg" :src="currentImg" alt="" />
        </Transition>
      </div>
      <button v-if="images.length > 1" class="nav-arrow nav-arrow--left" @click="prev" aria-label="上一张">&#x2039;</button>
      <button v-if="images.length > 1" class="nav-arrow nav-arrow--right" @click="next" aria-label="下一张">&#x203A;</button>
      <router-link to="/" class="map-btn" title="回到地图">
        <img :src="mapIcon" alt="地图" />
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import SiteHeader from '../components/SiteHeader.vue';
import bg from '../../assets/images/gallery-bg.png';
import fallbackArt from '../../assets/images/gallery-art.png';
import mapIcon from '../../assets/images/map-icon.png';
import { getGallery } from '@/services/api/gallery.js';

const pageRef = ref(null);
const images = ref([]);
const currentIndex = ref(0);

const currentImg = computed(() => {
  if (images.value.length === 0) return fallbackArt;
  const img = images.value[currentIndex.value];
  return img.url.startsWith('http') ? img.url : 'http://localhost:3000' + img.url;
});

function prev() {
  if (images.value.length <= 1) return;
  currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length;
}

function next() {
  if (images.value.length <= 1) return;
  currentIndex.value = (currentIndex.value + 1) % images.value.length;
}

function onKeydown(e) {
  if (e.key === 'ArrowLeft') prev();
  else if (e.key === 'ArrowRight') next();
}

onMounted(() => {
  getGallery(
    (res) => { if (res.data && res.data.length) images.value = res.data; },
    () => {},
  );
  document.addEventListener('keydown', onKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown);
});
</script>

<style scoped>
.page {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
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

.art {
  position: absolute;
  left: 28.06%;
  top: 15.11%;
  width: 43.89%;
  height: 47.78%;
}

.art img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }

.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;
  width: 3.5cqi;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3cqi;
  color: rgba(240, 230, 210, 0.7);
  background: rgba(58, 47, 40, 0.15);
  border: 1px solid rgba(240, 230, 210, 0.2);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
  line-height: 1;
  font-family: var(--font-ink);
}

.nav-arrow:hover { background: rgba(58, 47, 40, 0.3); color: #fff; }
.nav-arrow--left { left: 22%; }
.nav-arrow--right { right: 22%; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

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
