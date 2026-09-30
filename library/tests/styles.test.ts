import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const allowed = [
  'border-radius: 0 max(0px, var(--yarcl-r) - var(--yarcl-border-width)) max(0px, var(--yarcl-r) - var(--yarcl-border-width)) 0;',
  'border-radius: 9999px;',
  'height: 0.8em;',
  'height: 0.8em;',
  'height: 1.1em;',
  'height: 1em;',
  'margin: calc((1lh - 0.8em) / 2) 0;',
  'max-height: min(24rem, 60dvh);',
  'max-width: 18rem;',
  'max-width: min(24rem, calc(100vw - var(--yarcl-padding)));',
  'min-height: 1em;',
  'text-underline-offset: 0.25em;',
  'text-underline-offset: 0.2em;',
  'width: 0.8em;',
  'width: 1.1em;',
  'width: 1em;',
  'width: min(22rem, calc(100vw - var(--yarcl-padding) * 2));',
];

describe('component styles', () => {
  it('keeps literal lengths limited to structural exceptions', () => {
    const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
    const literals = css
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.endsWith(';') && /-?\d*\.?\d+(?:px|rem|em)\b/.test(line))
      .sort();

    expect(literals).toEqual(allowed);
  });
});
