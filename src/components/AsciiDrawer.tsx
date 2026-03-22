import React, { useRef } from "react";
import type { BorderStyle } from "../chars";
import { AsciiPortal } from "../internal/AsciiPortal";
import { AsciiSurface } from "../internal/AsciiSurface";
import { useAsciiOverlay } from "../internal/useAsciiOverlay";

export type DrawerSide = "left" | "right" | "top" | "bottom";

export interface AsciiDrawerProps {
  open: boolean;
  onClose: () => void;
  side?: DrawerSide;
  title?: string;
  children?: React.ReactNode;
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
  const contentRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useAsciiOverlay({
    open,
    onClose,
    contentRef,
    initialFocusRef: closeRef,
  });

  if (!open) return null;

  const sideClass = `ascii-drawer-${side}`;

  return (
    <AsciiPortal>
      <div
        className="ascii-lib ascii-drawer-overlay"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div
          ref={contentRef}
          className={`ascii-drawer ${sideClass} ${className ?? ""}`.trim()}
          style={style}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          tabIndex={-1}
        >
          <button
            ref={closeRef}
            type="button"
            className="ascii-drawer-close"
            onClick={onClose}
            aria-label="Close"
          >
            [x]
          </button>
          <AsciiSurface width={width} border={border} title={title} bodyClassName="ascii-drawer-body">
            {children}
          </AsciiSurface>
        </div>
      </div>
    </AsciiPortal>
  );
}
