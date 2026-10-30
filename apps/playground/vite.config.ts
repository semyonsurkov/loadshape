import { defineConfig, defaultClientConditions } from 'vite';
import react from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

// Условие source из exports библиотеки отдаёт исходники вместо dist, поэтому
// playground видит правки loadshape сразу, без параллельной сборки в watch.
export default defineConfig({
  base: process.env.PLAYGROUND_BASE_PATH ?? '/',
  plugins: [tanstackRouter({ target: 'react', autoCodeSplitting: true }), react()],
  resolve: {
    conditions: ['source', ...defaultClientConditions],
  },
});
