<template>
  <div class="page">
    <div class="scene">
      <img :src="bg" alt="" class="scene__bg" />
      <router-link v-for="c in creatures" :key="c.name" :to="c.path" class="creature" :style="c.style" :title="c.name">
        <img :src="c.img" :alt="c.name" />
      </router-link>
    </div>
  </div>
</template>

<script setup>
import bg from '../assets/images/map-bg.png';
import yinglong from '../assets/images/creature-yinglong.png';
import baize from '../assets/images/creature-baize.png';
import kunpeng from '../assets/images/creature-kunpeng.png';
import dangkang from '../assets/images/creature-dangkang.png';
import taotie from '../assets/images/creature-taotie.png';
import jiuweihu from '../assets/images/creature-jiuweihu.png';

const creatures = [
  { name: '应龙', img: yinglong, path: '/gallery', style: { left: '37.43%', top: '0.67%', width: '6.11%', height: '19.89%' } },
  { name: '白泽', img: baize, path: '/blog', style: { left: '12.15%', top: '42.67%', width: '6.60%', height: '22.00%' } },
  { name: '鲲鹏', img: kunpeng, path: '/projects', style: { left: '13.96%', top: '69.78%', width: '6.25%', height: '20.67%' } },
  { name: '当康', img: dangkang, path: '/friends', style: { left: '60.63%', top: '43.11%', width: '6.25%', height: '21.00%' } },
  { name: '饕餮', img: taotie, path: '/messages', style: { left: '87.08%', top: '69.44%', width: '6.18%', height: '21.11%' } },
  { name: '九尾狐', img: jiuweihu, path: '/about', style: { left: '87.85%', top: '5.22%', width: '6.60%', height: '22.78%' } },
];
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

.creature {
  position: absolute;
  display: block;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.creature:hover { transform: scale(1.1); }
.creature img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
</style>
