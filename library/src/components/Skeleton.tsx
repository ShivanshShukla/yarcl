import type { ComponentProps, CSSProperties } from 'react';
import { cx, radiusClass, sizeClass, typeClass } from '../classes';
import type { ComponentSize, Radius, TextStyle } from '../types';
import { useDefaults } from '../runtime';


/** Props for {@link Skeleton}. */
export interface SkeletonProps extends Omit<ComponentProps<'span'>, 'children'> {
  /**
   * `text`: lines matching a text style; `control`: the height of a control of the given `size`;
   * `circle`: a circle, e.g. for an avatar; `rect`: a block sized by `width` and `height`.
   * @default 'text'
   */
  shape?: 'text' | 'control' | 'circle' | 'rect';
  /** Number of lines for `shape="text"`. The last line is shorter. */
  lines?: number;
  /**
   * Text style whose font size and line height the lines match, for `shape="text"`.
   * @default config.defaults.textStyle
   */
  textStyle?: TextStyle;
  /**
   * Control size, from the `sizes` config. Sets the height for `shape="control"` and the diameter for `shape="circle"`.
   * @default config.defaults.size
   */
  size?: ComponentSize<'Skeleton'>;
  /**
   * Corner radius for `control` and `rect`, from the `radii` config.
   * @default config.defaults.radius
   */
  radius?: Radius | 'size';
  /** Width as a CSS length. */
  width?: string;
  /** Height as a CSS length, for `shape="rect"`. */
  height?: string;
}

/**
 * A placeholder shown while content loads. Hidden from assistive technology;
 * mark the loading region with `aria-busy` instead.
 *
 * @example
 * ```tsx
 * <Stack aria-busy>
 *   <Skeleton shape="text" textStyle="title" width="40%" />
 *   <Skeleton shape="text" lines={3} />
 *   <Skeleton shape="control" width="12rem" />
 * </Stack>
 * ```
 */
export function Skeleton({
  shape = 'text',
  lines = 1,
  textStyle,
  size,
  radius,
  width,
  height,
  className,
  style,
  ...props
}: SkeletonProps) {
  const own = useDefaults('Skeleton');
  const dimensions = { width, height, ...style } as CSSProperties;

  if (shape === 'text') {
    return (
      <span
        aria-hidden="true"
        className={cx('yarcl-skeleton-text', textStyle && typeClass(textStyle), className)}
        style={dimensions}
        {...props}
      >
        {Array.from({ length: lines }, (_, i) => (
          <span key={i} className="yarcl-skeleton yarcl-skeleton-line" />
        ))}
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cx(
        'yarcl-skeleton',
        `yarcl-skeleton-${shape}`,
        shape !== 'rect' && sizeClass(size ?? own.size, 'Skeleton'),
        shape !== 'circle' && radiusClass(radius ?? own.radius, size ?? own.size),
        className,
      )}
      style={dimensions}
      {...props}
    />
  );
}
