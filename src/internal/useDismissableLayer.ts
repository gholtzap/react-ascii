import type { RefObject } from "react";
import { useEffect } from "react";

interface UseDismissableLayerOptions {
  open: boolean;
  onDismiss: () => void;
  refs: Array<RefObject<HTMLElement | null>>;
  closeOnEscape?: boolean;
}

export function useDismissableLayer({
  open,
  onDismiss,
  refs,
  closeOnEscape = true,
}: UseDismissableLayerOptions) {
  useEffect(() => {
    if (!open || typeof document === "undefined") return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;

      if (!target) return;

      const inside = refs.some((ref) => {
        const current = ref.current;
        return current ? current.contains(target) : false;
      });

      if (!inside) onDismiss();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === "Escape") {
        event.preventDefault();
        onDismiss();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeOnEscape, onDismiss, open, refs]);
}
