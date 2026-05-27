<template>
  <div class="page">
    <div class="scene">
      <img :src="bg" alt="" class="scene__bg" />
      <div class="scene__header">
        <SiteHeader active-page="projects" />
      </div>

      <a v-for="p in projects" :key="p.name" :href="p.url" target="_blank" rel="noopener" class="project-card">
        <div class="project-card__icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <ellipse cx="11.5" cy="5" rx="4.5" ry="4.5" stroke="currentColor" stroke-width="1.5" />
            <path d="M3 19c0-3.5 3.5-6.5 8.5-6.5S20 15.5 20 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </div>
        <h3 class="project-card__name">{{ p.name }}</h3>
        <p class="project-card__desc">{{ p.desc }}</p>
      </a>

      <router-link to="/" class="map-btn" title="回到地图">
        <img :src="mapIcon" alt="地图" />
      </router-link>
    </div>
  </div>
</template>

<script setup>
import SiteHeader from '../components/SiteHeader.vue';
import bg from '../assets/images/projects-bg.png';
import mapIcon from '../assets/images/map-icon.png';

const projects = [
  { name: 'Live2d面试官', desc: '智能虚拟面试官', url: '#' },
];
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

/* ── project card ── */
.project-card {
  position: absolute;
  left: 4.44%;
  top: 78%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5%;
  width: 10cqi;
  padding: 2.5% 2%;
  text-decoration: none;
  background: rgba(245, 240, 232, 0.78);
  border: 1px solid rgba(58, 47, 40, 0.2);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(58, 47, 40, 0.08);
  transition: border-color 0.35s ease, box-shadow 0.35s ease;
  cursor: pointer;
}

.project-card:hover {
  border-color: rgba(196, 30, 30, 0.3);
  box-shadow: 0 3px 14px rgba(58, 47, 40, 0.14);
}

/* icon */
.project-card__icon {
  width: 4cqi;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3a2f28;
  transition: color 0.35s ease;
}

.project-card:hover .project-card__icon {
  color: #C41E1E;
}

.project-card__icon svg {
  width: 100%;
  height: 100%;
}

/* name */
.project-card__name {
  font-family: var(--font-ink);
  font-size: 1.39cqi;
  font-weight: 600;
  color: #3a2f28;
  margin: 0;
  line-height: 1;
  letter-spacing: 0.04em;
  transition: color 0.35s ease;
}

.project-card:hover .project-card__name {
  color: #C41E1E;
}

/* desc */
.project-card__desc {
  font-family: var(--font-ink);
  font-size: 0.97cqi;
  font-weight: 400;
  color: rgba(58, 47, 40, 0.55);
  margin: 0;
  line-height: 1;
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
