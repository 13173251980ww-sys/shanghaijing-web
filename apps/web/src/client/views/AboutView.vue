<template>
  <div class="page">
    <div class="scene">
      <img :src="bg" alt="" class="scene__bg" />
      <div class="scene__header">
        <SiteHeader active-page="about" />
      </div>

      <article class="profile">
        <div class="profile__card">
          <div class="profile__identity">
            <div class="profile__avatar" :style="avatarStyle" />
            <div class="profile__names">
              <h2 class="profile__nickname">{{ info.nickname }}</h2>
              <p class="profile__school">{{ info.school }}</p>
            </div>
          </div>

          <span class="profile__seal" aria-hidden="true">印</span>

          <hr class="profile__rule" />

          <section class="profile__section">
            <h3 class="profile__label">技术</h3>
            <ul class="profile__links">
              <li v-if="info.githubUrl">
                <a :href="info.githubUrl" target="_blank" rel="noopener">GitHub</a>
              </li>
              <li v-if="info.csdnUrl">
                <a :href="info.csdnUrl" target="_blank" rel="noopener">CSDN</a>
              </li>
            </ul>
          </section>

          <hr class="profile__rule" />

          <section class="profile__section">
            <h3 class="profile__label">媒体</h3>
            <p class="profile__social">{{ info.social }}</p>
          </section>
        </div>
      </article>

      <router-link to="/" class="map-btn" title="回到地图">
        <img :src="mapIcon" alt="地图" />
      </router-link>
    </div>
  </div>
</template>

<script setup>
// 关于我：个人信息展示页
import { reactive, computed, onMounted } from 'vue';
import SiteHeader from '../components/SiteHeader.vue';
import bg from '../../assets/images/about-bg.png';
import mapIcon from '../../assets/images/map-icon.png';
import { getAbout } from '@/services/api/about.js';

const info = reactive({
  nickname: 'Amadeus',
  school: '聊城大学',
  avatarUrl: '',
  githubUrl: 'https://github.com/13173251980ww-sys',
  csdnUrl: 'https://blog.csdn.net/amadeusCristina',
  social: 'B站 / QQ 1685736247',
});

const avatarStyle = computed(() => {
  if (info.avatarUrl) {
    const url = info.avatarUrl.startsWith('http') ? info.avatarUrl : info.avatarUrl;
    return { backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center' };
  }
  return {};
});

onMounted(() => {
  getAbout(
    (res) => { if (res.data) Object.assign(info, res.data); },
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

.profile {
  position: absolute;
  left: 4.5%;
  top: 22%;
  width: 26%;
  height: 56%;
}

.profile__card {
  position: relative;
  height: 100%;
  background: rgba(245, 240, 232, 0.75);
  border: 1px solid rgba(58, 47, 40, 0.2);
  border-radius: 4px;
  padding: 5% 6%;
  box-shadow:
    0 0 0 4px rgba(58, 47, 40, 0.04),
    2px 3px 10px rgba(58, 47, 40, 0.12);
  font-family: var(--font-ink);
  color: #3a2f28;
  overflow: hidden;
}

.profile__identity {
  display: flex;
  align-items: center;
  gap: 5.5%;
  margin-bottom: 5%;
}

.profile__avatar {
  width: 17%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: linear-gradient(135deg, #d4c8b0, #e8ddd0);
  border: 1.5px solid rgba(58, 47, 40, 0.25);
  flex-shrink: 0;
}

.profile__names {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.profile__nickname {
  font-size: 1.67cqi;
  font-weight: 600;
  color: #3a2f28;
  margin: 0;
  line-height: 1;
  letter-spacing: 0.04em;
}

.profile__school {
  font-size: 0.97cqi;
  font-weight: 400;
  color: rgba(58, 47, 40, 0.6);
  margin: 0;
  line-height: 1;
}

.profile__seal {
  position: absolute;
  top: 5%;
  right: 5%;
  width: 5.5cqi;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.22cqi;
  font-weight: 700;
  color: #C41E1E;
  border: 1.5px solid #C41E1E;
  border-radius: 3px;
  opacity: 0.55;
  transform: rotate(8deg);
  line-height: 1;
  pointer-events: none;
  font-family: var(--font-ink);
}

.profile__rule {
  width: 100%;
  height: 1px;
  border: 0;
  margin: 5% 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(58, 47, 40, 0.15) 10%,
    rgba(58, 47, 40, 0.25) 50%,
    rgba(58, 47, 40, 0.15) 90%,
    transparent 100%
  );
}

.profile__section {
  display: flex;
  flex-direction: column;
  gap: 1%;
}

.profile__label {
  font-size: 0.83cqi;
  font-weight: 400;
  color: rgba(58, 47, 40, 0.45);
  margin: 0 0 2% 0;
  line-height: 1;
  letter-spacing: 0.08em;
}

.profile__links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5%;
  font-size: 0.97cqi;
}

.profile__links a {
  color: #3a2f28;
  text-decoration: none;
  transition: color 0.3s;
  display: inline-block;
}

.profile__links a:hover {
  color: #C41E1E;
}

.profile__social {
  font-size: 0.97cqi;
  color: #3a2f28;
  margin: 0;
  line-height: 1.5;
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
}

.map-btn:hover { transform: scale(1.05); }
.map-btn img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
</style>
