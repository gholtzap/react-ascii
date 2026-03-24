import React from "react";
import type { BorderStyle } from "../chars";
import { AsciiDialogFrame } from "../internal/AsciiDialogFrame";

export type DrawerSide = "left" | "right" | "top" | "bottom";

export interface AsciiDrawerProps {
  open: boolean;
  onClose: () => void;
  side?: DrawerSide;
  title?: string;
  ariaLabel?: string;
  children?: React.ReactNode;
  width?: number;
  border?: BorderStyle;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiDrawer({
  open,
  onClose,
  side = "right",
  title,
  ariaLabel = "Drawer",
  children,
  width = 40,
  border = "single",
  color,
  className,
  style,
}: AsciiDrawerProps) {
  const sideClass = `ascii-drawer-${side}`;

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
      overlayClassName="ascii-drawer-overlay"
      panelClassName={`ascii-drawer ${sideClass}`}
      bodyClassName="ascii-drawer-body"
      closeClassName="ascii-drawer-close"
    >
      {children}
    </AsciiDialogFrame>
  );
}
