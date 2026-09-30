import type { ComponentProps, ReactNode } from 'react';
import { colorClass, cx, sizeClass } from '../classes';
import { useFieldProps } from '../field-context';
import type { Color, ComponentSize } from '../types';
import { useDefaults } from '../runtime';


/** Props for {@link Switch}. Accepts all native `<input>` attributes except `type`, `color` and `size`. */
export interface SwitchProps extends Omit<ComponentProps<'input'>, 'type' | 'color' | 'size' | 'children'> {
  /** Label shown next to the switch. */
  children?: ReactNode;
  /**
   * Switch size, from the `sizes` config (scaled from the size's `iconSize`).
   * @default config.defaults.size
   */
  size?: ComponentSize<'Switch'>;
  /**
   * Track color when on, from the `colors` config.
   * @default config.defaults.color
   */
  color?: Color;
}

/**
 * An on/off toggle. A native checkbox with `role="switch"`, so `checked`,
 * `defaultChecked` and `onChange` work as usual.
 *
 * @example
 * ```tsx
 * <Switch defaultChecked>Notifications</Switch>
 * ```
 */
export function Switch(props: SwitchProps) {
  const own = useDefaults('Switch');
  const { children, size, color, className, style, ...rest } = useFieldProps(props);
  return (
    <label className={cx('yarcl-switch', sizeClass(size ?? own.size, 'Switch'), colorClass(color ?? own.color), className)} style={style}>
      <input type="checkbox" role="switch" className="yarcl-switch-input" {...rest} />
      {children != null && <span className="yarcl-switch-label">{children}</span>}
    </label>
  );
}
