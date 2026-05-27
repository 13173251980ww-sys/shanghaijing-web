<template>
  <div class="page">
    <div class="scene">
      <img :src="bg" alt="" class="scene__bg" />
      <div class="scene__header">
        <SiteHeader active-page="blog" />
      </div>

      <!-- 个人信息栏 — 固定吸附 -->
      <aside class="sidebar">
        <div class="sidebar__card">
          <div class="sidebar__avatar" />
          <h2 class="sidebar__name">Amadeus</h2>
          <p class="sidebar__motto">笔落惊风雨，诗成泣鬼神</p>
          <hr class="sidebar__rule" />
          <h3 class="sidebar__section-title">近期文章</h3>
          <ul class="sidebar__articles">
            <li v-for="a in articles.slice(0, 6)" :key="a.id">
              <a :href="a.url" class="sidebar__article-link">{{ a.title }}</a>
            </li>
          </ul>
          <p class="sidebar__icp">ICP备案号：666666666666</p>
        </div>
      </aside>

      <!-- 文章列表 — 可滚动 -->
      <div class="article-scroll">
        <article v-for="a in articles" :key="a.id" class="blog-card">
          <a :href="a.url" class="blog-card__link">
            <div class="blog-card__thumb">
              <span class="blog-card__thumb-placeholder" aria-hidden="true">文</span>
            </div>
            <div class="blog-card__body">
              <h3 class="blog-card__title">{{ a.title }}</h3>
              <p class="blog-card__desc">{{ a.desc }}</p>
              <time class="blog-card__time">{{ a.date }}</time>
            </div>
          </a>
        </article>
      </div>

      <router-link to="/" class="map-btn" title="回到地图">
        <img :src="mapIcon" alt="地图" />
      </router-link>
    </div>
  </div>
</template>

<script setup>
import SiteHeader from '../components/SiteHeader.vue';
import bg from '../assets/images/blog-bg.png';
import mapIcon from '../assets/images/map-icon.png';

const articles = [
  { id: 1, title: '山海经异兽考', desc: '应龙、白泽与九尾狐的传说溯源', date: '2026-05-20', url: '#' },
  { id: 2, title: '水墨渲染算法笔记', desc: '基于 WebGL 的实时水墨扩散模拟', date: '2026-05-15', url: '#' },
  { id: 3, title: '前端动画性能优化', desc: '从 30fps 到 60fps 的逐帧分析', date: '2026-05-10', url: '#' },
  { id: 4, title: '聊城大学游记', desc: '东昌湖畔的四年春秋', date: '2026-04-28', url: '#' },
  { id: 5, title: 'Live2D 技术调研', desc: 'Cubism SDK 在 Web 端的集成方案', date: '2026-04-15', url: '#' },
  { id: 6, title: '古诗词数据集构建', desc: '十万首唐诗宋词的清洗与标注', date: '2026-04-02', url: '#' },
  { id: 7, title: 'Vue3 组合式 API 实践', desc: '从 Options 到 Composition 的迁移总结', date: '2026-03-20', url: '#' },
  { id: 8, title: '个人网站开发手记', desc: '从设计到上线的全流程记录', date: '2026-03-10', url: '#' },
  { id: 9, title: 'CSS Container Queries 入门', desc: '现代响应式布局的新范式', date: '2026-02-28', url: '#' },
  { id: 10, title: 'JavaScript 闭包深入理解', desc: '从作用域链到内存管理的完整解析', date: '2026-02-15', url: '#' },
  { id: 11, title: 'Web Worker 多线程实践', desc: '主线程卡顿的终极解决方案', date: '2026-02-01', url: '#' },
  { id: 12, title: 'Canvas 实现粒子特效', desc: '从零搭建烟花粒子系统', date: '2026-01-18', url: '#' },
  { id: 13, title: 'Git 工作流最佳实践', desc: '从 feature branch 到 CI/CD', date: '2026-01-05', url: '#' },
  { id: 14, title: 'HTTP/3 与 QUIC 协议浅析', desc: '新一代传输协议的技术内幕', date: '2025-12-20', url: '#' },
  { id: 15, title: 'TypeScript 类型体操入门', desc: '从泛型到条件类型的进阶之路', date: '2025-12-08', url: '#' },
  { id: 16, title: '2025 年度技术总结', desc: '这一年的成长与收获', date: '2025-12-01', url: '#' },
];
</script>

<style scoped>
.page {
  position: fixed;
  inset: 0;
  background:
    repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(160,140,110,0.08) 3px, rgba(160,140,110,0.08) 6px),
    linear-gradient(180deg, rgba(120,100,70,0.3) 0%, rgba(235,215,185,0.05) 25%, rgba(248,238,218,0.05) 75%, rgba(120,100,70,0.3) 100%),
    linear-gradient(90deg, rgba(120,100,70,0.35) 0%, transparent 6%, transparent 94%, rgba(120,100,70,0.35) 100%),
    #E8D9BE;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scene {
  container-type: size;
  position: relative;
  aspect-ratio: 1440 / 900;
  width: min(100vw, calc(100vh * 1440 / 900));
  overflow: hidden;
}

.scene__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.scene__header {
  position: absolute;
  top: 2.22%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

/* ── Sidebar — 固定吸附 ── */
.sidebar {
  position: absolute;
  left: 2.92%;
  top: 10%;
  bottom: 3%;
  width: 18%;
  z-index: 5;
}

.sidebar__card {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding: 8% 10% 6%;
  background: rgba(245, 240, 232, 0.82);
  border: 1px solid rgba(58, 47, 40, 0.15);
  border-radius: 6px;
  box-shadow: 1px 2px 10px rgba(58, 47, 40, 0.08);
  font-family: var(--font-ink);
  color: #3a2f28;
}

.sidebar__avatar {
  width: 48%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: linear-gradient(135deg, #d4c8b0, #e0d6c4);
  border: 2px solid rgba(58, 47, 40, 0.2);
  flex-shrink: 0;
}

.sidebar__name {
  margin: 6% 0 2%;
  font-size: 1.39cqi;
  font-weight: 600;
  letter-spacing: 0.06em;
  line-height: 1;
}

.sidebar__motto {
  margin: 0 0 8%;
  font-size: 0.69cqi;
  color: rgba(58, 47, 40, 0.45);
  letter-spacing: 0.04em;
  text-align: center;
  line-height: 1.4;
}

.sidebar__rule {
  width: 80%;
  height: 1px;
  border: 0;
  margin: 0 0 8%;
  background: linear-gradient(90deg, transparent, rgba(58,47,40,0.12) 30%, rgba(58,47,40,0.12) 70%, transparent);
}

.sidebar__section-title {
  align-self: flex-start;
  margin: 0 0 6%;
  font-size: 0.83cqi;
  font-weight: 500;
  color: rgba(58, 47, 40, 0.5);
  letter-spacing: 0.08em;
}

.sidebar__articles {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4%;
  flex: 1;
  overflow: hidden;
}

.sidebar__article-link {
  display: block;
  font-size: 0.76cqi;
  color: #3a2f28;
  text-decoration: none;
  line-height: 1.3;
  letter-spacing: 0.03em;
  transition: color 0.3s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar__article-link:hover {
  color: #C41E1E;
}

.sidebar__icp {
  margin: 6% 0 0;
  font-size: 0.62cqi;
  color: rgba(58, 47, 40, 0.3);
  letter-spacing: 0.04em;
  flex-shrink: 0;
}

/* ── Article scroll area ── */
.article-scroll {
  position: absolute;
  left: 24.86%;
  top: 60%;
  width: 53%;
  height: 37%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 3%;
  padding-right: 1.5%;
  scroll-behavior: smooth;
}

.article-scroll::-webkit-scrollbar { width: 3px; }
.article-scroll::-webkit-scrollbar-track { background: transparent; }
.article-scroll::-webkit-scrollbar-thumb {
  background: rgba(58, 47, 40, 0.15);
  border-radius: 2px;
}

/* ── Blog card ── */
.blog-card {
  flex-shrink: 0;
}

.blog-card__link {
  display: flex;
  gap: 4%;
  padding: 3.5% 4%;
  background: rgba(245, 240, 232, 0.72);
  border: 1px solid rgba(58, 47, 40, 0.1);
  border-radius: 6px;
  text-decoration: none;
  transition: border-color 0.35s ease, box-shadow 0.35s ease;
  cursor: pointer;
}

.blog-card__link:hover {
  border-color: rgba(196, 30, 30, 0.2);
  box-shadow: 0 2px 12px rgba(58, 47, 40, 0.08);
}

.blog-card__thumb {
  width: 8cqi;
  aspect-ratio: 1;
  flex-shrink: 0;
  background: linear-gradient(135deg, #e8ddd0, #f0e8db);
  border: 1px solid rgba(58, 47, 40, 0.1);
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.blog-card__thumb-placeholder {
  font-family: var(--font-ink);
  font-size: 2.5cqi;
  color: rgba(58, 47, 40, 0.15);
  line-height: 1;
}

.blog-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3%;
  min-width: 0;
}

.blog-card__title {
  font-family: var(--font-ink);
  font-size: 1.25cqi;
  font-weight: 600;
  color: #3a2f28;
  margin: 0;
  line-height: 1;
  letter-spacing: 0.04em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.35s ease;
}

.blog-card__link:hover .blog-card__title {
  color: #C41E1E;
}

.blog-card__desc {
  font-family: var(--font-ink);
  font-size: 0.9cqi;
  color: rgba(58, 47, 40, 0.5);
  margin: 0;
  line-height: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.blog-card__time {
  font-family: var(--font-ink);
  font-size: 0.76cqi;
  color: rgba(58, 47, 40, 0.35);
  line-height: 1;
}

/* ── map button ── */
.map-btn {
  position: absolute;
  right: 3.19%;
  bottom: 3%;
  width: 12.01%;
  aspect-ratio: 1;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  filter: drop-shadow(0 0.28cqi 0.28cqi rgba(0,0,0,0.25));
  transition: transform 0.3s ease;
  display: block;
  z-index: 5;
}

.map-btn:hover { transform: scale(1.05); }
.map-btn img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
</style>
