<template>
  <nav class="sidebar">
    <router-link to="/admin" class="sidebar__brand">
      <span class="sidebar__brand-text">山海阁</span>
    </router-link>

    <div class="sidebar__nav">
      <router-link
        v-for="item in navItems"
        :key="item.key"
        :to="item.path"
        class="sidebar__link"
        :class="{ 'sidebar__link--active': isActive(item.key) }"
      >
        <span class="sidebar__link-icon" v-html="item.icon" />
        <span class="sidebar__link-label">{{ item.label }}</span>
      </router-link>
    </div>

    <div class="sidebar__footer">
      <a href="/" class="sidebar__back">← 返回前台</a>
      <button class="sidebar__logout" @click="handleLogout">退出</button>
    </div>
  </nav>
</template>

<script setup>
// 管理后台侧边导航：功能菜单 + 返回前台 + 退出登录
import { useRoute, useRouter } from 'vue-router';
import { useAdminStore } from '../store.js';

const route = useRoute();
const router = useRouter();
const adminStore = useAdminStore();

const navItems = [
  { key: 'admin-dashboard', label: '仪表盘', path: '/admin', icon: '&#x2302;' },
  { key: 'admin-gallery', label: '画廊', path: '/admin/gallery', icon: '&#x25A1;' },
  { key: 'admin-blog', label: '博客', path: '/admin/blog', icon: '&#x270E;' },
  { key: 'admin-about', label: '关于我', path: '/admin/about', icon: '&#x263A;' },
  { key: 'admin-friends', label: '友情', path: '/admin/friends', icon: '&#x2666;' },
  { key: 'admin-messages', label: '留言', path: '/admin/messages', icon: '&#x2709;' },
  { key: 'admin-projects', label: '项目', path: '/admin/projects', icon: '&#x2699;' },
  { key: 'admin-api-docs', label: 'API 文档', path: '/admin/api-docs', icon: '&#x2139;' },
  { key: 'admin-database', label: '数据库', path: '/admin/database', icon: '&#x25A3;' },
  { key: 'admin-ai-config', label: 'AI 配置', path: '/admin/ai-config', icon: '&#x2691;' },
  { key: 'admin-music', label: '音乐', path: '/admin/music', icon: '&#x266A;' },
];

function isActive(key) {
  return route.name === key;
}

function handleLogout() {
  adminStore.logout();
  router.push('/admin/login');
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 220px;
  display: flex;
  flex-direction: column;
  background: rgba(245, 240, 232, 0.92);
  border-right: 1px solid rgba(58, 47, 40, 0.12);
  box-shadow: 2px 0 16px rgba(58, 47, 40, 0.06);
  z-index: 100;
  font-family: var(--font-ink);
}

.sidebar__brand {
  display: block;
  padding: 28px 24px 12px;
  font-size: 22px;
  font-weight: 700;
  color: #C41E1E;
  letter-spacing: 0.08em;
  text-decoration: none;
  text-align: center;
}

.sidebar__nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 12px;
}

.sidebar__link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 6px;
  text-decoration: none;
  color: #3a2f28;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.04em;
  transition: all 0.25s ease;
}

.sidebar__link:hover {
  background: rgba(196, 30, 30, 0.06);
  color: #C41E1E;
}

.sidebar__link--active {
  background: rgba(196, 30, 30, 0.08);
  color: #C41E1E;
}

.sidebar__link-icon {
  width: 20px;
  text-align: center;
  font-size: 16px;
  flex-shrink: 0;
}

.sidebar__footer {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid rgba(58, 47, 40, 0.08);
}

.sidebar__back {
  font-size: 13px;
  color: rgba(58, 47, 40, 0.5);
  text-decoration: none;
  transition: color 0.2s;
}

.sidebar__back:hover {
  color: #3a2f28;
}

.sidebar__logout {
  font-family: var(--font-ink);
  font-size: 13px;
  color: rgba(196, 30, 30, 0.5);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  text-align: left;
  transition: color 0.2s;
}

.sidebar__logout:hover {
  color: #C41E1E;
}
</style>
