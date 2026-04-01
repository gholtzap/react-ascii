import React from "react";

export interface AsciiSkeletonProps {
  width?: number;
  lines?: number;
  char?: string;
  shimmer?: boolean;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiSkeleton({
  width = 20,
  lines = 1,
  char = "░",
  shimmer = false,
  color,
  className,
  style,
}: AsciiSkeletonProps) {
  const rows: string[] = [];
  for (let i = 0; i < lines; i++) {
    const lineWidth = i === lines - 1 && lines > 1
      ? Math.ceil(width * 0.6)
      : width;
    rows.push(char.repeat(lineWidth));
  }

  const shimmerClass = shimmer ? " ascii-skeleton-shimmer" : "";

  return (
    <div
      className={`ascii-lib ascii-skeleton${shimmerClass} ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
      role="status"
      aria-label="Loading"
    >
      <span aria-hidden="true">{rows.join("\n")}</span>
      <span className="ascii-sr-only">Loading...</span>
    </div>
  );
}
