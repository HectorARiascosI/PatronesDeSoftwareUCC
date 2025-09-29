import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,          // usar test, expect, describe sin import
    setupFiles: './src/setupTests.ts',
    environment: 'jsdom',   // necesario para testing-library
  },
});
