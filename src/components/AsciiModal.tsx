import React, { useId, useRef } from "react";
import type { BorderStyle } from "../chars";
import { AsciiPortal } from "../internal/AsciiPortal";
import { AsciiSurface } from "../internal/AsciiSurface";
import { useAsciiOverlay } from "../internal/useAsciiOverlay";

export interface AsciiModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  ariaLabel?: string;
  children?: React.ReactNode;
  width?: number;
  border?: BorderStyle;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiModal({
  open,
  onClose,
  title,
  ariaLabel = "Modal",
  children,
  width = 50,
  border = "double",
  className,
  style,
}: AsciiModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useAsciiOverlay({
    open,
    onClose,
    contentRef,
    initialFocusRef: closeRef,
  });

  if (!open) return null;

  return (
    <AsciiPortal>
      <div
        className="ascii-lib ascii-modal-overlay"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div
          ref={contentRef}
          className={`ascii-modal ${className ?? ""}`.trim()}
          style={style}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-label={title ? undefined : ariaLabel}
          tabIndex={-1}
        >
          <button
            ref={closeRef}
            type="button"
            className="ascii-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            [x]
          </button>
          <AsciiSurface
            width={width}
            border={border}
            title={title}
            accessibleTitleId={title ? titleId : undefined}
            bodyClassName="ascii-modal-body"
          >
            {children}
          </AsciiSurface>
        </div>
      </div>
    </AsciiPortal>
  );
}
