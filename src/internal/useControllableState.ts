import { useCallback, useEffect, useRef, useState } from "react";

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
  const currentValueRef = useRef(currentValue);

  useEffect(() => {
    currentValueRef.current = currentValue;
  }, [currentValue]);

  const setValue = useCallback(
    (nextValue: T | ((currentValue: T) => T)) => {
      if (typeof nextValue === "function") {
        const updater = nextValue as (currentValue: T) => T;

        if (!controlled) {
          setInternalValue((previousValue) => {
            const resolvedValue = updater(previousValue);
            onChange?.(resolvedValue);
            return resolvedValue;
          });
          return;
        }

        const resolvedValue = updater(currentValueRef.current);
        onChange?.(resolvedValue);
        return;
      }

      if (!controlled) {
        setInternalValue(nextValue);
      }

      onChange?.(nextValue);
    },
    [controlled, onChange]
  );

  return [currentValue, setValue] as const;
}
