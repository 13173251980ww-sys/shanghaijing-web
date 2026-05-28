// 全局 Pinia 状态管理
import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    title: 'shanghaijing-web',
  }),
});
