import { defineConfig } from './define';
import defaults from './yarcl.config';

defineConfig({ ...defaults, colors: { ...defaults.colors, brand: { light: '#000', dark: '#fff' } } });

defineConfig({ ...defaults, components: { Grid: { gap: 'sm' } } });
defineConfig({
  ...defaults,
  components: {
    // @ts-expect-error unknown spacing
    Grid: { gap: 'missing' },
  },
});

defineConfig({
  ...defaults,
  // @ts-expect-error
  colors: { primary: { light: '#2d4bb8' } },
});

defineConfig({
  ...defaults,
  // @ts-expect-error
  defaults: { ...defaults.defaults, size: 'xxl' },
});

defineConfig({
  ...defaults,
  // @ts-expect-error
  focusRing: { ...defaults.focusRing, color: 'nope' },
});

defineConfig({
  ...defaults,
  typography: {
    ...defaults.typography,
    // @ts-expect-error
    fonts: { ...defaults.typography.fonts, body: 'serif' },
  },
});

defineConfig({
  ...defaults,
  typography: {
    ...defaults.typography,
    // @ts-expect-error
    styles: { body: { family: 'serif', size: '1rem', weight: 400, lineHeight: 1.5 } },
  },
});

defineConfig({
  ...defaults,
  // @ts-expect-error
  radii: { ...defaults.radii, 'extra round': '2rem' },
});

defineConfig({
  ...defaults,
  zIndex: { ...defaults.zIndex, banner: 900 },
  neutrals: { ...defaults.neutrals, raised: { light: '#fff', dark: '#222' } },
});

defineConfig({
  ...defaults,
  // @ts-expect-error
  zIndex: { dropdown: 1000, tooltip: 1100, dialog: 1200 },
});

defineConfig({
  ...defaults,
  variants: { ...defaults.variants, link: { background: 'none', border: 'none', text: 'color' } },
});

defineConfig({
  ...defaults,
  // @ts-expect-error
  variants: { solid: { background: 'gradient', border: 'color', text: 'on' } },
});

defineConfig({
  ...defaults,
  // @ts-expect-error
  defaults: { ...defaults.defaults, errorColor: 'red' },
});

defineConfig({
  ...defaults,
  // @ts-expect-error
  defaults: { ...defaults.defaults, textStyle: 'huge' },
});

defineConfig({
  ...defaults,
  // @ts-expect-error
  defaults: { ...defaults.defaults, gap: 'tight' },
});

defineConfig({
  ...defaults,
  // @ts-expect-error
  defaults: { ...defaults.defaults, softVariant: 'subtle' },
});

defineConfig({
  ...defaults,
  typography: {
    ...defaults.typography,
    fontFaces: [{ family: 'Inter', src: ['/fonts/inter.woff2', 'local(Inter)'], weight: '100 900' }],
  },
});

defineConfig({
  ...defaults,
  typography: {
    ...defaults.typography,
    // @ts-expect-error
    headings: { ...defaults.typography.headings, h3: 'huge' },
  },
});

defineConfig({
  ...defaults,
  typography: {
    ...defaults.typography,
    // @ts-expect-error
    headings: { h1: 'display', h2: 'heading' },
  },
});

defineConfig({
  ...defaults,
  // @ts-expect-error
  defaults: { ...defaults.defaults, labelStyle: 'tiny' },
});

defineConfig({
  ...defaults,
  components: {
    Button: { radius: 'square', variant: 'outline' },
    IconButton: { radius: 'size' },
    Card: { padding: 'xl', shadow: 'lg' },
    Stack: { gap: 'sm' },
    Pagination: { size: 'sm', variant: 'outline', selectedVariant: 'solid' },
    Breadcrumb: { textStyle: 'caption', color: 'neutral' },
    Accordion: { size: 'sm', radius: 'size', color: 'success' },
    Label: { textStyle: 'label', color: 'success', variant: 'soft', size: 'sm', radius: 'rounded' },
  },
});

defineConfig({
  ...defaults,
  components: {
    // @ts-expect-error
    Pagination: { selectedVariant: 'filled' },
  },
});

defineConfig({
  ...defaults,
  components: {
    // @ts-expect-error
    Breadcrumb: { size: 'sm' },
  },
});

defineConfig({
  ...defaults,
  components: {
    // @ts-expect-error
    Breadcrumb: { textStyle: 'huge' },
  },
});

defineConfig({
  ...defaults,
  components: {
    // @ts-expect-error
    Accordion: { variant: 'solid' },
  },
});

defineConfig({
  ...defaults,
  components: {
    // @ts-expect-error
    Buton: { radius: 'square' },
  },
});

defineConfig({
  ...defaults,
  components: {
    // @ts-expect-error
    Card: { variant: 'solid' },
  },
});

defineConfig({
  ...defaults,
  components: {
    // @ts-expect-error
    Button: { radius: 'pill' },
  },
});

defineConfig({
  ...defaults,
  // @ts-expect-error
  radii: { ...defaults.radii, size: '1rem' },
});

defineConfig({ ...defaults, components: { CommandPalette: { size: 'lg', radius: 'size', color: 'danger' } } });

defineConfig({
  ...defaults,
  components: {
    Button: {
      allowedSizes: ['sm', 'md'],
      sizeOverrides: { sm: { paddingX: '0.875rem' }, md: {} },
    },
    Input: { allowedSizes: ['md'] },
  },
});

defineConfig({
  ...defaults,
  components: {
    // @ts-expect-error
    Button: { allowedSizes: [] },
  },
});

defineConfig({
  ...defaults,
  components: {
    // @ts-expect-error
    Button: { allowedSizes: ['huge'] },
  },
});

defineConfig({
  ...defaults,
  components: {
    // @ts-expect-error
    Button: { allowedSizes: ['sm'], size: 'md' },
  },
});

defineConfig({
  ...defaults,
  components: {
    // @ts-expect-error
    Button: { allowedSizes: ['sm'] },
  },
});

defineConfig({
  ...defaults,
  components: {
    Button: {
      // @ts-expect-error
      sizeOverrides: { huge: { height: '4rem' } },
    },
  },
});

defineConfig({
  ...defaults,
  components: {
    Button: {
      // @ts-expect-error
      sizeOverrides: { md: { paddingY: '1rem' } },
    },
  },
});

defineConfig({
  ...defaults,
  components: {
    Button: {
      allowedSizes: ['sm'],
      size: 'sm',
      // @ts-expect-error
      sizeOverrides: { md: { height: '3rem' } },
    },
  },
});

defineConfig({
  ...defaults,
  components: {
    // @ts-expect-error
    CommandPalette: { variant: 'solid' },
  },
});

defineConfig({ ...defaults, defaults: { ...defaults.defaults, radius: 'square' } });

defineConfig({
  ...defaults,
  modalSizes: { ...defaults.modalSizes, huge: '80rem' },
  components: { Dialog: { size: 'huge' }, Drawer: { size: 'sm' } },
});

defineConfig({
  ...defaults,
  components: {
    // @ts-expect-error
    Dialog: { size: 'giant' },
  },
});

defineConfig({ ...defaults, components: { Label: { textStyle: 'caption', color: 'neutral' } } });

defineConfig({
  ...defaults,
  components: {
    // @ts-expect-error
    Label: { textStyle: 'tiny' },
  },
});

defineConfig({
  ...defaults,
  components: {
    // @ts-expect-error
    Label: { size: 'gigantic' },
  },
});

defineConfig({
  ...defaults,
  // @ts-expect-error
  defaults: { ...defaults.defaults, modalSize: 'giant' },
});

defineConfig({
  ...defaults,
  colors: { ...defaults.colors, primary: { light: '#2d4bb8', dark: '#8aa2ff', text: { light: '#1e3480', dark: '#c3cfff' } } },
});

defineConfig({
  ...defaults,
  components: { Progress: { size: 'lg', color: 'success', radius: 'rounded' } },
});

defineConfig({
  ...defaults,
  components: {
    Avatar: { size: 'lg', radius: 'rounded', color: 'success', variant: 'outline' },
    AvatarGroup: { size: 'sm', radius: 'size', color: 'neutral', variant: 'soft' },
    EmptyState: { color: 'neutral', gap: 'sm', padding: 'lg', textStyle: 'body' },
  },
});

defineConfig({
  ...defaults,
  components: {
    // @ts-expect-error
    Avatar: { padding: 'md' },
  },
});

defineConfig({
  ...defaults,
  components: {
    // @ts-expect-error
    EmptyState: { radius: 'md' },
  },
});

defineConfig({
  ...defaults,
  components: {
    // @ts-expect-error
    Progress: { variant: 'solid' },
  },
});
