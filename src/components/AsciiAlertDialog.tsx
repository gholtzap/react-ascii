import React, { useRef } from "react";
import type { BorderStyle } from "../chars";
import { AsciiDialogFrame } from "../internal/AsciiDialogFrame";

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
  color?: string;
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
  color,
  className,
  style,
}: AsciiAlertDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  return (
    <AsciiDialogFrame
      open={open}
      onClose={onCancel}
      title={title}
      ariaLabel={ariaLabel}
      width={width}
      border={border}
      className={className}
      style={color ? { ...style, color } : style}
      overlayClassName="ascii-modal-overlay"
      panelClassName="ascii-alertdialog"
      role="alertdialog"
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
      showCloseButton={false}
      initialFocusRef={confirmRef}
    >
      {children}
    </AsciiDialogFrame>
  );
}
