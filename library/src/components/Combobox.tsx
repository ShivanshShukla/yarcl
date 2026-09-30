import {
  autoUpdate,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useMergeRefs,
  useRole,
} from '@floating-ui/react';
import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { colorClass, cx, radiusClass, sizeClass } from '../classes';
import { useFieldProps } from '../field-context';
import { CheckIcon, floatingMiddleware } from '../floating';
import { useControllable } from '../hooks';
import type { Color, Size, TokenProps } from '../types';
import { Badge, BadgeRemove } from './Badge';
import type { SelectOption } from './Select';
import { useDefaults } from '../runtime';


/** Props shared by both forms of {@link ComboboxProps}. */
export interface ComboboxBaseProps<V extends string = string>
  extends TokenProps<'Combobox'>,
    Omit<ComponentProps<'input'>, 'color' | 'size' | 'value' | 'defaultValue' | 'onChange' | 'children' | 'multiple'> {
  /** The options to suggest. For async search, update this as results arrive and set `filter={false}`. */
  options: readonly SelectOption<V>[];
  /** Controlled text in the input. */
  inputValue?: string;
  /** Called on every keystroke with the input text. Use it to fetch options for async search. */
  onInputValueChange?: (text: string) => void;
  /**
   * How options are matched against the typed text.
   * `true`: case-insensitive "contains" on the label; a function for custom matching;
   * `false` to show `options` as given (e.g. already filtered by a server).
   * @default true
   */
  filter?: boolean | ((option: SelectOption<V>, text: string) => boolean);
  /**
   * Accepts typed text that doesn't match an option (typeahead / autocomplete).
   * When `false`, unchosen text is discarded on blur: the input resets to the selected option's label,
   * or clears with `multiple`. With `multiple`, Enter adds the typed text as a chip.
   * @default false
   */
  allowCustomValue?: boolean;
  /** Shows a loading row instead of options. */
  loading?: boolean;
  /**
   * Shown when no options match.
   * @default 'No results'
   */
  emptyMessage?: ReactNode;
  /**
   * Shown while `loading` is set.
   * @default 'Loading…'
   */
  loadingMessage?: ReactNode;
}

/** Props for {@link Combobox}. `multiple` switches the value from one option to an array of them. */
export type ComboboxProps<V extends string = string> = ComboboxBaseProps<V> &
  (
    | {
        /** One value at a time. The input shows the selected option's label. */
        multiple?: false;
        /** Controlled selected value. `null` means nothing is selected. */
        value?: V | null;
        /** Initial selected value when uncontrolled. */
        defaultValue?: V | null;
        /** Called when an option is chosen, or with the typed text when `allowCustomValue` is set. */
        onValueChange?: (value: V | null) => void;
        maxSelected?: never;
      }
    | {
        /** Any number of values, shown as removable chips before the input. */
        multiple: true;
        /** Controlled selected values. */
        value?: readonly V[];
        /** Initial selected values when uncontrolled. */
        defaultValue?: readonly V[];
        /** Called with all selected values. */
        onValueChange?: (value: V[]) => void;
        /** The most values that can be selected. Other options are disabled once it is reached. */
        maxSelected?: number;
      }
  );

type SingleProps<V extends string> = Extract<ComboboxProps<V>, { multiple?: false }>;
type MultipleProps<V extends string> = Extract<ComboboxProps<V>, { multiple: true }>;

const contains = (option: SelectOption, text: string) => option.label.toLowerCase().includes(text.trim().toLowerCase());

/**
 * A text input with a filtered list of suggestions.
 * Covers searchable select (default), typeahead / autocomplete (`allowCustomValue`),
 * async search (`filter={false}` + `onInputValueChange` + `loading`)
 * and multi-select with removable chips (`multiple`).
 * Shares the size scale with {@link Input}. Works inside a {@link Field}.
 *
 * @example
 * ```tsx
 * <Combobox placeholder="Country" options={countries} onValueChange={setCountry} />
 * <Combobox multiple placeholder="Countries" options={countries} onValueChange={setCountries} />
 * ```
 */
export function Combobox<V extends string = string>(props: ComboboxProps<V>) {
  return props.multiple ? <MultipleCombobox {...props} /> : <SingleCombobox {...props} />;
}

interface ListOptions<V extends string> {
  options: readonly SelectOption<V>[];
  text: string;
  filter: ComboboxBaseProps<V>['filter'];
  loading: boolean;
  emptyMessage: ReactNode;
  loadingMessage: ReactNode;
  size: Size | undefined;
  color: Color | undefined;
  multiple: boolean;
  isSelected: (option: SelectOption<V>) => boolean;
  isDisabled: (option: SelectOption<V>) => boolean;
  onChoose: (option: SelectOption<V>) => void;
  onDismiss: () => void;
  containerRef?: RefObject<HTMLElement | null>;
}

function useComboboxList<V extends string>(opts: ListOptions<V>) {
  const { options, text, filter, loading, isSelected, isDisabled, onChoose, containerRef } = opts;
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listRef = useRef<(HTMLElement | null)[]>([]);
  const idPrefix = useId();

  const match = filter === true || filter === undefined ? contains : filter === false ? () => true : filter;
  const visible = options.filter((option) => match(option, text));

  function close() {
    setOpen(false);
    setActiveIndex(null);
  }

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange(next) {
      setOpen(next);
      if (!next) opts.onDismiss();
    },
    placement: 'bottom-start',
    transform: false,
    whileElementsMounted: autoUpdate,
    middleware: floatingMiddleware({ gap: 4, matchWidth: true }),
  });
  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    useRole(context, { role: 'combobox' }),
    useDismiss(context, {
      outsidePress: (event) => !containerRef?.current?.contains(event.target as Node),
    }),
    useListNavigation(context, {
      listRef,
      activeIndex,
      onNavigate: setActiveIndex,
      virtual: true,
      loop: true,
      disabledIndices: visible.flatMap((option, i) => (isDisabled(option) ? [i] : [])),
    }),
  ]);

  const showList = open && (loading || visible.length > 0 || text.trim() !== '');

  const list = showList && (
    <FloatingPortal>
      <div
        ref={refs.setFloating}
        style={floatingStyles}
        className={cx('yarcl-floating yarcl-panel yarcl-listbox', sizeClass(opts.size, 'Combobox'), colorClass(opts.color))}
        {...getFloatingProps({
          'aria-multiselectable': opts.multiple || undefined,
          onMouseDown: (event: MouseEvent) => event.preventDefault(),
        })}
      >
        {loading ? (
          <div className="yarcl-listbox-message">{opts.loadingMessage}</div>
        ) : visible.length === 0 ? (
          <div className="yarcl-listbox-message">{opts.emptyMessage}</div>
        ) : (
          visible.map((option, i) => {
            const isActive = i === activeIndex;
            const selected = isSelected(option);
            return (
              <div
                key={option.value}
                id={`${idPrefix}-${i}`}
                ref={(node) => {
                  listRef.current[i] = node;
                }}
                aria-disabled={isDisabled(option) || undefined}
                data-active={isActive || undefined}
                className="yarcl-option"
                {...getItemProps({ active: isActive, selected, onClick: () => onChoose(option) })}
              >
                <span className="yarcl-option-label">{option.label}</span>
                {selected && <CheckIcon />}
              </div>
            );
          })
        )}
      </div>
    </FloatingPortal>
  );

  return { open, setOpen, activeIndex, setActiveIndex, close, visible, match, refs, getReferenceProps, list };
}

function SingleCombobox<V extends string>(props: SingleProps<V>) {
  const own = useDefaults('Combobox');
  const {
    options,
    value: valueProp,
    defaultValue = null,
    onValueChange,
    inputValue: inputValueProp,
    onInputValueChange,
    filter = true,
    allowCustomValue = false,
    loading = false,
    emptyMessage = 'No results',
    loadingMessage = 'Loading…',
    size,
    radius,
    color,
    className,
    onBlur,
    name,
    multiple: _multiple,
    maxSelected: _maxSelected,
    ...rest
  } = useFieldProps(props);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useControllable<V | null>(valueProp, defaultValue, onValueChange, inputRef);
  const labelOf = (v: V | null) => options.find((option) => option.value === v)?.label ?? (allowCustomValue ? (v ?? '') : '');
  const [text, setText] = useControllable(inputValueProp, labelOf(defaultValue), onInputValueChange, inputRef);

  function choose(option: SelectOption<V>) {
    if (option.disabled) return;
    setValue(option.value);
    setText(option.label);
    close();
  }

  function restore() {
    if (allowCustomValue) return;
    const label = labelOf(value);
    if (text !== label) setText(label);
  }

  const { open, setOpen, activeIndex, setActiveIndex, close, visible, refs, getReferenceProps, list } = useComboboxList({
    options,
    text,
    filter,
    loading,
    emptyMessage,
    loadingMessage,
    size: size ?? own.size,
    color: color ?? own.color,
    multiple: false,
    isSelected: (option) => option.value === value,
    isDisabled: (option) => !!option.disabled,
    onChoose: choose,
    onDismiss: restore,
  });

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.value;
    setText(next);
    setOpen(true);
    setActiveIndex(next ? 0 : null);
    if (allowCustomValue) setValue(next ? (next as V) : null);
    else if (!next) setValue(null);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter' || !open) return;
    event.preventDefault();
    const option = activeIndex != null ? visible[activeIndex] : undefined;
    if (option) choose(option);
    else close();
  }

  const referenceRef = useMergeRefs([inputRef, refs.setReference, (rest as { ref?: React.Ref<HTMLInputElement> }).ref]);

  return (
    <>
      <input
        ref={referenceRef}
        className={cx('yarcl-input yarcl-combobox', sizeClass(size ?? own.size, 'Combobox'), radiusClass(radius ?? own.radius, size ?? own.size), colorClass(color ?? own.color), className)}
        autoComplete="off"
        aria-autocomplete="list"
        {...getReferenceProps({
          ...rest,
          value: text,
          onChange,
          onKeyDown,
          onFocus: () => setOpen(true),
          onClick: () => setOpen(true),
          onBlur(event) {
            restore();
            onBlur?.(event as FocusEvent<HTMLInputElement>);
          },
        })}
      />
      {name && <input type="hidden" name={name} value={value ?? ''} />}
      {list}
    </>
  );
}

function MultipleCombobox<V extends string>(props: MultipleProps<V>) {
  const own = useDefaults('Combobox');
  const {
    options,
    value: valueProp,
    defaultValue = [],
    onValueChange,
    maxSelected,
    inputValue: inputValueProp,
    onInputValueChange,
    filter = true,
    allowCustomValue = false,
    loading = false,
    emptyMessage = 'No results',
    loadingMessage = 'Loading…',
    size,
    radius,
    color,
    className,
    style,
    name,
    required,
    disabled,
    placeholder,
    onBlur,
    multiple: _multiple,
    ...rest
  } = useFieldProps(props);

  const controlRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [values, setValues] = useControllable<readonly V[]>(valueProp, defaultValue, onValueChange as (value: readonly V[]) => void, controlRef);
  const [text, setText] = useControllable(inputValueProp, '', onInputValueChange, controlRef);
  const chipsRef = useRef<HTMLUListElement>(null);
  const knownLabels = useRef(new Map<V, string>());
  const quietFocus = useRef(false);

  const full = maxSelected != null && values.length >= maxSelected;
  const labelOf = (v: V) => options.find((option) => option.value === v)?.label ?? knownLabels.current.get(v) ?? v;

  function toggle(option: SelectOption<V>) {
    if (option.disabled) return;
    const selected = values.includes(option.value);
    if (!selected && full) return;
    knownLabels.current.set(option.value, option.label);
    setValues(selected ? values.filter((v) => v !== option.value) : [...values, option.value]);
    if (text) {
      setText('');
      const index = options.filter((o) => match(o, '')).indexOf(option);
      setActiveIndex(index >= 0 ? index : null);
    }
  }

  function addCustom() {
    const typed = text.trim() as V;
    if (!values.includes(typed) && !full) setValues([...values, typed]);
    setText('');
    setActiveIndex(null);
  }

  function focusInput() {
    const input = inputRef.current;
    if (!input) return;
    if (document.activeElement !== input) quietFocus.current = true;
    input.focus();
  }

  function remove(v: V) {
    setValues(values.filter((x) => x !== v));
    focusInput();
  }

  function restore() {
    if (!allowCustomValue && text) setText('');
  }

  const { open, setOpen, activeIndex, setActiveIndex, close, visible, match, refs, getReferenceProps, list } = useComboboxList({
    options,
    text,
    filter,
    loading,
    emptyMessage,
    loadingMessage,
    size: size ?? own.size,
    color: color ?? own.color,
    multiple: true,
    isSelected: (option) => values.includes(option.value),
    isDisabled: (option) => !!option.disabled || (full && !values.includes(option.value)),
    onChoose: toggle,
    onDismiss: () => {},
    containerRef: controlRef,
  });

  const controlRefs = useMergeRefs([controlRef, refs.setPositionReference]);
  const inputRefs = useMergeRefs([inputRef, refs.setReference, (rest as { ref?: React.Ref<HTMLInputElement> }).ref]);
  const chipButtons = () => [...(chipsRef.current?.querySelectorAll<HTMLButtonElement>('.yarcl-badge-remove') ?? [])];

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.value;
    setText(next);
    setOpen(true);
    setActiveIndex(next ? 0 : null);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    if (event.key === 'Enter') {
      const option = open && activeIndex != null ? visible[activeIndex] : undefined;
      if (option) toggle(option);
      else if (allowCustomValue && text.trim()) addCustom();
      else if (open) close();
      else return;
      event.preventDefault();
    } else if (event.key === 'Backspace' && text === '' && values.length > 0) {
      event.preventDefault();
      setValues(values.slice(0, -1));
    } else if (event.key === 'ArrowLeft' && input.selectionStart === 0 && input.selectionEnd === 0 && values.length > 0) {
      event.preventDefault();
      close();
      chipButtons().at(-1)?.focus();
    }
  }

  function onChipKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    const buttons = chipButtons();
    const i = buttons.indexOf(event.target as HTMLButtonElement);
    if (i < 0) return;
    if (event.key === 'ArrowLeft') buttons[Math.max(i - 1, 0)].focus();
    else if (event.key === 'ArrowRight') {
      if (i === buttons.length - 1) focusInput();
      else buttons[i + 1].focus();
    } else if (event.key === 'Backspace' || event.key === 'Delete') remove(values[i]);
    else if (event.key === 'Escape') focusInput();
    else return;
    event.preventDefault();
  }

  function onControlMouseDown(event: MouseEvent<HTMLDivElement>) {
    if (disabled || (event.target as Element).closest('button, input')) return;
    event.preventDefault();
    inputRef.current?.focus();
    setOpen(true);
  }

  const s = size ?? own.size;

  return (
    <>
      <div
        ref={controlRefs}
        className={cx('yarcl-input yarcl-combobox-control', sizeClass(s, 'Combobox'), radiusClass(radius ?? own.radius, s), colorClass(color ?? own.color), className)}
        style={style}
        onMouseDown={onControlMouseDown}
      >
        {values.length > 0 && (
          <ul ref={chipsRef} role="list" aria-label="Selected" className="yarcl-combobox-chips" onKeyDown={onChipKeyDown}>
            {values.map((v) => {
              const label = labelOf(v);
              return (
                <li key={v}>
                  <Badge size={s} color={color ?? own.color}>
                    <span className="yarcl-combobox-chip-label">{label}</span>
                    <BadgeRemove aria-label={`Remove ${label}`} tabIndex={-1} disabled={disabled} onClick={() => remove(v)} />
                  </Badge>
                </li>
              );
            })}
          </ul>
        )}
        <input
          ref={inputRefs}
          className="yarcl-combobox-input"
          autoComplete="off"
          aria-autocomplete="list"
          {...getReferenceProps({
            ...rest,
            disabled,
            required: required && values.length === 0,
            placeholder: values.length > 0 ? undefined : placeholder,
            value: text,
            onChange,
            onKeyDown,
            onFocus() {
              if (quietFocus.current) quietFocus.current = false;
              else setOpen(true);
            },
            onClick: () => setOpen(true),
            onBlur(event) {
              if (!controlRef.current?.contains(event.relatedTarget as Node)) restore();
              onBlur?.(event as FocusEvent<HTMLInputElement>);
            },
          })}
        />
        {name && values.map((v) => <input key={v} type="hidden" name={name} value={v} />)}
      </div>
      {list}
    </>
  );
}
