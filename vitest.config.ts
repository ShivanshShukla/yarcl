import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: ['library/vitest.config.ts', 'consumer/vitest.config.ts', 'e2e/consumer/vitest.config.ts'],
  },
});
