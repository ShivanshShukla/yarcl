import { defineConfig } from '@yarcl/react/define';
import defaults from '@yarcl/react/defaults';
import { brand } from './palette.ts';

export default defineConfig({
  ...defaults,
  colors: { ...defaults.colors, brand },
  defaults: { ...defaults.defaults, color: 'brand' },
});
