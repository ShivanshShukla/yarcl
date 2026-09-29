import { createContext, useContext, type ComponentProps } from 'react';
import { cx } from '../classes';
import type { TokenProps, VariantProps } from '../types';

const ButtonGroupContext = createContext<(TokenProps<'Button'> & VariantProps) | null>(null);

export function useButtonGroup() {
  return useContext(ButtonGroupContext);
}

/** Props for {@link ButtonGroup}. Token props are passed down to every button inside. */
export interface ButtonGroupProps extends Omit<ComponentProps<'div'>, 'color'>, TokenProps<'Button'>, VariantProps {
  /**
   * Joins the buttons into one control with shared borders.
   * @default true
   */
  attached?: boolean;
  /**
   * Direction of the buttons.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
}

/**
 * Groups related {@link Button}s and {@link IconButton}s. Buttons inherit `size`, `color`,
 * `variant` and `radius` from the group unless they set their own. Give the group an `aria-label`.
 *
 * @example
 * ```tsx
 * <ButtonGroup aria-label="Pagination" variant="outline">
 *   <Button>Previous</Button>
 *   <Button>Next</Button>
 * </ButtonGroup>
 * ```
 */
export function ButtonGroup({
  size,
  color,
  variant,
  radius,
  attached = true,
  orientation = 'horizontal',
  className,
  ...props
}: ButtonGroupProps) {
  return (
    <ButtonGroupContext.Provider value={{ size, color, variant, radius }}>
      <div
        role="group"
        className={cx(
          'yarcl-button-group',
          `yarcl-button-group-${orientation}`,
          attached && 'yarcl-button-group-attached',
          className,
        )}
        {...props}
      />
    </ButtonGroupContext.Provider>
  );
}
