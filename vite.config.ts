import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import type { ConfigEnv, UserConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd())

  // 根据不同环境设置不同的baseUrl
  const BASE_URL = mode === 'production' ? '/vue3-test/' : '/'

  // API基础URL
  const API_BASE_URL = env.VITE_BASE_URL || 'https://dev.178778.xyz'

  return {
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    base: BASE_URL,
    define: {
      // 将环境变量传递给应用
      __APP_ENV__: JSON.stringify(env.APP_ENV || 'development'),
      __API_BASE_URL__: JSON.stringify(API_BASE_URL),
    },
    server: {
      // 开发服务器配置
      port: 3000,
      open: true,
      cors: true,
      host: 'localhost',
      proxy: {
        '/demo': {
          target: API_BASE_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/demo/, '')
        },
      }
    },
    build: {
      // 优化构建输出
      outDir: 'dist',
      sourcemap: false,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            'element-plus': ['element-plus'],
            'vendor': ['vue', 'vue-router', 'pinia']
          }
        }
      }
    },
    esbuild: {
      // pure: mode === 'production' ? ['console.log', 'debugger'] : []
      drop: ['console', 'debugger'],
    }
  }
})
