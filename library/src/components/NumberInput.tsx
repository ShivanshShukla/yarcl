import { useEffect, useId, useRef, useState, type ComponentProps, type KeyboardEvent, type FocusEvent } from 'react';
import { colorClass, cx, radiusClass, sizeClass } from '../classes';
import { useFieldProps } from '../field-context';
import { ChevronIcon } from '../floating';
import { useControllable } from '../hooks';
import type { TokenProps } from '../types';
import { useDefaults } from '../runtime';

/**
 * Props for {@link NumberInput}. Native `<input>` attributes go to the inner input;
 * `className` and `style` go to the outer box.
 */
export interface NumberInputProps
  extends TokenProps,
    Omit<ComponentProps<'input'>, 'color' | 'size' | 'type' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step'> {
  /** Controlled value. `null` means the input is empty. */
  value?: number | null;
  /**
   * Initial value when uncontrolled.
   * @default null
   */
  defaultValue?: number | null;
  /** Called with the new value after a step, or when typed text is committed on blur or Enter. */
  onValueChange?: (value: number | null) => void;
  /** Lowest allowed value. Typed values are clamped to it, and `Home` jumps to it. */
  min?: number;
  /** Highest allowed value. Typed values are clamped to it, and `End` jumps to it. */
  max?: number;
  /**
   * Amount added or removed by the stepper buttons and the arrow keys. `PageUp` and `PageDown` step ten times as far.
   * @default 1
   */
  step?: number;
  /**
   * Accessible label of the increment button.
   * @default 'Increase'
   */
  incrementLabel?: string;
  /**
   * Accessible label of the decrement button.
   * @default 'Decrease'
   */
  decrementLabel?: string;
}

function decimals(n: number): number {
  const text = String(n);
  const exp = text.match(/e-(\d+)$/);
  if (exp) return Number(exp[1]);
  return text.split('.')[1]?.length ?? 0;
}

function parse(text: string): number | null | undefined {
  const trimmed = text.trim();
  if (trimmed === '') return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * A numeric input with increment and decrement buttons, exposed as a `spinbutton`.
 * Arrow keys step by `step`, `PageUp` and `PageDown` by ten steps, `Home` and `End` jump to `min` and `max`.
 * Shares the size scale with {@link Input}, so both have the same height at the same size. Works inside a {@link Field}.
 *
 * @example
 * ```tsx
 * <Field label="Guests">
 *   <NumberInput min={1} max={10} defaultValue={2} onValueChange={setGuests} />
 * </Field>
 * ```
 */
export function NumberInput(props: NumberInputProps) {
  const own = useDefaults('NumberInput');
  const fallbackId = useId();
  const {
    value: valueProp,
    defaultValue = null,
    onValueChange,
    min,
    max,
    step = 1,
    incrementLabel = 'Increase',
    decrementLabel = 'Decrease',
    size,
    radius,
    color,
    className,
    style,
    id = fallbackId,
    disabled,
    readOnly,
    onBlur,
    onKeyDown,
    ...rest
  } = useFieldProps(props);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useControllable(valueProp, defaultValue, onValueChange, inputRef);
  const [draft, setDraft] = useState<string | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    const form = inputRef.current.closest('form');
    if (!form) return;
    const onReset = () => setDraft(null);
    form.addEventListener('reset', onReset);
    return () => form.removeEventListener('reset', onReset);
  }, []);

  const clamp = (n: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n));
  const locked = disabled || readOnly;

  function update(next: number | null) {
    setDraft(null);
    if (next !== value) setValue(next);
  }

  function current(): number | null {
    if (draft === null) return value;
    const parsed = parse(draft);
    return parsed === undefined ? value : parsed === null ? null : clamp(parsed);
  }

  function stepBy(amount: number) {
    if (locked) return;
    const base = current();
    if (base === null) {
      update(clamp(amount > 0 ? (min ?? 0) : (max ?? 0)));
      return;
    }
    const precision = Math.max(decimals(base), decimals(step));
    update(clamp(Number((base + amount).toFixed(precision))));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const actions: Record<string, (() => void) | undefined> = {
      ArrowUp: () => stepBy(step),
      ArrowDown: () => stepBy(-step),
      PageUp: () => stepBy(step * 10),
      PageDown: () => stepBy(-step * 10),
      Home: min === undefined || locked ? undefined : () => update(min),
      End: max === undefined || locked ? undefined : () => update(max),
      Enter: draft === null ? undefined : () => update(current()),
    };
    const action = actions[event.key];
    if (!action) return;
    if (event.key !== 'Enter') event.preventDefault();
    action();
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    onBlur?.(event);
    if (draft !== null) update(current());
  }

  const shown = current();
  const canIncrement = !locked && (shown === null || max === undefined || shown < max);
  const canDecrement = !locked && (shown === null || min === undefined || shown > min);

  return (
    <div
      className={cx(
        'yarcl-number-input',
        sizeClass(size ?? own.size),
        radiusClass(radius ?? own.radius, size ?? own.size),
        colorClass(color ?? own.color),
        className,
      )}
      style={style}
    >
      <input
        {...rest}
        ref={(node) => {
          inputRef.current = node;
          const incomingRef = (rest as { ref?: React.Ref<HTMLInputElement> }).ref;
          if (typeof incomingRef === 'function') incomingRef(node);
          else if (incomingRef && 'current' in incomingRef) (incomingRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
        }}
        id={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        role="spinbutton"
        aria-valuenow={value ?? undefined}
        aria-valuemin={min}
        aria-valuemax={max}
        className="yarcl-input yarcl-number-input-field"
        value={draft ?? (value === null ? '' : String(value))}
        disabled={disabled}
        readOnly={readOnly}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
      <div className="yarcl-number-input-steppers">
        <button
          type="button"
          tabIndex={-1}
          className="yarcl-number-input-stepper yarcl-number-input-increment"
          aria-label={incrementLabel}
          aria-controls={id}
          disabled={!canIncrement}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => stepBy(step)}
        >
          <ChevronIcon />
        </button>
        <button
          type="button"
          tabIndex={-1}
          className="yarcl-number-input-stepper yarcl-number-input-decrement"
          aria-label={decrementLabel}
          aria-controls={id}
          disabled={!canDecrement}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => stepBy(-step)}
        >
          <ChevronIcon />
        </button>
      </div>
    </div>
  );
}
