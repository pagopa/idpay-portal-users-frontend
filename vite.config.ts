import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/utente/', // <-- importante per il deploy su un path
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
