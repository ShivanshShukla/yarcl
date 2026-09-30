import {
  addDays,
  addMonths,
  addYears,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  startOfDay,
  startOfMonth,
  startOfWeek,
  type Day,
  type Locale,
} from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { useContext, useEffect, useId, useRef, useState, type ComponentProps, type KeyboardEvent, type ReactNode } from 'react';
import { colorClass, cx, radiusClass, sizeClass, softVariantClass, variantClass } from '../classes';
import { FieldContext, useFieldProps } from '../field-context';
import { useControllable } from '../hooks';
import { useDefaults } from '../runtime';
import type { TokenProps, VariantProps } from '../types';
import { Popover } from './Popover';

/** A date range picked with a {@link DatePicker} in `mode="range"`. `to` is `null` while only the start is picked. */
export interface DateRange {
  /** First day of the range. */
  from: Date;
  /** Last day of the range, or `null` until the second day is picked. */
  to: Date | null;
}

/** Text for the parts of a {@link DatePicker} that have no visible label. */
export interface DatePickerLabels {
  /** Accessible name of the calendar popover. */
  dialog: string;
  /** Accessible name of the previous month button. */
  previousMonth: string;
  /** Accessible name of the next month button. */
  nextMonth: string;
}

/** Props shared by both modes of {@link DatePicker}. */
export interface DatePickerBaseProps
  extends TokenProps<'DatePicker'>,
    VariantProps,
    Omit<ComponentProps<'button'>, 'color' | 'value' | 'defaultValue' | 'onChange' | 'children' | 'type' | 'name'> {
  /**
   * Earliest day that can be picked. Earlier days are shown disabled and the calendar can't move before its month.
   * @example
   * ```tsx
   * <DatePicker min={new Date()} />
   * ```
   */
  min?: Date;
  /**
   * Latest day that can be picked.
   * @example
   * ```tsx
   * <DatePicker max={addYears(new Date(), 1)} />
   * ```
   */
  max?: Date;
  /**
   * Returns `true` for days that can't be picked, e.g. weekends or booked dates. They stay focusable but can't be chosen.
   * @example
   * ```tsx
   * <DatePicker isDateDisabled={isWeekend} />
   * ```
   */
  isDateDisabled?: (date: Date) => boolean;
  /**
   * A date-fns locale. Sets month and weekday names, the display format and the first day of the week.
   * @default enUS
   * @example
   * ```tsx
   * import { de } from 'date-fns/locale';
   * <DatePicker locale={de} />
   * ```
   */
  locale?: Locale;
  /**
   * First day of the week, from 0 (Sunday) to 6 (Saturday).
   * @default the locale's first day of the week
   * @example
   * ```tsx
   * <DatePicker weekStartsOn={1} />
   * ```
   */
  weekStartsOn?: Day;
  /**
   * A date-fns `format` pattern for the value shown in the trigger.
   * @default 'PP'
   * @example
   * ```tsx
   * <DatePicker displayFormat="yyyy-MM-dd" />
   * ```
   */
  displayFormat?: string;
  /**
   * Text shown when nothing is picked.
   * @example
   * ```tsx
   * <DatePicker placeholder="Pick a date" />
   * ```
   */
  placeholder?: ReactNode;
  /**
   * Form field name. Renders a hidden input with the value as `yyyy-MM-dd`, or `yyyy-MM-dd/yyyy-MM-dd` for a range.
   * @example
   * ```tsx
   * <DatePicker name="birthday" />
   * ```
   */
  name?: string;
  /**
   * Accessible names for the popover and the month buttons, for translation.
   * @default { dialog: 'Choose date', previousMonth: 'Previous month', nextMonth: 'Next month' }
   * @example
   * ```tsx
   * <DatePicker labels={{ dialog: 'Datum wählen', previousMonth: 'Vorheriger Monat', nextMonth: 'Nächster Monat' }} />
   * ```
   */
  labels?: Partial<DatePickerLabels>;
}

/** Props for {@link DatePicker} picking one day. */
export interface DatePickerSingleProps extends DatePickerBaseProps {
  /**
   * Picks one day.
   * @default 'single'
   */
  mode?: 'single';
  /** Controlled value. `null` means nothing is picked. */
  value?: Date | null;
  /**
   * Initial value when uncontrolled.
   * @default null
   */
  defaultValue?: Date | null;
  /**
   * Called with the picked day.
   * @example
   * ```tsx
   * <DatePicker value={date} onValueChange={setDate} />
   * ```
   */
  onValueChange?: (value: Date | null) => void;
}

/** Props for {@link DatePicker} picking a range of days. */
export interface DatePickerRangeProps extends DatePickerBaseProps {
  /** Picks a start and an end day. */
  mode: 'range';
  /** Controlled value. `null` means nothing is picked. */
  value?: DateRange | null;
  /**
   * Initial value when uncontrolled.
   * @default null
   */
  defaultValue?: DateRange | null;
  /**
   * Called when the start is picked (with `to: null`) and again when the range is complete.
   * @example
   * ```tsx
   * <DatePicker mode="range" value={range} onValueChange={setRange} />
   * ```
   */
  onValueChange?: (value: DateRange | null) => void;
}

/** Props for {@link DatePicker}. `mode` decides whether one day or a range is picked. */
export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps;

const defaultLabels: DatePickerLabels = { dialog: 'Choose date', previousMonth: 'Previous month', nextMonth: 'Next month' };

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

const calendarPath = 'M8 3v4M16 3v4M4 10h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z';
const iso = (date: Date) => format(date, 'yyyy-MM-dd');

/**
 * Picks a day or a range of days from a calendar popover. Built on {@link Popover}, with dates handled by date-fns.
 * The trigger shares the size scale with {@link Input}. Picked days use `variant`, days inside a range use
 * `defaults.softVariant`. The calendar follows the WAI-ARIA date picker dialog pattern. Works inside a {@link Field}.
 *
 * @example
 * ```tsx
 * <Field label="Check-in">
 *   <DatePicker value={date} onValueChange={setDate} min={new Date()} placeholder="Pick a date" />
 * </Field>
 * ```
 */
export function DatePicker(props: DatePickerProps) {
  const own = useDefaults('DatePicker');
  const field = useContext(FieldContext);
  const {
    mode = 'single',
    value: valueProp,
    defaultValue = null,
    onValueChange,
    min,
    max,
    isDateDisabled,
    locale = enUS,
    weekStartsOn,
    displayFormat = 'PP',
    placeholder,
    name,
    labels: labelsProp,
    size,
    radius,
    color,
    variant,
    className,
    required: _required,
    ...rest
  } = useFieldProps(props as DatePickerProps & { required?: boolean });
  const range = mode === 'range';
  const labels = { ...defaultLabels, ...labelsProp };
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [value, setValue] = useControllable<Date | DateRange | null>(
    valueProp,
    defaultValue,
    onValueChange as ((value: Date | DateRange | null) => void) | undefined,
    triggerRef,
  );
  const from = value == null ? null : value instanceof Date ? value : value.from;
  const to = value == null ? null : value instanceof Date ? value : value.to;

  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(() => startOfDay(new Date()));
  const [hovered, setHovered] = useState<Date | null>(null);
  const cellRef = useRef<HTMLTableCellElement | null>(null);
  const moveFocus = useRef(false);
  const id = useId();
  const titleId = `${id}-title`;
  const valueId = `${id}-value`;

  const minDay = min && startOfDay(min);
  const maxDay = max && startOfDay(max);
  const outOfRange = (day: Date) => (minDay != null && isBefore(day, minDay)) || (maxDay != null && isAfter(day, maxDay));
  const unavailable = (day: Date) => outOfRange(day) || !!isDateDisabled?.(day);
  const clamp = (day: Date) => (minDay && isBefore(day, minDay) ? minDay : maxDay && isAfter(day, maxDay) ? maxDay : day);
  const week = { locale, weekStartsOn };

  useEffect(() => {
    if (!open || !moveFocus.current) return;
    moveFocus.current = false;
    cellRef.current?.focus();
  }, [open, focused]);

  function onOpenChange(next: boolean) {
    if (next) {
      setFocused(clamp(startOfDay(from ?? new Date())));
      setHovered(null);
    }
    setOpen(next);
  }

  function pick(day: Date) {
    if (unavailable(day)) return;
    if (!range) {
      setValue(day);
      setOpen(false);
    } else if (!from || to) {
      setValue({ from: day, to: null });
    } else {
      setValue(isBefore(day, from) ? { from: day, to: from } : { from, to: day });
      setOpen(false);
    }
  }

  function navigate(day: Date) {
    moveFocus.current = true;
    setFocused(clamp(day));
  }

  function onGridKeyDown(event: KeyboardEvent<HTMLTableElement>) {
    const moves: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focused, -1),
      ArrowRight: () => addDays(focused, 1),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      Home: () => startOfWeek(focused, week),
      End: () => startOfDay(endOfWeek(focused, week)),
      PageUp: () => (event.shiftKey ? addYears(focused, -1) : addMonths(focused, -1)),
      PageDown: () => (event.shiftKey ? addYears(focused, 1) : addMonths(focused, 1)),
    };
    const move = moves[event.key];
    if (move) {
      event.preventDefault();
      navigate(move());
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      pick(focused);
    }
  }

  const month = startOfMonth(focused);
  const first = startOfWeek(month, week);
  const days = Array.from({ length: 42 }, (_, i) => addDays(first, i));
  const weeks = Array.from({ length: 6 }, (_, i) => days.slice(i * 7, i * 7 + 7));
  const prevDisabled = minDay != null && isBefore(endOfMonth(addMonths(month, -1)), minDay);
  const nextDisabled = maxDay != null && isAfter(addMonths(month, 1), maxDay);

  const previewEnd = range && from && !to ? (hovered ?? focused) : null;
  const [spanStart, spanEnd] = previewEnd && from
    ? isBefore(previewEnd, from) ? [previewEnd, from] : [from, previewEnd]
    : [from, to];
  const inSpan = (day: Date) => spanStart != null && spanEnd != null && isAfter(day, spanStart) && isBefore(day, spanEnd);
  const isEndpoint = (day: Date) => (from != null && isSameDay(day, from)) || (to != null && isSameDay(day, to));

  const show = (date: Date) => format(date, displayFormat, { locale });
  const display = from ? (range && to ? `${show(from)} – ${show(to)}` : show(from)) : null;
  const labelled = field != null || rest['aria-label'] != null || rest['aria-labelledby'] != null;
  const s = size ?? own.size;
  const hidden = value == null ? '' : range ? `${from ? iso(from) : ''}/${to ? iso(to) : ''}` : from ? iso(from) : '';

  return (
    <>
      <Popover open={open} onOpenChange={onOpenChange} placement="bottom-start" modal>
        <Popover.Trigger>
          <button
            ref={(node) => {
              triggerRef.current = node;
              const incomingRef = (rest as { ref?: React.Ref<HTMLButtonElement> }).ref;
              if (typeof incomingRef === 'function') incomingRef(node);
              else if (incomingRef && 'current' in incomingRef) (incomingRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
            }}
            type="button"
            className={cx('yarcl-input yarcl-select yarcl-date-picker', sizeClass(s, 'DatePicker'), radiusClass(radius ?? own.radius, s), colorClass(color ?? own.color), className)}
            {...rest}
            aria-describedby={cx(labelled && display && valueId, rest['aria-describedby']) || undefined}
          >
            <span id={valueId} className={cx('yarcl-select-value', !display && 'yarcl-select-placeholder')}>
              {display ?? placeholder}
            </span>
            <Icon d={calendarPath} />
          </button>
        </Popover.Trigger>
        <Popover.Content
          aria-label={labels.dialog}
          initialFocus={cellRef}
          className={cx('yarcl-date-picker-panel', sizeClass(s, 'DatePicker'), colorClass(color ?? own.color))}
        >
          <div className="yarcl-date-picker-header">
            <button
              type="button"
              className="yarcl-date-picker-nav"
              aria-label={labels.previousMonth}
              aria-disabled={prevDisabled || undefined}
              onClick={() => !prevDisabled && setFocused(clamp(addMonths(focused, -1)))}
            >
              <Icon d="m15 6-6 6 6 6" />
            </button>
            <div id={titleId} className="yarcl-date-picker-title" aria-live="polite">
              {format(month, 'LLLL y', { locale })}
            </div>
            <button
              type="button"
              className="yarcl-date-picker-nav"
              aria-label={labels.nextMonth}
              aria-disabled={nextDisabled || undefined}
              onClick={() => !nextDisabled && setFocused(clamp(addMonths(focused, 1)))}
            >
              <Icon d="m9 6 6 6-6 6" />
            </button>
          </div>
          <table
            role="grid"
            aria-labelledby={titleId}
            aria-multiselectable={range || undefined}
            className={cx('yarcl-date-picker-grid', radiusClass(radius ?? own.radius, s))}
            onKeyDown={onGridKeyDown}
            onMouseLeave={() => setHovered(null)}
          >
            <thead>
              <tr>
                {weeks[0].map((day) => (
                  <th key={day.getDay()} scope="col" abbr={format(day, 'EEEE', { locale })}>
                    {format(day, 'EEEEEE', { locale })}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((row) => (
                <tr key={iso(row[0])}>
                  {row.map((day) => {
                    if (!isSameMonth(day, month)) return <td key={iso(day)} role="gridcell" />;
                    const isFocused = isSameDay(day, focused);
                    const endpoint = isEndpoint(day);
                    const between = inSpan(day);
                    const selected = endpoint || (between && !previewEnd);
                    return (
                      <td
                        key={iso(day)}
                        ref={isFocused ? cellRef : undefined}
                        role="gridcell"
                        tabIndex={isFocused ? 0 : -1}
                        aria-selected={selected}
                        aria-disabled={unavailable(day) || undefined}
                        aria-current={isToday(day) ? 'date' : undefined}
                        aria-label={format(day, 'PPPP', { locale })}
                        data-selected={endpoint || undefined}
                        data-in-range={between || undefined}
                        className={cx(
                          'yarcl-date-picker-day',
                          endpoint ? variantClass(variant ?? own.variant) : between && softVariantClass(),
                        )}
                        onClick={() => {
                          setFocused(day);
                          pick(day);
                        }}
                        onMouseEnter={() => range && setHovered(day)}
                      >
                        {format(day, 'd', { locale })}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Popover.Content>
      </Popover>
      {name && <input type="hidden" name={name} value={hidden} />}
    </>
  );
}
