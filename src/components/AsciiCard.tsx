import React from "react";
import type { BorderStyle } from "../chars";
import { AsciiSurface } from "../internal/AsciiSurface";

export interface AsciiCardProps {
  title?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
  border?: BorderStyle;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiCard({
  title,
  children,
  footer,
  width = 40,
  border = "single",
  className,
  style,
}: AsciiCardProps) {
  return (
    <AsciiSurface
      width={width}
      border={border}
      title={title}
      footer={footer}
      className={`ascii-card ${className ?? ""}`.trim()}
      style={style}
      bodyClassName="ascii-card-body"
      footerClassName="ascii-card-footer"
    >
      {children}
    </AsciiSurface>
  );
}
