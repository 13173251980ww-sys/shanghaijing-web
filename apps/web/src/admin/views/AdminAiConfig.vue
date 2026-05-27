<template>
  <div class="page-wrap">
    <h2 class="page-wrap__title">AI 配置</h2>
    <p class="page-wrap__desc">管理 AI 书灵聊天的 API 密钥与模型参数，当前仅支持 DeepSeek。</p>

    <form class="config-form" @submit.prevent="handleSave">
      <label class="field">
        <span class="field__label">DeepSeek API Key</span>
        <div class="field__input-row">
          <input
            v-model="form.apiKey"
            :type="showKey ? 'text' : 'password'"
            class="field__input"
            placeholder="sk-..."
            autocomplete="off"
          />
          <button type="button" class="btn btn--sm" @click="showKey = !showKey">
            {{ showKey ? '隐藏' : '显示' }}
          </button>
        </div>
        <span class="field__hint">用于调用 DeepSeek Chat API，密钥将加密存储在数据库中</span>
      </label>

      <label class="field">
        <span class="field__label">模型</span>
        <input
          v-model="form.model"
          type="text"
          class="field__input"
          placeholder="deepseek-chat"
        />
        <span class="field__hint">DeepSeek 模型名称，默认 deepseek-chat</span>
      </label>

      <div class="field">
        <span class="field__label">当前状态</span>
        <span v-if="loading" class="status-dot status-dot--loading">检测中…</span>
        <span v-else-if="configured" class="status-dot status-dot--ok">已配置</span>
        <span v-else class="status-dot status-dot--none">未配置</span>
        <span class="field__hint">
          未配置时，书灵对话将使用环境变量中的 DEEPSEEK_API_KEY
        </span>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn--primary" :disabled="saving">
          {{ saving ? '保存中…' : '保存' }}
        </button>
        <span v-if="saved" class="form-actions__ok">已保存</span>
        <span v-if="error" class="form-actions__err">{{ error }}</span>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { getAiConfig, setAiConfig } from '@/services/api/admin.js';

const showKey = ref(false);
const loading = ref(true);
const saving = ref(false);
const saved = ref(false);
const error = ref('');

const form = reactive({
  apiKey: '',
  model: 'deepseek-chat',
});

const configured = computed(() => !!form.apiKey);

function load() {
  getAiConfig(
    (res) => {
      if (res.data) {
        form.apiKey = res.data.deepseek_api_key || '';
        form.model = res.data.deepseek_model || 'deepseek-chat';
      }
      loading.value = false;
    },
    () => { loading.value = false; },
  );
}

function handleSave() {
  saving.value = true;
  error.value = '';
  saved.value = false;

  let count = 0;
  let total = 2;

  const checkDone = () => {
    count++;
    if (count >= total) {
      saving.value = false;
      saved.value = true;
      setTimeout(() => { saved.value = false; }, 2000);
    }
  };

  setAiConfig('deepseek_api_key', form.apiKey.trim(),
    () => checkDone(),
    (err) => { error.value = (err && err.message) || '保存失败'; checkDone(); },
  );

  setAiConfig('deepseek_model', form.model.trim() || 'deepseek-chat',
    () => checkDone(),
    (err) => { error.value = (err && err.message) || '保存失败'; checkDone(); },
  );
}

onMounted(load);
</script>

<style scoped>
.page-wrap__title {
  font-family: var(--font-ink);
  font-size: 24px;
  font-weight: 600;
  color: #3a2f28;
  margin: 0 0 8px;
  letter-spacing: 0.06em;
}

.page-wrap__desc {
  font-family: var(--font-ink);
  font-size: 13px;
  color: rgba(58, 47, 40, 0.45);
  margin: 0 0 28px;
  letter-spacing: 0.04em;
}

.config-form {
  max-width: 560px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field__label {
  font-family: var(--font-ink);
  font-size: 13px;
  color: rgba(58, 47, 40, 0.55);
  font-weight: 500;
  letter-spacing: 0.04em;
}

.field__input {
  font-family: var(--font-ink);
  font-size: 14px;
  padding: 8px 12px;
  color: #3a2f28;
  background: rgba(255,255,255,0.7);
  border: 1px solid rgba(58, 47, 40, 0.12);
  border-radius: 4px;
  outline: none;
  transition: border-color 0.2s;
}

.field__input:focus {
  border-color: rgba(196, 30, 30, 0.25);
}

.field__input::placeholder {
  color: rgba(58, 47, 40, 0.2);
}

.field__input-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.field__input-row .field__input {
  flex: 1;
}

.field__hint {
  font-family: var(--font-ink);
  font-size: 11px;
  color: rgba(58, 47, 40, 0.3);
  letter-spacing: 0.03em;
}

.status-dot {
  font-family: var(--font-ink);
  font-size: 13px;
}

.status-dot--loading { color: rgba(58, 47, 40, 0.35); }
.status-dot--ok { color: #2e7d32; }
.status-dot--none { color: #C41E1E; }

.form-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
}

.form-actions__ok {
  font-family: var(--font-ink);
  font-size: 13px;
  color: #2e7d32;
}

.form-actions__err {
  font-family: var(--font-ink);
  font-size: 13px;
  color: #C41E1E;
}

.btn {
  font-family: var(--font-ink);
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 4px;
  border: 1px solid rgba(58, 47, 40, 0.15);
  cursor: pointer;
  transition: all 0.2s;
  background: rgba(255,255,255,0.7);
  color: #3a2f28;
}

.btn:hover {
  background: rgba(58, 47, 40, 0.06);
}

.btn--primary {
  background: #C41E1E;
  color: #fff;
  border-color: #C41E1E;
}

.btn--primary:hover { background: #a01818; }
.btn--sm { padding: 4px 10px; font-size: 12px; }
.btn:disabled { opacity: 0.4; cursor: default; }
</style>
