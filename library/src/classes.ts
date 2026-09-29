import { activeConfig } from './runtime';
import type { Color, Density, Radius, Shadow, Size, Spacing, TextStyle, Variant } from './types';
import type { ComponentName } from './define';

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

export const sizeClass = (size: Size = activeConfig().defaults.size, component?: ComponentName) =>
  `yarcl-size-${size}${component ? ` yarcl-sized-${component}` : ''}`;
export function radiusClass(radius?: Radius | 'size', size?: Size): string | undefined {
  const value: Radius | 'size' = radius ?? (activeConfig().defaults.radius as Radius | 'size');
  if (value !== 'size') return `yarcl-radius-${value}`;
  const match = size ?? activeConfig().defaults.size;
  return match in activeConfig().radii ? `yarcl-radius-${match}` : undefined;
}
export const colorClass = (color: Color = activeConfig().defaults.color) => `yarcl-color-${color}`;
export const variantClass = (variant: Variant = activeConfig().defaults.variant) => `yarcl-variant-${variant}`;
export const gapClass = (gap: Spacing = activeConfig().defaults.gap) => `yarcl-gap-${gap}`;
export const paddingClass = (padding: Spacing = activeConfig().defaults.padding) => `yarcl-padding-${padding}`;
export const shadowClass = (shadow?: Shadow) => shadow && `yarcl-shadow-${shadow}`;
export const typeClass = (style: TextStyle) => `yarcl-type-${style}`;
export const densityClass = (density: Density = activeConfig().defaults.density) => `yarcl-density-${density}`;
export const softVariantClass = (variant: Variant = activeConfig().defaults.softVariant) => `yarcl-variant-${variant}`;
