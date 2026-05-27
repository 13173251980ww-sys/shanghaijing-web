<template>
  <router-view />
  <CloudTransition ref="cloudRef" />
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import CloudTransition from './components/CloudTransition.vue';

const router = useRouter();
const cloudRef = ref(null);

router.beforeEach(async (to, from) => {
  if (!from.name) return; // 首次加载不触发
  await cloudRef.value?.cover();
});

router.afterEach(async () => {
  await nextTick();
  await cloudRef.value?.reveal();
});
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background:
    repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(160,140,110,0.08) 3px, rgba(160,140,110,0.08) 6px),
    linear-gradient(180deg, rgba(120,100,70,0.3) 0%, rgba(235,215,185,0.05) 25%, rgba(248,238,218,0.05) 75%, rgba(120,100,70,0.3) 100%),
    linear-gradient(90deg, rgba(120,100,70,0.35) 0%, transparent 6%, transparent 94%, rgba(120,100,70,0.35) 100%),
    #E8D9BE;
}
</style>
