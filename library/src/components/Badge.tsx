import type { ComponentProps } from 'react';
import { colorClass, cx, radiusClass, sizeClass, softVariantClass } from '../classes';
import type { Color, ComponentSize, Radius, Variant } from '../types';
import { useDefaults } from '../runtime';


/** Props for {@link Badge}. */
export interface BadgeProps extends Omit<ComponentProps<'span'>, 'color'> {
  /**
   * Semantic color, from the `colors` config.
   * @default config.defaults.color
   */
  color?: Color;
  /**
   * Style recipe, from the `variants` config.
   * @default config.defaults.softVariant
   */
  variant?: Variant;
  /**
   * Scales with the size's font size, from the `sizes` config.
   * @default config.defaults.size
   */
  size?: ComponentSize<'Badge'>;
  /**
   * Corner radius, from the `radii` config.
   * @default config.defaults.radius
   */
  radius?: Radius | 'size';
  /** Shows a remove button, making the badge a removable tag. Called when it is pressed. */
  onRemove?: () => void;
  /**
   * Accessible label of the remove button.
   * @default 'Remove'
   */
  removeLabel?: string;
}

/**
 * A small label for status, counts or categories. With `onRemove`, a removable tag.
 * Uses the same variant recipes as {@link Button}.
 *
 * @example
 * ```tsx
 * <Badge color="success">Active</Badge>
 * <Badge onRemove={() => removeTag('react')}>react</Badge>
 * ```
 */
export function Badge({
  color,
  variant,
  size,
  radius,
  onRemove,
  removeLabel = 'Remove',
  className,
  children,
  ...props
}: BadgeProps) {
  const own = useDefaults('Badge');
  return (
    <span
      className={cx('yarcl-badge', colorClass(color ?? own.color), softVariantClass(variant ?? own.variant), sizeClass(size ?? own.size, 'Badge'), radiusClass(radius ?? own.radius, size ?? own.size), className)}
      {...props}
    >
      {children}
      {onRemove && <BadgeRemove aria-label={removeLabel} onClick={onRemove} />}
    </span>
  );
}

export function BadgeRemove(props: Omit<ComponentProps<'button'>, 'children'>) {
  return (
    <button type="button" className="yarcl-badge-remove" {...props}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
        <path d="M7 7l10 10M17 7 7 17" />
      </svg>
    </button>
  );
}
