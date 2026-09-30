import type { ColorToken, DensityToken, SizeToken, TextStyleToken, VariantToken } from '../define';
import type defaults from '../yarcl.config';

type Defaults = typeof defaults;

/**
 * The keys every bundled theme defines: the same keys as the library defaults.
 * Apps written against these keys work with any theme that satisfies the contract.
 * Values are free; extra keys are allowed.
 */
export interface ThemeContract {
  colors: Record<keyof Defaults['colors'], ColorToken>;
  sizes: Record<keyof Defaults['sizes'], SizeToken>;
  radii: Record<keyof Defaults['radii'], string>;
  variants: Record<keyof Defaults['variants'], VariantToken>;
  spacing: Record<keyof Defaults['spacing'], string>;
  shadows: Record<keyof Defaults['shadows'], string>;
  density: Record<keyof Defaults['density'], DensityToken>;
  modalSizes: Record<keyof Defaults['modalSizes'], string>;
  typography: {
    families: Record<keyof Defaults['typography']['families'], string>;
    fonts: Record<keyof Defaults['typography']['fonts'], keyof Defaults['typography']['families']>;
    styles: Record<keyof Defaults['typography']['styles'], TextStyleToken>;
  };
}
