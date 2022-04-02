// vite.config.js
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/index.js'),
      name: 'MyLib',
      fileName: (format) => `my-lib.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['kuroshiro', 'kuroshiro-analyzer-kuromoji'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {

        },
      },
    },
  },
});
