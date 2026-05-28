<template>
  <div class="page-wrap">
    <h2 class="page-wrap__title">留言管理</h2>

    <div v-if="messages.length" class="msg-list">
      <div v-for="m in messages" :key="m.id" class="msg-card">
        <div class="msg-card__body">
          <div class="msg-card__header">
            <span class="msg-card__author">{{ m.author }}</span>
            <span class="msg-card__time">{{ formatTime(m.createdAt) }}</span>
          </div>
          <p class="msg-card__content">{{ m.content }}</p>
        </div>
        <button class="btn btn--sm btn--danger" @click="handleDelete(m.id)">删除</button>
      </div>
    </div>
    <p v-else class="empty">暂无留言</p>
  </div>
</template>

<script setup>
// 留言管理：查看与删除留言
import { ref, onMounted } from 'vue';
import { getMessages, deleteMessage } from '@/services/api/messages.js';

const messages = ref([]);

function load() {
  getMessages((res) => { messages.value = res.data; }, () => {});
}

function handleDelete(id) {
  if (!confirm('确认删除？')) return;
  deleteMessage(id, () => load(), () => {});
}

function formatTime(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('zh-CN', {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

onMounted(load);
</script>

<style scoped>
.page-wrap__title { font-family: var(--font-ink); font-size: 24px; font-weight: 600; color: #3a2f28; margin: 0 0 24px; letter-spacing: 0.06em; }

.msg-list { display: flex; flex-direction: column; gap: 8px; }
.msg-card {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
  padding: 14px 16px; background: rgba(245, 240, 232, 0.6);
  border: 1px solid rgba(58, 47, 40, 0.08); border-radius: 6px;
}
.msg-card__body { flex: 1; min-width: 0; }
.msg-card__header { display: flex; align-items: baseline; gap: 12px; margin-bottom: 4px; }
.msg-card__author { font-family: var(--font-ink); font-size: 14px; font-weight: 500; color: #3a2f28; }
.msg-card__time { font-family: var(--font-ink); font-size: 11px; color: rgba(58, 47, 40, 0.3); }
.msg-card__content { font-family: var(--font-ink); font-size: 13px; color: rgba(58, 47, 40, 0.55); margin: 0; line-height: 1.5; }

.btn {
  font-family: var(--font-ink); font-size: 13px; padding: 6px 14px; border-radius: 4px;
  border: 1px solid rgba(58, 47, 40, 0.15); cursor: pointer; transition: all 0.2s;
  background: rgba(255,255,255,0.7); color: #3a2f28;
}
.btn:hover { background: rgba(58, 47, 40, 0.06); }
.btn--sm { padding: 4px 10px; font-size: 12px; }
.btn--danger { color: #C41E1E; border-color: rgba(196, 30, 30, 0.2); }
.btn--danger:hover { background: rgba(196, 30, 30, 0.08); }

.empty { font-family: var(--font-ink); color: rgba(58, 47, 40, 0.35); text-align: center; padding: 60px 0; }
</style>
