import React from "react";

export interface AsciiProgressProps {
  value: number; // 0-100
  width?: number;
  filled?: string;
  empty?: string;
  showLabel?: boolean;
  "aria-label"?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiProgress({
  value,
  width = 30,
  filled = "█",
  empty = "░",
  showLabel = true,
  "aria-label": ariaLabel,
  className,
  style,
}: AsciiProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const barWidth = width - 2; // subtract brackets
  const filledCount = Math.round((clamped / 100) * barWidth);
  const emptyCount = barWidth - filledCount;

  const bar = `[${filled.repeat(filledCount)}${empty.repeat(emptyCount)}]`;
  const label = showLabel ? ` ${Math.round(clamped)}%` : "";

  return (
    <div
      className={`ascii-lib ascii-progress ${className ?? ""}`.trim()}
      style={style}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
    >
      {bar}{label}
    </div>
  );
}
