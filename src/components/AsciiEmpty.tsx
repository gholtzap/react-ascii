import React from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

export interface AsciiEmptyProps {
  title?: string;
  description?: string;
  icon?: string;
  width?: number;
  border?: BorderStyle;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiEmpty({
  title = "No data",
  description,
  icon = "( )",
  width = 40,
  border = "single",
  color,
  className,
  style,
}: AsciiEmptyProps) {
  const b = borders[border];
  const inner = width - 2;
  const lines: string[] = [];

  lines.push(b.tl + repeatChar(b.h, inner) + b.tr);
  lines.push(b.v + " ".repeat(inner) + b.v);
  lines.push(b.v + pad(icon, inner, "center") + b.v);
  lines.push(b.v + " ".repeat(inner) + b.v);
  lines.push(b.v + pad(title, inner, "center") + b.v);
  if (description) {
    lines.push(b.v + " ".repeat(inner) + b.v);
    for (const line of description.split("\n")) {
      lines.push(b.v + pad(line, inner, "center") + b.v);
    }
  }
  lines.push(b.v + " ".repeat(inner) + b.v);
  lines.push(b.bl + repeatChar(b.h, inner) + b.br);

  return (
    <div
      className={`ascii-lib ascii-empty ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
    >
      {lines.join("\n")}
    </div>
  );
}
