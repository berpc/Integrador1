import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Buscador de Libros',
        short_name: 'Libros',
        description: 'Buscá y guardá tus libros favoritos',
        theme_color: '#f97316',
        background_color: '#0b0f1a',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ],
        screenshots: [
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', form_factor: 'wide', label: 'Buscador de Libros' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', label: 'Buscador de Libros' }
        ]
      }
    })
  ],
})
