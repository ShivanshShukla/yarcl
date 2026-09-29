import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import yarcl from '@yarcl/react/vite';

export default defineConfig({
  plugins: [react(), yarcl({ config: 'src/yarcl.config.ts' })],
});
