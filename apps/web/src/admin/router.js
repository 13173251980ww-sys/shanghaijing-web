import AdminLayout from './AdminLayout.vue';

const TOKEN_KEY = 'admin_token';

const adminRoutes = [
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('./views/AdminLoginView.vue'),
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'admin-dashboard', component: () => import('./views/AdminDashboard.vue') },
      { path: 'gallery', name: 'admin-gallery', component: () => import('./views/AdminGallery.vue') },
      { path: 'blog', name: 'admin-blog', component: () => import('./views/AdminBlog.vue') },
      { path: 'about', name: 'admin-about', component: () => import('./views/AdminAbout.vue') },
      { path: 'friends', name: 'admin-friends', component: () => import('./views/AdminFriends.vue') },
      { path: 'messages', name: 'admin-messages', component: () => import('./views/AdminMessages.vue') },
      { path: 'projects', name: 'admin-projects', component: () => import('./views/AdminProjects.vue') },
      { path: 'api-docs', name: 'admin-api-docs', component: () => import('./views/AdminApiDocs.vue') },
      { path: 'database', name: 'admin-database', component: () => import('./views/AdminDatabase.vue') },
      { path: 'ai-config', name: 'admin-ai-config', component: () => import('./views/AdminAiConfig.vue') },
    ],
  },
];

export function adminGuard(to, _from, next) {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return next({ name: 'admin-login', query: { redirect: to.fullPath } });
  }
  next();
}

export default adminRoutes;
