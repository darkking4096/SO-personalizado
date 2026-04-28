import { defineConfig } from 'electron-vite'
import path from 'path'

export default defineConfig({
  main: {
    entry: 'packages/main/src/main.ts',
    vite: {
      build: {
        lib: {
          entry: path.resolve(__dirname, 'packages/main/src/main.ts'),
          formats: ['cjs'],
        },
        rollupOptions: {
          external: ['electron'],
        },
      },
    },
  },
  preload: {
    entry: 'packages/main/src/preload.ts',
    vite: {
      build: {
        lib: {
          entry: path.resolve(__dirname, 'packages/main/src/preload.ts'),
          formats: ['cjs'],
        },
        rollupOptions: {
          external: ['electron'],
        },
      },
    },
  },
  renderer: {
    root: 'packages/renderer',
    env: {
      VITE_APP_VERSION: 'v1.0.0',
    },
    build: {
      sourcemap: false,
      rollupOptions: {
        input: path.resolve(__dirname, 'packages/renderer/index.html'),
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './packages/renderer/src'),
      },
    },
  },
})
