import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const initiativePath = env.VITE_INITIATIVE
    ? `/${env.VITE_INITIATIVE}`
    : ''

  return {
    base: `${initiativePath}/utente/`,
    plugins: [react()],
    optimizeDeps: {
      force: true,
      include: [
        '@pagopa/mui-italia',
        '@pagopa/mui-italia/components/ButtonNaked',
        '@pagopa/mui-italia/components/MITextField',
        '@pagopa/mui-italia/components/MISwitch',
        '@pagopa/mui-italia/components/MIPaper',
        '@pagopa/mui-italia/components/MIChip',
        '@pagopa/mui-italia/components/FooterLegal',
        '@pagopa/mui-italia/components/FooterPostLogin',
        '@pagopa/mui-italia/components/HeaderAccount',
        '@pagopa/mui-italia/components/HeaderProduct'
      ]
    },
    build: {
      outDir: 'dist',
      sourcemap: mode === 'DEV',
    },
    define: {
      'process.env': {}
    }
  }
})