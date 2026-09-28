import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  Fragment,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react';
import { cx, densityClass, radiusClass } from '../classes';
import { Checkbox } from './Checkbox';
import type { Density, Radius } from '../types';
import { useDefaults } from '../runtime';

interface TableContextValue {
  density?: Density;
  wrapRef: RefObject<HTMLDivElement | null>;
}

const TableContext = createContext<TableContextValue | null>(null);

/** Props for {@link Table}. */
export interface TableProps extends ComponentProps<'table'> {
  /**
   * Cell padding and font size, from the `density` config.
   * @default config.defaults.density
   */
  density?: Density;
  /**
   * Corner radius of the table frame, from the `radii` config.
   * @default config.components.Table.radius ?? config.defaults.radius
   */
  radius?: Radius;
  /** Shades every other row. */
  striped?: boolean;
  /** Highlights the row under the pointer. Use when rows are clickable. */
  interactive?: boolean;
  /** Visible caption describing the table. Also its accessible name. */
  caption?: ReactNode;
  /** Enables a scrollable container with sticky header support. */
  stickyHeader?: boolean;
  /** Additional class name for the outer table wrapper. */
  wrapClassName?: string;
  /** Additional inline styles for the outer table wrapper. */
  wrapStyle?: CSSProperties;
}

function TableRoot({
  density,
  radius,
  striped,
  interactive,
  caption,
  stickyHeader,
  wrapClassName,
  wrapStyle,
  className,
  children,
  ...props
}: TableProps) {
  const own = useDefaults('Table');
  const resolvedDensity = density ?? own.density;
  const wrapRef = useRef<HTMLDivElement>(null);

  return (
    <TableContext value={{ density: resolvedDensity, wrapRef }}>
      <div
        ref={wrapRef}
        className={cx(
          'yarcl-table-wrap',
          radiusClass(radius ?? own.radius),
          stickyHeader && 'yarcl-table-sticky-wrap',
          wrapClassName,
        )}
        style={wrapStyle}
      >
        <table
          className={cx(
            'yarcl-table',
            densityClass(resolvedDensity),
            striped && 'yarcl-table-striped',
            interactive && 'yarcl-table-interactive',
            className,
          )}
          {...props}
        >
          {caption != null && <caption className="yarcl-table-caption">{caption}</caption>}
          {children}
        </table>
      </div>
    </TableContext>
  );
}

/** Horizontal alignment of a cell's content. `end` also uses tabular numbers, for numeric columns. */
export type CellAlign = 'start' | 'center' | 'end';

/** Sort direction for a table column. */
export type SortDirection = 'ascending' | 'descending' | 'none';

function SortIcon({ direction }: { direction?: SortDirection | false | null }) {
  if (direction === 'ascending') {
    return (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 12V4M4 8l4-4 4 4" />
      </svg>
    );
  }
  if (direction === 'descending') {
    return (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 4v8M4 8l4 4 4-4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 6l3-3 3 3M5 10l3 3 3-3" />
    </svg>
  );
}

/** Props for `Table.HeaderCell`. */
export interface TableHeaderCellProps extends Omit<ComponentProps<'th'>, 'align'> {
  /**
   * Content alignment.
   * @default 'start'
   */
  align?: CellAlign;
  /** Indicates whether the column is sortable. */
  sortable?: boolean;
  /** Current sort direction of the column. */
  sortDirection?: SortDirection | false | null;
  /** Callback invoked when the user activates the sort button. */
  onSort?: (direction: 'ascending' | 'descending') => void;
  /** Accessible label for the sort action. */
  sortLabel?: string;
}

function TableHeaderCell({
  align = 'start',
  scope = 'col',
  sortable,
  sortDirection,
  onSort,
  sortLabel,
  className,
  children,
  ...props
}: TableHeaderCellProps) {
  if (sortable) {
    const ariaSort = sortDirection === 'ascending' ? 'ascending' : sortDirection === 'descending' ? 'descending' : 'none';
    const nextDirection = sortDirection === 'ascending' ? 'descending' : 'ascending';

    return (
      <th
        scope={scope}
        aria-sort={ariaSort}
        className={cx(`yarcl-cell-${align}`, 'yarcl-table-sortable', className)}
        {...props}
      >
        <button
          type="button"
          className="yarcl-table-sort-button"
          onClick={() => onSort?.(nextDirection)}
          aria-label={sortLabel}
        >
          <span>{children}</span>
          <span className="yarcl-table-sort-icon" aria-hidden="true">
            <SortIcon direction={sortDirection} />
          </span>
        </button>
      </th>
    );
  }

  return (
    <th scope={scope} className={cx(`yarcl-cell-${align}`, className)} {...props}>
      {children}
    </th>
  );
}

/** Props for `Table.Row`. */
export interface TableRowProps extends ComponentProps<'tr'> {
  /** Indicates whether the row is currently selected. */
  selected?: boolean;
}

function TableRow({ selected, className, ...props }: TableRowProps) {
  return (
    <tr
      aria-selected={selected ? true : undefined}
      className={cx(selected && 'yarcl-table-row-selected', className)}
      {...props}
    />
  );
}

/** Props for `Table.Cell`. */
export interface TableCellProps extends Omit<ComponentProps<'td'>, 'align'> {
  /**
   * Content alignment.
   * @default 'start'
   */
  align?: CellAlign;
}

function TableCell({ align = 'start', className, ...props }: TableCellProps) {
  return <td className={cx(`yarcl-cell-${align}`, className)} {...props} />;
}

/** Props for `Table.SelectAllCell`. */
export interface TableSelectAllCellProps extends Omit<ComponentProps<'th'>, 'children'> {
  /** Checked state when all rows are selected. */
  checked?: boolean;
  /** Indeterminate state when a subset of rows is selected. */
  indeterminate?: boolean;
  /** Change handler when the checkbox is toggled. */
  onCheckedChange?: (checked: boolean) => void;
  /** Accessible label for screen readers. @default 'Select all rows' */
  'aria-label'?: string;
  /** Disables the select all checkbox. */
  disabled?: boolean;
}

function TableSelectAllCell({
  checked = false,
  indeterminate = false,
  onCheckedChange,
  disabled,
  'aria-label': ariaLabel = 'Select all rows',
  className,
  scope = 'col',
  ...props
}: TableSelectAllCellProps) {
  return (
    <th scope={scope} className={cx('yarcl-cell-center', 'yarcl-table-selection-cell', className)} {...props}>
      <Checkbox
        aria-label={ariaLabel}
        checked={checked}
        indeterminate={indeterminate}
        disabled={disabled}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
      />
    </th>
  );
}

/** Props for `Table.SelectionCell`. */
export interface TableSelectionCellProps extends Omit<ComponentProps<'td'>, 'children'> {
  /** Checked state of the row selection checkbox. */
  checked?: boolean;
  /** Change handler when the row checkbox is toggled. */
  onCheckedChange?: (checked: boolean) => void;
  /** Accessible label for the row checkbox. */
  'aria-label': string;
  /** Disables the row selection checkbox. */
  disabled?: boolean;
}

function TableSelectionCell({
  checked = false,
  onCheckedChange,
  disabled,
  'aria-label': ariaLabel,
  className,
  ...props
}: TableSelectionCellProps) {
  return (
    <td className={cx('yarcl-cell-center', 'yarcl-table-selection-cell', className)} {...props}>
      <Checkbox
        aria-label={ariaLabel}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
      />
    </td>
  );
}

function defaultDensityRowHeight(density?: string): number {
  if (density === 'compact' || density === 'dense') return 32;
  if (density === 'relaxed' || density === 'cozy') return 48;
  return 40;
}

/** Props for `Table.VirtualBody`. */
export interface TableVirtualBodyProps<T> extends Omit<ComponentProps<'tbody'>, 'children'> {
  /** Array of items to render. */
  items: T[];
  /** Estimated or fixed row height in pixels. Defaults to density-based height. */
  estimateRowHeight?: number;
  /** Number of buffer rows to render above and below the visible viewport. @default 5 */
  overscan?: number;
  /** Render prop called for each visible item. */
  children: (item: T, index: number) => ReactNode;
  /** Optional key extractor for each item. Defaults to item.id or index. */
  getItemKey?: (item: T, index: number) => string | number;
  /** Optional custom scroll container ref if not using the default table wrap. */
  scrollRef?: RefObject<HTMLElement | null>;
}

function TableVirtualBody<T>({
  items,
  estimateRowHeight,
  overscan = 5,
  children,
  getItemKey,
  scrollRef,
  className,
  ...props
}: TableVirtualBodyProps<T>) {
  const context = useContext(TableContext);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    const el = scrollRef?.current ?? context?.wrapRef.current;
    if (!el) return;

    const update = () => {
      setScrollTop(el.scrollTop);
      setViewportHeight(el.clientHeight);
    };

    update();
    el.addEventListener('scroll', update, { passive: true });

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    ro?.observe(el);

    return () => {
      el.removeEventListener('scroll', update);
      ro?.disconnect();
    };
  }, [scrollRef, context?.wrapRef]);

  const rowHeight = estimateRowHeight ?? defaultDensityRowHeight(context?.density);
  const effectiveViewportHeight = viewportHeight || 600;
  const count = items.length;

  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endIndex = Math.min(count - 1, Math.ceil((scrollTop + effectiveViewportHeight) / rowHeight) + overscan);

  const topHeight = startIndex * rowHeight;
  const bottomHeight = count > 0 && endIndex < count - 1 ? Math.max(0, (count - 1 - endIndex) * rowHeight) : 0;
  const visibleItems = count > 0 && startIndex <= endIndex ? items.slice(startIndex, endIndex + 1) : [];

  return (
    <tbody className={cx('yarcl-table-virtual-body', className)} {...props}>
      {topHeight > 0 && (
        <tr aria-hidden="true" className="yarcl-table-virtual-spacer" style={{ height: topHeight }}>
          <td colSpan={100} style={{ height: topHeight, padding: 0, border: 0 }} />
        </tr>
      )}
      {visibleItems.map((item, i) => {
        const index = startIndex + i;
        const key = getItemKey
          ? getItemKey(item, index)
          : ((item as { id?: string | number })?.id ?? index);
        return <Fragment key={key}>{children(item, index)}</Fragment>;
      })}
      {bottomHeight > 0 && (
        <tr aria-hidden="true" className="yarcl-table-virtual-spacer" style={{ height: bottomHeight }}>
          <td colSpan={100} style={{ height: bottomHeight, padding: 0, border: 0 }} />
        </tr>
      )}
    </tbody>
  );
}

/**
 * A data table with density from the config, sortable columns, row selection and row virtualization.
 *
 * @example
 * ```tsx
 * <Table density="compact" striped caption="Invoices">
 *   <Table.Head>
 *     <Table.Row>
 *       <Table.SelectAllCell checked={allSelected} onCheckedChange={toggleAll} />
 *       <Table.HeaderCell sortable sortDirection={sortDir} onSort={setSortDir}>Customer</Table.HeaderCell>
 *       <Table.HeaderCell align="end">Amount</Table.HeaderCell>
 *     </Table.Row>
 *   </Table.Head>
 *   <Table.VirtualBody items={invoices}>
 *     {(invoice) => (
 *       <Table.Row key={invoice.id} selected={selected.has(invoice.id)}>
 *         <Table.SelectionCell aria-label={`Select ${invoice.customer}`} checked={selected.has(invoice.id)} onCheckedChange={() => toggle(invoice.id)} />
 *         <Table.Cell>{invoice.customer}</Table.Cell>
 *         <Table.Cell align="end">{invoice.amount}</Table.Cell>
 *       </Table.Row>
 *     )}
 *   </Table.VirtualBody>
 * </Table>
 * ```
 */
export const Table = Object.assign(TableRoot, {
  Head: (props: ComponentProps<'thead'>) => <thead {...props} />,
  Body: (props: ComponentProps<'tbody'>) => <tbody {...props} />,
  VirtualBody: TableVirtualBody,
  Row: TableRow,
  HeaderCell: TableHeaderCell,
  Cell: TableCell,
  SelectAllCell: TableSelectAllCell,
  SelectionCell: TableSelectionCell,
});
