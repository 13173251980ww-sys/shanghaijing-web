# 09-SEO 搜索引擎优化

**日期**: 2026-05-27  
**摘要**: 全站 SEO 基础优化 — 动态页面标题与 meta 描述、Open Graph 标签、robots.txt（后台禁索引）、sitemap.xml。

---

## 变更清单

### 新增

| 文件 | 说明 |
|------|------|
| `apps/web/src/composables/useSEO.js` | SEO 工具函数 — 根据路由 meta 动态更新 `document.title`、`<meta name="description">`、`og:title`、`og:description`、`robots` |
| `apps/web/public/robots.txt` | 爬虫规则 — 允许前台，禁止 `/admin`，指向 sitemap |
| `apps/web/public/sitemap.xml` | 站点地图 — 7 个前台页面，含 `changefreq` 和 `priority` |

### 修改

| 文件 | 变更 |
|------|------|
| `apps/web/index.html` | 新增默认 `<meta name="description">`、`<meta name="keywords">`、`<meta name="author">`、`<meta name="robots">`、Open Graph 标签（`og:title`、`og:description`、`og:type`、`og:locale`） |
| `apps/web/src/App.vue` | 引入 `useSEO`，在 `router.beforeEach` 和 `router.afterEach` 中调用 `seo.apply(to)` 动态更新 SEO 标签 |
| `apps/web/src/client/router.js` | 7 个前台路由全部添加 `meta.seoTitle` + `meta.seoDescription` |
| `apps/web/src/admin/router.js` | 后台父路由添加 `meta.seoNoIndex: true`，所有后台页面自动标记 `noindex, nofollow` |

---

## 技术要点

### 动态 SEO 标签更新
- `useSEO` 创建/更新 `<meta>` 标签而非仅依赖 SSR，SPA 路由切换时实时生效
- 路由 `meta.seoTitle` → `document.title` = `"{seoTitle} | 山海经"`
- 路由 `meta.seoDescription` → `<meta name="description">` + `og:description`
- 路由 `meta.seoNoIndex` → `<meta name="robots" content="noindex, nofollow">`
- 缺少 meta 时回退到 `index.html` 中的默认值

### 各页面 SEO 标题

| 路由 | 页面标题 |
|------|---------|
| `/` | 山海图 \| 山海经 |
| `/gallery` | 画廊 \| 山海经 |
| `/blog` | 博客 \| 山海经 |
| `/about` | 关于我 \| 山海经 |
| `/friends` | 友情链接 \| 山海经 |
| `/projects` | 项目 \| 山海经 |
| `/messages` | 留言板 \| 山海经 |
| `/admin/*` | (noindex, nofollow) |

### 验证
- 构建通过（276 modules, 1.83s）
- `dist/index.html` 包含完整 meta 标签（1.68 KB，含 keywords/description/og）
- `dist/robots.txt` 和 `dist/sitemap.xml` 正常输出
