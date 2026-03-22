import { useCallback, useState } from "react";

interface UseControllableStateOptions<T> {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const controlled = value !== undefined;
  const currentValue = controlled ? value : internalValue;

  const setValue = useCallback(
    (nextValue: T | ((currentValue: T) => T)) => {
      const resolvedValue = typeof nextValue === "function"
        ? (nextValue as (currentValue: T) => T)(currentValue)
        : nextValue;

      if (!controlled) {
        setInternalValue(resolvedValue);
      }

      onChange?.(resolvedValue);
    },
    [controlled, currentValue, onChange]
  );

  return [currentValue, setValue] as const;
}
