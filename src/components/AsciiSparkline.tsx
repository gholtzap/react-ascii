import React, { useState, useEffect } from "react";
import { useReducedMotion } from "../internal/useReducedMotion";

const SPARK_CHARS = ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"];

export interface AsciiSparklineProps {
  data: number[];
  min?: number;
  max?: number;
  animate?: boolean;
  className?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
}

export function AsciiSparkline({
  data,
  min: minOverride,
  max: maxOverride,
  animate = false,
  className,
  style,
  "aria-label": ariaLabel,
}: AsciiSparklineProps) {
  if (data.length === 0) return null;

  const reduced = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(animate && !reduced ? 0 : data.length);

  useEffect(() => {
    if (!animate || reduced) { setVisibleCount(data.length); return; }
    setVisibleCount(0);
    let count = 0;
    const timer = setInterval(() => {
      count++;
      setVisibleCount(count);
      if (count >= data.length) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, [data, animate, reduced]);

  const min = minOverride ?? Math.min(...data);
  const max = maxOverride ?? Math.max(...data);
  const range = max - min || 1;

  const bars = data.map((v) => {
    const normalized = (v - min) / range;
    const index = Math.min(Math.round(normalized * (SPARK_CHARS.length - 1)), SPARK_CHARS.length - 1);
    return SPARK_CHARS[index];
  });

  const displayed = bars.slice(0, visibleCount).join("") + " ".repeat(Math.max(0, data.length - visibleCount));

  return (
    <span
      className={`ascii-lib ascii-sparkline ${className ?? ""}`.trim()}
      style={style}
      role="img"
      aria-label={ariaLabel ?? `Sparkline: ${data.join(", ")}`}
    >
      {displayed}
    </span>
  );
}
