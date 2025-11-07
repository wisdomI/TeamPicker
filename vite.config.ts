import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          // Export libraries will be dynamically imported, so they won't be in main bundle
        },
      },
    },
    chunkSizeWarningLimit: 600, // Increase limit slightly since we're code-splitting
  },
})

