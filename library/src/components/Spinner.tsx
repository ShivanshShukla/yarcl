import type { ComponentProps } from 'react';
import { colorClass, cx, sizeClass } from '../classes';
import type { Color, ComponentSize } from '../types';
import { useDefaults } from '../runtime';


/** Props for {@link Spinner}. */
export interface SpinnerProps extends Omit<ComponentProps<'span'>, 'color'> {
  /** Diameter from the size's `iconSize`, from the `sizes` config. Inherits the surrounding control's size when omitted. */
  size?: ComponentSize<'Spinner'>;
  /** Semantic color, from the `colors` config. Uses the current text color when omitted. */
  color?: Color;
  /**
   * Accessible label announced to screen readers.
   * @default 'Loading'
   */
  label?: string;
}

/**
 * An indeterminate loading indicator. Sized like an icon, so it fits inside controls of the same size.
 *
 * @example
 * ```tsx
 * <Spinner size="lg" color="brand" />
 * ```
 */
export function Spinner({ size, color, label = 'Loading', className, ...props }: SpinnerProps) {
  const own = useDefaults('Spinner');
  return (
    <span
      role="status"
      aria-label={label}
      className={cx('yarcl-spinner', (size ?? own.size) && sizeClass(size ?? own.size, 'Spinner'), (color ?? own.color) && cx('yarcl-spinner-colored', colorClass(color ?? own.color)), className)}
      {...props}
    />
  );
}
