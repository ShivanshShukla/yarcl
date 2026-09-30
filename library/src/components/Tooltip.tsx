import {
  autoUpdate,
  FloatingArrow,
  FloatingPortal,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  type Placement,
} from '@floating-ui/react';
import { useRef, useState, type ReactElement, type ReactNode } from 'react';
import { cx, paddingClass, radiusClass, typeClass } from '../classes';
import { floatingMiddleware, useTrigger } from '../floating';
import { useConfig, useDefaults } from '../runtime';
import type { Radius, Spacing, TextStyle } from '../types';

/** Props for {@link Tooltip}. */
export interface TooltipProps {
  /** Short text describing the trigger. Keep it plain; tooltips can't contain interactive content. */
  content: ReactNode;
  /** A single focusable element, e.g. an {@link IconButton}. */
  children: ReactElement;
  /**
   * Preferred side. Flips when there isn't room.
   * @default 'top'
   */
  placement?: Placement;
  /**
   * Delay before opening on hover, in ms. Opens immediately on keyboard focus.
   * @default config.timing.tooltipDelay
   */
  delay?: number;
  /**
   * Corner radius, from the `radii` config.
   * @default config.components.Tooltip.radius ?? config.defaults.radius
   */
  radius?: Radius;
  /**
   * Inner spacing, from the `spacing` config.
   * @default config.components.Tooltip.padding ?? config.defaults.padding
   */
  padding?: Spacing;
  /**
   * Typography style, from the `typography.styles` config.
   * @default config.components.Tooltip.textStyle ?? config.defaults.helperStyle
   */
  textStyle?: TextStyle;
}

/**
 * A short label shown on hover and keyboard focus.
 *
 * @example
 * ```tsx
 * <Tooltip content="Search">
 *   <IconButton aria-label="Search"><SearchIcon /></IconButton>
 * </Tooltip>
 * ```
 */
export function Tooltip({ content, children, placement = 'top', delay, radius, padding, textStyle }: TooltipProps) {
  const config = useConfig();
  const own = useDefaults('Tooltip');
  const [open, setOpen] = useState(false);
  const arrowRef = useRef<SVGSVGElement>(null);
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    transform: false,
    whileElementsMounted: autoUpdate,
    middleware: floatingMiddleware({ gap: 8, arrowRef }),
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, { move: false, delay: { open: delay ?? config.timing.tooltipDelay, close: 0 } }),
    useFocus(context),
    useDismiss(context),
    useRole(context, { role: 'tooltip' }),
  ]);
  const trigger = useTrigger(children, refs.setReference, getReferenceProps);

  return (
    <>
      {trigger}
      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className={cx(
              'yarcl-floating yarcl-tooltip',
              radiusClass(radius ?? own.radius),
              paddingClass(padding ?? own.padding),
              typeClass(textStyle ?? own.textStyle ?? config.defaults.helperStyle),
            )}
            {...getFloatingProps()}
          >
            {content}
            <FloatingArrow ref={arrowRef} context={context} className="yarcl-tooltip-arrow" width={10} height={5} />
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
