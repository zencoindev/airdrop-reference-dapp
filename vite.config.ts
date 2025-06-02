import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

const branch = 'main';

const base = branch === 'main' ? '/airdrop-reference-dapp/' : `/airdrop-reference-dapp/${branch}/`

export default defineConfig({
  plugins: [nodePolyfills(), react()],
  server: {
    fs: {
      strict: false,
    },
  },
  base: '/',
})
