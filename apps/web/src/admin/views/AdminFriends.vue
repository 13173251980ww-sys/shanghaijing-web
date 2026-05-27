<template>
  <div class="page-wrap">
    <h2 class="page-wrap__title">友情链接管理</h2>

    <form class="add-form" @submit.prevent="handleAdd">
      <input v-model="newName" type="text" class="field__input" placeholder="名称" />
      <input v-model="newUrl" type="text" class="field__input" placeholder="链接 URL" />
      <button type="submit" class="btn btn--primary" :disabled="!newName || !newUrl">添加</button>
    </form>

    <div v-if="links.length" class="link-list">
      <div v-for="link in links" :key="link.id" class="link-card">
        <div class="link-card__body">
          <span class="link-card__name">{{ link.name }}</span>
          <a :href="link.url" target="_blank" class="link-card__url">{{ link.url }}</a>
        </div>
        <div class="link-card__actions">
          <button class="btn btn--sm" @click="startEdit(link)">编辑</button>
          <button class="btn btn--sm btn--danger" @click="handleDelete(link.id)">删除</button>
        </div>
      </div>
    </div>
    <p v-else class="empty">暂无友链</p>

    <!-- 编辑弹窗 -->
    <div v-if="editing" class="modal-mask" @click.self="editing = null">
      <div class="modal">
        <h3 class="modal__title">编辑友链</h3>
        <label class="field">
          <span class="field__label">名称</span>
          <input v-model="editing.name" type="text" class="field__input" />
        </label>
        <label class="field">
          <span class="field__label">链接 URL</span>
          <input v-model="editing.url" type="text" class="field__input" />
        </label>
        <div class="modal__actions">
          <button class="btn" @click="editing = null">取消</button>
          <button class="btn btn--primary" @click="handleEdit">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getFriends, addFriend, updateFriend, deleteFriend } from '@/services/api/friends.js';

const links = ref([]);
const newName = ref('');
const newUrl = ref('');
const editing = ref(null);

function load() {
  getFriends((res) => { links.value = res.data; }, () => {});
}

function handleAdd() {
  addFriend({ name: newName.value, url: newUrl.value }, () => {
    newName.value = '';
    newUrl.value = '';
    load();
  }, () => {});
}

function startEdit(link) {
  editing.value = reactive({ id: link.id, name: link.name, url: link.url });
}

function handleEdit() {
  updateFriend(editing.value.id, {
    name: editing.value.name,
    url: editing.value.url,
  }, () => { editing.value = null; load(); }, () => {});
}

function handleDelete(id) {
  if (!confirm('确认删除？')) return;
  deleteFriend(id, () => load(), () => {});
}

onMounted(load);
</script>

<style scoped>
.page-wrap__title { font-family: var(--font-ink); font-size: 24px; font-weight: 600; color: #3a2f28; margin: 0 0 24px; letter-spacing: 0.06em; }

.add-form { display: flex; gap: 10px; align-items: center; margin-bottom: 24px; }
.add-form .field__input { flex: 1; }

.link-list { display: flex; flex-direction: column; gap: 8px; }
.link-card {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px; background: rgba(245, 240, 232, 0.6);
  border: 1px solid rgba(58, 47, 40, 0.08); border-radius: 6px;
}
.link-card__body { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.link-card__name { font-family: var(--font-ink); font-size: 15px; font-weight: 500; color: #3a2f28; }
.link-card__url {
  font-family: var(--font-ink); font-size: 12px; color: rgba(58, 47, 40, 0.4);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.link-card__actions { display: flex; gap: 6px; flex-shrink: 0; }

.field { display: flex; flex-direction: column; gap: 4px; }
.field__label { font-family: var(--font-ink); font-size: 13px; color: rgba(58, 47, 40, 0.5); }
.field__input {
  font-family: var(--font-ink); font-size: 14px; padding: 8px 12px; color: #3a2f28;
  background: rgba(255,255,255,0.7); border: 1px solid rgba(58, 47, 40, 0.12); border-radius: 4px; outline: none;
}
.field__input:focus { border-color: rgba(196, 30, 30, 0.25); }

.modal-mask {
  position: fixed; inset: 0; background: rgba(58, 47, 40, 0.3);
  display: flex; align-items: center; justify-content: center; z-index: 200;
}
.modal {
  width: 420px; background: rgba(250, 247, 242, 0.98);
  border: 1px solid rgba(58, 47, 40, 0.12); border-radius: 8px;
  padding: 28px 32px; box-shadow: 0 8px 32px rgba(58, 47, 40, 0.16);
  display: flex; flex-direction: column; gap: 14px;
}
.modal__title { font-family: var(--font-ink); font-size: 18px; font-weight: 600; color: #3a2f28; margin: 0; }
.modal__actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 4px; }

.btn {
  font-family: var(--font-ink); font-size: 13px; padding: 6px 14px; border-radius: 4px;
  border: 1px solid rgba(58, 47, 40, 0.15); cursor: pointer; transition: all 0.2s;
  background: rgba(255,255,255,0.7); color: #3a2f28; flex-shrink: 0;
}
.btn:hover { background: rgba(58, 47, 40, 0.06); }
.btn--primary { background: #C41E1E; color: #fff; border-color: #C41E1E; }
.btn--primary:hover { background: #a01818; }
.btn--sm { padding: 4px 10px; font-size: 12px; }
.btn--danger { color: #C41E1E; border-color: rgba(196, 30, 30, 0.2); }
.btn--danger:hover { background: rgba(196, 30, 30, 0.08); }
.btn:disabled { opacity: 0.4; cursor: default; }

.empty { font-family: var(--font-ink); color: rgba(58, 47, 40, 0.35); text-align: center; padding: 60px 0; }
</style>
