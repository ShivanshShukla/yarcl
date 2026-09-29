import type { ChangeEvent, ComponentProps, ReactNode } from 'react';
import { colorClass, cx, sizeClass } from '../classes';
import type { Color, ComponentSize } from '../types';
import { useRadioGroup } from './RadioGroup';
import { useDefaults } from '../runtime';


/** Props for {@link Radio}. Accepts all native `<input>` attributes except `type`, `color` and `size`. */
export interface RadioProps extends Omit<ComponentProps<'input'>, 'type' | 'color' | 'size' | 'children' | 'value'> {
  /** Label shown next to the radio. */
  children?: ReactNode;
  /** Value reported to the {@link RadioGroup} and submitted with forms. */
  value?: string;
  /**
   * Radio size, from the `sizes` config (uses the size's `iconSize`). Inherited from a {@link RadioGroup}.
   * @default config.defaults.size
   */
  size?: ComponentSize<'Radio'>;
  /**
   * Color of the selected radio, from the `colors` config. Inherited from a {@link RadioGroup}.
   * @default config.defaults.color
   */
  color?: Color;
}

/**
 * A radio button with an optional label. Place inside a {@link RadioGroup}, or group standalone
 * radios with the same `name`.
 *
 * @example
 * ```tsx
 * <RadioGroup label="Plan" defaultValue="pro">
 *   <Radio value="free">Free</Radio>
 *   <Radio value="pro">Pro</Radio>
 * </RadioGroup>
 * ```
 */
export function Radio({ children, size, color, value, className, style, onChange, ...props }: RadioProps) {
  const own = useDefaults('Radio');
  const group = useRadioGroup();
  const groupProps = group && {
    name: group.name,
    checked: value !== undefined && group.value === value,
    'aria-invalid': group.invalid || undefined,
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      if (event.target.checked && value !== undefined) group.select(value);
    },
  };
  return (
    <label
      className={cx('yarcl-radio', sizeClass(size ?? group?.size ?? own.size, 'Radio'), colorClass(color ?? group?.color ?? own.color), className)}
      style={style}
    >
      <input type="radio" className="yarcl-radio-input" value={value} onChange={onChange} {...props} {...groupProps} />
      {children != null && <span className="yarcl-radio-label">{children}</span>}
    </label>
  );
}
