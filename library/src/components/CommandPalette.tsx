import {
  cloneElement,
  useEffect,
  useId,
  useState,
  useSyncExternalStore,
  type ChangeEvent,
  type ComponentProps,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { colorClass, cx, radiusClass, sizeClass } from '../classes';
import { useControllable } from '../hooks';
import { useConfig, useDefaults } from '../runtime';
import type { TokenProps } from '../types';
import { useModalDialog } from './Modal';

/** A command shown in a {@link CommandPalette}. */
export interface CommandPaletteCommand {
  /** Unique id of the command. */
  id: string;
  /** Text shown in the list and matched by the search. */
  label: string;
  /** Heading of the group the command is listed under. Groups appear in the order they're first used. */
  group?: string;
  /** Extra words the search matches, e.g. synonyms. */
  keywords?: readonly string[];
  /**
   * Keyboard shortcut hint shown next to the label, e.g. `'Mod+S'`, or `'G D'` for a sequence.
   * `Mod` is ⌘ on Apple devices and Ctrl elsewhere. Only a hint: bind the shortcut yourself.
   */
  shortcut?: string;
  /** An icon shown before the label. */
  icon?: ReactNode;
  /** Shows the command but prevents choosing it. */
  disabled?: boolean;
  /** Called when the command is chosen. The palette closes first. */
  onSelect?: () => void;
}

/** Props for {@link CommandPalette}. */
export interface CommandPaletteProps
  extends TokenProps<'CommandPalette'>,
    Omit<ComponentProps<'dialog'>, 'color' | 'open' | 'onSelect' | 'children' | 'title'> {
  /** The commands to search. Commands with the same `group` are listed together under a heading. */
  commands: readonly CommandPaletteCommand[];
  /** Controlled open state. */
  open?: boolean;
  /**
   * Initial open state when uncontrolled.
   * @default false
   */
  defaultOpen?: boolean;
  /** Called when the palette opens or closes, including by the shortcut, Esc or a backdrop click. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Keyboard shortcut that toggles the palette from anywhere on the page, e.g. `'Mod+K'` or `'Shift+Mod+P'`.
   * `Mod` is ⌘ on Apple devices and Ctrl elsewhere. `false` disables it.
   * @default 'Mod+K'
   */
  shortcut?: string | false;
  /** An element that opens the palette when clicked, e.g. a {@link Button}. */
  trigger?: ReactElement<{ onClick?: (event: MouseEvent) => void }>;
  /** Called with the chosen command, after its own `onSelect`. */
  onSelect?: (command: CommandPaletteCommand) => void;
  /** Controlled search text. */
  inputValue?: string;
  /** Called on every keystroke with the search text. */
  onInputValueChange?: (text: string) => void;
  /**
   * How commands are matched against the search text.
   * `true`: every typed word appears in the label, group or keywords (case-insensitive);
   * a function for custom matching; `false` to show `commands` as given.
   * @default true
   */
  filter?: boolean | ((command: CommandPaletteCommand, text: string) => boolean);
  /**
   * Placeholder of the search input.
   * @default 'Search commands…'
   */
  placeholder?: string;
  /**
   * Accessible name of the palette and its search input.
   * @default 'Command palette'
   */
  label?: string;
  /**
   * Shown when no commands match.
   * @default 'No results'
   */
  emptyMessage?: ReactNode;
}

function detectApple() {
  return typeof navigator !== 'undefined' && /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent);
}

const noop = () => () => {};

function useIsApple() {
  return useSyncExternalStore(noop, detectApple, () => false);
}

function parseShortcut(shortcut: string, apple: boolean) {
  const parts = shortcut.split('+').map((part) => part.trim().toLowerCase());
  const key = parts[parts.length - 1] ?? '';
  const mods = new Set(parts.slice(0, -1));
  const mod = mods.has('mod');
  return {
    key,
    ctrl: mods.has('ctrl') || mods.has('control') || (mod && !apple),
    meta: mods.has('meta') || mods.has('cmd') || (mod && apple),
    alt: mods.has('alt') || mods.has('option'),
    shift: mods.has('shift'),
  };
}

function matchesShortcut(event: globalThis.KeyboardEvent, shortcut: string, apple: boolean) {
  const s = parseShortcut(shortcut, apple);
  if (event.ctrlKey !== s.ctrl || event.metaKey !== s.meta || event.altKey !== s.alt || event.shiftKey !== s.shift) return false;
  const code = s.key.length === 1 ? (/[a-z]/.test(s.key) ? `Key${s.key.toUpperCase()}` : /\d/.test(s.key) ? `Digit${s.key}` : '') : '';
  return event.key?.toLowerCase() === s.key || (code !== '' && event.code === code);
}

function ariaChord(chord: string, apple: boolean) {
  const s = parseShortcut(chord, apple);
  const key = s.key.length === 1 ? s.key.toUpperCase() : s.key.charAt(0).toUpperCase() + s.key.slice(1);
  return [s.ctrl && 'Control', s.alt && 'Alt', s.shift && 'Shift', s.meta && 'Meta', key].filter(Boolean).join('+');
}

function ariaShortcut(shortcut: string, apple: boolean) {
  return shortcut
    .trim()
    .split(/\s+/)
    .map((chord) => ariaChord(chord, apple))
    .join(' ');
}

function shortcutKeys(shortcut: string, apple: boolean) {
  return shortcut.trim().split(/[\s+]+/).filter(Boolean).map((raw) => {
    const part = raw.trim();
    const lower = part.toLowerCase();
    if (lower === 'mod') return apple ? '⌘' : 'Ctrl';
    if (lower === 'ctrl' || lower === 'control') return apple ? '⌃' : 'Ctrl';
    if (lower === 'alt' || lower === 'option') return apple ? '⌥' : 'Alt';
    if (lower === 'shift') return apple ? '⇧' : 'Shift';
    if (lower === 'meta' || lower === 'cmd') return apple ? '⌘' : 'Meta';
    return part.length === 1 ? part.toUpperCase() : part;
  });
}

function ShortcutHint({ shortcut, apple }: { shortcut: string; apple: boolean }) {
  return (
    <span className="yarcl-command-palette-shortcut" aria-hidden="true">
      {shortcutKeys(shortcut, apple).map((key, i) => (
        <kbd key={i}>{key}</kbd>
      ))}
    </span>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function contains(command: CommandPaletteCommand, text: string) {
  const haystack = [command.label, command.group ?? '', ...(command.keywords ?? [])].join(' ').toLowerCase();
  return text
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

function firstEnabled(list: readonly CommandPaletteCommand[], from = 0, step = 1): number | null {
  for (let i = 0; i < list.length; i++) {
    const index = (((from + i * step) % list.length) + list.length) % list.length;
    if (!list[index]?.disabled) return index;
  }
  return null;
}

/**
 * A searchable command menu in a modal dialog, opened with a keyboard shortcut (⌘K / Ctrl+K by default).
 * The search input is a combobox: arrow keys, Home and End move through the matching commands,
 * Enter runs the highlighted one, Esc closes and returns focus.
 *
 * @example
 * ```tsx
 * <CommandPalette
 *   commands={[
 *     { id: 'new', label: 'New file', group: 'File', shortcut: 'Mod+N', onSelect: createFile },
 *     { id: 'theme', label: 'Toggle dark mode', group: 'View', keywords: ['theme'], onSelect: toggleTheme },
 *   ]}
 * />
 * ```
 */
type BodyProps = Pick<
  CommandPaletteProps,
  'commands' | 'inputValue' | 'onInputValueChange' | 'filter' | 'placeholder' | 'label' | 'emptyMessage'
> & { apple: boolean; choose: (command: CommandPaletteCommand) => void };

function CommandPaletteBody({
  commands,
  inputValue,
  onInputValueChange,
  filter = true,
  placeholder = 'Search commands…',
  label = 'Command palette',
  emptyMessage = 'No results',
  apple,
  choose,
}: BodyProps) {
  const [text, setText] = useControllable(inputValue, '', onInputValueChange);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const idPrefix = useId();
  const listId = `${idPrefix}-list`;
  const optionId = (i: number) => `${idPrefix}-option-${i}`;

  const match = filter === true ? contains : filter === false ? () => true : filter;
  const sections: { heading?: string; commands: CommandPaletteCommand[] }[] = [];
  for (const command of commands) {
    if (!match(command, text)) continue;
    let section = sections.find((s) => s.heading === command.group);
    if (!section) sections.push((section = { heading: command.group, commands: [] }));
    section.commands.push(command);
  }
  const visible = sections.flatMap((s) => s.commands);
  const shown = activeIndex === null || activeIndex >= visible.length ? firstEnabled(visible) : activeIndex;

  useEffect(() => {
    if (shown != null) document.getElementById(`${idPrefix}-option-${shown}`)?.scrollIntoView({ block: 'nearest' });
  }, [shown, idPrefix]);

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (visible.length === 0) return;
    let next: number | null;
    if (event.key === 'ArrowDown') next = firstEnabled(visible, shown == null ? 0 : shown + 1);
    else if (event.key === 'ArrowUp') next = firstEnabled(visible, shown == null ? visible.length - 1 : shown - 1, -1);
    else if (event.key === 'Home') next = firstEnabled(visible);
    else if (event.key === 'End') next = firstEnabled(visible, visible.length - 1, -1);
    else if (event.key === 'Enter') {
      event.preventDefault();
      const command = shown != null ? visible[shown] : undefined;
      if (command) choose(command);
      return;
    } else return;
    event.preventDefault();
    setActiveIndex(next);
  }

  let index = 0;

  return (
    <div className="yarcl-command-palette-content">
      <div className="yarcl-command-palette-search">
        <SearchIcon />
        <input
          className="yarcl-command-palette-input"
          type="text"
          role="combobox"
          aria-label={label}
          aria-autocomplete="list"
          aria-expanded={visible.length > 0}
          aria-controls={visible.length > 0 ? listId : undefined}
          aria-activedescendant={shown != null ? optionId(shown) : undefined}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder={placeholder}
          value={text}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setText(event.target.value);
            setActiveIndex(null);
          }}
          onKeyDown={onKeyDown}
        />
      </div>
      {visible.length > 0 && (
        <div id={listId} role="listbox" aria-label={label} className="yarcl-listbox yarcl-command-palette-list">
          {sections.map((section, s) => {
            const headingId = `${idPrefix}-group-${s}`;
            const options = section.commands.map((command) => {
              const i = index++;
              const isActive = i === shown;
              return (
                <div
                  key={command.id}
                  id={optionId(i)}
                  role="option"
                  aria-selected={isActive}
                  aria-disabled={command.disabled || undefined}
                  aria-keyshortcuts={command.shortcut ? ariaShortcut(command.shortcut, apple) : undefined}
                  data-active={isActive || undefined}
                  className="yarcl-option"
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseMove={() => {
                    if (!command.disabled && i !== shown) setActiveIndex(i);
                  }}
                  onClick={() => choose(command)}
                >
                  <span className="yarcl-command-palette-item">
                    {command.icon}
                    <span className="yarcl-option-label">{command.label}</span>
                  </span>
                  {command.shortcut && <ShortcutHint shortcut={command.shortcut} apple={apple} />}
                </div>
              );
            });
            return (
              <div
                key={section.heading ?? ''}
                role="group"
                aria-labelledby={section.heading ? headingId : undefined}
                className="yarcl-command-palette-group"
              >
                {section.heading && (
                  <div id={headingId} className="yarcl-command-palette-heading" aria-hidden="true">
                    {section.heading}
                  </div>
                )}
                {options}
              </div>
            );
          })}
        </div>
      )}
      <div role="status" className="yarcl-listbox-message yarcl-command-palette-empty">
        {visible.length === 0 ? emptyMessage : null}
      </div>
    </div>
  );
}

/**
 * A searchable command menu in a modal dialog, opened with a keyboard shortcut (⌘K or Ctrl+K by default).
 * The search input is a combobox: arrow keys, Home and End move through the matching commands,
 * Enter runs the highlighted one, Esc closes the palette and returns focus.
 *
 * @example
 * ```tsx
 * <CommandPalette
 *   commands={[
 *     { id: 'new', label: 'New file', group: 'File', shortcut: 'Mod+N', onSelect: createFile },
 *     { id: 'theme', label: 'Toggle dark mode', group: 'View', keywords: ['theme'], onSelect: toggleTheme },
 *   ]}
 * />
 * ```
 */
export function CommandPalette({
  commands,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  shortcut = 'Mod+K',
  trigger,
  onSelect,
  inputValue,
  onInputValueChange,
  filter,
  placeholder,
  label = 'Command palette',
  emptyMessage,
  size,
  radius,
  color,
  className,
  onClick,
  onClose,
  ...props
}: CommandPaletteProps) {
  const own = useDefaults('CommandPalette');
  const config = useConfig();
  const apple = useIsApple();
  const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange);
  const dialog = useModalDialog(open, setOpen);

  useEffect(() => {
    if (!shortcut) return;
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.defaultPrevented || !shortcut || !matchesShortcut(event, shortcut, detectApple())) return;
      event.preventDefault();
      setOpen(!open);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [shortcut, open, setOpen]);

  function choose(command: CommandPaletteCommand) {
    if (command.disabled) return;
    setOpen(false);
    command.onSelect?.();
    onSelect?.(command);
  }

  const resolvedSize = size ?? own.size;

  return (
    <>
      {trigger &&
        cloneElement(trigger, {
          onClick(event: MouseEvent) {
            trigger.props.onClick?.(event);
            setOpen(true);
          },
          ...(shortcut ? { 'aria-keyshortcuts': ariaShortcut(shortcut, apple) } : {}),
        })}
      <dialog
        aria-label={label}
        {...props}
        ref={dialog.ref}
        className={cx(
          'yarcl-modal yarcl-dialog yarcl-command-palette',
          `yarcl-modal-size-${config.defaults.modalSize}`,
          sizeClass(resolvedSize, 'CommandPalette'),
          radiusClass(radius ?? own.radius, resolvedSize),
          colorClass(color ?? own.color),
          className,
        )}
        onClose={(event) => {
          dialog.onClose(event);
          onClose?.(event);
        }}
        onClick={(event) => {
          dialog.onClick(event);
          onClick?.(event);
        }}
      >
        {open && (
          <CommandPaletteBody
            commands={commands}
            inputValue={inputValue}
            onInputValueChange={onInputValueChange}
            filter={filter}
            placeholder={placeholder}
            label={label}
            emptyMessage={emptyMessage}
            apple={apple}
            choose={choose}
          />
        )}
      </dialog>
    </>
  );
}
