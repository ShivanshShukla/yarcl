import { describe, expect, it, vi } from 'vitest';
import { generateCss } from '../src/css.ts';
import type { YarclShape } from '../src/define.ts';
import defaults from '../src/yarcl.config.ts';

function withConfig(overrides: Partial<YarclShape>): YarclShape {
  return { ...defaults, ...overrides };
}

describe('generateCss', () => {
  it('emits root variables and modifier classes', () => {
    const css = generateCss(defaults);

    expect(css).toContain(':root {\n  color-scheme: light dark;');
    expect(css).toContain('--yarcl-color-primary: light-dark(#2d4bb8, #8aa2ff);');
    expect(css).toContain('--yarcl-size-md-height: 2.5rem;');
    expect(css).toContain('--yarcl-radius-md: 0.375rem;');
    expect(css).toContain('--yarcl-space-md: 1rem;');
    expect(css).toContain('--yarcl-shadow-md: 0 4px 12px light-dark(rgb(0 0 0 / 0.12), rgb(0 0 0 / 0.6));');
    expect(css).toContain('.yarcl-color-primary {\n  --yarcl-c: var(--yarcl-color-primary);');
    expect(css).toContain('.yarcl-size-md {\n  --yarcl-h: var(--yarcl-size-md-height);');
    expect(css).toContain('.yarcl-radius-md {\n  --yarcl-r: var(--yarcl-radius-md);');
    expect(css).toContain('.yarcl-variant-solid {\n  --yarcl-v-bg: var(--yarcl-c);');
    expect(css).toContain('.yarcl-gap-md {\n  --yarcl-component-gap: var(--yarcl-space-md);');
    expect(css).toContain('.yarcl-padding-md {\n  --yarcl-component-padding: var(--yarcl-space-md);');
    expect(css).toContain('.yarcl-shadow-md {\n  box-shadow: var(--yarcl-shadow-md);');
    expect(css).toContain('.yarcl-density-comfortable {\n  --yarcl-cell-px: 0.75rem;');
    expect(css).toContain('--yarcl-font-body: var(--yarcl-font-family-sans);');
    expect(css).toContain('--yarcl-font-heading: var(--yarcl-font-family-sans);');
    expect(css).toContain('--yarcl-font-mono: var(--yarcl-font-family-mono);');
    expect(css).toContain('--yarcl-font-sans: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;');
    expect(css).toContain('--yarcl-accent: var(--yarcl-color-primary);');
    expect(css).toContain('.yarcl-type-body {\n  font-family: var(--yarcl-font-family-sans);');
    expect(css).toContain('--yarcl-r: var(--yarcl-radius-md, 0);');
  });

  it('emits component-scoped size overrides without changing the global size class', () => {
    const css = generateCss(
      withConfig({
        components: {
          Button: { sizeOverrides: { sm: { paddingX: '0.875rem' } } },
          Input: { sizeOverrides: { md: { height: '2.75rem', fontSize: '1rem' } } },
        },
      }),
    );

    expect(css).toContain(`.yarcl-sized-Button.yarcl-size-sm,
.yarcl-sized-Button.yarcl-sized-Button .yarcl-size-sm {
  --yarcl-px: 0.875rem;
}`);
    expect(css).toContain(`.yarcl-sized-Input.yarcl-size-md,
.yarcl-sized-Input.yarcl-sized-Input .yarcl-size-md {
  --yarcl-h: 2.75rem;
  --yarcl-fs: 1rem;
}`);
    expect(css.match(/^\.yarcl-size-sm \{/gm)).toHaveLength(1);
  });

  it('escapes unusual config keys in variables, selectors, and references', () => {
    const css = generateCss(
      withConfig({
        colors: {
          ...defaults.colors,
          'brand/bright': { light: '#123456', dark: '#abcdef' },
        },
        sizes: {
          ...defaults.sizes,
          '2 xl': defaults.sizes.md,
        },
        typography: {
          ...defaults.typography,
          families: { ...defaults.typography.families, 'display.alt': 'Georgia, serif' },
          styles: {
            ...defaults.typography.styles,
            hero: { family: 'display.alt', size: '3rem', weight: 700, lineHeight: 1 },
          },
        },
      }),
    );

    expect(css).toContain('--yarcl-color-brand\\/bright: light-dark(#123456, #abcdef);');
    expect(css).toContain('.yarcl-color-brand\\/bright {');
    expect(css).toContain('--yarcl-size-2\\ xl-height: 2.5rem;');
    expect(css).toContain('.yarcl-size-2\\ xl {');
    expect(css).toContain('--yarcl-font-family-display\\.alt: Georgia, serif;');
    expect(css).toContain('font-family: var(--yarcl-font-family-display\\.alt);');
  });

  it('keeps role variables stable when font family and accent color keys change', () => {
    const css = generateCss(
      withConfig({
        colors: {
          action: { light: '#123456', dark: '#abcdef' },
          failure: { light: '#a00000', dark: '#ff8080' },
        },
        typography: {
          ...defaults.typography,
          families: {
            prose: 'Inter, sans-serif',
            display: 'Georgia, serif',
            code: 'Menlo, monospace',
          },
          fonts: { body: 'prose', heading: 'display', mono: 'code' },
        },
        defaults: { ...defaults.defaults, color: 'action', errorColor: 'failure' },
      }),
    );

    expect(css).toContain('--yarcl-font-body: var(--yarcl-font-family-prose);');
    expect(css).toContain('--yarcl-font-heading: var(--yarcl-font-family-display);');
    expect(css).toContain('--yarcl-font-mono: var(--yarcl-font-family-code);');
    expect(css).toContain('--yarcl-accent: var(--yarcl-color-action);');
    expect(css).toContain('--yarcl-error: var(--yarcl-color-failure);');
  });

  it('emits font faces with inferred formats and optional descriptors', () => {
    const css = generateCss(
      withConfig({
        typography: {
          ...defaults.typography,
          fontFaces: [
            {
              family: 'Test Sans',
              src: ['local("Test Sans")', '/fonts/test.woff2?v=2', '/fonts/test.otf'],
              weight: '100 900',
              style: 'italic',
              display: 'optional',
            },
          ],
        },
      }),
    );

    expect(css).toContain(`@font-face {
  font-family: "Test Sans";
  src: local("Test Sans"), url("/fonts/test.woff2?v=2") format("woff2"), url("/fonts/test.otf") format("opentype");
  font-weight: 100 900;
  font-style: italic;
  font-display: optional;
}`);
  });

  it('generates computed and explicit foregrounds and text shades', () => {
    const css = generateCss(
      withConfig({
        colors: {
          ink: { light: '#000000', dark: '#ffffff' },
          custom: {
            light: '#112233',
            dark: '#ddeeff',
            on: { light: '#fefefe', dark: '#010101' },
            text: { light: '#102030', dark: '#d0e0f0' },
          },
        },
      }),
    );

    expect(css).toContain('--yarcl-color-ink-on: light-dark(#ffffff, #000000);');
    expect(css).toContain('--yarcl-color-ink-text: light-dark(#000000, #ffffff);');
    expect(css).toContain('--yarcl-color-custom-on: light-dark(#fefefe, #010101);');
    expect(css).toContain('--yarcl-color-custom-text: light-dark(#102030, #d0e0f0);');
  });

  it('warns about invalid or low-contrast foregrounds', () => {
    const warn = vi.fn();
    const css = generateCss(
      withConfig({
        colors: {
          dynamic: { light: 'oklch(50% 0.2 20)', dark: 'var(--dynamic)' },
          faint: { light: '#777777', dark: '#777777', on: '#888888' },
        },
      }),
      warn,
    );

    expect(css).toContain('--yarcl-color-dynamic-on: #ffffff;');
    expect(warn).toHaveBeenCalledWith(
      'colors.dynamic: cannot compute a light foreground from "oklch(50% 0.2 20)"; use a hex value or set `on`',
    );
    expect(warn).toHaveBeenCalledWith(
      'colors.dynamic: cannot compute a dark foreground from "var(--dynamic)"; use a hex value or set `on`',
    );
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(/^colors\.faint: light foreground contrast .* is below 4\.5:1$/));
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(/^colors\.faint: dark foreground contrast .* is below 4\.5:1$/));
  });
});
