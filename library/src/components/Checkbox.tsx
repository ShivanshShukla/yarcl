import { useEffect, useImperativeHandle, useRef, type ComponentProps, type ReactNode } from 'react';
import { colorClass, cx, sizeClass } from '../classes';
import { useFieldProps } from '../field-context';
import type { Color, ComponentSize } from '../types';
import { useDefaults } from '../runtime';


/** Props for {@link Checkbox}. Accepts all native `<input>` attributes except `type`, `color` and `size`. */
export interface CheckboxProps extends Omit<ComponentProps<'input'>, 'type' | 'color' | 'size' | 'children'> {
  /** Label shown next to the box. */
  children?: ReactNode;
  /**
   * Box size, from the `sizes` config (uses the size's `iconSize`).
   * @default config.defaults.size
   */
  size?: ComponentSize<'Checkbox'>;
  /**
   * Color of the checked box, from the `colors` config.
   * @default config.defaults.color
   */
  color?: Color;
  /** Shows a mixed state. Cleared by the browser when the user toggles the box. */
  indeterminate?: boolean;
}

/**
 * A checkbox with an optional label.
 *
 * @example
 * ```tsx
 * <Checkbox defaultChecked>Remember me</Checkbox>
 * ```
 */
export function Checkbox(props: CheckboxProps) {
  const own = useDefaults('Checkbox');
  const { children, size, color, indeterminate = false, className, style, ref, ...rest } = useFieldProps(props);
  const inner = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inner.current!, []);
  useEffect(() => {
    if (inner.current) inner.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label className={cx('yarcl-checkbox', sizeClass(size ?? own.size, 'Checkbox'), colorClass(color ?? own.color), className)} style={style}>
      <input ref={inner} type="checkbox" className="yarcl-checkbox-input" {...rest} />
      {children != null && <span className="yarcl-checkbox-label">{children}</span>}
    </label>
  );
}
