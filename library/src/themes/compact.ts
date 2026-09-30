import { defineConfig } from '../define';
import defaults from '../yarcl.config';
import type { ThemeContract } from './contract';

/** Dense and businesslike: teal on cool gray, small 28px controls, tight spacing, 13px text, compact tables, nearly flat. */
export const compact = defineConfig({
  ...defaults,
  colors: {
    primary: { light: '#0f766e', dark: '#2dd4bf' },
    neutral: { light: '#52606d', dark: '#9aa5b1' },
    success: { light: '#15803d', dark: '#4ade80' },
    warning: { light: '#a16207', dark: '#facc15' },
    danger: { light: '#b91c1c', dark: '#f87171' },
    info: { light: '#1d4ed8', dark: '#60a5fa' },
  },
  neutrals: {
    bg: { light: '#eef1f4', dark: '#0b0f14' },
    surface: { light: '#ffffff', dark: '#141a21' },
    text: { light: '#1f2933', dark: '#e4e7eb' },
    muted: { light: '#52606d', dark: '#9aa5b1' },
    border: { light: '#cbd2d9', dark: '#2a333d' },
  },
  sizes: {
    xs: { height: '1.25rem', paddingX: '0.375rem', fontSize: '0.6875rem', iconSize: '0.75rem' },
    sm: { height: '1.5rem', paddingX: '0.5rem', fontSize: '0.75rem', iconSize: '0.75rem' },
    md: { height: '1.75rem', paddingX: '0.625rem', fontSize: '0.8125rem', iconSize: '0.875rem' },
    lg: { height: '2.25rem', paddingX: '0.875rem', fontSize: '0.875rem', iconSize: '1rem' },
    xl: { height: '2.75rem', paddingX: '1rem', fontSize: '1rem', iconSize: '1.125rem' },
  },
  radii: { square: '0', sm: '2px', md: '3px', lg: '4px', xl: '6px', rounded: '9999px' },
  variants: {
    ...defaults.variants,
    outline: { background: 'none', border: 'neutral', text: 'neutral' },
  },
  spacing: { xs: '0.125rem', sm: '0.25rem', md: '0.5rem', lg: '0.75rem', xl: '1rem' },
  shadows: {
    sm: '0 1px 0 light-dark(rgb(15 23 42 / 0.05), rgb(0 0 0 / 0.4))',
    md: '0 2px 8px light-dark(rgb(15 23 42 / 0.14), rgb(0 0 0 / 0.55))',
    lg: '0 8px 24px light-dark(rgb(15 23 42 / 0.18), rgb(0 0 0 / 0.6))',
  },
  density: {
    compact: { paddingX: '0.5rem', paddingY: '0.25rem', fontSize: '0.75rem' },
    comfortable: { paddingX: '0.625rem', paddingY: '0.375rem', fontSize: '0.8125rem' },
  },
  typography: {
    families: {
      sans: '"IBM Plex Sans", "Segoe UI", system-ui, -apple-system, sans-serif',
      mono: '"IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace',
    },
    fonts: { body: 'sans', heading: 'sans', mono: 'mono' },
    styles: {
      display: { family: 'sans', size: '1.5rem', weight: 600, lineHeight: 1.25 },
      heading: { family: 'sans', size: '1.125rem', weight: 600, lineHeight: 1.3 },
      subheading: { family: 'sans', size: '0.9375rem', weight: 600, lineHeight: 1.35 },
      body: { family: 'sans', size: '0.8125rem', weight: 400, lineHeight: 1.45 },
      caption: { family: 'sans', size: '0.75rem', weight: 400, lineHeight: 1.4 },
      code: { family: 'mono', size: '0.75rem', weight: 400, lineHeight: 1.45 },
      label: { family: 'sans', size: '0.75rem', weight: 600, lineHeight: 1.35, letterSpacing: '0.02em' },
    },
    headings: { h1: 'display', h2: 'heading', h3: 'heading', h4: 'subheading', h5: 'subheading', h6: 'label' },
  },
  focusRing: { width: '2px', offset: '1px', color: 'info' },
  defaults: { ...defaults.defaults, radius: 'sm', padding: 'lg', gap: 'md', density: 'compact' },
}) satisfies ThemeContract;
