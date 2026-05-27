<template>
  <div class="page-wrap">
    <h2 class="page-wrap__title">API 接口文档</h2>

    <section class="section">
      <h3 class="section__title">错误状态码</h3>
      <div class="err-grid">
        <div v-for="ec in errorCodes" :key="ec.code" class="err-card" :class="errClass(ec.status)">
          <span class="err-card__code">{{ ec.code }}</span>
          <span class="err-card__label">{{ ec.label }}</span>
          <span class="err-card__status">HTTP {{ ec.status }}</span>
        </div>
      </div>
    </section>

    <section class="section">
      <h3 class="section__title">接口列表</h3>
      <table class="doc-table" v-if="endpoints.length">
        <thead>
          <tr>
            <th>方法</th>
            <th>路径</th>
            <th>认证</th>
            <th>说明</th>
            <th>可能错误码</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ep, i) in endpoints" :key="i">
            <td><span class="method" :class="'method--' + ep.method.toLowerCase()">{{ ep.method }}</span></td>
            <td class="path-cell">{{ ep.path }}</td>
            <td><span class="auth-tag" :class="ep.auth ? 'auth-tag--yes' : 'auth-tag--no'">{{ ep.auth ? '需认证' : '公开' }}</span></td>
            <td>{{ ep.desc }}</td>
            <td>
              <span v-if="ep.errors.length" class="err-tags">
                <span v-for="c in ep.errors" :key="c" class="err-tags__tag">{{ c }}</span>
              </span>
              <span v-else class="err-tags--none">—</span>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="empty">加载中…</p>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getApiDocs } from '@/services/api/admin.js';

const endpoints = ref([]);
const errorCodes = ref([]);

function errClass(status) {
  if (status === 400) return 'err-card--warn';
  if (status === 401) return 'err-card--auth';
  if (status === 404) return 'err-card--info';
  if (status >= 500) return 'err-card--danger';
  return '';
}

onMounted(() => {
  getApiDocs(
    (res) => {
      endpoints.value = res.data.endpoints;
      errorCodes.value = res.data.errorCodes;
    },
    () => {},
  );
});
</script>

<style scoped>
.page-wrap__title { font-family: var(--font-ink); font-size: 24px; font-weight: 600; color: #3a2f28; margin: 0 0 28px; letter-spacing: 0.06em; }

.section { margin-bottom: 32px; }
.section__title { font-family: var(--font-ink); font-size: 16px; font-weight: 600; color: rgba(58, 47, 40, 0.65); margin: 0 0 14px; letter-spacing: 0.06em; }

/* 错误码卡片 */
.err-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
.err-card {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px; border-radius: 6px;
  background: rgba(245, 240, 232, 0.6); border: 1px solid rgba(58, 47, 40, 0.08);
  font-family: var(--font-ink);
}
.err-card__code { font-size: 14px; font-weight: 700; min-width: 52px; }
.err-card__label { font-size: 13px; color: #3a2f28; flex: 1; }
.err-card__status { font-size: 11px; color: rgba(58, 47, 40, 0.35); }

.err-card--warn { border-left: 3px solid #d4a017; }
.err-card--warn .err-card__code { color: #b8860b; }
.err-card--auth { border-left: 3px solid #C41E1E; }
.err-card--auth .err-card__code { color: #C41E1E; }
.err-card--info { border-left: 3px solid #4a7fb5; }
.err-card--info .err-card__code { color: #3a6d96; }
.err-card--danger { border-left: 3px solid #cc3300; }
.err-card--danger .err-card__code { color: #cc3300; }

/* 接口表格 */
.doc-table { width: 100%; border-collapse: collapse; font-family: var(--font-ink); font-size: 13px; }
.doc-table th {
  text-align: left; padding: 10px 12px; font-weight: 600; font-size: 12px;
  color: rgba(58, 47, 40, 0.45); letter-spacing: 0.05em;
  border-bottom: 1px solid rgba(58, 47, 40, 0.1);
}
.doc-table td { padding: 10px 12px; color: #3a2f28; border-bottom: 1px solid rgba(58, 47, 40, 0.05); }
.doc-table tbody tr:hover { background: rgba(196, 30, 30, 0.025); }

.path-cell { font-family: 'Courier New', monospace; font-size: 12px; color: #5a4a3a; }

.method {
  display: inline-block; min-width: 44px; text-align: center;
  padding: 2px 8px; border-radius: 3px; font-size: 11px; font-weight: 700; letter-spacing: 0.05em;
}
.method--get { background: #e8f5e9; color: #2e7d32; }
.method--post { background: #e3f2fd; color: #1565c0; }
.method--put { background: #fff3e0; color: #e65100; }
.method--delete { background: #fce4ec; color: #c62828; }

.auth-tag { font-size: 11px; padding: 2px 8px; border-radius: 3px; }
.auth-tag--yes { background: rgba(196, 30, 30, 0.08); color: #C41E1E; }
.auth-tag--no { background: rgba(58, 47, 40, 0.05); color: rgba(58, 47, 40, 0.4); }

.err-tags { display: flex; gap: 4px; flex-wrap: wrap; }
.err-tags__tag { font-size: 10px; padding: 2px 6px; border-radius: 3px; font-weight: 600; background: rgba(58, 47, 40, 0.06); color: rgba(58, 47, 40, 0.5); }
.err-tags--none { font-size: 12px; color: rgba(58, 47, 40, 0.2); }

.empty { font-family: var(--font-ink); color: rgba(58, 47, 40, 0.35); text-align: center; padding: 60px 0; }
</style>
