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
            <li v-for="a in posts.slice(0, 6)" :key="a.id">
              <router-link :to="'/blog/' + a.id" class="sidebar__article-link">{{ a.title }}</router-link>
            </li>
          </ul>
          <p class="sidebar__icp">ICP备案号：{{ sidebar.icp }}</p>
        </div>
      </aside>

      <div class="article-scroll">
        <article v-for="a in posts" :key="a.id" class="blog-card">
          <router-link :to="'/blog/' + a.id" class="blog-card__link">
            <div class="blog-card__thumb">
              <img
                :src="a.coverUrl ? coverImg(a.coverUrl) : '/default-cover.jpg'"
                class="blog-card__thumb-img"
                alt=""
                @error="onCoverError"
              />
            </div>
            <div class="blog-card__body">
              <h3 class="blog-card__title">{{ a.title }}</h3>
              <p class="blog-card__desc">{{ a.desc }}</p>
              <time class="blog-card__time">{{ a.date }}</time>
            </div>
          </router-link>
        </article>
      </div>

      <router-link to="/" class="map-btn" title="回到地图">
        <img :src="mapIcon" alt="地图" />
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import SiteHeader from '../components/SiteHeader.vue';
import bg from '../../assets/images/blog-bg.png';
import mapIcon from '../../assets/images/map-icon.png';
import { getPosts, getSidebar } from '@/services/api/blog.js';

const posts = ref([]);
const sidebar = reactive({ name: 'Amadeus', motto: '笔落惊风雨，诗成泣鬼神', avatarUrl: '', icp: '666666666666' });

const avatarStyle = computed(() => {
  if (sidebar.avatarUrl) {
    const url = sidebar.avatarUrl.startsWith('http') ? sidebar.avatarUrl : sidebar.avatarUrl;
    return { backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center' };
  }
  return {};
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
  getPosts(
    (res) => { if (res.data && res.data.length) posts.value = res.data; },
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

.blog-card { flex-shrink: 0; }

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
  overflow: hidden;
}

.blog-card__thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.blog-card__link:hover .blog-card__title { color: #C41E1E; }

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
