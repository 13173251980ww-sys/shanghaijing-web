import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import publicRoutes from './client/router';
import adminRoutes, { adminGuard } from './admin/router';
import './styles/main.css';

const router = createRouter({
  history: createWebHistory(),
  routes: [...publicRoutes, ...adminRoutes],
});

router.beforeEach(adminGuard);

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.mount('#app');
