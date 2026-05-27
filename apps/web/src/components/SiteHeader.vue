<template>
  <header class="header" :class="{ 'header--light': light }">
    <nav class="header__nav">
      <router-link
        v-for="item in navItems"
        :key="item.key"
        :to="item.path"
        class="header__link"
        :class="{ 'header__link--active': activePage === item.key }"
      >
        {{ item.label }}
        <span class="header__link-ink" aria-hidden="true" />
      </router-link>
    </nav>
    <button class="header__menu" aria-label="菜单">
      <svg viewBox="0 0 24 24" fill="none" class="header__menu-icon">
        <path d="M5 7h10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        <path d="M3 12h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        <path d="M9 17h10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
    </button>
  </header>
</template>

<script setup>
defineProps({
  activePage: { type: String, default: 'map' },
  light: { type: Boolean, default: false },
});

const navItems = [
  { key: 'map', label: '首页', path: '/' },
  { key: 'gallery', label: '画廊', path: '/gallery' },
  { key: 'about', label: '关于我', path: '/about' },
  { key: 'blog', label: '博客', path: '/blog' },
  { key: 'friends', label: '友情', path: '/friends' },
  { key: 'projects', label: '项目', path: '/projects' },
  { key: 'messages', label: '留言', path: '/messages' },
];
</script>

<style scoped>
/* Ink wash painting (水墨画) style navigation */

.header {
  position: relative;
  display: flex;
  align-items: center;
  width: 63.4cqi;
  height: 8.44cqb;
  z-index: 10;
}

.header__nav {
  display: flex;
  align-items: center;
  gap: 3.47cqi;
}

.header__link {
  position: relative;
  font-family: var(--font-ink);
  font-size: 2.22cqi;
  font-weight: 500;
  line-height: 1;
  color: #3a2f28;
  letter-spacing: 0.06em;
  white-space: nowrap;
  text-decoration: none;
  transition: color 0.35s ease;
}

.header__link:hover {
  color: #8b5a2b;
}

/* Light mode — text sits on dark background images */
.header--light .header__link {
  color: #f0e6d2;
}

.header--light .header__link:hover {
  color: #fff;
}

/* Active ink brush underline */
.header__link-ink {
  position: absolute;
  bottom: -4px;
  left: 5%;
  width: 90%;
  height: 2px;
  border-radius: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    #C41E1E 15%,
    #C41E1E 85%,
    transparent 100%
  );
  opacity: 0;
  transform: scaleX(0);
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.header__link--active .header__link-ink {
  opacity: 1;
  transform: scaleX(1);
}

/* Active text turns vermillion red like a seal stamp */
.header__link--active {
  color: #C41E1E !important;
}

/* Hamburger menu — thin ink lines */
.header__menu {
  position: absolute;
  right: 0;
  top: 0;
  width: 5.28cqi;
  height: 5.28cqi;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: #3a2f28;
  transition: color 0.35s ease;
}

.header__menu:hover {
  color: #8b5a2b;
}

.header--light .header__menu {
  color: #f0e6d2;
}

.header--light .header__menu:hover {
  color: #fff;
}

.header__menu-icon {
  width: 100%;
  height: 100%;
}
</style>
