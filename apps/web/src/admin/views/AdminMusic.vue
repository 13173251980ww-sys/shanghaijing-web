<template>
  <div class="page-wrap">
    <h2 class="page-wrap__title">音乐管理</h2>
    <p class="page-wrap__desc">管理"山海乐坊"音乐列表，支持本地路径或外部音频 URL</p>

    <!-- ── 网易云音乐 ── -->
    <section class="netease-section">
      <h3 class="netease-section__title">网易云音乐</h3>
      <div class="netease-section__body">
        <!-- 未登录 -->
        <div v-if="!netease.isLoggedIn" class="netease-login-row">
          <span class="netease-login-row__hint">登录后可导入收藏歌曲</span>
          <button class="btn btn--primary btn--sm" :disabled="netease.isQrLoading" @click="netease.startQrLogin()">
            {{ netease.isQrLoading ? '生成中…' : '扫码登录网易云' }}
          </button>
        </div>
        <!-- 已登录 -->
        <div v-else class="netease-loggedin">
          <div class="netease-loggedin__info">
            <img v-if="netease.profile && netease.profile.avatarUrl" :src="netease.profile.avatarUrl" class="netease-avatar" alt="" />
            <span class="netease-loggedin__name">{{ netease.profile && netease.profile.nickname || '已登录' }}</span>
          </div>
          <button class="btn btn--sm" @click="netease.doLogout()">退出登录</button>
        </div>
      </div>

      <!-- 歌单浏览器（已登录后显示） -->
      <div v-if="netease.isLoggedIn" class="netease-browser">
        <div class="netease-tabs">
          <button
            class="netease-tabs__tab"
            :class="{ 'netease-tabs__tab--active': netease.activeTab === 'liked' }"
            @click="netease.showLiked()"
          >我喜欢的音乐</button>
          <button
            v-for="pl in netease.playlists"
            :key="pl.id"
            class="netease-tabs__tab"
            :class="{ 'netease-tabs__tab--active': netease.activeTab === 'playlist' && netease.currentSongs.length && netease.playlists.find(p => p.id === pl.id && netease.activeTab === 'playlist') }"
            :title="`${pl.name} (${pl.trackCount}首)`"
            @click="netease.browsePlaylist(pl.id)"
          >{{ pl.name }}</button>
        </div>

        <!-- 勾选操作栏 -->
        <div class="netease-toolbar" v-if="netease.activeTab === 'liked' || netease.currentSongs.length">
          <label class="netease-select-all">
            <input type="checkbox" :checked="netease.selectedIds.size > 0 && netease.selectedIds.size === (netease.activeTab === 'liked' ? netease.likelistSongs.length : netease.currentSongs.length)" @change="netease.selectAll()" />
            <span>全选</span>
          </label>
          <button class="btn btn--primary btn--sm" :disabled="netease.selectedIds.size === 0 || netease.isLoading" @click="netease.doImport()">
            {{ netease.isLoading ? '导入中…' : `导入选中 (${netease.selectedCount})` }}
          </button>
        </div>

        <!-- 歌曲列表 -->
        <div class="netease-song-list" v-if="netease.activeTab === 'liked' || netease.currentSongs.length">
          <div
            v-for="s in netease.activeTab === 'liked' ? netease.likelistSongs : netease.currentSongs"
            :key="s.id"
            class="netease-song-row"
            :class="{ 'netease-song-row--selected': netease.selectedIds.has(s.id) }"
          >
            <input type="checkbox" class="netease-song-row__check" :checked="netease.selectedIds.has(s.id)" @change="netease.toggleSong(s.id)" />
            <img v-if="s.cover" :src="s.cover" class="netease-song-row__cover" alt="" />
            <span class="netease-song-row__cover-ph" v-else />
            <span class="netease-song-row__title">{{ s.title }}</span>
            <span class="netease-song-row__artist">{{ s.artist }}</span>
          </div>
        </div>
        <p v-if="netease.isLoading" class="netease-loading">加载中…</p>
      </div>
    </section>

    <!-- QR 登录弹窗 -->
    <div v-if="netease.showQrModal" class="modal-overlay" @click.self="netease.closeQrModal()">
      <div class="modal-box qr-modal">
        <h3 class="modal-box__title">扫码登录网易云音乐</h3>
        <div class="qr-modal__img-wrap">
          <img v-if="netease.qrDataUrl" :src="netease.qrDataUrl" class="qr-modal__img" alt="QR码" />
          <span v-else class="qr-modal__placeholder">生成中…</span>
        </div>
        <p class="qr-modal__status">{{ netease.qrStatusText }}</p>
        <div class="modal-box__actions">
          <button class="btn" @click="netease.closeQrModal()">取消</button>
          <button v-if="netease.qrStatusText.includes('过期')" class="btn btn--primary" @click="netease.startQrLogin()">刷新二维码</button>
        </div>
      </div>
    </div>

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
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { getMusic, addMusic, updateMusic, deleteMusic } from '@/services/api/music.js';
import { useNeteaseStore } from '@/admin/store/netease.js';

const netease = useNeteaseStore();

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

onMounted(() => { load(); netease.checkStatus(); });
onUnmounted(() => { netease.stopPolling(); });
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

/* ── 网易云音乐 ── */
.netease-section {
  margin-bottom: 28px;
  padding: 16px;
  background: rgba(245, 240, 232, 0.4);
  border: 1px solid rgba(58, 47, 40, 0.08);
  border-radius: 8px;
}

.netease-section__title {
  font-family: var(--font-ink);
  font-size: 16px;
  font-weight: 600;
  color: #3a2f28;
  margin: 0 0 12px;
  letter-spacing: 0.05em;
}

.netease-section__body {
  margin-bottom: 12px;
}

.netease-login-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.netease-login-row__hint {
  font-family: var(--font-ink);
  font-size: 13px;
  color: rgba(58, 47, 40, 0.4);
}

.netease-loggedin {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.netease-loggedin__info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.netease-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(58, 47, 40, 0.1);
}

.netease-loggedin__name {
  font-family: var(--font-ink);
  font-size: 14px;
  color: #3a2f28;
  font-weight: 500;
}

.netease-browser {
  border-top: 1px solid rgba(58, 47, 40, 0.06);
  padding-top: 12px;
}

.netease-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.netease-tabs__tab {
  font-family: var(--font-ink);
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 12px;
  border: 1px solid rgba(58, 47, 40, 0.1);
  background: transparent;
  color: rgba(58, 47, 40, 0.5);
  cursor: pointer;
  transition: all 0.2s;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.netease-tabs__tab:hover { color: #3a2f28; border-color: rgba(58, 47, 40, 0.2); }

.netease-tabs__tab--active {
  color: #C41E1E;
  border-color: rgba(196, 30, 30, 0.25);
  background: rgba(196, 30, 30, 0.04);
}

.netease-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.netease-select-all {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-ink);
  font-size: 12px;
  color: rgba(58, 47, 40, 0.5);
  cursor: pointer;
}

.netease-select-all input { cursor: pointer; }

.netease-song-list {
  max-height: 260px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.netease-song-list::-webkit-scrollbar { width: 3px; }
.netease-song-list::-webkit-scrollbar-track { background: transparent; }
.netease-song-list::-webkit-scrollbar-thumb { background: rgba(58, 47, 40, 0.1); border-radius: 2px; }

.netease-song-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 8px;
  border-radius: 4px;
  transition: background 0.15s;
}

.netease-song-row:hover { background: rgba(245, 240, 232, 0.6); }

.netease-song-row--selected { background: rgba(196, 30, 30, 0.04); }

.netease-song-row__check { flex-shrink: 0; cursor: pointer; }

.netease-song-row__cover {
  width: 32px;
  height: 32px;
  border-radius: 3px;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid rgba(58, 47, 40, 0.06);
}

.netease-song-row__cover-ph {
  width: 32px;
  height: 32px;
  border-radius: 3px;
  flex-shrink: 0;
  background: linear-gradient(135deg, #e8ddd0, #f0e8db);
  border: 1px solid rgba(58, 47, 40, 0.06);
}

.netease-song-row__title {
  font-family: var(--font-ink);
  font-size: 12px;
  color: #3a2f28;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.netease-song-row__artist {
  font-family: var(--font-ink);
  font-size: 11px;
  color: rgba(58, 47, 40, 0.35);
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 0;
}

.netease-loading {
  font-family: var(--font-ink);
  font-size: 12px;
  color: rgba(58, 47, 40, 0.35);
  text-align: center;
  padding: 16px 0;
}

/* ── QR 弹窗 ── */
.qr-modal {
  text-align: center;
}

.qr-modal__img-wrap {
  margin: 12px auto;
  width: 240px;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid rgba(58, 47, 40, 0.08);
  border-radius: 6px;
}

.qr-modal__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.qr-modal__placeholder {
  font-family: var(--font-ink);
  font-size: 13px;
  color: rgba(58, 47, 40, 0.3);
}

.qr-modal__status {
  font-family: var(--font-ink);
  font-size: 13px;
  color: rgba(58, 47, 40, 0.5);
  margin: 8px 0 12px;
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
