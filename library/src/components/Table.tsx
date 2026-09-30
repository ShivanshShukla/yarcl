import type { ComponentProps, ReactNode } from 'react';
import { cx, densityClass, radiusClass } from '../classes';
import type { Density, Radius } from '../types';
import { useDefaults } from '../runtime';


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
}

function TableRoot({ density, radius, striped, interactive, caption, className, children, ...props }: TableProps) {
  const own = useDefaults('Table');
  return (
    <div className={cx('yarcl-table-wrap', radiusClass(radius ?? own.radius))}>
      <table
        className={cx(
          'yarcl-table',
          densityClass(density ?? own.density),
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
  );
}

/** Horizontal alignment of a cell's content. `end` also uses tabular numbers, for numeric columns. */
export type CellAlign = 'start' | 'center' | 'end';

/** Props for `Table.HeaderCell`. */
export interface TableHeaderCellProps extends Omit<ComponentProps<'th'>, 'align'> {
  /**
   * Content alignment.
   * @default 'start'
   */
  align?: CellAlign;
}

function TableHeaderCell({ align = 'start', scope = 'col', className, ...props }: TableHeaderCellProps) {
  return <th scope={scope} className={cx(`yarcl-cell-${align}`, className)} {...props} />;
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

/**
 * A data table with density from the config. Scrolls horizontally when it doesn't fit.
 *
 * @example
 * ```tsx
 * <Table density="compact" striped caption="Invoices">
 *   <Table.Head>
 *     <Table.Row>
 *       <Table.HeaderCell>Customer</Table.HeaderCell>
 *       <Table.HeaderCell align="end">Amount</Table.HeaderCell>
 *     </Table.Row>
 *   </Table.Head>
 *   <Table.Body>
 *     <Table.Row>
 *       <Table.Cell>Ada</Table.Cell>
 *       <Table.Cell align="end">$120.00</Table.Cell>
 *     </Table.Row>
 *   </Table.Body>
 * </Table>
 * ```
 */
export const Table = Object.assign(TableRoot, {
  Head: (props: ComponentProps<'thead'>) => <thead {...props} />,
  Body: (props: ComponentProps<'tbody'>) => <tbody {...props} />,
  Row: (props: ComponentProps<'tr'>) => <tr {...props} />,
  HeaderCell: TableHeaderCell,
  Cell: TableCell,
});
