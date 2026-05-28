// 前台公开路由：首页、画廊、关于、博客、友链、项目、留言
const publicRoutes = [
  {
    path: '/', name: 'map',
    component: () => import('./views/MapView.vue'),
    meta: { seoTitle: '山海图', seoDescription: '交互式山海经异兽地图，探索上古奇珍异兽的地理分布与典故。' },
  },
  {
    path: '/gallery', name: 'gallery',
    component: () => import('./views/GalleryView.vue'),
    meta: { seoTitle: '画廊', seoDescription: '山海经神兽图鉴，以水墨画风展现上古奇兽的风采。' },
  },
  {
    path: '/about', name: 'about',
    component: () => import('./views/AboutView.vue'),
    meta: { seoTitle: '关于我', seoDescription: '山海阁主人的个人简介、求学经历与社交链接。' },
  },
  {
    path: '/blog', name: 'blog',
    component: () => import('./views/BlogView.vue'),
    meta: { seoTitle: '博客', seoDescription: '山海阁文章，记录技术随想、读书笔记与山海经考据。' },
  },
  {
    path: '/blog/:id', name: 'blog-post',
    component: () => import('./views/BlogPostView.vue'),
    meta: { seoTitle: '博文', seoDescription: '山海阁博文。' },
  },
  {
    path: '/friends', name: 'friends',
    component: () => import('./views/FriendLinksView.vue'),
    meta: { seoTitle: '友情链接', seoDescription: '山海阁友链，与志同道合的朋友互相链接。' },
  },
  {
    path: '/projects', name: 'projects',
    component: () => import('./views/ProjectsView.vue'),
    meta: { seoTitle: '项目', seoDescription: '山海阁主人的个人项目作品展示。' },
  },
  {
    path: '/messages', name: 'messages',
    component: () => import('./views/MessagesView.vue'),
    meta: { seoTitle: '留言板', seoDescription: '山海阁留言板，留下你的足迹与话语。' },
  },
];

export default publicRoutes;
