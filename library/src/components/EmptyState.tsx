import type { ComponentProps, ReactNode } from 'react';
import { colorClass, cx, gapClass, paddingClass, typeClass } from '../classes';
import { useConfig, useDefaults } from '../runtime';
import type { Color, Spacing, TextStyle } from '../types';
import { Heading } from './Heading';

/** Props for {@link EmptyState}. */
export interface EmptyStateProps extends Omit<ComponentProps<'div'>, 'children' | 'color' | 'title'> {
  /** Main message. */
  title: ReactNode;
  /** Supporting text below the title. */
  description?: ReactNode;
  /** Decorative content shown above the title. */
  icon?: ReactNode;
  /** Actions shown below the description, usually buttons or links. */
  actions?: ReactNode;
  /**
   * Semantic heading level for the title.
   * @default 2
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Icon color, from the `colors` config.
   * @default config.defaults.color
   */
  color?: Color;
  /**
   * Space between content, from the `spacing` config.
   * @default config.defaults.gap
   */
  gap?: Spacing;
  /**
   * Inner spacing, from the `spacing` config.
   * @default config.defaults.padding
   */
  padding?: Spacing;
  /**
   * Description typography, from the `typography.styles` config.
   * @default config.defaults.textStyle
   */
  textStyle?: TextStyle;
}

/**
 * A centered message for a view that has no content yet or no matching results.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   title="No projects yet"
 *   description="Create a project to start organizing your work."
 *   actions={<Button>Create project</Button>}
 * />
 * ```
 */
export function EmptyState({
  title,
  description,
  icon,
  actions,
  headingLevel = 2,
  color,
  gap,
  padding,
  textStyle,
  className,
  ...props
}: EmptyStateProps) {
  const own = useDefaults('EmptyState');
  const config = useConfig();

  return (
    <div
      className={cx(
        'yarcl-empty-state',
        colorClass(color ?? own.color),
        gapClass(gap ?? own.gap),
        paddingClass(padding ?? own.padding),
        typeClass(textStyle ?? own.textStyle ?? config.defaults.textStyle),
        className,
      )}
      {...props}
    >
      {icon != null && (
        <div className="yarcl-empty-state-icon" aria-hidden="true">
          {icon}
        </div>
      )}
      <Heading level={headingLevel} className="yarcl-empty-state-title">
        {title}
      </Heading>
      {description != null && <p className="yarcl-empty-state-description">{description}</p>}
      {actions != null && <div className="yarcl-empty-state-actions">{actions}</div>}
    </div>
  );
}
