import type { ComponentProps } from 'react';
import { colorClass, cx, radiusClass, sizeClass } from '../classes';
import { useFieldProps } from '../field-context';
import type { TokenProps } from '../types';
import { useDefaults } from '../runtime';


/** Props for {@link Textarea}. Accepts all native `<textarea>` attributes except `color`. */
export interface TextareaProps extends Omit<ComponentProps<'textarea'>, 'color'>, TokenProps<'Textarea'> {}

/**
 * A multi-line text input. Uses the size's font size and padding, and grows from
 * a minimum of one control height. Inside a {@link Field}, it is labelled and described automatically.
 *
 * @example
 * ```tsx
 * <Textarea rows={4} placeholder="Message" />
 * ```
 */
export function Textarea(props: TextareaProps) {
  const own = useDefaults('Textarea');
  const { size, radius, color, className, ...rest } = useFieldProps(props);
  return (
    <textarea className={cx('yarcl-textarea', sizeClass(size ?? own.size, 'Textarea'), radiusClass(radius ?? own.radius, size ?? own.size), colorClass(color ?? own.color), className)} {...rest} />
  );
}
