import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'browser-src',
  base: './',
  build: {
    outDir: '../docs',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'browser-src/index.html'),
      },
    },
  },
  server: {
    port: 3001,
    open: true,
  },
});
