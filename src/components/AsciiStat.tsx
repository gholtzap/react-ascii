import React from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

export interface AsciiStatProps {
  label: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  border?: BorderStyle;
  width?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiStat({
  label,
  value,
  trend,
  trendLabel,
  border = "single",
  width = 24,
  className,
  style,
}: AsciiStatProps) {
  const b = borders[border];
  const inner = width - 2;

  let trendStr = "";
  if (trend !== undefined) {
    const arrow = trend > 0 ? "▲" : trend < 0 ? "▼" : "─";
    const sign = trend > 0 ? "+" : "";
    trendStr = `${arrow} ${sign}${trend}%`;
    if (trendLabel) trendStr += ` ${trendLabel}`;
  }

  const lines: string[] = [];
  lines.push(b.tl + repeatChar(b.h, inner) + b.tr);
  lines.push(b.v + pad(` ${label}`, inner) + b.v);
  lines.push(b.v + pad(` ${value}`, inner) + b.v);
  if (trendStr) {
    lines.push(b.v + pad(` ${trendStr}`, inner) + b.v);
  }
  lines.push(b.bl + repeatChar(b.h, inner) + b.br);

  return (
    <div
      className={`ascii-lib ascii-stat ${className ?? ""}`.trim()}
      style={style}
    >
      {lines.join("\n")}
    </div>
  );
}
