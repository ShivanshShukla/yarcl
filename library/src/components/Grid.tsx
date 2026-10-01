import type { ComponentProps, CSSProperties } from 'react';
import { cx, gapClass } from '../classes';
import { useDefaults } from '../runtime';
import type { Spacing } from '../types';
import type { LayoutElement } from './Stack';

/** Props for {@link Grid}. */
export interface GridProps extends ComponentProps<'div'> {
  /**
   * Element to render. Use `li` children when rendering a list.
   * @default 'div'
   */
  as?: LayoutElement;
  /**
   * Number of equal-width columns, or a CSS grid track definition. Ignored when `minItemWidth` is set.
   * @default 1
   */
  columns?: number | string;
  /** Minimum item width for auto-fit columns. Items shrink to fit narrower containers. */
  minItemWidth?: string;
  /**
   * Space between rows and columns, from the `spacing` config.
   * @default config.defaults.gap
   */
  gap?: Spacing;
}

/**
 * Lays out children in columns and automatically creates rows as needed.
 * Use `minItemWidth` for responsive cards or a track definition for a sidebar layout.
 *
 * @example
 * ```tsx
 * <Grid minItemWidth="16rem" gap="md">
 *   <Card>Revenue</Card>
 *   <Card>Subscriptions</Card>
 * </Grid>
 * ```
 */
export function Grid({ as = 'div', columns = 1, minItemWidth, gap, className, style, ...props }: GridProps) {
  const own = useDefaults('Grid');
  const tracks = minItemWidth
    ? `repeat(auto-fit, minmax(min(100%, ${minItemWidth}), 1fr))`
    : typeof columns === 'number'
      ? `repeat(${Number.isFinite(columns) ? Math.max(1, Math.floor(columns)) : 1}, minmax(0, 1fr))`
      : columns;
  const Tag = as as 'div';
  return (
    <Tag
      className={cx('yarcl-grid', gapClass(gap ?? own.gap), className)}
      style={{ '--yarcl-grid-columns': tracks, ...style } as CSSProperties}
      {...props}
    />
  );
}
