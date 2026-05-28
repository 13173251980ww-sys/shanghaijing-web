// Vue 应用入口：挂载路由、状态管理、全局样式
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
// 前台路由（公开页面）与管理后台路由
import publicRoutes from './client/router';
import adminRoutes, { adminGuard } from './admin/router';
import './styles/main.css';

// 创建路由实例：合并前台与后台路由
const router = createRouter({
  history: createWebHistory(),
  routes: [...publicRoutes, ...adminRoutes],
});

// 全局路由守卫：后台页面需验证 token
router.beforeEach(adminGuard);

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.mount('#app');
