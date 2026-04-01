import type { RefObject } from "react";
import { useCallback, useEffect, useRef } from "react";

interface UseAsciiOverlayOptions {
  open: boolean;
  onClose: () => void;
  contentRef: RefObject<HTMLElement | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
  trapFocus?: boolean;
  lockScroll?: boolean;
}

function getFocusableElements(node: HTMLElement) {
  return Array.from(
    node.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter((element) => !element.hasAttribute("disabled") && !element.getAttribute("aria-hidden"));
}

export function useAsciiOverlay({
  open,
  onClose,
  contentRef,
  initialFocusRef,
  trapFocus = true,
  lockScroll = true,
}: UseAsciiOverlayOptions) {
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const previousOverflowRef = useRef<string | null>(null);

  const focusInitial = useCallback(() => {
    const explicitInitial = initialFocusRef?.current;

    if (explicitInitial) {
      explicitInitial.focus();
      return;
    }

    const content = contentRef.current;

    if (!content) return;

    const firstFocusable = getFocusableElements(content)[0];

    if (firstFocusable) {
      firstFocusable.focus();
      return;
    }

    content.focus();
  }, [contentRef, initialFocusRef]);

  useEffect(() => {
    if (!open || typeof document === "undefined") return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    if (lockScroll) {
      previousOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }

    const frame = requestAnimationFrame(focusInitial);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (!trapFocus || event.key !== "Tab" || !contentRef.current) return;

      const focusable = getFocusableElements(contentRef.current);

      if (focusable.length === 0) {
        event.preventDefault();
        contentRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (activeElement === first || activeElement === contentRef.current) {
          event.preventDefault();
          last.focus();
        }
        return;
      }

      if (activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);

      if (lockScroll && previousOverflowRef.current !== null) {
        document.body.style.overflow = previousOverflowRef.current;
        previousOverflowRef.current = null;
      }

      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    };
  }, [contentRef, focusInitial, lockScroll, onClose, open, trapFocus]);
}
