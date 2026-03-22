import React from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

export interface AsciiAspectRatioProps {
  ratio?: number;
  width?: number;
  border?: BorderStyle;
  children?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiAspectRatio({
  ratio = 16 / 9,
  width = 40,
  border = "single",
  children,
  className,
  style,
}: AsciiAspectRatioProps) {
  const b = borders[border];
  const inner = width - 2;
  const height = Math.max(1, Math.round(inner / ratio / 2));

  const lines: string[] = [];
  lines.push(b.tl + repeatChar(b.h, inner) + b.tr);

  const contentLines = children ? children.split("\n") : [];
  for (let i = 0; i < height; i++) {
    const text = contentLines[i] ?? "";
    lines.push(b.v + pad(text ? ` ${text}` : "", inner) + b.v);
  }

  lines.push(b.bl + repeatChar(b.h, inner) + b.br);

  return (
    <div
      className={`ascii-lib ascii-aspect-ratio ${className ?? ""}`.trim()}
      style={style}
    >
      {lines.join("\n")}
    </div>
  );
}
