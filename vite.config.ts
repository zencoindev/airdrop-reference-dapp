import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'

const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()

const base = branch === 'master' ? '/airdrop-reference-dapp/' : `/airdrop-reference-dapp/${branch}/`

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  // это важно, чтобы Vercel не ломал роутинг
  server: {
    fs: {
      strict: false,
    },
  }
})
