import * as path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker'
import svgrPlugin from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), checker({ typescript: true }), svgrPlugin()],
  esbuild: {},
  resolve: {
    alias: [{ find: /^~/, replacement: path.join(__dirname, '../../node_modules', '/') }],
  },
  define: {
    'process.env': {},
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
})
