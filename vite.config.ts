import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  base: '/utente/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: mode === 'DEV',
  },
  define: {
    'process.env': {}
  }
}))