import React, { useEffect, useCallback, useRef } from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

export type DrawerSide = "left" | "right" | "top" | "bottom";

export interface AsciiDrawerProps {
  open: boolean;
  onClose: () => void;
  side?: DrawerSide;
  title?: string;
  children?: string;
  width?: number;
  border?: BorderStyle;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiDrawer({
  open,
  onClose,
  side = "right",
  title,
  children,
  width = 40,
  border = "single",
  className,
  style,
}: AsciiDrawerProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.addEventListener("keydown", handleKeyDown);
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
  } else {
    lines.push(b.v + " ".repeat(inner) + b.v);
  }

  lines.push(b.bl + repeatChar(b.h, inner) + b.br);

  const sideClass = `ascii-drawer-${side}`;

  return (
    <div
      ref={overlayRef}
      className="ascii-lib ascii-drawer-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`ascii-drawer ${sideClass} ${className ?? ""}`.trim()}
        style={style}
      >
        <button
          type="button"
          className="ascii-drawer-close"
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
