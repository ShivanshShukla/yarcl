import {
  createContext,
  useContext,
  useId,
  type ComponentProps,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { colorClass, cx, sizeClass } from '../classes';
import { useControllable } from '../hooks';
import type { Color, ComponentSize } from '../types';
import { useDefaults } from '../runtime';


interface TabsContextValue {
  value: string;
  select: (value: string) => void;
  idFor: (kind: 'tab' | 'panel', value: string) => string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(component: string) {
  const context = useContext(TabsContext);
  if (!context) throw new Error(`yarcl: <${component}> must be inside <Tabs>`);
  return context;
}

/** Props shared by both forms of {@link TabsProps}. */
export interface TabsBaseProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'color'> {
  /** Called with the newly selected tab's value. */
  onValueChange?: (value: string) => void;
  /**
   * Tab height and font size, from the `sizes` config.
   * @default config.defaults.size
   */
  size?: ComponentSize<'Tabs'>;
  /**
   * Color of the selected tab's indicator, from the `colors` config.
   * @default config.defaults.color
   */
  color?: Color;
}

/** Props for {@link Tabs}. Pass `value` (controlled) or `defaultValue` (uncontrolled). */
export type TabsProps = TabsBaseProps &
  (
    | { /** Selected tab (controlled). */ value: string; defaultValue?: never }
    | { value?: never; /** Initially selected tab (uncontrolled). */ defaultValue: string }
  );

function TabsRoot({ value: valueProp, defaultValue, onValueChange, size, color, className, ...props }: TabsProps) {
  const own = useDefaults('Tabs');
  const [value, select] = useControllable(valueProp, defaultValue ?? '', onValueChange);
  const baseId = useId();
  const idFor = (kind: 'tab' | 'panel', v: string) => `${baseId}-${kind}-${v.replace(/[^\w-]/g, '_')}`;
  return (
    <TabsContext.Provider value={{ value, select, idFor }}>
      <div className={cx('yarcl-tabs', sizeClass(size ?? own.size, 'Tabs'), colorClass(color ?? own.color), className)} {...props} />
    </TabsContext.Provider>
  );
}

/** Props for `Tabs.List`. */
export interface TabsListProps extends ComponentProps<'div'> {
  /** `Tabs.Trigger`s. */
  children?: ReactNode;
}

function TabsList({ className, onKeyDown, ...props }: TabsListProps) {
  const { select } = useTabsContext('Tabs.List');

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    const tabs = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)')];
    const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (current === -1) return;
    const next = {
      ArrowRight: (current + 1) % tabs.length,
      ArrowLeft: (current - 1 + tabs.length) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    tabs[next].focus();
    select(tabs[next].dataset.value!);
  }

  return <div role="tablist" className={cx('yarcl-tabs-list', className)} onKeyDown={handleKeyDown} {...props} />;
}

/** Props for `Tabs.Trigger`. */
export interface TabsTriggerProps extends Omit<ComponentProps<'button'>, 'value'> {
  /** Identifies the tab; matches a `Tabs.Panel`'s `value`. */
  value: string;
}

function TabsTrigger({ value, className, onClick, ...props }: TabsTriggerProps) {
  const context = useTabsContext('Tabs.Trigger');
  const selected = context.value === value;
  return (
    <button
      type="button"
      role="tab"
      id={context.idFor('tab', value)}
      aria-controls={context.idFor('panel', value)}
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      data-value={value}
      className={cx('yarcl-tabs-trigger', className)}
      onClick={(event) => {
        onClick?.(event);
        context.select(value);
      }}
      {...props}
    />
  );
}

/** Props for `Tabs.Panel`. */
export interface TabsPanelProps extends Omit<ComponentProps<'div'>, 'value'> {
  /** Matches the `value` of the `Tabs.Trigger` that shows this panel. */
  value: string;
}

function TabsPanel({ value, className, ...props }: TabsPanelProps) {
  const context = useTabsContext('Tabs.Panel');
  const selected = context.value === value;
  return (
    <div
      role="tabpanel"
      id={context.idFor('panel', value)}
      aria-labelledby={context.idFor('tab', value)}
      tabIndex={0}
      hidden={!selected}
      className={cx('yarcl-tabs-panel', className)}
      {...props}
    />
  );
}

/**
 * Switches between panels of content. Arrow keys move between tabs, Home and End jump to the ends.
 * Tab height comes from the shared size scale.
 *
 * @example
 * ```tsx
 * <Tabs defaultValue="overview">
 *   <Tabs.List aria-label="Project">
 *     <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
 *     <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
 *   </Tabs.List>
 *   <Tabs.Panel value="overview">…</Tabs.Panel>
 *   <Tabs.Panel value="settings">…</Tabs.Panel>
 * </Tabs>
 * ```
 */
export const Tabs = Object.assign(TabsRoot, { List: TabsList, Trigger: TabsTrigger, Panel: TabsPanel });
