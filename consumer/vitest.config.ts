import { defineConfig, mergeConfig } from 'vitest/config';
import { browserTests } from '../vitest.shared.ts';
import viteConfig from './vite.config.ts';

export default mergeConfig(
  viteConfig,
  mergeConfig(browserTests('consumer'), defineConfig({ optimizeDeps: { include: ['date-fns', 'date-fns/locale/de', 'zod', '@hookform/resolvers/zod'] } })),
);
