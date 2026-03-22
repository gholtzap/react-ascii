import { useCallback, useMemo, useState } from "react";

interface UseAsciiListNavigationOptions<T> {
  items: T[];
  isDisabled?: (item: T, index: number) => boolean;
  loop?: boolean;
  initialIndex?: number;
}

function findEnabledIndex<T>(
  items: T[],
  isDisabled: (item: T, index: number) => boolean,
  startIndex: number,
  direction: 1 | -1,
  loop: boolean
) {
  if (items.length === 0) return -1;

  let index = startIndex;
  const visited = new Set<number>();

  while (!visited.has(index)) {
    visited.add(index);

    if (index >= 0 && index < items.length && !isDisabled(items[index], index)) {
      return index;
    }

    index += direction;

    if (loop) {
      if (index < 0) index = items.length - 1;
      if (index >= items.length) index = 0;
    } else if (index < 0 || index >= items.length) {
      return -1;
    }
  }

  return -1;
}

export function useAsciiListNavigation<T>({
  items,
  isDisabled = () => false,
  loop = false,
  initialIndex = 0,
}: UseAsciiListNavigationOptions<T>) {
  const initialEnabledIndex = useMemo(
    () => findEnabledIndex(items, isDisabled, initialIndex, 1, true),
    [initialIndex, isDisabled, items]
  );
  const [activeIndex, setActiveIndex] = useState(initialEnabledIndex);

  const reset = useCallback(
    (preferredIndex = 0) => {
      setActiveIndex(findEnabledIndex(items, isDisabled, preferredIndex, 1, true));
    },
    [isDisabled, items]
  );

  const move = useCallback(
    (direction: 1 | -1) => {
      setActiveIndex((currentIndex) => {
        const startIndex = currentIndex < 0 ? (direction === 1 ? 0 : items.length - 1) : currentIndex + direction;
        const nextIndex = findEnabledIndex(items, isDisabled, startIndex, direction, loop);
        return nextIndex === -1 ? currentIndex : nextIndex;
      });
    },
    [isDisabled, items, loop]
  );

  const moveFirst = useCallback(() => {
    setActiveIndex(findEnabledIndex(items, isDisabled, 0, 1, false));
  }, [isDisabled, items]);

  const moveLast = useCallback(() => {
    setActiveIndex(findEnabledIndex(items, isDisabled, items.length - 1, -1, false));
  }, [isDisabled, items]);

  return {
    activeIndex,
    activeItem: activeIndex >= 0 ? items[activeIndex] : undefined,
    setActiveIndex,
    reset,
    moveNext: useCallback(() => move(1), [move]),
    movePrev: useCallback(() => move(-1), [move]),
    moveFirst,
    moveLast,
  };
}
