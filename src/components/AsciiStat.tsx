import React from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

export interface AsciiStatProps {
  label: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  border?: BorderStyle;
  width?: number;
  sparkline?: number[];
  color?: string;
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
  sparkline,
  color,
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
  if (sparkline && sparkline.length > 0) {
    const sparks = ["\u2581", "\u2582", "\u2583", "\u2584", "\u2585", "\u2586", "\u2587", "\u2588"];
    const sMin = Math.min(...sparkline);
    const sMax = Math.max(...sparkline);
    const sRange = sMax - sMin || 1;
    const bars = sparkline.map((v) => {
      const n = (v - sMin) / sRange;
      return sparks[Math.min(Math.round(n * 7), 7)];
    });
    lines.push(b.v + pad(` ${bars.join("")}`, inner) + b.v);
  }
  lines.push(b.bl + repeatChar(b.h, inner) + b.br);

  return (
    <div
      className={`ascii-lib ascii-stat ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
    >
      {lines.join("\n")}
    </div>
  );
}
