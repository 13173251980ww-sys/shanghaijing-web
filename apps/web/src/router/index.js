import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', name: 'map', component: () => import('../views/MapView.vue') },
  { path: '/gallery', name: 'gallery', component: () => import('../views/GalleryView.vue') },
  { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
  { path: '/blog', name: 'blog', component: () => import('../views/BlogView.vue') },
  { path: '/friends', name: 'friends', component: () => import('../views/FriendLinksView.vue') },
  { path: '/projects', name: 'projects', component: () => import('../views/ProjectsView.vue') },
  { path: '/messages', name: 'messages', component: () => import('../views/MessagesView.vue') },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
