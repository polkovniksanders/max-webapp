import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // No web manifest — this is a mini-app, not an installable PWA
      manifest: false,
      workbox: {
        // Pre-cache all static assets (JS/CSS/HTML have content-hash filenames)
        globPatterns: ['**/*.{js,css,html,woff2}'],
        runtimeCaching: [
          {
            // Product images — served from api.spodial.com/storage/
            // StaleWhileRevalidate: respond instantly from cache, refresh in background
            urlPattern: /^https:\/\/api\.spodial\.com\/storage\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'product-images',
              expiration: {
                maxEntries: 300,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Google Fonts CSS (small, changes rarely)
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-css',
              expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 * 7 }, // 7 days
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Google Fonts binary files (woff2 — essentially static forever)
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-files',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
    server: {
        host: '0.0.0.0',
        port: 8080,
        strictPort: true,
        allowedHosts: ['localhost.berghub.ru'],
    },
  // В production/staging (сборка для GitLab Pages) используем subpath /spodialMaxApp/
  // В dev-режиме оставляем /, чтобы dev-сервер работал нормально
  base: process.env.NODE_ENV === 'production' ? '/spodialMaxApp/' : '/',
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
