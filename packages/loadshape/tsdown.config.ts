import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/styles.css'],
  format: 'esm',
  platform: 'neutral',
  dts: true,
  css: {
    fileName: 'styles.css',
  },
});
