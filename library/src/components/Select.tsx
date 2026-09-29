import {
  autoUpdate,
  FloatingFocusManager,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useMergeRefs,
  useRole,
  useTypeahead,
} from '@floating-ui/react';
import { useRef, useState, type ComponentProps, type ReactNode } from 'react';
import { colorClass, cx, radiusClass, sizeClass } from '../classes';
import { useFieldProps } from '../field-context';
import { CheckIcon, ChevronIcon, floatingMiddleware } from '../floating';
import { useControllable } from '../hooks';
import type { TokenProps } from '../types';
import { useDefaults } from '../runtime';


/** An option of a {@link Select} or {@link Combobox}. */
export interface SelectOption<V extends string = string> {
  /** Value reported by `onValueChange` and submitted with forms. */
  value: V;
  /** Text shown to the user. Also used for type-to-select and filtering. */
  label: string;
  /** Prevents choosing this option. */
  disabled?: boolean;
}

/** Props for {@link Select}. */
export interface SelectProps<V extends string = string>
  extends TokenProps<'Select'>,
    Omit<ComponentProps<'button'>, 'color' | 'value' | 'defaultValue' | 'onChange' | 'children'> {
  /** The options to choose from. */
  options: readonly SelectOption<V>[];
  /** Controlled value. `null` means nothing is selected. */
  value?: V | null;
  /**
   * Initial value when uncontrolled.
   * @default null
   */
  defaultValue?: V | null;
  /** Called with the chosen option's value. */
  onValueChange?: (value: V | null) => void;
  /** Text shown when nothing is selected. */
  placeholder?: ReactNode;
  /** Form field name. Renders a hidden input with the value. */
  name?: string;
}

/**
 * Picks one value from a list, like a native `<select>` but styled from the design tokens.
 * Arrow keys and type-to-select work both open and closed.
 * Shares the size scale with {@link Input} and {@link Button}. Works inside a {@link Field}.
 *
 * @example
 * ```tsx
 * <Select
 *   placeholder="Choose a plan"
 *   options={[
 *     { value: 'free', label: 'Free' },
 *     { value: 'pro', label: 'Pro' },
 *   ]}
 *   onValueChange={setPlan}
 * />
 * ```
 */
export function Select<V extends string = string>(props: SelectProps<V>) {
  const own = useDefaults('Select');
  const {
    options,
    value: valueProp,
    defaultValue = null,
    onValueChange,
    placeholder,
    name,
    size,
    radius,
    color,
    className,
    disabled,
    ...rest
  } = useFieldProps(props);

  const [value, setValue] = useControllable<V | null>(valueProp, defaultValue, onValueChange);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listRef = useRef<(HTMLElement | null)[]>([]);
  const labelsRef = useRef<(string | null)[]>([]);
  const typingRef = useRef(false);

  labelsRef.current = options.map((option) => (option.disabled ? null : option.label));
  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;
  const disabledIndices = options.flatMap((option, i) => (option.disabled ? [i] : []));

  function choose(index: number) {
    const option = options[index];
    if (!option || option.disabled) return;
    setValue(option.value);
    setOpen(false);
  }

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
    transform: false,
    whileElementsMounted: autoUpdate,
    middleware: floatingMiddleware({ gap: 4, matchWidth: true }),
  });
  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    useClick(context, { enabled: !disabled }),
    useDismiss(context),
    useRole(context, { role: 'select' }),
    useListNavigation(context, {
      listRef,
      activeIndex,
      selectedIndex: selectedIndex >= 0 ? selectedIndex : null,
      onNavigate: setActiveIndex,
      disabledIndices,
      loop: true,
    }),
    useTypeahead(context, {
      listRef: labelsRef,
      activeIndex,
      selectedIndex: selectedIndex >= 0 ? selectedIndex : null,
      onMatch: open ? setActiveIndex : choose,
      onTypingChange: (typing) => {
        typingRef.current = typing;
      },
    }),
  ]);

  const buttonRef = useMergeRefs([refs.setReference, (rest as { ref?: React.Ref<HTMLButtonElement> }).ref]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        className={cx('yarcl-input yarcl-select', sizeClass(size ?? own.size, 'Select'), radiusClass(radius ?? own.radius, size ?? own.size), colorClass(color ?? own.color), className)}
        {...getReferenceProps(rest)}
      >
        <span className={cx('yarcl-select-value', !selected && 'yarcl-select-placeholder')}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronIcon />
      </button>
      {name && <input type="hidden" name={name} value={value ?? ''} />}
      {open && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              className={cx('yarcl-floating yarcl-panel yarcl-listbox', sizeClass(size ?? own.size, 'Select'), colorClass(color ?? own.color))}
              {...getFloatingProps()}
            >
              {options.map((option, i) => {
                const isSelected = i === selectedIndex;
                const isActive = i === activeIndex;
                return (
                  <div
                    key={option.value}
                    ref={(node) => {
                      listRef.current[i] = node;
                    }}
                    tabIndex={isActive ? 0 : -1}
                    aria-disabled={option.disabled || undefined}
                    data-active={isActive || undefined}
                    className="yarcl-option"
                    {...getItemProps({
                      active: isActive,
                      selected: isSelected,
                      onClick: () => choose(i),
                      onKeyDown(event) {
                        if (event.key === 'Enter' || (event.key === ' ' && !typingRef.current)) {
                          event.preventDefault();
                          choose(i);
                        }
                      },
                    })}
                  >
                    <span className="yarcl-option-label">{option.label}</span>
                    {isSelected && <CheckIcon />}
                  </div>
                );
              })}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
}
