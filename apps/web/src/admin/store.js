// 管理员 Pinia Store：token 管理、登录/退出、认证状态
import { defineStore } from 'pinia';
import { login as apiLogin, checkAuth as apiCheckAuth } from '@/services/api/admin.js';

const TOKEN_KEY = 'admin_token';

export const useAdminStore = defineStore('admin', {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY) || '',
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    login(username, password) {
      return new Promise((resolve, reject) => {
        apiLogin(
          { username, password },
          (res) => {
            this.token = res.data.token;
            localStorage.setItem(TOKEN_KEY, res.data.token);
            resolve(res);
          },
          (err) => reject(err),
        );
      });
    },
    logout() {
      this.token = '';
      localStorage.removeItem(TOKEN_KEY);
    },
    checkAuth() {
      return new Promise((resolve, reject) => {
        apiCheckAuth(
          () => resolve(),
          (err) => {
            this.logout();
            reject(err);
          },
        );
      });
    },
  },
});
