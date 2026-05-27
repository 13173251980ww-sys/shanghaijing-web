<template>
  <div class="dashboard">
    <h2 class="dashboard__title">仪表盘</h2>

    <div class="dashboard__cards">
      <router-link
        v-for="card in cards"
        :key="card.key"
        :to="card.path"
        class="stat-card"
      >
        <span class="stat-card__icon" v-html="card.icon" />
        <div class="stat-card__body">
          <span class="stat-card__count">{{ card.count }}</span>
          <span class="stat-card__label">{{ card.label }}</span>
        </div>
      </router-link>
    </div>

    <div v-if="messages.length" class="dashboard__recent">
      <h3 class="dashboard__section-title">最近留言</h3>
      <div v-for="m in messages.slice(0, 5)" :key="m.id" class="msg-row">
        <span class="msg-row__author">{{ m.author }}</span>
        <span class="msg-row__content">{{ m.content }}</span>
        <span class="msg-row__time">{{ formatTime(m.createdAt) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getGallery } from '@/services/api/gallery.js';
import { getPosts } from '@/services/api/blog.js';
import { getFriends } from '@/services/api/friends.js';
import { getMessages } from '@/services/api/messages.js';
import { getProjects } from '@/services/api/projects.js';
import { getApiDocs } from '@/services/api/admin.js';

const gallery = ref([]);
const blogPosts = ref([]);
const friends = ref([]);
const messages = ref([]);
const projects = ref([]);
const apiEndpoints = ref([]);

const cards = [
  { key: 'gallery', label: '画廊图片', path: '/admin/gallery', icon: '&#x25A1;', get count() { return gallery.value.length; } },
  { key: 'blog', label: '博客文章', path: '/admin/blog', icon: '&#x270E;', get count() { return blogPosts.value.length; } },
  { key: 'friends', label: '友情链接', path: '/admin/friends', icon: '&#x2666;', get count() { return friends.value.length; } },
  { key: 'messages', label: '留言', path: '/admin/messages', icon: '&#x2709;', get count() { return messages.value.length; } },
  { key: 'projects', label: '项目', path: '/admin/projects', icon: '&#x2699;', get count() { return projects.value.length; } },
  { key: 'about', label: '关于我', path: '/admin/about', icon: '&#x263A;', get count() { return 1; } },
  { key: 'api', label: 'API 接口', path: '/admin/api-docs', icon: '&#x2139;', get count() { return apiEndpoints.value.length; } },
];

function load() {
  getGallery((res) => { gallery.value = res.data; }, () => {});
  getPosts((res) => { blogPosts.value = res.data; }, () => {});
  getFriends((res) => { friends.value = res.data; }, () => {});
  getMessages((res) => { messages.value = res.data; }, () => {});
  getProjects((res) => { projects.value = res.data; }, () => {});
  getApiDocs((res) => { apiEndpoints.value = res.data?.endpoints || []; }, () => {});
}

function formatTime(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

onMounted(load);
</script>

<style scoped>
.dashboard__title {
  font-family: var(--font-ink);
  font-size: 24px;
  font-weight: 600;
  color: #3a2f28;
  margin: 0 0 28px;
  letter-spacing: 0.06em;
}

.dashboard__cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 36px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 18px;
  background: rgba(245, 240, 232, 0.7);
  border: 1px solid rgba(58, 47, 40, 0.1);
  border-radius: 8px;
  text-decoration: none;
  transition: border-color 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.stat-card:hover {
  border-color: rgba(196, 30, 30, 0.2);
  box-shadow: 0 2px 12px rgba(58, 47, 40, 0.06);
}

.stat-card__icon {
  font-size: 24px;
  color: rgba(58, 47, 40, 0.3);
}

.stat-card__body {
  display: flex;
  flex-direction: column;
}

.stat-card__count {
  font-family: var(--font-ink);
  font-size: 28px;
  font-weight: 600;
  color: #3a2f28;
  line-height: 1;
}

.stat-card__label {
  font-family: var(--font-ink);
  font-size: 13px;
  color: rgba(58, 47, 40, 0.45);
  margin-top: 4px;
}

.dashboard__section-title {
  font-family: var(--font-ink);
  font-size: 16px;
  font-weight: 500;
  color: rgba(58, 47, 40, 0.5);
  margin: 0 0 12px;
  letter-spacing: 0.06em;
}

.msg-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 14px;
  background: rgba(245, 240, 232, 0.5);
  border: 1px solid rgba(58, 47, 40, 0.06);
  border-radius: 4px;
  margin-bottom: 6px;
  font-family: var(--font-ink);
  font-size: 13px;
}

.msg-row__author {
  color: #3a2f28;
  font-weight: 500;
  flex-shrink: 0;
  min-width: 60px;
}

.msg-row__content {
  flex: 1;
  color: rgba(58, 47, 40, 0.6);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.msg-row__time {
  color: rgba(58, 47, 40, 0.3);
  font-size: 12px;
  flex-shrink: 0;
}
</style>
