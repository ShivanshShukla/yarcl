import { defineConfig } from '../define';
import defaults from '../yarcl.config';
import type { ThemeContract } from './contract';

const glow = (geometry: string, alpha: number) =>
  `${geometry} light-dark(rgb(91 33 182 / ${alpha}), rgb(0 0 0 / ${Math.min(alpha * 5, 0.7)}))`;

/** Friendly and airy: violet on lavender, pill-shaped controls, rounded cards, large targets, soft tinted shadows. */
export const bloom = defineConfig({
  ...defaults,
  colors: {
    primary: { light: '#7c3aed', dark: '#c4b5fd' },
    neutral: { light: '#6b6485', dark: '#b5aecf' },
    success: { light: '#0f8a5f', dark: '#5eead4' },
    warning: { light: '#c2410c', dark: '#fdba74' },
    danger: { light: '#e11d48', dark: '#fb7185' },
    info: { light: '#0369a1', dark: '#7dd3fc' },
  },
  neutrals: {
    bg: { light: '#f7f4ff', dark: '#14111f' },
    surface: { light: '#ffffff', dark: '#1f1a30' },
    text: { light: '#2a2540', dark: '#efeafc' },
    muted: { light: '#6b6485', dark: '#aaa3c4' },
    border: { light: '#e6dff7', dark: '#342c4d' },
  },
  sizes: {
    xs: { height: '2rem', paddingX: '0.875rem', fontSize: '0.8125rem', iconSize: '0.875rem' },
    sm: { height: '2.25rem', paddingX: '1rem', fontSize: '0.875rem', iconSize: '1rem' },
    md: { height: '2.75rem', paddingX: '1.25rem', fontSize: '0.9375rem', iconSize: '1.125rem' },
    lg: { height: '3.25rem', paddingX: '1.625rem', fontSize: '1.0625rem', iconSize: '1.25rem' },
    xl: { height: '3.75rem', paddingX: '2rem', fontSize: '1.1875rem', iconSize: '1.5rem' },
  },
  radii: { square: '0', sm: '0.75rem', md: '1rem', lg: '1.5rem', xl: '2rem', rounded: '9999px' },
  spacing: { xs: '0.375rem', sm: '0.75rem', md: '1.25rem', lg: '1.75rem', xl: '2.5rem' },
  shadows: {
    sm: glow('0 2px 8px', 0.08),
    md: glow('0 10px 30px', 0.14),
    lg: glow('0 20px 60px', 0.2),
  },
  density: {
    compact: { paddingX: '0.75rem', paddingY: '0.5rem', fontSize: '0.875rem' },
    comfortable: { paddingX: '1.25rem', paddingY: '0.875rem', fontSize: '0.9375rem' },
  },
  typography: {
    families: {
      sans: 'Nunito, "SF Pro Rounded", ui-rounded, "Varela Round", system-ui, sans-serif',
      mono: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
    },
    fonts: { body: 'sans', heading: 'sans', mono: 'mono' },
    styles: {
      display: { family: 'sans', size: '2.5rem', weight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' },
      heading: { family: 'sans', size: '1.625rem', weight: 800, lineHeight: 1.2 },
      subheading: { family: 'sans', size: '1.1875rem', weight: 700, lineHeight: 1.35 },
      body: { family: 'sans', size: '1rem', weight: 500, lineHeight: 1.55 },
      caption: { family: 'sans', size: '0.8125rem', weight: 500, lineHeight: 1.45 },
      code: { family: 'mono', size: '0.875rem', weight: 400, lineHeight: 1.5 },
      label: { family: 'sans', size: '0.9375rem', weight: 700, lineHeight: 1.4 },
    },
    headings: { h1: 'display', h2: 'heading', h3: 'heading', h4: 'subheading', h5: 'subheading', h6: 'label' },
  },
  focusRing: { width: '3px', offset: '3px', color: 'primary' },
  components: {
    ...defaults.components,
    Button: { radius: 'rounded' },
    IconButton: { radius: 'rounded' },
    ToggleGroup: { radius: 'rounded' },
    Badge: { radius: 'rounded' },
    Input: { radius: 'rounded' },
    Select: { radius: 'rounded' },
    Combobox: { radius: 'rounded' },
  },
  defaults: { ...defaults.defaults, radius: 'lg', padding: 'lg', gap: 'md' },
}) satisfies ThemeContract;
