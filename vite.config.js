import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/VisualAPL-Staging/',
  plugins: [react()],
})
