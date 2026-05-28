<template>
  <div class="page">
    <div class="scene">
      <img :src="bg" alt="" class="scene__bg" />
      <div class="scene__header">
        <SiteHeader active-page="blog" />
      </div>

      <aside class="sidebar">
        <div class="sidebar__card">
          <div class="sidebar__avatar" :style="avatarStyle" />
          <h2 class="sidebar__name">{{ sidebar.name }}</h2>
          <p class="sidebar__motto">{{ sidebar.motto }}</p>
          <hr class="sidebar__rule" />
          <h3 class="sidebar__section-title">近期文章</h3>
          <ul class="sidebar__articles">
            <li v-for="a in recentPosts" :key="a.id">
              <router-link :to="'/blog/' + a.id" class="sidebar__article-link">{{ a.title }}</router-link>
            </li>
          </ul>
          <p class="sidebar__icp">ICP备案号：{{ sidebar.icp }}</p>
        </div>
      </aside>

      <div class="article-area">
        <div v-if="loading" class="article-loading">载入中…</div>
        <template v-else-if="post">
          <div class="article-cover" v-if="post.coverUrl">
            <img :src="coverImg(post.coverUrl)" class="article-cover__img" alt="" @error="onCoverError" />
          </div>
          <h1 class="article-title">{{ post.title }}</h1>
          <time class="article-date">{{ post.date }}</time>
          <div class="article-content" v-html="renderedContent" />
        </template>
        <div v-else class="article-empty">文章未找到</div>
      </div>

      <router-link to="/blog" class="map-btn" title="回到博客列表">
        <img :src="mapIcon" alt="博客列表" />
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { marked } from 'marked';
import SiteHeader from '../components/SiteHeader.vue';
import bg from '../../assets/images/blog-bg.png';
import mapIcon from '../../assets/images/map-icon.png';
import { getPost, getPosts, getSidebar } from '@/services/api/blog.js';

const route = useRoute();

const post = ref(null);
const recentPosts = ref([]);
const loading = ref(true);
const sidebar = reactive({ name: 'Amadeus', motto: '笔落惊风雨，诗成泣鬼神', avatarUrl: '', icp: '666666666666' });

const avatarStyle = computed(() => {
  if (sidebar.avatarUrl) {
    const url = sidebar.avatarUrl.startsWith('http') ? sidebar.avatarUrl : sidebar.avatarUrl;
    return { backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center' };
  }
  return {};
});

const renderedContent = computed(() => {
  if (!post.value || !post.value.content) return '';
  return marked(post.value.content);
});

function coverImg(url) {
  if (!url) return '';
  return url.startsWith('http') ? url : url;
}

function onCoverError(e) {
  if (!e.target.src.endsWith('/default-cover.jpg')) {
    e.target.src = '/default-cover.jpg';
  }
}

onMounted(() => {
  const id = route.params.id;
  getPost(id,
    (res) => {
      post.value = res.data;
      loading.value = false;
    },
    () => { loading.value = false; },
  );
  getPosts(
    (res) => { if (res.data && res.data.length) recentPosts.value = res.data.slice(0, 6); },
    () => {},
  );
  getSidebar(
    (res) => { if (res.data) Object.assign(sidebar, res.data); },
    () => {},
  );
});
</script>

<style scoped>
.page {
  position: fixed;
  inset: 0;
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

/* ---- sidebar (shared with BlogView) ---- */
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

.sidebar__article-link:hover { color: #C41E1E; }

.sidebar__icp {
  margin: 6% 0 0;
  font-size: 0.62cqi;
  color: rgba(58, 47, 40, 0.3);
  letter-spacing: 0.04em;
  flex-shrink: 0;
}

/* ---- article area ---- */
.article-area {
  position: absolute;
  left: 24.86%;
  top: 12%;
  width: 53%;
  height: 84%;
  overflow-y: auto;
  padding-right: 1.5%;
}

.article-area::-webkit-scrollbar { width: 3px; }
.article-area::-webkit-scrollbar-track { background: transparent; }
.article-area::-webkit-scrollbar-thumb {
  background: rgba(58, 47, 40, 0.15);
  border-radius: 2px;
}

.article-loading,
.article-empty {
  font-family: var(--font-ink);
  font-size: 1.1cqi;
  color: rgba(58, 47, 40, 0.4);
  text-align: center;
  padding: 15% 0;
}

.article-cover {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 3%;
  background: linear-gradient(135deg, #e8ddd0, #f0e8db);
  border: 1px solid rgba(58, 47, 40, 0.1);
}

.article-cover__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-title {
  font-family: var(--font-ink);
  font-size: 2.2cqi;
  font-weight: 700;
  color: #3a2f28;
  margin: 0 0 1%;
  letter-spacing: 0.05em;
  line-height: 1.3;
}

.article-date {
  display: block;
  font-family: var(--font-ink);
  font-size: 0.83cqi;
  color: rgba(58, 47, 40, 0.35);
  margin-bottom: 3%;
}

.article-content {
  font-family: var(--font-ink);
  font-size: 1.1cqi;
  color: #3a2f28;
  line-height: 1.9;
  letter-spacing: 0.03em;
  word-break: break-word;
}

.article-content :deep(h1) { font-size: 1.8cqi; font-weight: 700; margin: 4% 0 2%; }
.article-content :deep(h2) { font-size: 1.5cqi; font-weight: 600; margin: 3.5% 0 1.5%; }
.article-content :deep(h3) { font-size: 1.3cqi; font-weight: 600; margin: 3% 0 1.5%; }
.article-content :deep(p) { margin: 0 0 2%; }
.article-content :deep(ul), .article-content :deep(ol) { margin: 0 0 2%; padding-left: 1.5em; }
.article-content :deep(li) { margin-bottom: 0.5%; }
.article-content :deep(blockquote) {
  margin: 2% 0;
  padding: 2% 3%;
  border-left: 3px solid rgba(196, 30, 30, 0.3);
  background: rgba(245, 240, 232, 0.5);
  color: rgba(58, 47, 40, 0.65);
  font-style: italic;
}
.article-content :deep(code) {
  background: rgba(58, 47, 40, 0.12);
  color: #2a1f18;
  padding: 0.15em 0.5em;
  border-radius: 3px;
  font-size: 0.9em;
}
.article-content :deep(pre) {
  background: rgba(58, 47, 40, 0.85);
  color: #e8ddd0;
  padding: 3%;
  border-radius: 6px;
  overflow-x: auto;
  margin: 2% 0;
}
.article-content :deep(pre code) {
  background: none;
  color: inherit;
  padding: 0;
  font-size: 0.85em;
}
.article-content :deep(img) {
  max-width: 100%;
  border-radius: 4px;
  margin: 2% 0;
}
.article-content :deep(hr) {
  border: 0;
  height: 1px;
  margin: 3% 0;
  background: linear-gradient(90deg, transparent, rgba(58,47,40,0.12) 30%, rgba(58,47,40,0.12) 70%, transparent);
}

/* ---- map button ---- */
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
