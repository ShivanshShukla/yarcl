import type { ComponentProps } from 'react';
import { colorClass, cx, radiusClass, sizeClass } from '../classes';
import { useFieldProps } from '../field-context';
import type { TokenProps } from '../types';
import { useDefaults } from '../runtime';


/**
 * Props for {@link Input}. Accepts all native `<input>` attributes except
 * `color` and `size`, which are replaced by design tokens.
 */
export interface InputProps extends Omit<ComponentProps<'input'>, 'color' | 'size'>, TokenProps<'Input'> {}

/**
 * A text input styled from the consumer's design tokens.
 * Shares the base size scale with {@link Button}; component size overrides can adjust either one.
 * `color` sets the focus border and ring. Inside a {@link Field}, it is labelled and described automatically.
 *
 * @example
 * ```tsx
 * <Input size="lg" placeholder="Email" />
 * ```
 */
export function Input(props: InputProps) {
  const own = useDefaults('Input');
  const { size, radius, color, className, ...rest } = useFieldProps(props);
  return <input className={cx('yarcl-input', sizeClass(size ?? own.size, 'Input'), radiusClass(radius ?? own.radius, size ?? own.size), colorClass(color ?? own.color), className)} {...rest} />;
}
