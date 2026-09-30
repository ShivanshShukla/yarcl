import { defineConfig } from '@yarcl/react/define';
import defaults from '@yarcl/react/defaults';

export default defineConfig({
  ...defaults,
  colors: {
    ...defaults.colors,
    packageAccent: { light: '#4338ca', dark: '#a5b4fc' },
  },
  defaults: { ...defaults.defaults, color: 'packageAccent' },
});
