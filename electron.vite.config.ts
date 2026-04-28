import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    sourcemap: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './packages/renderer/src'),
      '@shared': path.resolve(__dirname, './src'),
    },
  },
  define: {
    __VITE_APP_VERSION__: JSON.stringify('1.0.0'),
  },
})
