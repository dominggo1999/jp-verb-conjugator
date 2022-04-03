// vite.config.js

const path = require('path');
const { defineConfig } = require('vite');
const commonjs = require('@rollup/plugin-commonjs');

module.exports = defineConfig({
  plugins: [
    commonjs({
      transformMixedEsModules: true,
    }),
  ],
  build: {
    minify: true,
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, 'lib/index.js'),
      name: 'MyLib',
      fileName: (format) => {
        return format === 'es' ? 'my-lib.mjs' : 'my-lib.cjs';
      },
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['kuroshiro', 'kuroshiro-analyzer-kuromoji'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          kuroshiro: 'kuroshiro',
          'kuroshiro-analyzer-kuromoji': 'kuroshiro-analyzer-kuromoji',
        },
        exports: 'named',
      },
    },
  },
});
