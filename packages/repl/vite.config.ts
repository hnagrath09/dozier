import * as path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker'
import svgrPlugin from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), checker({ typescript: true }), svgrPlugin(), tsconfigPaths()],
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
