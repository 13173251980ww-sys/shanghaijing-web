<template>
  <div class="page-wrap">
    <h2 class="page-wrap__title">画廊管理</h2>

    <form class="add-form" @submit.prevent="handleAdd">
      <div class="add-form__upload">
        <input ref="fileInputRef" type="file" accept="image/*" @change="onFileChange" />
        <button type="button" class="btn btn--outline" @click="fileInputRef.click()" :disabled="uploading">
          {{ uploading ? '上传中…' : '选择图片' }}
        </button>
        <span v-if="pendingFile" class="add-form__filename">{{ pendingFile.name }}</span>
      </div>
      <button type="submit" class="btn btn--primary" :disabled="!pendingFile || uploading">添加</button>
    </form>

    <div v-if="images.length" class="image-grid">
      <div v-for="(img, idx) in images" :key="img.id" class="image-card">
        <img :src="imgUrl(img.url)" :alt="img.filename" class="image-card__thumb" />
        <span class="image-card__name">{{ img.filename }}</span>
        <div class="image-card__actions">
          <button v-if="idx > 0" class="btn btn--sm" @click="moveUp(idx)" title="上移">↑</button>
          <button v-if="idx < images.length - 1" class="btn btn--sm" @click="moveDown(idx)" title="下移">↓</button>
          <button class="btn btn--sm btn--danger" @click="handleDelete(img.id)">删除</button>
        </div>
      </div>
    </div>
    <p v-else class="empty">暂无图片，请上传</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getGallery, addGallery, deleteGallery, reorderGallery } from '@/services/api/gallery.js';
import { uploadImage } from '@/services/api/admin.js';

const images = ref([]);
const fileInputRef = ref(null);
const pendingFile = ref(null);
const uploading = ref(false);

function imgUrl(url) {
  return url.startsWith('http') ? url : url;
}

function load() {
  getGallery(
    (res) => { images.value = res.data; },
    () => {},
  );
}

function handleAdd() {
  if (!pendingFile.value) return;
  uploading.value = true;
  const form = new FormData();
  form.append('file', pendingFile.value);
  uploadImage(form,
    (uploadRes) => {
      addGallery(
        { filename: pendingFile.value.name, url: uploadRes.data.url },
        () => {
          pendingFile.value = null;
          if (fileInputRef.value) fileInputRef.value.value = '';
          uploading.value = false;
          load();
        },
        () => { uploading.value = false; },
      );
    },
    () => { uploading.value = false; },
  );
}

function onFileChange(e) {
  pendingFile.value = e.target.files[0] || null;
}

function handleDelete(id) {
  if (!confirm('确认删除？')) return;
  deleteGallery(id, () => load(), () => {});
}

function moveUp(idx) {
  const arr = [...images.value];
  [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
  reorderGallery(arr.map((i) => i.id), () => load(), () => {});
}

function moveDown(idx) {
  const arr = [...images.value];
  [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
  reorderGallery(arr.map((i) => i.id), () => load(), () => {});
}

onMounted(load);
</script>

<style scoped>
.page-wrap__title {
  font-family: var(--font-ink);
  font-size: 24px;
  font-weight: 600;
  color: #3a2f28;
  margin: 0 0 24px;
  letter-spacing: 0.06em;
}

.add-form {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 28px;
  padding: 16px;
  background: rgba(245, 240, 232, 0.5);
  border: 1px solid rgba(58, 47, 40, 0.08);
  border-radius: 8px;
}

.add-form__upload {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.add-form__upload input[type="file"] { display: none; }

.add-form__filename {
  font-family: var(--font-ink);
  font-size: 13px;
  color: rgba(58, 47, 40, 0.5);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.image-card {
  background: rgba(245, 240, 232, 0.6);
  border: 1px solid rgba(58, 47, 40, 0.1);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.image-card__thumb {
  width: 100%;
  aspect-ratio: 1440 / 900;
  object-fit: cover;
  border-radius: 4px;
  background: rgba(58, 47, 40, 0.05);
}

.image-card__name {
  font-family: var(--font-ink);
  font-size: 13px;
  color: #3a2f28;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.image-card__actions {
  display: flex;
  gap: 6px;
}

.btn {
  font-family: var(--font-ink);
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 4px;
  border: 1px solid rgba(58, 47, 40, 0.15);
  cursor: pointer;
  transition: all 0.2s;
  background: rgba(255,255,255,0.7);
  color: #3a2f28;
}

.btn:hover { background: rgba(58, 47, 40, 0.06); }
.btn--primary { background: #C41E1E; color: #fff; border-color: #C41E1E; }
.btn--primary:hover { background: #a01818; }
.btn--outline { background: transparent; }
.btn--sm { padding: 4px 10px; font-size: 12px; }
.btn--danger { color: #C41E1E; border-color: rgba(196, 30, 30, 0.2); }
.btn--danger:hover { background: rgba(196, 30, 30, 0.08); }
.btn:disabled { opacity: 0.4; cursor: default; }

.empty {
  font-family: var(--font-ink);
  color: rgba(58, 47, 40, 0.35);
  text-align: center;
  padding: 60px 0;
}
</style>
