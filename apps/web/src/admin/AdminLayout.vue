<template>
  <div class="admin-layout">
    <AdminSidebar />
    <main class="admin-main">
      <div class="admin-content">
        <router-view />
      </div>
    </main>
    <Live2dWidget />
    <DialogueBox />
    <AffectionBar />
    <MusicPlayer />
  </div>
</template>

<script setup>
import AdminSidebar from './components/AdminSidebar.vue';
import Live2dWidget from './components/Live2dWidget.vue';
import DialogueBox from './components/DialogueBox.vue';
import AffectionBar from './components/AffectionBar.vue';
import MusicPlayer from '@/components/MusicPlayer.vue';
</script>

<style scoped>
.admin-layout {
  position: fixed;
  inset: 0;
  display: flex;
}

.admin-main {
  margin-left: 220px;
  flex: 1;
  overflow-y: auto;
  padding: 32px 40px;
}

.admin-content {
  max-width: 1000px;
}
</style>
