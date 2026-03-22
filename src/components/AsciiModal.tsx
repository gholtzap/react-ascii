import React, { useEffect, useCallback, useRef } from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

export interface AsciiModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: string;
  width?: number;
  border?: BorderStyle;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiModal({
  open,
  onClose,
  title,
  children,
  width = 50,
  border = "double",
  className,
  style,
}: AsciiModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus trap and keyboard handling
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && overlayRef.current) {
        const focusable = overlayRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.addEventListener("keydown", handleKeyDown);

      // Move focus into modal on next frame
      requestAnimationFrame(() => {
        if (overlayRef.current) {
          const firstFocusable = overlayRef.current.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (firstFocusable) {
            firstFocusable.focus();
          } else {
            overlayRef.current.focus();
          }
        }
      });

      return () => document.removeEventListener("keydown", handleKeyDown);
    } else {
      // Restore focus when closing
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
    }
  }, [open, handleKeyDown]);

  if (!open) return null;

  const b = borders[border];
  const inner = width - 2;

  const lines: string[] = [];

  // Top
  lines.push(b.tl + repeatChar(b.h, inner) + b.tr);

  // Title row (close button rendered separately)
  if (title) {
    const maxTitleLen = Math.max(0, inner - 2);
    const clampedTitle = title.length > maxTitleLen ? title.slice(0, maxTitleLen) : title;
    const titleSpace = inner - clampedTitle.length - 1;
    lines.push(
      b.v + ` ${clampedTitle}` + " ".repeat(Math.max(1, titleSpace)) + b.v
    );
    lines.push(b.lm + repeatChar(b.h, inner) + b.rm);
  }

  // Body
  if (children) {
    const bodyLines = children.split("\n");
    for (const bl of bodyLines) {
      lines.push(b.v + pad(` ${bl}`, inner) + b.v);
    }
  } else {
    lines.push(b.v + " ".repeat(inner) + b.v);
  }

  // Bottom
  lines.push(b.bl + repeatChar(b.h, inner) + b.br);

  return (
    <div
      ref={overlayRef}
      className="ascii-lib ascii-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      tabIndex={-1}
    >
      <div className={`ascii-modal ${className ?? ""}`.trim()} style={style}>
        <button
          type="button"
          className="ascii-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          [x]
        </button>
        {lines.join("\n")}
      </div>
    </div>
  );
}
