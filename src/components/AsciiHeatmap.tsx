import React from "react";
import { useWaveReveal } from "../internal/useWaveReveal";

const DENSITY_CHARS = [" ", "░", "▒", "▓", "█"];

export interface AsciiHeatmapProps {
  data: number[][];
  min?: number;
  max?: number;
  xLabels?: string[];
  yLabels?: string[];
  animate?: boolean;
  color?: string;
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
  animate = false,
  color,
  className,
  style,
  "aria-label": ariaLabel,
}: AsciiHeatmapProps) {
  if (data.length === 0) return null;

  let derivedMin = Infinity;
  let derivedMax = -Infinity;
  for (let r = 0; r < data.length; r++) {
    for (let c = 0; c < data[r].length; c++) {
      if (data[r][c] < derivedMin) derivedMin = data[r][c];
      if (data[r][c] > derivedMax) derivedMax = data[r][c];
    }
  }
  const min = minOverride ?? derivedMin;
  const max = maxOverride ?? derivedMax;
  const range = max - min || 1;

  const cols = data[0]?.length ?? 0;
  const waveProgress = useWaveReveal(data.length, cols, 30, animate);

  const yLabelWidth = yLabels ? Math.max(...yLabels.map((l) => l.length)) + 1 : 0;

  const lines: string[] = [];

  if (xLabels) {
    const header = " ".repeat(yLabelWidth) + xLabels.join("");
    lines.push(header);
  }

  for (let row = 0; row < data.length; row++) {
    const prefix = yLabels ? (yLabels[row] ?? "").padStart(yLabelWidth - 1) + " " : "";
    const cells = data[row].map((v, col) => {
      const diag = row + col;
      if (diag >= waveProgress) return " ";
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
      style={color ? { ...style, color } : style}
      role="img"
      aria-label={ariaLabel ?? "Heatmap"}
    >
      {lines.join("\n")}
    </div>
  );
}
