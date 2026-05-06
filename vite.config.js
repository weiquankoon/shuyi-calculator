import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  // 开发服务器配置
  server: {
    port: 5500,
    open: true,
  },
  // 多页面入口
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        flow: resolve(__dirname, 'flow.html'),
        login: resolve(__dirname, 'login.html'),
      },
    },
  },
});
