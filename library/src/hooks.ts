import { useCallback, useEffect, useState, type RefObject } from 'react';

export function useControllable<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
  elementRef?: RefObject<HTMLElement | null>,
): [T, (next: T) => void] {
  const [internal, setInternal] = useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : internal;

  useEffect(() => {
    if (controlled || !elementRef?.current) return;
    const form = elementRef.current.closest('form');
    if (!form) return;
    const onReset = () => {
      setInternal(defaultValue);
      onChange?.(defaultValue);
    };
    form.addEventListener('reset', onReset);
    return () => form.removeEventListener('reset', onReset);
  }, [controlled, defaultValue, elementRef, onChange]);

  const set = useCallback(
    (next: T) => {
      if (!controlled) setInternal(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );
  return [current, set];
}
