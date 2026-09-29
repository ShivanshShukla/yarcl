import type { ComponentProps } from 'react';
import { colorClass, cx, radiusClass, sizeClass, variantClass } from '../classes';
import type { TokenProps, VariantProps } from '../types';
import { useButtonGroup } from './ButtonGroup';
import { Spinner } from './Spinner';
import { useDefaults } from '../runtime';


/** Props for {@link Button}. Accepts all native `<button>` attributes except `color`. */
export interface ButtonProps extends Omit<ComponentProps<'button'>, 'color'>, TokenProps<'Button'>, VariantProps {
  /** Shows a {@link Spinner}, disables the button and sets `aria-busy`. */
  loading?: boolean;
}

/**
 * A button styled from the consumer's design tokens.
 * Shares the base size scale with {@link Input}; component size overrides can adjust either one.
 * Icons (`<svg>`) inside are sized from the size's `iconSize`.
 *
 * @example
 * ```tsx
 * <Button size="lg" color="danger" variant="outline" radius="pill">Delete</Button>
 * ```
 */
export function Button({
  size,
  radius,
  color,
  variant,
  loading,
  disabled,
  className,
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  const own = useDefaults('Button');
  const group = useButtonGroup();
  return (
    <button
      type={type}
      className={cx(
        'yarcl-button',
        sizeClass(size ?? group?.size ?? own.size, 'Button'),
        radiusClass(radius ?? group?.radius ?? own.radius, size ?? group?.size ?? own.size),
        colorClass(color ?? group?.color ?? own.color),
        variantClass(variant ?? group?.variant ?? own.variant),
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Spinner label="" aria-hidden="true" />}
      {children}
    </button>
  );
}
