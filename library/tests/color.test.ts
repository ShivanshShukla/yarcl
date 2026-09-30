import { describe, expect, it } from 'vitest';
import { contrast, mix, parseHex, readableOn, readableText, toHex } from '../src/color.ts';

describe('color utilities', () => {
  describe('parseHex', () => {
    it('parses short and long hex colors', () => {
      expect(parseHex('#0aF')).toEqual([0, 170, 255]);
      expect(parseHex(' 12abef ')).toEqual([18, 171, 239]);
    });

    it('rejects unsupported color values', () => {
      expect(parseHex('#12')).toBeNull();
      expect(parseHex('#abcd')).toBeNull();
      expect(parseHex('rgb(0 0 0)')).toBeNull();
      expect(parseHex('not-a-color')).toBeNull();
    });
  });

  it('calculates WCAG contrast ratios', () => {
    expect(contrast([0, 0, 0], [255, 255, 255])).toBeCloseTo(21, 5);
    expect(contrast([255, 255, 255], [0, 0, 0])).toBeCloseTo(21, 5);
    expect(contrast([42, 42, 42], [42, 42, 42])).toBe(1);
  });

  it('mixes colors and serializes them as hex', () => {
    expect(mix([0, 0, 0], [255, 128, 1], 0.5)).toEqual([128, 64, 1]);
    expect(toHex([0, 15, 255])).toBe('#000fff');
  });

  it('chooses the more readable black or white foreground', () => {
    expect(readableOn([0, 0, 0])).toBe('#ffffff');
    expect(readableOn([255, 255, 255])).toBe('#000000');
  });

  describe('readableText', () => {
    it('keeps a color that already meets the contrast target', () => {
      expect(readableText([0, 0, 0], [[255, 255, 255]], [20, 20, 20], 4.5)).toEqual([0, 0, 0]);
    });

    it('moves a color toward the neutral text until every background passes', () => {
      const backgrounds: [number, number, number][] = [
        [255, 255, 255],
        [245, 245, 245],
      ];
      const result = readableText([150, 150, 150], backgrounds, [0, 0, 0], 4.5);

      expect(result).not.toEqual([150, 150, 150]);
      expect(backgrounds.every((background) => contrast(result, background) >= 4.5)).toBe(true);
    });

    it('falls back to the target color when no candidate can pass', () => {
      expect(readableText([127, 127, 127], [[0, 0, 0], [255, 255, 255]], [255, 255, 255], 21)).toEqual([
        255, 255, 255,
      ]);
    });
  });
});
