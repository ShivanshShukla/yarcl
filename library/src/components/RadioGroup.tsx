import { createContext, useContext, useId, type ComponentProps, type ReactNode } from 'react';
import { cx, typeClass } from '../classes';
import { useControllable } from '../hooks';
import type { Color, ComponentSize, Size } from '../types';
import { useConfig } from '../runtime';

interface RadioGroupContextValue {
  name: string;
  value: string | null;
  select: (value: string) => void;
  size?: Size;
  color?: Color;
  invalid: boolean;
  disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export function useRadioGroup() {
  return useContext(RadioGroupContext);
}

/** Props for {@link RadioGroup}. */
export interface RadioGroupProps extends Omit<ComponentProps<'fieldset'>, 'defaultValue' | 'onChange' | 'color'> {
  /** Visible group label, rendered as the `<legend>`. */
  label: ReactNode;
  /** Helper text shown below the options. */
  description?: ReactNode;
  /** Error message. Marks the options invalid and styles them with `defaults.errorColor`. */
  error?: ReactNode;
  /** Form field name shared by the radios. Generated when omitted. */
  name?: string;
  /** Controlled selected value. */
  value?: string | null;
  /**
   * Initially selected value when uncontrolled.
   * @default null
   */
  defaultValue?: string | null;
  /** Called with the selected radio's `value`. */
  onValueChange?: (value: string) => void;
  /** Size of every radio, from the `sizes` config. */
  size?: ComponentSize<'Radio'>;
  /** Color of every radio, from the `colors` config. */
  color?: Color;
  /**
   * Lays the radios out in a row or a column.
   * @default 'vertical'
   */
  orientation?: 'horizontal' | 'vertical';
  /** {@link Radio}s, each with a `value`. */
  children: ReactNode;
}

/**
 * A labelled group of {@link Radio}s. Renders a `<fieldset>` and `<legend>`, shares one `name`,
 * and tracks the selected value. Radios inside don't need `name` or `checked`.
 *
 * @example
 * ```tsx
 * <RadioGroup label="Plan" defaultValue="pro" orientation="horizontal">
 *   <Radio value="free">Free</Radio>
 *   <Radio value="pro">Pro</Radio>
 * </RadioGroup>
 * ```
 */
export function RadioGroup({
  label,
  description,
  error,
  name,
  value: valueProp,
  defaultValue = null,
  onValueChange,
  size,
  color,
  orientation = 'vertical',
  disabled,
  className,
  children,
  ...props
}: RadioGroupProps) {
  const config = useConfig();
  const id = useId();
  const [value, setValue] = useControllable<string | null>(valueProp, defaultValue, (v) => v != null && onValueChange?.(v));
  const descriptionId = description != null ? `${id}-description` : undefined;
  const errorId = error != null && error !== false ? `${id}-error` : undefined;

  return (
    <RadioGroupContext.Provider
      value={{ name: name ?? id, value, select: setValue, size, color, invalid: errorId != null, disabled }}
    >
      <fieldset
        className={cx('yarcl-field yarcl-radio-group', className)}
        aria-describedby={cx(descriptionId, errorId) || undefined}
        disabled={disabled}
        {...props}
      >
        <legend className={cx('yarcl-field-label', typeClass(config.defaults.labelStyle))}>{label}</legend>
        <div className={cx('yarcl-radio-group-options', `yarcl-radio-group-${orientation}`)}>{children}</div>
        {descriptionId && (
          <p className={cx('yarcl-field-description', typeClass(config.defaults.helperStyle))} id={descriptionId}>
            {description}
          </p>
        )}
        {errorId && (
          <p className={cx('yarcl-field-error', typeClass(config.defaults.helperStyle))} id={errorId}>
            {error}
          </p>
        )}
      </fieldset>
    </RadioGroupContext.Provider>
  );
}
