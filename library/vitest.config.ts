import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    name: 'library',
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
