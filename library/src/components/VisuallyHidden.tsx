import type { ComponentProps, ReactNode } from 'react';
import { cx } from '../classes';

/** Props for {@link VisuallyHidden}. */
export interface VisuallyHiddenProps extends ComponentProps<'span'> {
  /** Content exposed to assistive technology. */
  children?: ReactNode;
}

/**
 * Keeps content available to assistive technology while removing it from the visual layout.
 *
 * @example
 * ```tsx
 * <Button>
 *   <SearchIcon />
 *   <VisuallyHidden>Search</VisuallyHidden>
 * </Button>
 * ```
 */
export function VisuallyHidden({ className, ...props }: VisuallyHiddenProps) {
  return <span className={cx('yarcl-visually-hidden', className)} {...props} />;
}
