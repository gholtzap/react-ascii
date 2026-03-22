import React from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

export interface AsciiBarChartBar {
  label: string;
  value: number;
  color?: string;
}

export interface AsciiBarChartProps {
  bars: AsciiBarChartBar[];
  width?: number;
  max?: number;
  border?: BorderStyle;
  showValues?: boolean;
  fillChar?: string;
  emptyChar?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiBarChart({
  bars,
  width = 50,
  max: maxOverride,
  border = "single",
  showValues = true,
  fillChar = "█",
  emptyChar = "░",
  className,
  style,
}: AsciiBarChartProps) {
  if (bars.length === 0) return null;

  const b = borders[border];
  const inner = width - 2;
  const maxVal = maxOverride ?? Math.max(...bars.map((d) => d.value));
  const maxLabelLen = Math.max(...bars.map((d) => d.label.length));
  const maxValStr = showValues ? String(maxVal).length + 1 : 0;
  const barSpace = inner - maxLabelLen - 3 - maxValStr;

  const lines: string[] = [];
  lines.push(b.tl + repeatChar(b.h, inner) + b.tr);

  for (let i = 0; i < bars.length; i++) {
    const d = bars[i];
    const label = pad(d.label, maxLabelLen, "right");
    const ratio = maxVal > 0 ? d.value / maxVal : 0;
    const filled = Math.round(ratio * barSpace);
    const empty = barSpace - filled;
    const valStr = showValues ? ` ${d.value}` : "";
    const barLine = ` ${label} ${repeatChar(fillChar, filled)}${repeatChar(emptyChar, empty)}${valStr}`;
    lines.push(b.v + pad(barLine, inner) + b.v);
  }

  lines.push(b.bl + repeatChar(b.h, inner) + b.br);

  return (
    <div
      className={`ascii-lib ascii-barchart ${className ?? ""}`.trim()}
      style={style}
      role="img"
      aria-label={`Bar chart: ${bars.map((d) => `${d.label}: ${d.value}`).join(", ")}`}
    >
      {lines.join("\n")}
    </div>
  );
}
