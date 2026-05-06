/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const buildDate = new Date()
const pad = (n: number) => String(n).padStart(2, '0')
const buildVersion = `${String(buildDate.getFullYear()).slice(2)}.${pad(buildDate.getMonth() + 1)}.${pad(buildDate.getDate())}.${pad(buildDate.getHours())}${pad(buildDate.getMinutes())}`

export default defineConfig({
  base: '/nakama-words/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Palabra Hunter',
        short_name: 'Palabra Hunter',
        description: 'Hunt Spanish words — pirate style!',
        theme_color: '#0a2240',
        background_color: '#0a2240',
        display: 'standalone',
        orientation: 'portrait',
        icons: [{ src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
      },
    }),
  ],
  define: {
    __BUILD_VERSION__: JSON.stringify(buildVersion),
  },
  test: {
    globals: true,
    environment: 'node',
  },
})
