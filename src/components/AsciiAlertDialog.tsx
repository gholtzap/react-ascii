import React, { useEffect, useCallback, useRef } from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

export interface AsciiAlertDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  children?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  width?: number;
  border?: BorderStyle;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiAlertDialog({
  open,
  onConfirm,
  onCancel,
  title,
  children,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  width = 50,
  border = "double",
  className,
  style,
}: AsciiAlertDialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
        return;
      }
      if (e.key === "Enter") {
        onConfirm();
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
    [onConfirm, onCancel]
  );

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.addEventListener("keydown", handleKeyDown);
      requestAnimationFrame(() => {
        if (overlayRef.current) {
          const firstBtn = overlayRef.current.querySelector<HTMLElement>("button");
          if (firstBtn) firstBtn.focus();
        }
      });
      return () => document.removeEventListener("keydown", handleKeyDown);
    } else {
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

  lines.push(b.tl + repeatChar(b.h, inner) + b.tr);

  if (title) {
    lines.push(b.v + pad(` ${title}`, inner) + b.v);
    lines.push(b.lm + repeatChar(b.h, inner) + b.rm);
  }

  if (children) {
    for (const bl of children.split("\n")) {
      lines.push(b.v + pad(` ${bl}`, inner) + b.v);
    }
  }

  lines.push(b.v + " ".repeat(inner) + b.v);
  const actions = `  [${confirmLabel}]  [${cancelLabel}]`;
  lines.push(b.v + pad(actions, inner) + b.v);
  lines.push(b.bl + repeatChar(b.h, inner) + b.br);

  return (
    <div
      ref={overlayRef}
      className="ascii-lib ascii-modal-overlay"
      role="alertdialog"
      aria-modal="true"
      aria-label={title}
      tabIndex={-1}
    >
      <div className={`ascii-alertdialog ${className ?? ""}`.trim()} style={style}>
        <div style={{ whiteSpace: "pre" }}>{lines.join("\n")}</div>
        <div className="ascii-alertdialog-actions">
          <button
            type="button"
            className="ascii-alertdialog-btn"
            onClick={onConfirm}
          >
            [{confirmLabel}]
          </button>
          <button
            type="button"
            className="ascii-alertdialog-btn"
            onClick={onCancel}
          >
            [{cancelLabel}]
          </button>
        </div>
      </div>
    </div>
  );
}
