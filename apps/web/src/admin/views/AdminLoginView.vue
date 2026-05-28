<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="login-card__title">山海阁</h1>
      <p class="login-card__subtitle">后台管理</p>

      <form class="login-card__form" @submit.prevent="handleLogin">
        <div class="login-card__field">
          <input
            v-model="username"
            type="text"
            class="login-card__input"
            placeholder="账号"
            autocomplete="username"
          />
        </div>
        <div class="login-card__field">
          <input
            v-model="password"
            type="password"
            class="login-card__input"
            placeholder="密码"
            autocomplete="current-password"
          />
        </div>

        <p v-if="error" class="login-card__error">{{ error }}</p>

        <button type="submit" class="login-card__btn" :disabled="loading">
          {{ loading ? '验证中…' : '入阁' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
// 管理员登录页：账号密码验证 + token 管理
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAdminStore } from '../store.js';

const router = useRouter();
const route = useRoute();
const adminStore = useAdminStore();

const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

function handleLogin() {
  if (!username.value || !password.value) {
    error.value = '请输入账号和密码';
    return;
  }
  loading.value = true;
  error.value = '';
  adminStore.login(username.value, password.value)
    .then(() => {
      const redirect = route.query.redirect || '/admin';
      router.push(redirect);
    })
    .catch((err) => {
      error.value = (err && err.message) ? err.message : '登录失败，请重试';
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>

<style scoped>
.login-page {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  width: 380px;
  padding: 48px 40px 40px;
  background: rgba(245, 240, 232, 0.9);
  border: 1px solid rgba(58, 47, 40, 0.15);
  border-radius: 8px;
  box-shadow:
    0 0 0 2px rgba(58, 47, 40, 0.03),
    0 8px 32px rgba(58, 47, 40, 0.12);
  font-family: var(--font-ink);
  text-align: center;
}

.login-card__title {
  font-size: 28px;
  font-weight: 700;
  color: #C41E1E;
  letter-spacing: 0.1em;
  margin: 0 0 4px;
}

.login-card__subtitle {
  font-size: 14px;
  color: rgba(58, 47, 40, 0.4);
  margin: 0 0 36px;
  letter-spacing: 0.08em;
}

.login-card__form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login-card__input {
  width: 100%;
  padding: 12px 16px;
  font-family: var(--font-ink);
  font-size: 15px;
  color: #3a2f28;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(58, 47, 40, 0.15);
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s;
}

.login-card__input:focus {
  border-color: rgba(196, 30, 30, 0.3);
}

.login-card__input::placeholder {
  color: rgba(58, 47, 40, 0.25);
}

.login-card__error {
  margin: 0;
  font-size: 13px;
  color: #C41E1E;
  text-align: left;
}

.login-card__btn {
  margin-top: 8px;
  padding: 12px 0;
  font-family: var(--font-ink);
  font-size: 17px;
  font-weight: 600;
  color: #fff;
  background: #C41E1E;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  letter-spacing: 0.08em;
  transition: background 0.3s;
}

.login-card__btn:hover { background: #a01818; }
.login-card__btn:disabled { opacity: 0.5; cursor: default; }
</style>
