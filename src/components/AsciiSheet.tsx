import React from "react";
import type { BorderStyle } from "../chars";
import { AsciiDialogFrame } from "../internal/AsciiDialogFrame";

export type SheetSide = "left" | "right" | "bottom";

export interface AsciiSheetProps {
  open: boolean;
  onClose: () => void;
  side?: SheetSide;
  title?: string;
  ariaLabel?: string;
  children?: React.ReactNode;
  width?: number;
  border?: BorderStyle;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiSheet({
  open,
  onClose,
  side = "right",
  title,
  ariaLabel = "Sheet",
  children,
  width = 40,
  border = "single",
  color,
  className,
  style,
}: AsciiSheetProps) {
  const positionClass = `ascii-sheet-${side}`;

  return (
    <AsciiDialogFrame
      open={open}
      onClose={onClose}
      title={title}
      ariaLabel={ariaLabel}
      width={width}
      border={border}
      className={className}
      style={color ? { ...style, color } : style}
      overlayClassName="ascii-sheet-overlay"
      panelClassName={`ascii-sheet ${positionClass}`}
      bodyClassName="ascii-sheet-body"
      closeClassName="ascii-sheet-close"
    >
      {children}
    </AsciiDialogFrame>
  );
}
