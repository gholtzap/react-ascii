import React from "react";
import { borders, repeatChar, type BorderStyle } from "../chars";

export interface AsciiDividerProps {
  width?: number;
  border?: BorderStyle;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiDivider({
  width = 40,
  border = "single",
  label,
  className,
  style,
}: AsciiDividerProps) {
  const b = borders[border];

  let line: string;
  if (label) {
    const labelPart = ` ${label} `;
    const remaining = width - labelPart.length;
    const left = Math.floor(remaining / 2);
    const right = remaining - left;
    line = repeatChar(b.h, left) + labelPart + repeatChar(b.h, right);
  } else {
    line = repeatChar(b.h, width);
  }

  return (
    <div
      className={`ascii-lib ascii-divider ${className ?? ""}`.trim()}
      style={style}
      role="separator"
    >
      {line}
    </div>
  );
}
