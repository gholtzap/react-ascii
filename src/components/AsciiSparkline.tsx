import React from "react";

const SPARK_CHARS = ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"];

export interface AsciiSparklineProps {
  data: number[];
  min?: number;
  max?: number;
  className?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
}

export function AsciiSparkline({
  data,
  min: minOverride,
  max: maxOverride,
  className,
  style,
  "aria-label": ariaLabel,
}: AsciiSparklineProps) {
  if (data.length === 0) return null;

  const min = minOverride ?? Math.min(...data);
  const max = maxOverride ?? Math.max(...data);
  const range = max - min || 1;

  const bars = data.map((v) => {
    const normalized = (v - min) / range;
    const index = Math.min(Math.round(normalized * (SPARK_CHARS.length - 1)), SPARK_CHARS.length - 1);
    return SPARK_CHARS[index];
  });

  return (
    <span
      className={`ascii-lib ascii-sparkline ${className ?? ""}`.trim()}
      style={style}
      role="img"
      aria-label={ariaLabel ?? `Sparkline: ${data.join(", ")}`}
    >
      {bars.join("")}
    </span>
  );
}
