<template>
  <div class="admin-layout">
    <AdminSidebar />
    <main class="admin-main">
      <div class="admin-content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import AdminSidebar from './components/AdminSidebar.vue';
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
