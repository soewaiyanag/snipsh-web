import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Tests must not depend on an uncommitted .env file.
    env: {
      VITE_API_URL: 'http://localhost:3000',
      VITE_SHORT_DOMAIN: 'http://localhost:3000',
      VITE_USE_MOCKS: 'false',
    },
  },
})
