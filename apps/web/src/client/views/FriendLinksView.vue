<template>
  <div class="page">
    <div class="scene">
      <img :src="bg" alt="" class="scene__bg" />
      <div class="scene__header">
        <SiteHeader active-page="friends" />
      </div>

      <a v-for="link in links" :key="link.name" :href="link.url" target="_blank" rel="noopener" class="friend-card">
        <div class="friend-card__bg" />
        <div class="friend-card__inner" />
        <div class="friend-card__corner friend-card__corner--tl" />
        <div class="friend-card__corner friend-card__corner--tr" />
        <div class="friend-card__corner friend-card__corner--bl" />
        <div class="friend-card__corner friend-card__corner--br" />
        <p class="friend-card__name">{{ link.name }}</p>
      </a>

      <router-link to="/" class="map-btn" title="回到地图">
        <img :src="mapIcon" alt="地图" />
      </router-link>
    </div>
  </div>
</template>

<script setup>
// 友链页：友情链接展示
import { ref, onMounted } from 'vue';
import SiteHeader from '../components/SiteHeader.vue';
import bg from '../../assets/images/friends-bg.png';
import mapIcon from '../../assets/images/map-icon.png';
import { getFriends } from '@/services/api/friends.js';

const links = ref([]);

onMounted(() => {
  getFriends(
    (res) => { if (res.data && res.data.length) links.value = res.data; },
    () => {},
  );
});
</script>

<style scoped>
.page {
  position: fixed;
  inset: 0;
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

.friend-card {
  position: absolute;
  left: 4.51%;
  top: 82.89%;
  width: 19.93%;
  height: 13.44%;
  text-decoration: none;
  cursor: pointer;
}

.friend-card__bg {
  position: absolute;
  inset: 0;
  background: rgba(245, 240, 232, 0.78);
  border: 2px solid rgba(58, 47, 40, 0.2);
  border-radius: var(--radius-8);
  box-shadow: 0 0.28cqi 0.83cqi rgba(0, 0, 0, 0.1);
  transition: border-color 0.35s ease, background 0.35s ease;
}

.friend-card:hover .friend-card__bg {
  border-color: rgba(196, 30, 30, 0.35);
  background: rgba(250, 245, 238, 0.9);
}

.friend-card__inner {
  position: absolute;
  inset: 18.18% 4.53% 17.36% 4.53%;
  border: 2px solid rgba(58, 47, 40, 0.12);
  transition: border-color 0.35s ease;
}

.friend-card:hover .friend-card__inner {
  border-color: rgba(196, 30, 30, 0.22);
}

.friend-card__corner {
  position: absolute;
  width: 6.27%;
  aspect-ratio: 1;
  border: 2px solid rgba(58, 47, 40, 0.18);
  transition: border-color 0.35s ease;
}

.friend-card:hover .friend-card__corner {
  border-color: rgba(196, 30, 30, 0.28);
}

.friend-card__corner--tl { left: 4.53%; top: 18.18%; border-right: none; border-bottom: none; }
.friend-card__corner--tr { right: 4.53%; top: 18.18%; border-left: none; border-bottom: none; }
.friend-card__corner--bl { left: 4.53%; bottom: 17.36%; border-right: none; border-top: none; }
.friend-card__corner--br { right: 4.53%; bottom: 17.36%; border-left: none; border-top: none; }

.friend-card__name {
  position: absolute;
  left: 15.68%;
  top: 33.06%;
  font-family: var(--font-ink);
  font-size: 1.11cqi;
  font-weight: 500;
  color: #3a2f28;
  letter-spacing: 0.04em;
  white-space: nowrap;
  transition: color 0.35s ease;
}

.friend-card:hover .friend-card__name { color: #C41E1E; }

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
