import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Served from https://earthwisegrounding.github.io/jacob-troit/
export default defineConfig({
  plugins: [react()],
  base: '/jacob-troit/',
})
