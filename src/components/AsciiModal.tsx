import React from "react";
import type { BorderStyle } from "../chars";
import { AsciiDialogFrame } from "../internal/AsciiDialogFrame";

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
  return (
    <AsciiDialogFrame
      open={open}
      onClose={onClose}
      title={title}
      ariaLabel={ariaLabel}
      width={width}
      border={border}
      className={className}
      style={style}
      overlayClassName="ascii-modal-overlay"
      panelClassName="ascii-modal"
      bodyClassName="ascii-modal-body"
      closeClassName="ascii-modal-close"
    >
      {children}
    </AsciiDialogFrame>
  );
}
