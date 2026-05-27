<template>
  <div class="page-wrap">
    <h2 class="page-wrap__title">关于我管理</h2>

    <div class="layout">
      <form class="about-form" @submit.prevent="handleSave">
        <label class="field">
          <span class="field__label">昵称</span>
          <input v-model="form.nickname" type="text" class="field__input" />
        </label>
        <label class="field">
          <span class="field__label">学校</span>
          <input v-model="form.school" type="text" class="field__input" />
        </label>
        <label class="field">
          <span class="field__label">头像</span>
          <div class="field__upload-row">
            <input v-model="form.avatarUrl" type="text" class="field__input" placeholder="URL 或上传" />
            <input type="file" accept="image/*" @change="onFile" />
            <button type="button" class="btn btn--sm" :disabled="!pendingFile || uploading" @click="uploadAvatar">
              {{ uploading ? '上传中…' : '上传' }}
            </button>
          </div>
        </label>
        <label class="field">
          <span class="field__label">GitHub URL</span>
          <input v-model="form.githubUrl" type="text" class="field__input" />
        </label>
        <label class="field">
          <span class="field__label">CSDN URL</span>
          <input v-model="form.csdnUrl" type="text" class="field__input" />
        </label>
        <label class="field">
          <span class="field__label">社交信息</span>
          <input v-model="form.social" type="text" class="field__input" placeholder="如：B站 / QQ 123456" />
        </label>
        <div class="form-actions">
          <button type="submit" class="btn btn--primary">保存</button>
          <span v-if="saved" class="form-actions__ok">已保存</span>
        </div>
      </form>

      <!-- 预览卡片 -->
      <div class="preview">
        <h3 class="preview__title">预览效果</h3>
        <div class="preview__card">
          <div class="preview__identity">
            <div class="preview__avatar" :style="avatarStyle" />
            <div class="preview__names">
              <span class="preview__nickname">{{ form.nickname || '—' }}</span>
              <span class="preview__school">{{ form.school || '—' }}</span>
            </div>
          </div>
          <span class="preview__seal">印</span>
          <hr class="preview__rule" />
          <div class="preview__section">
            <span class="preview__label">技术</span>
            <span class="preview__link">{{ form.githubUrl || '—' }}</span>
            <span class="preview__link">{{ form.csdnUrl || '—' }}</span>
          </div>
          <hr class="preview__rule" />
          <div class="preview__section">
            <span class="preview__label">媒体</span>
            <span class="preview__social">{{ form.social || '—' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { getAbout, updateAbout } from '@/services/api/about.js';
import { uploadImage } from '@/services/api/admin.js';

const form = reactive({
  nickname: '', school: '', avatarUrl: '', githubUrl: '', csdnUrl: '', social: '',
});
const saved = ref(false);
const pendingFile = ref(null);
const uploading = ref(false);

const avatarStyle = computed(() => ({
  backgroundImage: form.avatarUrl ? `url(${imgUrl(form.avatarUrl)})` : '',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

function imgUrl(url) {
  return url.startsWith('http') ? url : 'http://localhost:3000' + url;
}

function load() {
  getAbout(
    (res) => { if (res.data) Object.assign(form, res.data); },
    () => {},
  );
}

function handleSave() {
  updateAbout({ ...form }, () => {
    saved.value = true;
    setTimeout(() => { saved.value = false; }, 2000);
  }, () => {});
}

function onFile(e) { pendingFile.value = e.target.files[0] || null; }

function uploadAvatar() {
  if (!pendingFile.value) return;
  uploading.value = true;
  const fd = new FormData();
  fd.append('file', pendingFile.value);
  uploadImage(fd,
    (res) => {
      form.avatarUrl = res.data.url;
      pendingFile.value = null;
      uploading.value = false;
    },
    () => { uploading.value = false; },
  );
}

onMounted(load);
</script>

<style scoped>
.page-wrap__title { font-family: var(--font-ink); font-size: 24px; font-weight: 600; color: #3a2f28; margin: 0 0 24px; letter-spacing: 0.06em; }

.layout { display: grid; grid-template-columns: 1fr 320px; gap: 32px; align-items: flex-start; }

.about-form { display: flex; flex-direction: column; gap: 14px; }

.field { display: flex; flex-direction: column; gap: 4px; }
.field__label { font-family: var(--font-ink); font-size: 13px; color: rgba(58, 47, 40, 0.5); }
.field__input {
  font-family: var(--font-ink); font-size: 14px; padding: 8px 12px; color: #3a2f28;
  background: rgba(255,255,255,0.7); border: 1px solid rgba(58, 47, 40, 0.12); border-radius: 4px; outline: none;
}
.field__input:focus { border-color: rgba(196, 30, 30, 0.25); }
.field__upload-row { display: flex; gap: 8px; align-items: center; }
.field__upload-row input[type="file"] { font-family: var(--font-ink); font-size: 12px; width: 100px; }

.form-actions { display: flex; align-items: center; gap: 12px; margin-top: 4px; }
.form-actions__ok { font-family: var(--font-ink); font-size: 13px; color: rgba(58, 47, 40, 0.4); }

.preview {
  position: sticky; top: 32px;
  background: rgba(245, 240, 232, 0.6); border: 1px solid rgba(58, 47, 40, 0.1);
  border-radius: 8px; padding: 20px;
}
.preview__title { font-family: var(--font-ink); font-size: 14px; font-weight: 500; color: rgba(58, 47, 40, 0.4); margin: 0 0 16px; letter-spacing: 0.06em; }
.preview__card {
  position: relative; padding: 16px 14px;
  background: rgba(245, 240, 232, 0.75); border: 1px solid rgba(58, 47, 40, 0.15);
  border-radius: 4px; font-family: var(--font-ink); color: #3a2f28;
  box-shadow: 0 0 0 3px rgba(58, 47, 40, 0.03), 1px 2px 8px rgba(58, 47, 40, 0.08);
}
.preview__identity { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.preview__avatar {
  width: 44px; aspect-ratio: 1; border-radius: 50%;
  background: linear-gradient(135deg, #d4c8b0, #e8ddd0);
  border: 1.5px solid rgba(58, 47, 40, 0.25); flex-shrink: 0;
}
.preview__names { display: flex; flex-direction: column; gap: 2px; }
.preview__nickname { font-size: 16px; font-weight: 600; line-height: 1; }
.preview__school { font-size: 11px; color: rgba(58, 47, 40, 0.5); }
.preview__seal {
  position: absolute; top: 10px; right: 10px; width: 28px; aspect-ratio: 1;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; font-weight: 700; color: #C41E1E;
  border: 1.5px solid #C41E1E; border-radius: 2px; opacity: 0.55;
  transform: rotate(8deg); pointer-events: none;
}
.preview__rule { width: 100%; height: 1px; border: 0; margin: 8px 0;
  background: linear-gradient(90deg, transparent, rgba(58,47,40,0.12) 30%, rgba(58,47,40,0.12) 70%, transparent); }
.preview__section { display: flex; flex-direction: column; gap: 2px; }
.preview__label { font-size: 10px; color: rgba(58, 47, 40, 0.4); letter-spacing: 0.06em; }
.preview__link { font-size: 11px; color: #3a2f28; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.preview__social { font-size: 11px; color: #3a2f28; }

.btn {
  font-family: var(--font-ink); font-size: 13px; padding: 6px 14px; border-radius: 4px;
  border: 1px solid rgba(58, 47, 40, 0.15); cursor: pointer; transition: all 0.2s;
  background: rgba(255,255,255,0.7); color: #3a2f28;
}
.btn:hover { background: rgba(58, 47, 40, 0.06); }
.btn--primary { background: #C41E1E; color: #fff; border-color: #C41E1E; }
.btn--primary:hover { background: #a01818; }
.btn--sm { padding: 4px 10px; font-size: 12px; }
.btn:disabled { opacity: 0.4; cursor: default; }
</style>
