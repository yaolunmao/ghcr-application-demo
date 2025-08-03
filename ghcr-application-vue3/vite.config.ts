import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: '0.0.0.0', // 监听所有地址
    port: 5173,
    proxy: {
      '/api': {
        // 目标不再是 localhost，而是后端的服务名
        // 端口是后端容器内部正在监听的端口 (3000)
        target: 'http://ghcr-application-fastify:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
