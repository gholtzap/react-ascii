import React, { useRef, useState } from "react";
import { borders, pad, repeatChar, type BorderStyle } from "../chars";
import { AsciiTrigger } from "../internal/AsciiTrigger";
import { useDismissableLayer } from "../internal/useDismissableLayer";

export type PopoverSide = "top" | "bottom";

export interface AsciiPopoverProps {
  content: string;
  width?: number;
  side?: PopoverSide;
  border?: BorderStyle;
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiPopover({
  content,
  width = 30,
  side = "bottom",
  border = "single",
  asChild,
  children,
  className,
  style,
}: AsciiPopoverProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const b = borders[border];
  const inner = width - 2;

  useDismissableLayer({
    open,
    onDismiss: () => setOpen(false),
    refs: [wrapperRef, contentRef],
  });

  const contentLines = content.split("\n");
  const lines: string[] = [];
  lines.push(b.tl + repeatChar(b.h, inner) + b.tr);
  for (const line of contentLines) {
    lines.push(b.v + pad(` ${line}`, inner) + b.v);
  }
  lines.push(b.bl + repeatChar(b.h, inner) + b.br);

  const posClass = side === "top" ? "ascii-popover-top" : "ascii-popover-bottom";

  return (
    <div
      ref={wrapperRef}
      className={`ascii-lib ascii-popover-wrapper ${className ?? ""}`.trim()}
      style={style}
    >
      <AsciiTrigger
        asChild={asChild}
        className="ascii-popover-trigger"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        {children}
      </AsciiTrigger>
      {open && (
        <div
          ref={contentRef}
          className={`ascii-popover-content ${posClass}`}
          role="dialog"
          tabIndex={-1}
        >
          {lines.join("\n")}
        </div>
      )}
    </div>
  );
}
