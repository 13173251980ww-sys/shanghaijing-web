<template>
  <router-view />
  <MusicPlayer />
  <CloudTransition ref="cloudRef" />
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import CloudTransition from './components/CloudTransition.vue';
import MusicPlayer from './components/MusicPlayer.vue';
import { useSEO } from './composables/useSEO.js';

const router = useRouter();
const cloudRef = ref(null);
const seo = useSEO();

router.beforeEach(async (to, from) => {
  seo.apply(to);
  if (!from.name) return; // 首次加载不触发
  await cloudRef.value?.cover();
});

router.afterEach(async (to) => {
  seo.apply(to);
  await nextTick();
  await cloudRef.value?.reveal();
});
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background:
    repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(160,140,110,0.07) 3px, rgba(160,140,110,0.07) 6px),
    radial-gradient(ellipse 55% 42% at 18% 38%, rgba(175,145,115,0.22) 0%, transparent 70%),
    radial-gradient(ellipse 48% 38% at 75% 25%, rgba(195,165,135,0.17) 0%, transparent 70%),
    radial-gradient(ellipse 52% 45% at 35% 70%, rgba(160,130,100,0.20) 0%, transparent 70%),
    radial-gradient(ellipse 40% 48% at 80% 55%, rgba(180,155,125,0.15) 0%, transparent 70%),
    linear-gradient(180deg, rgba(100,80,50,0.28) 0%, transparent 15%, transparent 85%, rgba(100,80,50,0.28) 100%),
    linear-gradient(90deg, rgba(100,80,50,0.32) 0%, transparent 8%, transparent 92%, rgba(100,80,50,0.32) 100%),
    #E8D9BE;
  background-size:
    100% 200px,
    200% 200%, 180% 180%, 220% 220%, 180% 180%,
    100% 100%, 100% 100%;
  background-repeat:
    repeat,
    no-repeat, no-repeat, no-repeat, no-repeat,
    no-repeat, no-repeat;
  animation: scrollUnroll 20s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  body { animation: none; }
}
</style>
