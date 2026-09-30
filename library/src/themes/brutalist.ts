import { defineConfig } from '../define';
import defaults from '../yarcl.config';
import type { ThemeContract } from './contract';

const ink = 'light-dark(#000000, #ffffff)';

/** Loud and flat: red on black and white, square corners, thick borders, hard offset shadows, monospace type. */
export const brutalist = defineConfig({
  ...defaults,
  colors: {
    primary: { light: '#ff3d2e', dark: '#ff5a4d' },
    neutral: { light: '#1a1a1a', dark: '#f5f5f5' },
    success: { light: '#00b862', dark: '#3dfc9a' },
    warning: { light: '#ff8a00', dark: '#ffb14a' },
    danger: { light: '#c2005a', dark: '#ff5ca1' },
    info: { light: '#2f6bff', dark: '#7aa2ff' },
  },
  neutrals: {
    bg: { light: '#fffdf2', dark: '#0f0f0f' },
    surface: { light: '#ffffff', dark: '#1a1a1a' },
    text: { light: '#000000', dark: '#ffffff' },
    muted: { light: '#3d3d3d', dark: '#cfcfcf' },
    border: { light: '#000000', dark: '#ffffff' },
  },
  sizes: {
    xs: { height: '1.75rem', paddingX: '0.625rem', fontSize: '0.75rem', iconSize: '0.75rem' },
    sm: { height: '2rem', paddingX: '0.75rem', fontSize: '0.8125rem', iconSize: '0.875rem' },
    md: { height: '2.5rem', paddingX: '1rem', fontSize: '0.875rem', iconSize: '1rem' },
    lg: { height: '3rem', paddingX: '1.25rem', fontSize: '1rem', iconSize: '1.25rem' },
    xl: { height: '3.5rem', paddingX: '1.5rem', fontSize: '1.125rem', iconSize: '1.5rem' },
  },
  radii: { square: '0', sm: '0', md: '0', lg: '0', xl: '0', rounded: '9999px' },
  variants: {
    solid: { background: 'fill', border: 'neutral', text: 'on' },
    soft: { background: 'tint', border: 'neutral', text: 'neutral' },
    outline: { background: 'none', border: 'neutral', text: 'neutral' },
    ghost: { background: 'none', border: 'none', text: 'neutral' },
  },
  shadows: {
    sm: `3px 3px 0 0 ${ink}`,
    md: `5px 5px 0 0 ${ink}`,
    lg: `8px 8px 0 0 ${ink}`,
  },
  borders: { width: '2px' },
  typography: {
    families: {
      sans: '"JetBrains Mono", "SF Mono", ui-monospace, Menlo, Consolas, monospace',
      mono: '"JetBrains Mono", "SF Mono", ui-monospace, Menlo, Consolas, monospace',
    },
    fonts: { body: 'sans', heading: 'sans', mono: 'mono' },
    styles: {
      display: { family: 'sans', size: '2.5rem', weight: 800, lineHeight: 1, letterSpacing: '-0.04em' },
      heading: { family: 'sans', size: '1.5rem', weight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' },
      subheading: { family: 'sans', size: '1.125rem', weight: 700, lineHeight: 1.3 },
      body: { family: 'sans', size: '0.875rem', weight: 400, lineHeight: 1.55 },
      caption: { family: 'sans', size: '0.75rem', weight: 400, lineHeight: 1.45 },
      code: { family: 'mono', size: '0.8125rem', weight: 400, lineHeight: 1.5 },
      label: { family: 'sans', size: '0.8125rem', weight: 700, lineHeight: 1.4, letterSpacing: '0.04em' },
    },
    headings: { h1: 'display', h2: 'heading', h3: 'heading', h4: 'subheading', h5: 'subheading', h6: 'label' },
  },
  focusRing: { width: '3px', offset: '3px', color: 'neutral', style: 'dashed' },
  defaults: { ...defaults.defaults, radius: 'md', padding: 'lg', floatingShadow: 'md' },
}) satisfies ThemeContract;
