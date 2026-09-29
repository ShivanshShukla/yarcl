import { useId, type ComponentProps, type CSSProperties, type ReactNode } from 'react';
import { colorClass, cx, radiusClass, sizeClass } from '../classes';
import type { Color, ComponentSize, Radius } from '../types';
import { useDefaults } from '../runtime';

/** Props for {@link Progress}. */
export interface ProgressProps extends Omit<ComponentProps<'div'>, 'color' | 'children'> {
  /**
   * Current value, from 0 to `max`. Leave undefined for an indeterminate bar that animates until the work is measurable.
   * @example
   * ```tsx
   * <Progress value={40} label="Uploading" />
   * ```
   */
  value?: number;
  /**
   * The value that means complete.
   * @default 100
   */
  max?: number;
  /**
   * Visible label above the bar. It also names the progress bar for screen readers;
   * without it, pass `aria-label` or `aria-labelledby`.
   */
  label?: ReactNode;
  /** Shows the value next to the label, as a percentage unless `formatValue` is set. Ignored when indeterminate. */
  showValue?: boolean;
  /**
   * Formats the value for the visible text and `aria-valuetext`.
   * @example
   * ```tsx
   * <Progress value={3} max={8} showValue formatValue={(v, max) => `${v} of ${max} files`} />
   * ```
   */
  formatValue?: (value: number, max: number) => string;
  /**
   * Track height, scaled from the size's `iconSize` in the `sizes` config. Also sets the label's font size.
   * @default config.defaults.size
   */
  size?: ComponentSize<'Progress'>;
  /**
   * Bar color, from the `colors` config.
   * @default config.defaults.color
   */
  color?: Color;
  /**
   * Corner radius of the track and bar, from the `radii` config.
   * @default config.defaults.radius
   */
  radius?: Radius | 'size';
}

/**
 * A progress bar. Determinate when `value` is set, indeterminate otherwise.
 * Renders `role="progressbar"` with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`
 * (omitted when indeterminate), named by `label` or `aria-label`.
 *
 * @example
 * ```tsx
 * <Progress value={64} label="Storage used" showValue color="warning" />
 * <Progress aria-label="Loading results" />
 * ```
 */
export function Progress({
  value,
  max = 100,
  label,
  showValue,
  formatValue,
  size,
  color,
  radius,
  className,
  style,
  ...props
}: ProgressProps) {
  const own = useDefaults('Progress');
  const labelId = useId();
  const indeterminate = value == null;
  const limit = max > 0 ? max : 100;
  const current = indeterminate ? 0 : Math.min(Math.max(value, 0), limit);
  const text = formatValue ? formatValue(current, limit) : `${Math.round((current / limit) * 100)}%`;
  const hasLabel = label != null;
  const named = hasLabel || props['aria-label'] != null || props['aria-labelledby'] != null;
  const valueVisible = showValue && !indeterminate;

  return (
    <div
      role="progressbar"
      aria-labelledby={hasLabel ? labelId : undefined}
      aria-label={named ? undefined : 'Progress'}
      aria-valuemin={indeterminate ? undefined : 0}
      aria-valuemax={indeterminate ? undefined : limit}
      aria-valuenow={indeterminate ? undefined : current}
      aria-valuetext={indeterminate || !formatValue ? undefined : text}
      data-indeterminate={indeterminate || undefined}
      className={cx(
        'yarcl-progress',
        sizeClass(size ?? own.size, 'Progress'),
        colorClass(color ?? own.color),
        radiusClass(radius ?? own.radius, size ?? own.size),
        className,
      )}
      style={{ ...(indeterminate ? null : { '--yarcl-progress': current / limit }), ...style } as CSSProperties}
      {...props}
    >
      {(hasLabel || valueVisible) && (
        <div className="yarcl-progress-header">
          {hasLabel && (
            <span id={labelId} className="yarcl-progress-label">
              {label}
            </span>
          )}
          {valueVisible && <span className="yarcl-progress-value">{text}</span>}
        </div>
      )}
      <div className="yarcl-progress-track">
        <div className="yarcl-progress-bar" />
      </div>
    </div>
  );
}
