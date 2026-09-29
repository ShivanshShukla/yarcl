import {
  createContext,
  useContext,
  useId,
  type ComponentProps,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { colorClass, cx, radiusClass, sizeClass } from '../classes';
import { ChevronIcon } from '../floating';
import { useControllable } from '../hooks';
import type { Color, ComponentSize, Radius } from '../types';
import { useDefaults } from '../runtime';

interface AccordionContextValue {
  open: string[];
  toggle: (value: string) => void;
  disabled?: boolean;
  idFor: (kind: 'trigger' | 'content', value: string) => string;
}

interface AccordionItemContextValue {
  value: string;
  open: boolean;
  disabled?: boolean;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);
const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

function useAccordionContext(component: string) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error(`yarcl: <${component}> must be inside <Accordion>`);
  return context;
}

function useItemContext(component: string) {
  const context = useContext(AccordionItemContext);
  if (!context) throw new Error(`yarcl: <${component}> must be inside <Accordion.Item>`);
  return context;
}

/** Props shared by both forms of {@link AccordionProps}. */
export interface AccordionBaseProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'color'> {
  /**
   * Trigger height, padding and font size, from the `sizes` config.
   * @default config.defaults.size
   */
  size?: ComponentSize<'Accordion'>;
  /**
   * Corner radius of the outer frame, from the `radii` config, or `'size'` to match the size.
   * @default config.defaults.radius
   */
  radius?: Radius | 'size';
  /**
   * Color of the open item's indicator, from the `colors` config.
   * @default config.defaults.color
   */
  color?: Color;
  /** Disables every item. */
  disabled?: boolean;
  /** `Accordion.Item`s. */
  children?: ReactNode;
}

/** Props for {@link Accordion}. `type` decides whether one or many items can be open. */
export type AccordionProps = AccordionBaseProps &
  (
    | {
        /** One item open at a time. */
        type: 'single';
        /** Open item (controlled), or `null` when all are closed. */
        value?: string | null;
        /** Initially open item (uncontrolled). */
        defaultValue?: string | null;
        /** Called with the open item, or `null` when it closes. */
        onValueChange?: (value: string | null) => void;
        /**
         * Lets the open item close, leaving all closed. When `false`, one item always stays open.
         * @default true
         */
        collapsible?: boolean;
      }
    | {
        /** Any number of items open. */
        type: 'multiple';
        /** Open items (controlled). */
        value?: string[];
        /** Initially open items (uncontrolled). */
        defaultValue?: string[];
        /** Called with all open items. */
        onValueChange?: (value: string[]) => void;
        collapsible?: never;
      }
  );

const toArray = (value: string | string[] | null | undefined) => (value == null ? [] : Array.isArray(value) ? value : [value]);

function AccordionRoot(props: AccordionProps) {
  const own = useDefaults('Accordion');
  const {
    type,
    value,
    defaultValue,
    onValueChange,
    collapsible = true,
    size,
    radius,
    color,
    disabled,
    className,
    onKeyDown,
    ...rest
  } = props;

  const [open, setOpen] = useControllable<string[]>(
    value === undefined ? undefined : toArray(value),
    toArray(defaultValue),
    (next) =>
      type === 'multiple'
        ? (onValueChange as (v: string[]) => void)?.(next)
        : (onValueChange as (v: string | null) => void)?.(next[0] ?? null),
  );

  const baseId = useId();
  const idFor = (kind: 'trigger' | 'content', v: string) => `${baseId}-${kind}-${v.replace(/[^\w-]/g, '_')}`;

  function toggle(item: string) {
    const on = open.includes(item);
    if (type === 'multiple') setOpen(on ? open.filter((v) => v !== item) : [...open, item]);
    else if (!on) setOpen([item]);
    else if (collapsible) setOpen([]);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    const root = event.currentTarget;
    const triggers = [...root.querySelectorAll<HTMLButtonElement>('.yarcl-accordion-trigger:not(:disabled)')].filter(
      (trigger) => trigger.closest('.yarcl-accordion') === root,
    );
    const current = triggers.indexOf(document.activeElement as HTMLButtonElement);
    if (current === -1) return;
    const next = {
      ArrowDown: (current + 1) % triggers.length,
      ArrowUp: (current - 1 + triggers.length) % triggers.length,
      Home: 0,
      End: triggers.length - 1,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    triggers[next].focus();
  }

  const resolvedSize = size ?? own.size;
  return (
    <AccordionContext.Provider value={{ open, toggle, disabled, idFor }}>
      <div
        className={cx(
          'yarcl-accordion',
          sizeClass(resolvedSize, 'Accordion'),
          radiusClass(radius ?? own.radius, resolvedSize),
          colorClass(color ?? own.color),
          className,
        )}
        onKeyDown={handleKeyDown}
        {...rest}
      />
    </AccordionContext.Provider>
  );
}

/** Props for `Accordion.Item`. */
export interface AccordionItemProps extends Omit<ComponentProps<'div'>, 'value'> {
  /** Identifies the item in the accordion's value. */
  value: string;
  /** Prevents opening or closing this item. */
  disabled?: boolean;
}

function AccordionItem({ value, disabled, className, ...props }: AccordionItemProps) {
  const context = useAccordionContext('Accordion.Item');
  const open = context.open.includes(value);
  const itemDisabled = disabled || context.disabled;
  return (
    <AccordionItemContext.Provider value={{ value, open, disabled: itemDisabled }}>
      <div
        data-state={open ? 'open' : 'closed'}
        data-disabled={itemDisabled || undefined}
        className={cx('yarcl-accordion-item', className)}
        {...props}
      />
    </AccordionItemContext.Provider>
  );
}

/** Props for `Accordion.Trigger`. */
export interface AccordionTriggerProps extends ComponentProps<'button'> {
  /**
   * Level of the heading that wraps the button, to fit the page outline.
   * @default 3
   */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

function AccordionTrigger({ level = 3, className, onClick, children, ...props }: AccordionTriggerProps) {
  const context = useAccordionContext('Accordion.Trigger');
  const item = useItemContext('Accordion.Trigger');
  const Heading = `h${level}` as 'h3';
  return (
    <Heading className="yarcl-accordion-heading">
      <button
        type="button"
        id={context.idFor('trigger', item.value)}
        aria-controls={context.idFor('content', item.value)}
        aria-expanded={item.open}
        disabled={item.disabled}
        className={cx('yarcl-accordion-trigger', className)}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) context.toggle(item.value);
        }}
        {...props}
      >
        <span className="yarcl-accordion-label">{children}</span>
        <ChevronIcon />
      </button>
    </Heading>
  );
}

/** Props for `Accordion.Content`. */
export type AccordionContentProps = ComponentProps<'div'>;

function AccordionContent({ className, children, ...props }: AccordionContentProps) {
  const context = useAccordionContext('Accordion.Content');
  const item = useItemContext('Accordion.Content');
  return (
    <div
      role="region"
      id={context.idFor('content', item.value)}
      aria-labelledby={context.idFor('trigger', item.value)}
      data-state={item.open ? 'open' : 'closed'}
      className={cx('yarcl-accordion-content', className)}
      {...props}
    >
      <div className="yarcl-accordion-body">{children}</div>
    </div>
  );
}

/**
 * Stacked sections that expand and collapse. Each trigger is a button inside a heading;
 * Up and Down move between triggers, Home and End jump to the ends. The panel height animates
 * with the `motion` tokens, and snaps when reduced motion is preferred.
 *
 * @example
 * ```tsx
 * <Accordion type="single" defaultValue="shipping">
 *   <Accordion.Item value="shipping">
 *     <Accordion.Trigger>Shipping</Accordion.Trigger>
 *     <Accordion.Content>Orders ship within two working days.</Accordion.Content>
 *   </Accordion.Item>
 *   <Accordion.Item value="returns">
 *     <Accordion.Trigger>Returns</Accordion.Trigger>
 *     <Accordion.Content>Free returns within 30 days.</Accordion.Content>
 *   </Accordion.Item>
 * </Accordion>
 * ```
 */
export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});
