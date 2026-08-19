import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.ts'],
  },
});
