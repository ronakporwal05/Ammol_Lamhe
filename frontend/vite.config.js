import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Frontend src alias
      '@': path.resolve(__dirname, './src'),
      // Cross-folder aliases
      '@backend': path.resolve(__dirname, '../backend'),
      '@ai': path.resolve(__dirname, '../ai'),
      // Ensure npm packages used by backend/ and ai/ resolve from frontend/node_modules
      'firebase': path.resolve(__dirname, 'node_modules/firebase'),
      'face-api.js': path.resolve(__dirname, 'node_modules/face-api.js'),
    },
  },
  server: {
    fs: {
      // Allow serving files from backend/ and ai/ folders (outside frontend root)
      allow: [
        path.resolve(__dirname, '..'),
      ],
    },
  },
})
