import { contrast, parseHex, readableOn } from './color';
import type { ColorPair, YarclShape } from './define';

/** A color combination in a config that falls below the required contrast. */
export interface ContrastIssue {
  /** The config path of the text color, e.g. `colors.warning` or `neutrals.muted`. */
  path: string;
  /** The color scheme the issue occurs in. */
  scheme: 'light' | 'dark';
  /** The contrast ratio, or `null` when it can't be computed (non-hex values). */
  ratio: number | null;
  /** A readable description of the problem. */
  message: string;
}

const schemes = ['light', 'dark'] as const;

function asPair(value: string | ColorPair): ColorPair {
  return typeof value === 'string' ? { light: value, dark: value } : value;
}

/**
 * Checks a config for text that doesn't reach a contrast ratio (WCAG AA, 4.5:1, by default)
 * in light or dark mode. Returns the problems instead of printing them, so you can run it in a
 * test, a CI step or a script.
 *
 * Checks the text drawn on each semantic color (its computed or configured `on`), and the
 * neutral `text` and `muted` colors on the `bg` and `surface` backgrounds. Colors drawn as text
 * need no check: their readable shade is computed automatically.
 *
 * @example
 * ```ts
 * import { checkContrast } from '@yarcl/react/contrast';
 * import config from './src/yarcl.config';
 *
 * test('design system is readable', () => {
 *   expect(checkContrast(config)).toEqual([]);
 * });
 * ```
 */
export function checkContrast(config: YarclShape, min = 4.5): ContrastIssue[] {
  const issues: ContrastIssue[] = [];

  for (const [key, token] of Object.entries(config.colors)) {
    const on = token.on ? asPair(token.on) : null;
    for (const scheme of schemes) {
      const bg = parseHex(token[scheme]);
      const path = `colors.${key}`;
      if (!bg || (on && !parseHex(on[scheme]))) {
        issues.push({ path, scheme, ratio: null, message: `${path}: can't check ${scheme} contrast of non-hex values; set \`on\` to a hex value` });
        continue;
      }
      const fg = on ? parseHex(on[scheme])! : parseHex(readableOn(bg))!;
      const ratio = contrast(bg, fg);
      if (ratio < min) {
        issues.push({ path, scheme, ratio, message: `${path}: ${scheme} text on this color is ${ratio.toFixed(2)}:1, below ${min}:1` });
      }
    }
  }

  const { neutrals } = config;
  for (const text of ['text', 'muted'] as const) {
    for (const ground of ['bg', 'surface'] as const) {
      for (const scheme of schemes) {
        const fg = parseHex(neutrals[text][scheme]);
        const bg = parseHex(neutrals[ground][scheme]);
        if (!fg || !bg) continue;
        const ratio = contrast(fg, bg);
        if (ratio < min) {
          issues.push({
            path: `neutrals.${text}`,
            scheme,
            ratio,
            message: `neutrals.${text} on neutrals.${ground}: ${scheme} contrast is ${ratio.toFixed(2)}:1, below ${min}:1`,
          });
        }
      }
    }
  }

  return issues;
}
