import React from "react";
import { useAnimatedValue } from "../internal/useAnimatedValue";

export interface AsciiProgressProps {
  value: number;
  width?: number;
  filled?: string;
  empty?: string;
  showLabel?: boolean;
  animate?: boolean;
  "aria-label"?: string;
  className?: string;
  style?: React.CSSProperties;
}

const FILL_STAGES = ["░", "▒", "▓", "█"];

export function AsciiProgress({
  value,
  width = 30,
  filled = "█",
  empty = "░",
  showLabel = true,
  animate = false,
  "aria-label": ariaLabel,
  className,
  style,
}: AsciiProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const animatedValue = useAnimatedValue(clamped, 600, animate);
  const displayValue = animate ? animatedValue : clamped;
  const barWidth = width - 2;
  const filledCount = Math.round((displayValue / 100) * barWidth);
  const emptyCount = barWidth - filledCount;

  let barStr: string;
  if (animate && filledCount > 0) {
    const leadingFull = Math.max(0, filledCount - 1);
    const progress = displayValue / clamped;
    const stageIndex = Math.min(Math.floor(progress * FILL_STAGES.length), FILL_STAGES.length - 1);
    const leadingChar = filled;
    const tipChar = progress < 1 ? FILL_STAGES[stageIndex] : filled;
    barStr = leadingChar.repeat(leadingFull) + tipChar + empty.repeat(emptyCount);
  } else {
    barStr = filled.repeat(filledCount) + empty.repeat(emptyCount);
  }

  const bar = `[${barStr}]`;
  const label = showLabel ? ` ${Math.round(displayValue)}%` : "";

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
