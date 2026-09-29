import type { ComponentProps, KeyboardEvent } from 'react';
import { colorClass, cx, radiusClass, sizeClass, variantClass } from '../classes';
import { useControllable } from '../hooks';
import type { Color, ComponentSize, Radius, Variant } from '../types';
import { Button } from './Button';
import { IconButton } from './IconButton';
import { useConfig, useDefaults } from '../runtime';

/** Props for {@link Pagination}. */
export interface PaginationProps extends Omit<ComponentProps<'nav'>, 'color' | 'onChange'> {
  /**
   * Total number of pages.
   * @example
   * ```tsx
   * <Pagination count={Math.ceil(total / perPage)} />
   * ```
   */
  count: number;
  /** Controlled current page, starting at 1. */
  page?: number;
  /**
   * Initial page when uncontrolled.
   * @default 1
   */
  defaultPage?: number;
  /** Called with the new page when the user picks one. */
  onPageChange?: (page: number) => void;
  /**
   * Pages shown on each side of the current page.
   * @default 1
   */
  siblings?: number;
  /**
   * Pages always shown at the start and end.
   * @default 1
   */
  boundaries?: number;
  /** Size of every button, from the `sizes` config. */
  size?: ComponentSize<'Pagination'>;
  /** Color of every button, from the `colors` config. */
  color?: Color;
  /** Radius of every button, from the `radii` config, or `'size'` to match the button size. */
  radius?: Radius | 'size';
  /**
   * Variant of the other pages and the previous and next buttons, from the `variants` config.
   * @default config.defaults.softVariant
   */
  variant?: Variant;
  /**
   * Variant of the current page, from the `variants` config.
   * @default config.defaults.variant
   */
  selectedVariant?: Variant;
  /**
   * Joins the buttons into one control with shared borders.
   * @default false
   */
  attached?: boolean;
  /** Disables every button. */
  disabled?: boolean;
  /**
   * Accessible name of the navigation landmark.
   * @default 'Pagination'
   */
  'aria-label'?: string;
  /**
   * Accessible name of the previous button.
   * @default 'Previous page'
   */
  previousLabel?: string;
  /**
   * Accessible name of the next button.
   * @default 'Next page'
   */
  nextLabel?: string;
  /**
   * Accessible name of each page button.
   * @default (page) => `Page ${page}`
   */
  pageLabel?: (page: number) => string;
}

type Item = number | 'start-ellipsis' | 'end-ellipsis';

const range = (start: number, end: number) => Array.from({ length: Math.max(0, end - start + 1) }, (_, i) => start + i);

function pageItems(page: number, count: number, siblings: number, boundaries: number): Item[] {
  const startPages = range(1, Math.min(boundaries, count));
  const endPages = range(Math.max(count - boundaries + 1, boundaries + 1), count);
  const siblingsStart = Math.max(Math.min(page - siblings, count - boundaries - siblings * 2 - 1), boundaries + 2);
  const siblingsEnd = Math.min(Math.max(page + siblings, boundaries + siblings * 2 + 2), count - boundaries - 1);
  const items: Item[] = [...startPages];
  if (siblingsStart > boundaries + 2) items.push('start-ellipsis');
  else if (boundaries + 1 < count - boundaries) items.push(boundaries + 1);
  items.push(...range(siblingsStart, siblingsEnd));
  if (siblingsEnd < count - boundaries - 1) items.push('end-ellipsis');
  else if (count - boundaries > boundaries) items.push(count - boundaries);
  items.push(...endPages);
  return items.filter((item, i) => typeof item !== 'number' || (item >= 1 && item <= count && items.indexOf(item) === i));
}

const Chevron = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

/**
 * Navigation between pages of results: previous and next buttons, the pages around the current one,
 * and the first and last pages with an ellipsis for the gaps. Renders a `<nav>` landmark; the current
 * page has `aria-current="page"`. Arrow keys, <kbd>Home</kbd> and <kbd>End</kbd> move focus between buttons.
 *
 * @example
 * ```tsx
 * <Pagination count={20} page={page} onPageChange={setPage} aria-label="Search results" />
 * ```
 */
export function Pagination({
  count,
  page,
  defaultPage = 1,
  onPageChange,
  siblings = 1,
  boundaries = 1,
  size,
  color,
  radius,
  variant,
  selectedVariant,
  attached = false,
  disabled,
  previousLabel = 'Previous page',
  nextLabel = 'Next page',
  pageLabel = (n) => `Page ${n}`,
  'aria-label': ariaLabel = 'Pagination',
  className,
  onKeyDown,
  ...props
}: PaginationProps) {
  const config = useConfig();
  const own = useDefaults('Pagination');
  const resolvedSize = size ?? own.size ?? config.defaults.size;
  const resolvedRadius = radius ?? own.radius ?? config.defaults.radius;
  const resolvedColor = color ?? own.color ?? config.defaults.color;
  const resolvedVariant = variant ?? own.variant ?? config.defaults.softVariant;
  const resolvedSelected = selectedVariant ?? own.selectedVariant ?? config.defaults.variant;

  const total = Math.max(0, Math.floor(count));
  const [current, setCurrent] = useControllable(page, defaultPage, onPageChange);
  const active = Math.min(Math.max(1, current), Math.max(1, total));
  const items = pageItems(active, total, Math.max(0, siblings), Math.max(0, boundaries));

  const go = (next: number) => {
    if (disabled || next === active || next < 1 || next > total) return;
    setCurrent(next);
  };

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    onKeyDown?.(event);
    const buttons = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')];
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    const next = {
      ArrowRight: Math.min(index + 1, buttons.length - 1),
      ArrowLeft: Math.max(index - 1, 0),
      Home: 0,
      End: buttons.length - 1,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    buttons[next].focus();
  }

  const shared = { size: resolvedSize, radius: resolvedRadius, color: resolvedColor, disabled };
  const edge = (label: string, target: number, d: string) => {
    const unavailable = target < 1 || target > total;
    return (
      <IconButton
        {...shared}
        variant={resolvedVariant}
        aria-label={label}
        aria-disabled={unavailable || undefined}
        onClick={() => go(target)}
      >
        <Chevron d={d} />
      </IconButton>
    );
  };

  return (
    <nav aria-label={ariaLabel} className={cx('yarcl-pagination', sizeClass(resolvedSize, 'Pagination'), className)} onKeyDown={handleKeyDown} {...props}>
      <div className={cx('yarcl-button-group yarcl-button-group-horizontal', attached && 'yarcl-button-group-attached')}>
        {edge(previousLabel, active - 1, 'm15 18-6-6 6-6')}
        {items.map((item) =>
          typeof item === 'number' ? (
            <Button
              key={item}
              {...shared}
              variant={item === active ? resolvedSelected : resolvedVariant}
              className="yarcl-pagination-page"
              aria-label={pageLabel(item)}
              aria-current={item === active ? 'page' : undefined}
              onClick={() => go(item)}
            >
              {item}
            </Button>
          ) : (
            <span
              key={item}
              aria-hidden="true"
              className={cx(
                'yarcl-button yarcl-pagination-ellipsis',
                sizeClass(resolvedSize, 'Pagination'),
                radiusClass(resolvedRadius, resolvedSize),
                colorClass(resolvedColor),
                variantClass(resolvedVariant),
              )}
            >
              …
            </span>
          ),
        )}
        {edge(nextLabel, active + 1, 'm9 18 6-6-6-6')}
      </div>
    </nav>
  );
}
