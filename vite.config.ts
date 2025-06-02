import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { execSync } from 'child_process'

const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()

const base = '/airdrop-reference-dapp/';

export default defineConfig({
  plugins: [nodePolyfills(), react()],
  base
})
