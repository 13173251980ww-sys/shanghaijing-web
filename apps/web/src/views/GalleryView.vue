<template>
  <div class="page">
    <div class="scene">
      <img :src="bg" alt="" class="scene__bg" />
      <div class="scene__header">
        <SiteHeader active-page="gallery" light />
      </div>
      <div class="art">
        <img :src="yinglongArt" alt="应龙" />
      </div>
      <router-link to="/" class="map-btn" title="回到地图">
        <img :src="mapIcon" alt="地图" />
      </router-link>
    </div>
  </div>
</template>

<script setup>
import SiteHeader from '../components/SiteHeader.vue';
import bg from '../assets/images/gallery-bg.png';
import yinglongArt from '../assets/images/gallery-art.png';
import mapIcon from '../assets/images/map-icon.png';
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

.art {
  position: absolute;
  left: 28.06%;
  top: 15.11%;
  width: 43.89%;
  height: 47.78%;
}

.art img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }

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
