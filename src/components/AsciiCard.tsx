import React from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

export interface AsciiCardProps {
  title?: string;
  children?: string;
  footer?: string;
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
  const b = borders[border];
  const inner = width - 2;

  const lines: string[] = [];

  // Top border
  lines.push(b.tl + repeatChar(b.h, inner) + b.tr);

  // Title
  if (title) {
    lines.push(b.v + pad(` ${title}`, inner) + b.v);
    lines.push(b.lm + repeatChar(b.h, inner) + b.rm);
  }

  // Body
  const bodyLines = children ? children.split("\n") : [];
  if (bodyLines.length > 0) {
    for (const line of bodyLines) {
      lines.push(b.v + pad(` ${line}`, inner) + b.v);
    }
  } else {
    lines.push(b.v + " ".repeat(inner) + b.v);
  }

  // Footer
  if (footer) {
    lines.push(b.lm + repeatChar(b.h, inner) + b.rm);
    lines.push(b.v + pad(` ${footer}`, inner) + b.v);
  }

  // Bottom border
  lines.push(b.bl + repeatChar(b.h, inner) + b.br);

  return (
    <div className={`ascii-lib ascii-card ${className ?? ""}`.trim()} style={style}>
      {lines.join("\n")}
    </div>
  );
}
