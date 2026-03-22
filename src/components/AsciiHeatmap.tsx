import React from "react";

const DENSITY_CHARS = [" ", "░", "▒", "▓", "█"];

export interface AsciiHeatmapProps {
  data: number[][];
  min?: number;
  max?: number;
  xLabels?: string[];
  yLabels?: string[];
  className?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
}

export function AsciiHeatmap({
  data,
  min: minOverride,
  max: maxOverride,
  xLabels,
  yLabels,
  className,
  style,
  "aria-label": ariaLabel,
}: AsciiHeatmapProps) {
  if (data.length === 0) return null;

  const flat = ([] as number[]).concat(...data);
  const min = minOverride ?? Math.min(...flat);
  const max = maxOverride ?? Math.max(...flat);
  const range = max - min || 1;

  const yLabelWidth = yLabels ? Math.max(...yLabels.map((l) => l.length)) + 1 : 0;

  const lines: string[] = [];

  if (xLabels) {
    const header = " ".repeat(yLabelWidth) + xLabels.join("");
    lines.push(header);
  }

  for (let row = 0; row < data.length; row++) {
    const prefix = yLabels ? (yLabels[row] ?? "").padStart(yLabelWidth - 1) + " " : "";
    const cells = data[row].map((v) => {
      const normalized = (v - min) / range;
      const index = Math.min(
        Math.round(normalized * (DENSITY_CHARS.length - 1)),
        DENSITY_CHARS.length - 1
      );
      return DENSITY_CHARS[index];
    });
    lines.push(prefix + cells.join(""));
  }

  return (
    <div
      className={`ascii-lib ascii-heatmap ${className ?? ""}`.trim()}
      style={style}
      role="img"
      aria-label={ariaLabel ?? "Heatmap"}
    >
      {lines.join("\n")}
    </div>
  );
}
