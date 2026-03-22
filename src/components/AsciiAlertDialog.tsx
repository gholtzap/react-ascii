import React, { useId, useRef } from "react";
import type { BorderStyle } from "../chars";
import { AsciiPortal } from "../internal/AsciiPortal";
import { AsciiSurface } from "../internal/AsciiSurface";
import { useAsciiOverlay } from "../internal/useAsciiOverlay";

export interface AsciiAlertDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  ariaLabel?: string;
  children?: React.ReactNode;
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
  ariaLabel = "Alert",
  children,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  width = 50,
  border = "double",
  className,
  style,
}: AsciiAlertDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useAsciiOverlay({
    open,
    onClose: onCancel,
    contentRef,
    initialFocusRef: confirmRef,
  });

  if (!open) return null;

  return (
    <AsciiPortal>
      <div
        className="ascii-lib ascii-modal-overlay"
        onClick={(event) => {
          if (event.target === event.currentTarget) onCancel();
        }}
      >
        <div
          ref={contentRef}
          className={`ascii-alertdialog ${className ?? ""}`.trim()}
          style={style}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-label={title ? undefined : ariaLabel}
          tabIndex={-1}
        >
          <AsciiSurface
            width={width}
            border={border}
            title={title}
            accessibleTitleId={title ? titleId : undefined}
            footer={
              <div className="ascii-alertdialog-actions">
                <button
                  ref={confirmRef}
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
            }
            footerClassName="ascii-alertdialog-footer"
          >
            {children}
          </AsciiSurface>
        </div>
      </div>
    </AsciiPortal>
  );
}
