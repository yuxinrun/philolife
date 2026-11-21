import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 项目站点部署在 /philolife/ 子路径下。
// 使用相对 base，使本地预览、子路径部署与自定义域名都能正确解析静态资源。
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 900,
  },
})
