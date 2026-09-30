import type { ComponentProps, ReactNode } from 'react';
import { colorClass, cx, gapClass, paddingClass, radiusClass, softVariantClass, typeClass } from '../classes';
import type { Color, Radius, Spacing, TextStyle, Variant } from '../types';
import { useConfig, useDefaults } from '../runtime';


/** Props for {@link Alert}. */
export interface AlertProps extends Omit<ComponentProps<'div'>, 'color' | 'title'> {
  /** Bold first line. */
  title?: ReactNode;
  /** Icon shown before the text. */
  icon?: ReactNode;
  /** Actions shown after the text, e.g. a {@link Button} or {@link Link}. */
  action?: ReactNode;
  /**
   * Semantic color, from the `colors` config.
   * @default config.defaults.color
   */
  color?: Color;
  /**
   * Style recipe, from the `variants` config.
   * @default config.defaults.softVariant
   */
  variant?: Variant;
  /**
   * Corner radius, from the `radii` config.
   * @default config.defaults.radius
   */
  radius?: Radius;
  /**
   * Space between the icon, text, action and dismiss button, from the `spacing` config.
   * @default config.components.Alert.gap ?? config.defaults.gap
   */
  gap?: Spacing;
  /**
   * Inner spacing, from the `spacing` config.
   * @default config.components.Alert.padding ?? config.defaults.padding
   */
  padding?: Spacing;
  /**
   * Typography style, from the `typography.styles` config.
   * @default config.components.Alert.textStyle ?? config.defaults.labelStyle
   */
  textStyle?: TextStyle;
  /** Shows a dismiss button. Called when it is pressed; hide the alert in response. */
  onDismiss?: () => void;
  /**
   * Announces the alert when it appears: `'polite'` (`role="status"`) or `'assertive'` (`role="alert"`).
   * Leave unset for messages present on page load.
   */
  live?: 'polite' | 'assertive';
}

/**
 * An inline message that stays on the page, e.g. a warning above a form.
 * For transient messages use {@link toast}.
 *
 * @example
 * ```tsx
 * <Alert color="warning" title="Trial ends in 3 days" action={<Button size="sm">Upgrade</Button>}>
 *   Add a payment method to keep your projects.
 * </Alert>
 * ```
 */
export function Alert({
  title,
  icon,
  action,
  color,
  variant,
  radius,
  gap,
  padding,
  textStyle,
  onDismiss,
  live,
  className,
  children,
  ...props
}: AlertProps) {
  const own = useDefaults('Alert');
  const config = useConfig();
  return (
    <div
      role={live === 'assertive' ? 'alert' : live === 'polite' ? 'status' : undefined}
      className={cx(
        'yarcl-alert',
        colorClass(color ?? own.color),
        softVariantClass(variant ?? own.variant),
        radiusClass(radius ?? own.radius),
        gapClass(gap ?? own.gap),
        paddingClass(padding ?? own.padding),
        typeClass(textStyle ?? own.textStyle ?? config.defaults.labelStyle),
        className,
      )}
      {...props}
    >
      {icon != null && <span className="yarcl-alert-icon">{icon}</span>}
      <div className="yarcl-alert-text">
        {title != null && <div className="yarcl-alert-title">{title}</div>}
        {children != null && <div className="yarcl-alert-body">{children}</div>}
      </div>
      {action != null && <div className="yarcl-alert-action">{action}</div>}
      {onDismiss && (
        <button type="button" className="yarcl-alert-dismiss" aria-label="Dismiss" onClick={onDismiss}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      )}
    </div>
  );
}
