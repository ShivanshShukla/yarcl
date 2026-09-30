import {
  useContext,
  useId,
  useRef,
  type ComponentProps,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { colorClass, cx, radiusClass, sizeClass } from '../classes';
import { FieldContext, useFieldProps } from '../field-context';
import { useControllable } from '../hooks';
import type { TokenProps } from '../types';
import { useDefaults } from '../runtime';

/** A {@link Slider} value: one number, or a `[start, end]` pair for a range. */
export type SliderValue = number | [number, number];

/** Props for {@link Slider}. Accepts all native `<div>` attributes except `color`, `defaultValue`, `onChange` and `children`. */
export interface SliderProps<V extends SliderValue = number>
  extends TokenProps<'Slider'>,
    Omit<ComponentProps<'div'>, 'color' | 'defaultValue' | 'onChange' | 'children'> {
  /**
   * Controlled value. Pass a `[start, end]` pair for a range with two thumbs.
   * @example
   * ```tsx
   * <Slider value={volume} onValueChange={setVolume} aria-label="Volume" />
   * ```
   */
  value?: V;
  /**
   * Initial value when uncontrolled. Pass a `[start, end]` pair for a range with two thumbs.
   * @default min
   * @example
   * ```tsx
   * <Slider defaultValue={[20, 80]} aria-label="Price" />
   * ```
   */
  defaultValue?: V;
  /**
   * Called with the new value while the user drags or presses a key.
   * @example
   * ```tsx
   * <Slider onValueChange={(value) => setVolume(value)} aria-label="Volume" />
   * ```
   */
  onValueChange?: (value: V) => void;
  /**
   * Lowest value.
   * @default 0
   * @example
   * ```tsx
   * <Slider min={-10} max={10} aria-label="Offset" />
   * ```
   */
  min?: number;
  /**
   * Highest value.
   * @default 100
   * @example
   * ```tsx
   * <Slider max={10} aria-label="Rating" />
   * ```
   */
  max?: number;
  /**
   * Interval between values. Values snap to multiples of it, counted from `min`.
   * @default 1
   * @example
   * ```tsx
   * <Slider step={5} aria-label="Opacity" />
   * ```
   */
  step?: number;
  /**
   * Jump for PageUp and PageDown.
   * @default a tenth of the range, rounded to a whole number of steps
   * @example
   * ```tsx
   * <Slider step={1} largeStep={25} aria-label="Progress" />
   * ```
   */
  largeStep?: number;
  /**
   * Prevents interaction and dims the slider.
   * @default false
   * @example
   * ```tsx
   * <Slider disabled defaultValue={40} aria-label="Volume" />
   * ```
   */
  disabled?: boolean;
  /**
   * Form field name. Renders a hidden input per thumb with its value.
   * @example
   * ```tsx
   * <Slider name="volume" aria-label="Volume" />
   * ```
   */
  name?: string;
  /**
   * Formats a value for screen readers (`aria-valuetext`).
   * @example
   * ```tsx
   * <Slider formatValue={(value) => `${value} percent`} aria-label="Volume" />
   * ```
   */
  formatValue?: (value: number) => string;
  /**
   * Names of the two thumbs of a range, added to the slider's label.
   * @default ['Minimum', 'Maximum']
   * @example
   * ```tsx
   * <Slider defaultValue={[9, 17]} thumbLabels={['Opens', 'Closes']} aria-label="Hours" />
   * ```
   */
  thumbLabels?: readonly [string, string];
}

/** Props for `Slider.Range`. */
export type SliderRangeProps = SliderProps<[number, number]>;

const clamp = (value: number, low: number, high: number) => Math.min(Math.max(value, low), high);

function decimals(value: number): number {
  const text = String(value);
  const exponent = text.match(/e-(\d+)$/);
  if (exponent) return Number(exponent[1]);
  return text.split('.')[1]?.length ?? 0;
}

const DEFAULT_THUMB_LABELS = ['Minimum', 'Maximum'] as const;

/**
 * Picks a number, or a range with two thumbs, by dragging along a track.
 * Each thumb has `role="slider"` and supports the arrow keys, Home, End, PageUp and PageDown.
 * Shares the size scale with the other controls. Works inside a {@link Field}; outside one, give it an `aria-label`.
 *
 * @example
 * ```tsx
 * <Field label="Volume">
 *   <Slider defaultValue={40} />
 * </Field>
 * ```
 */
function SliderRoot<V extends SliderValue = number>(props: SliderProps<V>) {
  const own = useDefaults('Slider');
  const field = useContext(FieldContext);
  const uid = useId();
  const {
    value: valueProp,
    defaultValue,
    onValueChange,
    min = 0,
    max = 100,
    step = 1,
    largeStep,
    disabled = false,
    name,
    formatValue,
    thumbLabels = DEFAULT_THUMB_LABELS,
    size,
    radius,
    color,
    className,
    style,
    id,
    required: _required,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onLostPointerCapture,
    ...rest
  } = useFieldProps(props) as SliderProps<V> & { required?: boolean };

  const trackRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useControllable<V>(valueProp, defaultValue ?? (min as V), onValueChange, trackRef);
  const thumbRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dragging = useRef<number | null>(null);

  const range = Array.isArray(value);
  const values = (range ? value : [value]).map((v) => clamp(v, min, max));
  const precision = decimals(step);
  const big = largeStep ?? Math.max(step, Math.round((max - min) / 10 / step) * step);

  const snap = (raw: number) => Number(clamp(min + Math.round((raw - min) / step) * step, min, max).toFixed(precision));
  const lowerBound = (index: number) => (range && index === 1 ? values[0] : min);
  const upperBound = (index: number) => (range && index === 0 ? values[1] : max);
  const percent = (v: number) => (max > min ? ((v - min) / (max - min)) * 100 : 0);

  function update(index: number, raw: number) {
    const next = clamp(snap(raw), lowerBound(index), upperBound(index));
    if (next === values[index]) return;
    const nextValues = values.slice();
    nextValues[index] = next;
    setValue((range ? [nextValues[0], nextValues[1]] : nextValues[0]) as V);
  }

  const rtl = () => trackRef.current != null && getComputedStyle(trackRef.current).direction === 'rtl';

  function valueAt(clientX: number): number {
    const rect = trackRef.current!.getBoundingClientRect();
    const ratio = rect.width > 0 ? clamp((clientX - rect.left) / rect.width, 0, 1) : 0;
    return min + (rtl() ? 1 - ratio : ratio) * (max - min);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    onPointerDown?.(event);
    if (disabled || event.defaultPrevented || event.button !== 0) return;
    event.preventDefault();
    const raw = valueAt(event.clientX);
    let index = 0;
    if (range) {
      const [start, end] = values;
      const toStart = Math.abs(raw - start);
      const toEnd = Math.abs(raw - end);
      index = toEnd < toStart || (toEnd === toStart && raw > end) ? 1 : 0;
    }
    dragging.current = index;
    event.currentTarget.setPointerCapture(event.pointerId);
    thumbRefs.current[index]?.focus();
    update(index, raw);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    onPointerMove?.(event);
    if (dragging.current != null) update(dragging.current, valueAt(event.clientX));
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    onPointerUp?.(event);
    dragging.current = null;
  }

  function handleLostPointerCapture(event: PointerEvent<HTMLDivElement>) {
    onLostPointerCapture?.(event);
    dragging.current = null;
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLDivElement>) {
    if (disabled) return;
    const current = values[index];
    const forward = rtl() ? -step : step;
    const moves: Record<string, number> = {
      ArrowRight: current + forward,
      ArrowLeft: current - forward,
      ArrowUp: current + step,
      ArrowDown: current - step,
      PageUp: current + big,
      PageDown: current - big,
      Home: lowerBound(index),
      End: upperBound(index),
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    update(index, moves[event.key]);
  }

  const outerLabelledBy = ariaLabelledBy ?? (field ? field.labelId : undefined);
  const start = range ? percent(values[0]) : 0;
  const end = percent(values[values.length - 1]);

  return (
    <div
      className={cx(
        'yarcl-slider',
        sizeClass(size ?? own.size, 'Slider'),
        radiusClass(radius ?? own.radius, size ?? own.size),
        colorClass(color ?? own.color),
        className,
      )}
      style={{ ...style, '--yarcl-slider-start': `${start}%`, '--yarcl-slider-end': `${end}%` } as CSSProperties}
      data-disabled={disabled || undefined}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onLostPointerCapture={handleLostPointerCapture}
      {...rest}
    >
      <div ref={trackRef} className="yarcl-slider-track">
        <div className="yarcl-slider-range" />
        {values.map((v, index) => {
          const thumbId = index === 0 && id ? id : `${uid}-thumb-${index}`;
          const thumbLabel = range ? thumbLabels[index] : undefined;
          return (
            <div
              key={index}
              ref={(el) => {
                thumbRefs.current[index] = el;
              }}
              id={thumbId}
              role="slider"
              tabIndex={disabled ? undefined : 0}
              className="yarcl-slider-thumb"
              style={{ '--yarcl-slider-position': `${percent(v)}%` } as CSSProperties}
              aria-valuemin={lowerBound(index)}
              aria-valuemax={upperBound(index)}
              aria-valuenow={v}
              aria-valuetext={formatValue?.(v)}
              aria-orientation="horizontal"
              aria-disabled={disabled || undefined}
              aria-invalid={ariaInvalid}
              aria-describedby={ariaDescribedBy}
              aria-label={thumbLabel && !outerLabelledBy && ariaLabel ? `${ariaLabel} ${thumbLabel}` : (thumbLabel ?? ariaLabel)}
              aria-labelledby={outerLabelledBy && (thumbLabel ? `${outerLabelledBy} ${thumbId}` : outerLabelledBy)}
              onKeyDown={(event) => handleKeyDown(index, event)}
            />
          );
        })}
      </div>
      {name != null && values.map((v, index) => <input key={index} type="hidden" name={name} value={v} disabled={disabled} />)}
    </div>
  );
}

function SliderRange(props: SliderRangeProps) {
  return <SliderRoot<[number, number]> {...props} />;
}

/**
 * Picks a number, or a range with two thumbs, by dragging along a track.
 * Use `Slider.Range` for an explicitly range-only API.
 */
export const Slider = Object.assign(SliderRoot, { Range: SliderRange });
