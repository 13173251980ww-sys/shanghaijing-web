// SEO 组合式函数：根据路由 meta 动态设置页面 title 和 meta 标签
const SITE_NAME = '山海经';
const DEFAULT_TITLE = `${SITE_NAME} - 个人网站`;
const DEFAULT_DESC = '山海经主题个人网站，以中国传统水墨画风打造的博客、画廊、留言、友链等功能的个人空间。';

// 确保指定 meta 标签存在并更新内容
function ensureMeta(name, attr, content) {
  let el;
  if (attr === 'name') {
    el = document.querySelector(`meta[name="${name}"]`);
  } else {
    el = document.querySelector(`meta[property="${name}"]`);
  }
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
  return el;
}

export function useSEO() {
  /** 根据路由对象更新页面 SEO 信息 */
  function apply(to) {
    const meta = to.meta || {};

    const title = meta.seoTitle
      ? `${meta.seoTitle} | ${SITE_NAME}`
      : DEFAULT_TITLE;
    document.title = title;

    const desc = meta.seoDescription || DEFAULT_DESC;
    ensureMeta('description', 'name', desc);
    ensureMeta('og:title', 'property', title);
    ensureMeta('og:description', 'property', desc);

    const robots = meta.seoNoIndex ? 'noindex, nofollow' : 'index, follow';
    ensureMeta('robots', 'name', robots);
  }

  return { apply };
}
