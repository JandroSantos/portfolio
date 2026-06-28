import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Vendor splitting: long-cached chunks the browser keeps between deploys.
    rollupOptions: {
      output: {
        advancedChunks: {
          groups: [
            { name: 'react', test: /node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\// },
            { name: 'motion', test: /node_modules\/(framer-motion|motion-dom|motion-utils)\// },
            { name: 'icons', test: /node_modules\/lucide-react\// },
          ],
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
})
