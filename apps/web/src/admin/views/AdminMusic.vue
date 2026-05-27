<template>
  <div class="page-wrap">
    <h2 class="page-wrap__title">音乐管理</h2>
    <p class="page-wrap__desc">管理"山海乐坊"音乐列表，支持本地路径或外部音频 URL</p>

    <form class="crud-form" @submit.prevent="handleAdd">
      <div class="crud-form__fields">
        <input v-model="form.title" class="field__input" placeholder="歌曲名" />
        <input v-model="form.artist" class="field__input" placeholder="艺人" />
        <input v-model="form.url" class="field__input" placeholder="音频地址" />
      </div>
      <button type="submit" class="btn btn--primary">添加</button>
    </form>

    <div v-if="songs.length" class="list-wrap">
      <div v-for="(song, i) in songs" :key="song.id" class="list-row">
        <div class="list-row__info">
          <span class="list-row__index">{{ i + 1 }}</span>
          <span class="list-row__title">{{ song.title }}</span>
          <span class="list-row__artist">{{ song.artist }}</span>
          <span class="list-row__url" :title="song.url">{{ song.url }}</span>
        </div>
        <div class="list-row__actions">
          <button class="btn btn--sm" @click="startEdit(song)">编辑</button>
          <button class="btn btn--sm btn--danger" @click="handleDelete(song.id)">删除</button>
        </div>
      </div>
    </div>
    <div v-else class="empty-hint">暂无音乐，添加一曲吧</div>

    <!-- 编辑弹窗 -->
    <div v-if="editing" class="modal-overlay" @click.self="editing = null">
      <div class="modal-box">
        <h3 class="modal-box__title">编辑音乐</h3>
        <label class="field">
          <span class="field__label">歌曲名</span>
          <input v-model="editing.title" class="field__input" />
        </label>
        <label class="field">
          <span class="field__label">艺人</span>
          <input v-model="editing.artist" class="field__input" />
        </label>
        <label class="field">
          <span class="field__label">音频地址</span>
          <input v-model="editing.url" class="field__input" />
        </label>
        <div class="modal-box__actions">
          <button class="btn btn--primary" @click="handleEdit">保存</button>
          <button class="btn" @click="editing = null">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getMusic, addMusic, updateMusic, deleteMusic } from '@/services/api/music.js';

const songs = ref([]);
const editing = ref(null);

const form = reactive({ title: '', artist: '', url: '' });

function load() {
  getMusic((res) => { songs.value = res.data || []; }, () => {});
}

function handleAdd() {
  if (!form.title || !form.url) return;
  addMusic({ title: form.title, artist: form.artist, url: form.url, sortOrder: songs.value.length }, () => {
    form.title = '';
    form.artist = '';
    form.url = '';
    load();
  }, () => {});
}

function startEdit(song) {
  editing.value = reactive({ ...song });
}

function handleEdit() {
  if (!editing.value) return;
  const { id, title, artist, url } = editing.value;
  updateMusic(id, { title, artist, url }, () => {
    editing.value = null;
    load();
  }, () => {});
}

function handleDelete(id) {
  if (!confirm('确定删除？')) return;
  deleteMusic(id, () => load(), () => {});
}

onMounted(load);
</script>

<style scoped>
.page-wrap__title {
  font-family: var(--font-ink);
  font-size: 24px;
  font-weight: 600;
  color: #3a2f28;
  margin: 0 0 8px;
  letter-spacing: 0.06em;
}

.page-wrap__desc {
  font-family: var(--font-ink);
  font-size: 13px;
  color: rgba(58, 47, 40, 0.45);
  margin: 0 0 28px;
  letter-spacing: 0.04em;
}

.crud-form {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
}

.crud-form__fields {
  display: flex;
  gap: 8px;
  flex: 1;
}

.field__input {
  font-family: var(--font-ink);
  font-size: 13px;
  padding: 7px 10px;
  color: #3a2f28;
  background: rgba(255,255,255,0.6);
  border: 1px solid rgba(58, 47, 40, 0.12);
  border-radius: 4px;
  outline: none;
  flex: 1;
  min-width: 0;
}

.field__input:focus {
  border-color: rgba(196, 30, 30, 0.25);
}

.field__input::placeholder {
  color: rgba(58, 47, 40, 0.2);
}

.list-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.list-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(245, 240, 232, 0.4);
  border: 1px solid rgba(58, 47, 40, 0.06);
  border-radius: 4px;
  gap: 12px;
}

.list-row__info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.list-row__index {
  font-family: var(--font-ink);
  font-size: 11px;
  color: rgba(58, 47, 40, 0.25);
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}

.list-row__title {
  font-family: var(--font-ink);
  font-size: 13px;
  color: #3a2f28;
  font-weight: 500;
  flex-shrink: 0;
}

.list-row__artist {
  font-family: var(--font-ink);
  font-size: 12px;
  color: rgba(58, 47, 40, 0.4);
  flex-shrink: 0;
}

.list-row__url {
  font-family: var(--font-ink);
  font-size: 11px;
  color: rgba(58, 47, 40, 0.3);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.list-row__actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.btn {
  font-family: var(--font-ink);
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 4px;
  border: 1px solid rgba(58, 47, 40, 0.15);
  cursor: pointer;
  transition: all 0.2s;
  background: rgba(255,255,255,0.6);
  color: #3a2f28;
  white-space: nowrap;
}

.btn:hover {
  background: rgba(58, 47, 40, 0.06);
}

.btn--primary {
  background: #C41E1E;
  color: #fff;
  border-color: #C41E1E;
}

.btn--primary:hover { background: #a01818; }

.btn--danger {
  color: #C41E1E;
  border-color: rgba(196, 30, 30, 0.2);
}

.btn--danger:hover {
  background: rgba(196, 30, 30, 0.06);
}

.btn--sm { padding: 3px 8px; font-size: 11px; }

.empty-hint {
  text-align: center;
  padding: 32px 16px;
  font-family: var(--font-ink);
  font-size: 13px;
  color: rgba(58, 47, 40, 0.35);
  letter-spacing: 0.04em;
}

/* ── 编辑弹窗 ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(58, 47, 40, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.modal-box {
  width: 380px;
  max-width: 90vw;
  background: rgba(245, 240, 232, 0.98);
  border: 1px solid rgba(58, 47, 40, 0.15);
  border-radius: 8px;
  padding: 20px 24px;
  box-shadow: 0 4px 20px rgba(58, 47, 40, 0.12);
}

.modal-box__title {
  font-family: var(--font-ink);
  font-size: 16px;
  font-weight: 600;
  color: #3a2f28;
  margin: 0 0 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-bottom: 10px;
}

.field__label {
  font-family: var(--font-ink);
  font-size: 12px;
  color: rgba(58, 47, 40, 0.45);
}

.field .field__input {
  width: 100%;
  box-sizing: border-box;
}

.modal-box__actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
