import type { ComponentProps } from 'react';
import { colorClass, cx, radiusClass, sizeClass, softVariantClass, typeClass } from '../classes';
import type { Color, ComponentSize, Radius, TextStyle, Variant } from '../types';
import { useConfig, useDefaults } from '../runtime';

/** Props for {@link Label}. */
export interface LabelProps extends Omit<ComponentProps<'label'>, 'color'> {
  /**
   * Text style, from the `typography.styles` config.
   * @default config.defaults.labelStyle
   */
  textStyle?: TextStyle;
  /**
   * Semantic color, from the `colors` config. Colors the label text; neutral when omitted.
   */
  color?: Color;
  /**
   * Style recipe, from the `variants` config, for a filled label. Plain when omitted.
   */
  variant?: Variant;
  /**
   * Font size scale, from the `sizes` config. Uses the text style's size when omitted.
   */
  size?: ComponentSize<'Label'>;
  /**
   * Corner radius, from the `radii` config.
   * @default config.defaults.radius
  */
  radius?: Radius | 'size';
  /**
   * Shows a required marker in `defaults.errorColor`. The marker is hidden from screen readers,
   * so also set `required` (or `aria-required`) on the control.
   */
  required?: boolean;
  /** Uses the muted color, to match a disabled control. */
  disabled?: boolean;
}

/**
 * A form label in the consumer's `defaults.labelStyle`, or a filled label with a variant. Connect
 * it with `htmlFor`, or give it an `id` and point the control's `aria-labelledby` at it.
 *
 * @example
 * ```tsx
 * <Label htmlFor="email" required>Email</Label>
 * <Input id="email" type="email" />
 * <Label variant="soft" color="success">Active</Label>
 * ```
 */
export function Label({
  textStyle,
  color,
  variant,
  size,
  radius,
  required,
  disabled,
  className,
  children,
  ...props
}: LabelProps) {
  const config = useConfig();
  const own = useDefaults('Label');
  const resolvedSize = size ?? own.size;
  const resolvedColor = color ?? own.color;
  const resolvedVariant = variant ?? own.variant;
  return (
    <label
      className={cx(
        'yarcl-label',
        typeClass(textStyle ?? own.textStyle ?? config.defaults.labelStyle),
        resolvedColor && cx('yarcl-label-colored', colorClass(resolvedColor)),
        resolvedVariant && cx('yarcl-label-variant', softVariantClass(resolvedVariant)),
        resolvedSize && cx('yarcl-label-sized', sizeClass(resolvedSize, 'Label')),
        radiusClass(radius ?? own.radius, resolvedSize),
        disabled && 'yarcl-label-disabled',
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="yarcl-label-required" aria-hidden="true">
          {' *'}
        </span>
      )}
    </label>
  );
}
