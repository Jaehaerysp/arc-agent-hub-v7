/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Vitest reads its config from this same file so there's a single build
  // configuration to maintain. Test-only settings live under `test` and
  // have no effect on `vite build` / `vite dev`.
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
