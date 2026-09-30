import { defineConfig } from '../define';
import defaults from '../yarcl.config';
import type { ThemeContract } from './contract';

/** Calm and considered: terracotta on cream, light grotesque type, square corners, flat surfaces, generous spacing. */
export const editorial = defineConfig({
  ...defaults,
  colors: {
    primary: { light: '#9a3412', dark: '#fb923c' },
    neutral: { light: '#57534e', dark: '#a8a29e' },
    success: { light: '#3f6212', dark: '#a3e635' },
    warning: { light: '#a16207', dark: '#fcd34d' },
    danger: { light: '#9f1239', dark: '#fda4af' },
    info: { light: '#1e3a8a', dark: '#93c5fd' },
  },
  neutrals: {
    bg: { light: '#f6f1e7', dark: '#1c1917' },
    surface: { light: '#fffdf8', dark: '#262220' },
    text: { light: '#1c1917', dark: '#f5efe3' },
    muted: { light: '#57534e', dark: '#aaa39b' },
    border: { light: '#d6cdbd', dark: '#48413b' },
  },
  sizes: {
    xs: { height: '1.75rem', paddingX: '0.75rem', fontSize: '0.8125rem', iconSize: '0.75rem' },
    sm: { height: '2rem', paddingX: '0.875rem', fontSize: '0.875rem', iconSize: '0.875rem' },
    md: { height: '2.625rem', paddingX: '1.375rem', fontSize: '1rem', iconSize: '1rem' },
    lg: { height: '3.25rem', paddingX: '1.75rem', fontSize: '1.0625rem', iconSize: '1.25rem' },
    xl: { height: '3.875rem', paddingX: '2.125rem', fontSize: '1.1875rem', iconSize: '1.375rem' },
  },
  radii: { square: '0', sm: '1px', md: '2px', lg: '3px', xl: '4px', rounded: '9999px' },
  spacing: { xs: '0.375rem', sm: '0.75rem', md: '1.25rem', lg: '2rem', xl: '3rem' },
  shadows: {
    sm: 'none',
    md: '0 18px 40px -18px light-dark(rgb(68 44 20 / 0.35), rgb(0 0 0 / 0.75))',
    lg: '0 30px 60px -20px light-dark(rgb(68 44 20 / 0.4), rgb(0 0 0 / 0.8))',
  },
  typography: {
    families: {
      sans: '"Helvetica Neue", Helvetica, "Inter", "Segoe UI", Arial, sans-serif',
      mono: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
    },
    fonts: { body: 'sans', heading: 'sans', mono: 'mono' },
    styles: {
      display: { family: 'sans', size: '2.75rem', weight: 300, lineHeight: 1.05, letterSpacing: '-0.03em' },
      heading: { family: 'sans', size: '1.75rem', weight: 300, lineHeight: 1.2, letterSpacing: '-0.015em' },
      subheading: { family: 'sans', size: '1.25rem', weight: 600, lineHeight: 1.3 },
      body: { family: 'sans', size: '1rem', weight: 400, lineHeight: 1.6 },
      caption: { family: 'sans', size: '0.875rem', weight: 400, lineHeight: 1.5 },
      code: { family: 'mono', size: '0.875rem', weight: 400, lineHeight: 1.5 },
      label: { family: 'sans', size: '0.8125rem', weight: 700, lineHeight: 1.4, letterSpacing: '0.08em' },
    },
    headings: { h1: 'display', h2: 'heading', h3: 'heading', h4: 'subheading', h5: 'subheading', h6: 'label' },
  },
  focusRing: { width: '3px', offset: '3px', color: 'primary', style: 'double' },
  defaults: { ...defaults.defaults, radius: 'square', padding: 'lg', gap: 'md', floatingShadow: 'md' },
}) satisfies ThemeContract;
