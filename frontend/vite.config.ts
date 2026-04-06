import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/items': 'http://localhost:8080',
      '/rent': 'http://localhost:8080'
    }
  },
  build: {
    outDir: '../src/main/webapp/static',
    emptyOutDir: true
  }
})
