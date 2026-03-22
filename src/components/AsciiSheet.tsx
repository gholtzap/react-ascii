import React, { useRef } from "react";
import type { BorderStyle } from "../chars";
import { AsciiPortal } from "../internal/AsciiPortal";
import { AsciiSurface } from "../internal/AsciiSurface";
import { useAsciiOverlay } from "../internal/useAsciiOverlay";

export type SheetSide = "left" | "right" | "bottom";

export interface AsciiSheetProps {
  open: boolean;
  onClose: () => void;
  side?: SheetSide;
  title?: string;
  children?: React.ReactNode;
  width?: number;
  border?: BorderStyle;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiSheet({
  open,
  onClose,
  side = "right",
  title,
  children,
  width = 40,
  border = "single",
  className,
  style,
}: AsciiSheetProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useAsciiOverlay({
    open,
    onClose,
    contentRef,
    initialFocusRef: closeRef,
  });

  if (!open) return null;

  const positionClass = `ascii-sheet-${side}`;

  return (
    <AsciiPortal>
      <div
        className="ascii-lib ascii-sheet-overlay"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div
          ref={contentRef}
          className={`ascii-sheet ${positionClass} ${className ?? ""}`.trim()}
          style={style}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          tabIndex={-1}
        >
          <button
            ref={closeRef}
            type="button"
            className="ascii-sheet-close"
            onClick={onClose}
            aria-label="Close"
          >
            [x]
          </button>
          <AsciiSurface width={width} border={border} title={title} bodyClassName="ascii-sheet-body">
            {children}
          </AsciiSurface>
        </div>
      </div>
    </AsciiPortal>
  );
}
