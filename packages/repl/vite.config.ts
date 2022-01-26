import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker'
import svgrPlugin from 'vite-plugin-svgr'
import colors from 'tailwindcss/colors'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), checker({ typescript: true }), svgrPlugin()],
  esbuild: {},
  define: {
    'process.env': {},
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          '@font-size-base': '13px',
          '@primary-color': colors.blue['600'],
          '@body-background': colors.stone['800'],
          '@component-background': colors.stone['800'],
          '@border-radius-base': '4px',
          '@border-color-base': colors.gray['400'],
          '@text-color': colors.gray['100'],
          '@label-color': colors.gray['100'],
        },
      },
    },
  },
})
