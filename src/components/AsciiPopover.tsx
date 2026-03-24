import React, { useId, useRef, useState } from "react";
import type { BorderStyle } from "../chars";
import { AsciiPortal } from "../internal/AsciiPortal";
import { AsciiSurface } from "../internal/AsciiSurface";
import { AsciiTrigger } from "../internal/AsciiTrigger";
import { type AsciiFloatingAlign, type AsciiFloatingSide, useAsciiFloating } from "../internal/useAsciiFloating";
import { useDismissableLayer } from "../internal/useDismissableLayer";
import { useAsciiAutoWidth } from "../internal/useAsciiAutoWidth";
import { useAsciiOverlay } from "../internal/useAsciiOverlay";

export type PopoverSide = AsciiFloatingSide;

export interface AsciiPopoverProps {
  content: React.ReactNode;
  width?: number;
  side?: PopoverSide;
  align?: AsciiFloatingAlign;
  offset?: number;
  border?: BorderStyle;
  asChild?: boolean;
  ariaLabel?: string;
  children: React.ReactNode;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiPopover({
  content,
  width,
  side = "bottom",
  align = "start",
  offset = 4,
  border = "single",
  asChild,
  ariaLabel = "Popover",
  children,
  color,
  className,
  style,
}: AsciiPopoverProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const popoverId = useId();
  const { resolvedWidth, measureRef, charMeasureRef, shouldMeasure } = useAsciiAutoWidth({
    content,
    width,
  });
  const { floatingStyle, placement } = useAsciiFloating({
    open,
    anchorRef: triggerRef,
    contentRef,
    side,
    align,
    offset,
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

  return (
    <div
      ref={wrapperRef}
      className={`ascii-lib ascii-popover-wrapper ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
    >
      <AsciiTrigger
        asChild={asChild}
        className="ascii-popover-trigger"
        ref={triggerRef}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={open ? popoverId : undefined}
      >
        {children}
      </AsciiTrigger>
      {open && (
        <AsciiPortal>
          <div
            id={popoverId}
            ref={contentRef}
            className={`ascii-popover-content ascii-popover-${placement.side}`}
            style={floatingStyle}
            role="dialog"
            aria-label={ariaLabel}
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
        </AsciiPortal>
      )}
    </div>
  );
}
