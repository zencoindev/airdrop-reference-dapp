import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

const base = '/airdrop-reference-dapp/';

export default defineConfig({
  plugins: [nodePolyfills(), react()],
  base
})
