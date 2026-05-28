// Vite 构建配置：Vue 插件、路径别名、开发代理
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),  // @ 别名指向 src 目录
    },
  },
  server: {
    port: 5173,
    proxy: {
      // 开发环境代理：将 /api 和 /uploads 请求转发到后端 3000 端口
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
