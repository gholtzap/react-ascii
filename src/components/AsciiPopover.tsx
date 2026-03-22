import React, { useId, useRef, useState } from "react";
import type { BorderStyle } from "../chars";
import { AsciiSurface } from "../internal/AsciiSurface";
import { AsciiTrigger } from "../internal/AsciiTrigger";
import { useDismissableLayer } from "../internal/useDismissableLayer";
import { useAsciiAutoWidth } from "../internal/useAsciiAutoWidth";
import { useAsciiOverlay } from "../internal/useAsciiOverlay";

export type PopoverSide = "top" | "bottom";

export interface AsciiPopoverProps {
  content: React.ReactNode;
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
  width,
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
  const popoverId = useId();
  const { resolvedWidth, measureRef, charMeasureRef, shouldMeasure } = useAsciiAutoWidth({
    content,
    width,
  });

  useDismissableLayer({
    open,
    onDismiss: () => setOpen(false),
    refs: [wrapperRef, contentRef],
    closeOnEscape: false,
  });

  useAsciiOverlay({
    open,
    onClose: () => setOpen(false),
    contentRef,
    trapFocus: false,
    lockScroll: false,
  });

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
        aria-controls={open ? popoverId : undefined}
      >
        {children}
      </AsciiTrigger>
      {open && (
        <div
          id={popoverId}
          ref={contentRef}
          className={`ascii-popover-content ${posClass}`}
          role="dialog"
          tabIndex={0}
        >
          <AsciiSurface width={resolvedWidth} border={border} className="ascii-popover-surface">
            {content}
          </AsciiSurface>
          {shouldMeasure && (
            <span className="ascii-popup-measure-root" aria-hidden="true">
              <span ref={charMeasureRef} className="ascii-popup-char-measure">0000000000</span>
              <span ref={measureRef} className="ascii-popup-measure">{content}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
