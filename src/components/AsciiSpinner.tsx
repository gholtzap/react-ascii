import React, { useState, useEffect } from "react";

export interface AsciiSpinnerProps {
  frames?: string[];
  interval?: number;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

const defaultFrames = ["|", "/", "-", "\\"];

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function AsciiSpinner({
  frames = defaultFrames,
  interval = 100,
  label,
  className,
  style,
}: AsciiSpinnerProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % frames.length);
    }, interval);
    return () => clearInterval(timer);
  }, [frames.length, interval]);

  return (
    <span
      className={`ascii-lib ascii-spinner ${className ?? ""}`.trim()}
      style={style}
      role="status"
      aria-label={label ?? "Loading"}
    >
      {frames[index]}{label ? ` ${label}` : ""}
    </span>
  );
}
