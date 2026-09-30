import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  type ComponentProps,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx, sizeClass } from '../classes';
import { useControllable } from '../hooks';
import type { Color, ComponentSize, Radius, Size, Variant } from '../types';
import { Button } from './Button';
import { useConfig, useDefaults } from '../runtime';


interface ToggleGroupContextValue {
  selected: string[];
  toggle: (value: string) => void;
  size?: Size;
  color?: Color;
  radius?: Radius | 'size';
  variant: Variant;
  selectedVariant: Variant;
  disabled?: boolean;
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

/** Props shared by both forms of {@link ToggleGroupProps}. */
export interface ToggleGroupBaseProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange' | 'color'> {
  /** Size of every item, from the `sizes` config. */
  size?: ComponentSize<'ToggleGroup'>;
  /** Color of every item, from the `colors` config. */
  color?: Color;
  /** Radius of every item, from the `radii` config, or `'size'` to match the item size. */
  radius?: Radius | 'size';
  /**
   * Variant of unselected items, from the `variants` config.
   * @default config.defaults.softVariant
   */
  variant?: Variant;
  /**
   * Variant of selected items, from the `variants` config.
   * @default config.defaults.variant
   */
  selectedVariant?: Variant;
  /**
   * Joins the items into one segmented control.
   * @default true
   */
  attached?: boolean;
  /** Disables every item. */
  disabled?: boolean;
  /** `ToggleGroup.Item`s. */
  children?: ReactNode;
}

/** Props for {@link ToggleGroup}. `type` decides whether one or many items can be on. */
export type ToggleGroupProps = ToggleGroupBaseProps &
  (
    | {
        /** One item on at a time, like a segmented control. */
        type: 'single';
        /** Controlled selected value. */
        value?: string | null;
        /** Initially selected value when uncontrolled. */
        defaultValue?: string | null;
        /** Called with the selected value, or `null` when the selected item is turned off. */
        onValueChange?: (value: string | null) => void;
        /** Prevents turning the selected item off, so one is always on. */
        required?: boolean;
      }
    | {
        /** Any number of items on, like formatting buttons. */
        type: 'multiple';
        /** Controlled selected values. */
        value?: string[];
        /** Initially selected values when uncontrolled. */
        defaultValue?: string[];
        /** Called with all selected values. */
        onValueChange?: (value: string[]) => void;
        required?: never;
      }
  );

const toArray = (value: string | string[] | null | undefined) => (value == null ? [] : Array.isArray(value) ? value : [value]);

function ToggleGroupRoot(props: ToggleGroupProps) {
  const config = useConfig();
  const own = useDefaults('ToggleGroup');
  const {
    type,
    value,
    defaultValue,
    onValueChange,
    required,
    size = own.size,
    color = own.color,
    radius = own.radius,
    variant = own.variant ?? config.defaults.softVariant,
    selectedVariant = own.selectedVariant ?? config.defaults.variant,
    attached = true,
    disabled,
    className,
    onKeyDown,
    children,
    ...rest
  } = props;

  const ref = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useControllable<string[]>(
    value === undefined ? undefined : toArray(value),
    toArray(defaultValue),
    (next) =>
      type === 'multiple'
        ? (onValueChange as (v: string[]) => void)?.(next)
        : (onValueChange as (v: string | null) => void)?.(next[0] ?? null),
    ref,
  );

  useLayoutEffect(() => {
    const items = [...(ref.current?.querySelectorAll<HTMLButtonElement>('.yarcl-toggle-item') ?? [])];
    const stop = items.find((item) => item.getAttribute('aria-pressed') === 'true' && !item.disabled) ?? items.find((item) => !item.disabled);
    items.forEach((item) => (item.tabIndex = item === stop ? 0 : -1));
  });

  function toggle(item: string) {
    const on = selected.includes(item);
    if (type === 'multiple') setSelected(on ? selected.filter((v) => v !== item) : [...selected, item]);
    else if (!on) setSelected([item]);
    else if (!required) setSelected([]);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    const items = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('.yarcl-toggle-item:not(:disabled)')];
    const current = items.indexOf(document.activeElement as HTMLButtonElement);
    if (current === -1) return;
    const next = {
      ArrowRight: (current + 1) % items.length,
      ArrowDown: (current + 1) % items.length,
      ArrowLeft: (current - 1 + items.length) % items.length,
      ArrowUp: (current - 1 + items.length) % items.length,
      Home: 0,
      End: items.length - 1,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    items.forEach((item, i) => (item.tabIndex = i === next ? 0 : -1));
    items[next].focus();
  }

  return (
    <ToggleGroupContext.Provider
      value={{
        selected,
        toggle,
        size,
        color,
        radius,
        variant,
        selectedVariant,
        disabled,
      }}
    >
      <div
        ref={ref}
        role="group"
        className={cx(
          'yarcl-button-group yarcl-button-group-horizontal yarcl-toggle-group',
          sizeClass(size, 'ToggleGroup'),
          attached && 'yarcl-button-group-attached',
          className,
        )}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
}

/** Props for `ToggleGroup.Item`. */
export interface ToggleGroupItemProps extends Omit<ComponentProps<'button'>, 'value' | 'color'> {
  /** Identifies the item in the group's value. */
  value: string;
  /** Makes the item square, for icon-only items. Give it an `aria-label`. */
  icon?: boolean;
}

function ToggleGroupItem({ value, icon, disabled, className, onClick, ...props }: ToggleGroupItemProps) {
  const context = useContext(ToggleGroupContext);
  if (!context) throw new Error('yarcl: <ToggleGroup.Item> must be inside <ToggleGroup>');
  const on = context.selected.includes(value);
  return (
    <Button
      aria-pressed={on}
      data-value={value}
      disabled={disabled || context.disabled}
      size={context.size}
      color={context.color}
      radius={context.radius}
      variant={on ? context.selectedVariant : context.variant}
      className={cx('yarcl-toggle-item', icon && 'yarcl-icon-button', className)}
      onClick={(event) => {
        onClick?.(event);
        context.toggle(value);
      }}
      {...props}
    />
  );
}

/**
 * A set of toggle buttons. `type="single"` behaves like a segmented control,
 * `type="multiple"` like formatting buttons. Items use `aria-pressed`; arrow keys move focus.
 *
 * @example
 * ```tsx
 * <ToggleGroup type="single" defaultValue="week" aria-label="Range" required>
 *   <ToggleGroup.Item value="day">Day</ToggleGroup.Item>
 *   <ToggleGroup.Item value="week">Week</ToggleGroup.Item>
 *   <ToggleGroup.Item value="month">Month</ToggleGroup.Item>
 * </ToggleGroup>
 * ```
 */
export const ToggleGroup = Object.assign(ToggleGroupRoot, { Item: ToggleGroupItem });
