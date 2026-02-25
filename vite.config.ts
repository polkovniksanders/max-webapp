import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  // В production (сборка для GitHub Pages) используем subpath /max-webapp/
  // В dev-режиме оставляем /, чтобы dev-сервер работал нормально
  base: process.env.NODE_ENV === 'production' ? '/max-webapp/' : '/',
  resolve: {
    alias: {
      '@app': resolve(__dirname, 'src/app'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@widgets': resolve(__dirname, 'src/widgets'),
      '@features': resolve(__dirname, 'src/features'),
      '@entities': resolve(__dirname, 'src/entities'),
      '@shared': resolve(__dirname, 'src/shared'),
    },
  },
})
