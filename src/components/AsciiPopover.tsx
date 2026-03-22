import React, { useState, useRef, useEffect, useCallback } from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

export type PopoverSide = "top" | "bottom";

export interface AsciiPopoverProps {
  content: string;
  width?: number;
  side?: PopoverSide;
  border?: BorderStyle;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiPopover({
  content,
  width = 30,
  side = "bottom",
  border = "single",
  children,
  className,
  style,
}: AsciiPopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const b = borders[border];
  const inner = width - 2;

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open, handleClickOutside]);

  useEffect(() => {
    if (open) {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [open]);

  const contentLines = content.split("\n");
  const lines: string[] = [];
  lines.push(b.tl + repeatChar(b.h, inner) + b.tr);
  for (const cl of contentLines) {
    lines.push(b.v + pad(` ${cl}`, inner) + b.v);
  }
  lines.push(b.bl + repeatChar(b.h, inner) + b.br);

  const posClass = side === "top" ? "ascii-popover-top" : "ascii-popover-bottom";

  return (
    <div
      ref={ref}
      className={`ascii-lib ascii-popover-wrapper ${className ?? ""}`.trim()}
      style={style}
    >
      <button
        type="button"
        className="ascii-popover-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {children}
      </button>
      {open && (
        <div className={`ascii-popover-content ${posClass}`} role="dialog">
          {lines.join("\n")}
        </div>
      )}
    </div>
  );
}
