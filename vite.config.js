import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // 🔑 EXACT public URL where the files live
  base: '/wp-content/uploads/classle/v2/',

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    cssCodeSplit: false,
    target: 'es2017',
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        manualChunks: undefined,
      },
    },
  },
})