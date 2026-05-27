<template>
  <div class="page-wrap">
    <h2 class="page-wrap__title">博客管理</h2>

    <div class="tabs">
      <button class="tabs__tab" :class="{ 'tabs__tab--active': tab === 'posts' }" @click="tab = 'posts'">文章管理</button>
      <button class="tabs__tab" :class="{ 'tabs__tab--active': tab === 'sidebar' }" @click="tab = 'sidebar'">侧边栏信息</button>
    </div>

    <!-- 文章管理 -->
    <div v-if="tab === 'posts'">
      <div class="toolbar">
        <button class="btn btn--primary" @click="openEditor()">新建文章</button>
        <button v-if="selectedIds.size" class="btn btn--danger" @click="handleBatchDelete">
          删除选中（{{ selectedIds.size }}）
        </button>
      </div>

      <div v-if="posts.length" class="post-list">
        <label class="select-all">
          <input type="checkbox" :checked="allSelected" @change="toggleSelectAll" />
          <span>全选</span>
        </label>
        <div v-for="p in posts" :key="p.id" class="post-card" :class="{ 'post-card--selected': selectedIds.has(p.id) }">
          <input type="checkbox" class="post-card__check" :checked="selectedIds.has(p.id)" @change="toggleSelect(p.id)" />
          <div class="post-card__body">
            <h3 class="post-card__title">{{ p.title }}</h3>
            <p class="post-card__desc">{{ p.desc }}</p>
            <span class="post-card__date">{{ p.date }}</span>
          </div>
          <div class="post-card__actions">
            <button class="btn btn--sm" @click="openEditor(p)">编辑</button>
            <button class="btn btn--sm btn--danger" @click="handleDeletePost(p.id)">删除</button>
          </div>
        </div>
      </div>
      <p v-else class="empty">暂无文章</p>
    </div>

    <!-- 侧边栏信息 -->
    <div v-if="tab === 'sidebar'">
      <form class="sidebar-form" @submit.prevent="handleSaveSidebar">
        <label class="field">
          <span class="field__label">昵称</span>
          <input v-model="sidebar.name" type="text" class="field__input" />
        </label>
        <label class="field">
          <span class="field__label">格言</span>
          <input v-model="sidebar.motto" type="text" class="field__input" />
        </label>
        <label class="field">
          <span class="field__label">头像 URL</span>
          <div class="field__upload-row">
            <input v-model="sidebar.avatarUrl" type="text" class="field__input" placeholder="或上传图片" />
            <input type="file" accept="image/*" @change="onAvatarFile" />
            <button type="button" class="btn btn--sm" :disabled="!avatarFile" @click="uploadAvatar">
              {{ uploadingAvatar ? '上传中…' : '上传' }}
            </button>
          </div>
        </label>
        <label class="field">
          <span class="field__label">ICP备案号</span>
          <input v-model="sidebar.icp" type="text" class="field__input" />
        </label>
        <div class="form-actions">
          <button type="submit" class="btn btn--primary">保存</button>
          <span v-if="sidebarSaved" class="form-actions__ok">已保存</span>
        </div>
      </form>
    </div>

    <!-- 编辑器弹窗 -->
    <div v-if="editing" class="modal-mask" @click.self="editing = null">
      <div class="modal">
        <h3 class="modal__title">{{ editingPost.id ? '编辑文章' : '新建文章' }}</h3>
        <label class="field">
          <span class="field__label">标题</span>
          <input v-model="editingPost.title" type="text" class="field__input" />
        </label>
        <label class="field">
          <span class="field__label">摘要</span>
          <input v-model="editingPost.desc" type="text" class="field__input" />
        </label>
        <label class="field">
          <span class="field__label">封面 URL</span>
          <div class="field__upload-row">
            <input v-model="editingPost.coverUrl" type="text" class="field__input" placeholder="或上传图片" />
            <input type="file" accept="image/*" @change="onCoverFile" />
            <button type="button" class="btn btn--sm" :disabled="!coverFile" @click="uploadCover">
              {{ uploadingCover ? '上传中…' : '上传' }}
            </button>
          </div>
        </label>
        <label class="field">
          <span class="field__label">正文（Markdown）</span>
          <textarea v-model="editingPost.content" class="field__textarea" rows="12" placeholder="支持 Markdown 语法…" />
        </label>
        <div class="modal__actions">
          <button class="btn" @click="editing = null">取消</button>
          <button class="btn btn--primary" @click="handleSavePost">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { getPosts, createPost, updatePost, deletePost, batchDeletePosts, getSidebar, updateSidebar } from '@/services/api/blog.js';
import { uploadImage } from '@/services/api/admin.js';

const tab = ref('posts');
const posts = ref([]);
const selectedIds = ref(new Set());
const sidebar = reactive({ name: '', motto: '', avatarUrl: '', icp: '' });
const sidebarSaved = ref(false);
const editing = ref(null);
const editingPost = reactive({ id: '', title: '', desc: '', content: '', coverUrl: '' });
const avatarFile = ref(null);
const coverFile = ref(null);
const uploadingAvatar = ref(false);
const uploadingCover = ref(false);

const allSelected = computed(() => posts.value.length > 0 && selectedIds.value.size === posts.value.length);

function toggleSelectAll() {
  if (allSelected.value) {
    selectedIds.value = new Set();
  } else {
    selectedIds.value = new Set(posts.value.map((p) => p.id));
  }
}

function toggleSelect(id) {
  const next = new Set(selectedIds.value);
  if (next.has(id)) next.delete(id); else next.add(id);
  selectedIds.value = next;
}

function loadPosts() {
  getPosts((res) => { posts.value = res.data; }, () => {});
}

function loadSidebar() {
  getSidebar((res) => { Object.assign(sidebar, res.data); }, () => {});
}

function openEditor(post) {
  if (post) {
    Object.assign(editingPost, {
      id: post.id, title: post.title, desc: post.desc, content: post.content || '', coverUrl: post.coverUrl || '',
    });
  } else {
    Object.assign(editingPost, { id: '', title: '', desc: '', content: '', coverUrl: '' });
  }
  editing.value = true;
}

function handleSavePost() {
  const payload = {
    title: editingPost.title,
    desc: editingPost.desc,
    content: editingPost.content,
    coverUrl: editingPost.coverUrl,
  };
  if (editingPost.id) {
    updatePost(editingPost.id, payload, () => { editing.value = null; loadPosts(); }, () => {});
  } else {
    createPost(payload, () => { editing.value = null; loadPosts(); }, () => {});
  }
}

function handleDeletePost(id) {
  if (!confirm('确认删除？')) return;
  deletePost(id, () => { selectedIds.value.delete(id); loadPosts(); }, () => {});
}

function handleBatchDelete() {
  if (!selectedIds.value.size) return;
  if (!confirm(`确认删除选中的 ${selectedIds.value.size} 篇文章？`)) return;
  const ids = [...selectedIds.value];
  batchDeletePosts(ids, () => {
    selectedIds.value = new Set();
    loadPosts();
  }, () => {});
}

function handleSaveSidebar() {
  updateSidebar({ ...sidebar }, () => {
    sidebarSaved.value = true;
    setTimeout(() => { sidebarSaved.value = false; }, 2000);
  }, () => {});
}

function onAvatarFile(e) { avatarFile.value = e.target.files[0] || null; }
function onCoverFile(e) { coverFile.value = e.target.files[0] || null; }

function uploadAvatar() {
  if (!avatarFile.value) return;
  uploadingAvatar.value = true;
  const form = new FormData();
  form.append('file', avatarFile.value);
  uploadImage(form,
    (res) => {
      sidebar.avatarUrl = res.data.url;
      avatarFile.value = null;
      uploadingAvatar.value = false;
    },
    () => { uploadingAvatar.value = false; },
  );
}

function uploadCover() {
  if (!coverFile.value) return;
  uploadingCover.value = true;
  const form = new FormData();
  form.append('file', coverFile.value);
  uploadImage(form,
    (res) => {
      editingPost.coverUrl = res.data.url;
      coverFile.value = null;
      uploadingCover.value = false;
    },
    () => { uploadingCover.value = false; },
  );
}

onMounted(() => { loadPosts(); loadSidebar(); });
</script>

<style scoped>
.page-wrap__title { font-family: var(--font-ink); font-size: 24px; font-weight: 600; color: #3a2f28; margin: 0 0 24px; letter-spacing: 0.06em; }

.tabs { display: flex; gap: 4px; margin-bottom: 20px; }
.tabs__tab {
  font-family: var(--font-ink); font-size: 14px; padding: 8px 20px;
  background: transparent; border: 1px solid rgba(58, 47, 40, 0.12); border-radius: 6px 6px 0 0;
  cursor: pointer; color: rgba(58, 47, 40, 0.5); transition: all 0.2s;
}
.tabs__tab--active { color: #C41E1E; border-bottom-color: transparent; background: rgba(245, 240, 232, 0.6); }
.tabs__tab:hover { color: #3a2f28; }

.toolbar { margin-bottom: 16px; display: flex; gap: 10px; align-items: center; }

.select-all {
  display: flex; align-items: center; gap: 6px; font-family: var(--font-ink); font-size: 13px; color: rgba(58, 47, 40, 0.5); cursor: pointer; padding: 0 4px 4px;
}
.select-all input { cursor: pointer; }

.post-list { display: flex; flex-direction: column; gap: 8px; }
.post-card {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 16px; background: rgba(245, 240, 232, 0.6);
  border: 1px solid rgba(58, 47, 40, 0.08); border-radius: 6px;
  transition: border-color 0.2s;
}
.post-card--selected { border-color: rgba(196, 30, 30, 0.25); background: rgba(196, 30, 30, 0.04); }
.post-card__check { flex-shrink: 0; cursor: pointer; }
.post-card__body { flex: 1; min-width: 0; }
.post-card__title { font-family: var(--font-ink); font-size: 15px; font-weight: 600; color: #3a2f28; margin: 0 0 2px; }
.post-card__desc { font-family: var(--font-ink); font-size: 12px; color: rgba(58, 47, 40, 0.45); margin: 0 0 2px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.post-card__date { font-family: var(--font-ink); font-size: 11px; color: rgba(58, 47, 40, 0.3); }
.post-card__actions { display: flex; gap: 6px; flex-shrink: 0; }

.sidebar-form { display: flex; flex-direction: column; gap: 16px; max-width: 500px; }

.field { display: flex; flex-direction: column; gap: 4px; }
.field__label { font-family: var(--font-ink); font-size: 13px; color: rgba(58, 47, 40, 0.5); }
.field__input {
  font-family: var(--font-ink); font-size: 14px; padding: 8px 12px; color: #3a2f28;
  background: rgba(255,255,255,0.7); border: 1px solid rgba(58, 47, 40, 0.12); border-radius: 4px; outline: none;
  transition: border-color 0.2s;
}
.field__input:focus { border-color: rgba(196, 30, 30, 0.25); }
.field__textarea {
  font-family: var(--font-ink); font-size: 14px; padding: 10px 12px; color: #3a2f28; resize: vertical;
  background: rgba(255,255,255,0.7); border: 1px solid rgba(58, 47, 40, 0.12); border-radius: 4px; outline: none;
}
.field__textarea:focus { border-color: rgba(196, 30, 30, 0.25); }
.field__upload-row { display: flex; gap: 8px; align-items: center; }
.field__upload-row input[type="file"] { font-family: var(--font-ink); font-size: 12px; width: 100px; }

.form-actions { display: flex; align-items: center; gap: 12px; margin-top: 4px; }
.form-actions__ok { font-family: var(--font-ink); font-size: 13px; color: rgba(58, 47, 40, 0.4); }

.btn {
  font-family: var(--font-ink); font-size: 13px; padding: 6px 14px; border-radius: 4px;
  border: 1px solid rgba(58, 47, 40, 0.15); cursor: pointer; transition: all 0.2s;
  background: rgba(255,255,255,0.7); color: #3a2f28;
}
.btn:hover { background: rgba(58, 47, 40, 0.06); }
.btn--primary { background: #C41E1E; color: #fff; border-color: #C41E1E; }
.btn--primary:hover { background: #a01818; }
.btn--sm { padding: 4px 10px; font-size: 12px; }
.btn--danger { color: #C41E1E; border-color: rgba(196, 30, 30, 0.2); }
.btn--danger:hover { background: rgba(196, 30, 30, 0.08); }
.btn:disabled { opacity: 0.4; cursor: default; }

.modal-mask {
  position: fixed; inset: 0; background: rgba(58, 47, 40, 0.3);
  display: flex; align-items: center; justify-content: center; z-index: 200;
}
.modal {
  width: 640px; max-height: 80vh; overflow-y: auto;
  background: rgba(250, 247, 242, 0.98); border: 1px solid rgba(58, 47, 40, 0.12);
  border-radius: 8px; padding: 28px 32px;
  box-shadow: 0 8px 32px rgba(58, 47, 40, 0.16);
  display: flex; flex-direction: column; gap: 14px;
}
.modal__title { font-family: var(--font-ink); font-size: 18px; font-weight: 600; color: #3a2f28; margin: 0; }
.modal__actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 4px; }

.empty { font-family: var(--font-ink); color: rgba(58, 47, 40, 0.35); text-align: center; padding: 60px 0; }
</style>
