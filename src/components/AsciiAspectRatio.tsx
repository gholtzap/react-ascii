import React from "react";
import type { BorderStyle } from "../chars";
import { AsciiSurface } from "../internal/AsciiSurface";

export interface AsciiAspectRatioProps {
  ratio?: number;
  width?: number;
  border?: BorderStyle;
  children?: React.ReactNode;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiAspectRatio({
  ratio = 16 / 9,
  width = 40,
  border = "single",
  children,
  color,
  className,
  style,
}: AsciiAspectRatioProps) {
  const inner = width - 2;
  const height = Math.max(1, Math.round(inner / ratio / 2));

  return (
    <AsciiSurface
      width={width}
      border={border}
      minBodyRows={height}
      className={`ascii-aspect-ratio ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
      bodyClassName="ascii-aspect-ratio-body"
    >
      {children}
    </AsciiSurface>
  );
}
