import { defineConfig } from 'vite';
import { resolve } from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('./package.json');

export default defineConfig({
  root: 'browser-src',
  base: './',
  build: {
    outDir: '../docs',
    emptyOutDir: false,
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
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
});
