// C:\Users\qweio\travel-guide\vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 📌 最終修正：明確設定基礎路徑為根目錄。
  // 這是解決 Vercel 上樣式/腳本連結錯誤的關鍵。
  base: '/', 
  css: {
    // 明確告訴 Vite 使用 .cjs 版本的 PostCSS config
    // 這確保了在各種 Node 環境中都能正確找到 Tailwind
    postcss: './postcss.config.cjs',
  }
})