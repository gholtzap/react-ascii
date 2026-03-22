import React from "react";

export interface AsciiSkeletonProps {
  width?: number;
  lines?: number;
  char?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiSkeleton({
  width = 20,
  lines = 1,
  char = "░",
  className,
  style,
}: AsciiSkeletonProps) {
  const rows: string[] = [];
  for (let i = 0; i < lines; i++) {
    // Vary line lengths slightly for a natural look
    const lineWidth = i === lines - 1 && lines > 1
      ? Math.ceil(width * 0.6)
      : width;
    rows.push(char.repeat(lineWidth));
  }

  return (
    <div
      className={`ascii-lib ascii-skeleton ${className ?? ""}`.trim()}
      style={style}
      role="status"
      aria-label="Loading"
    >
      <span aria-hidden="true">{rows.join("\n")}</span>
      <span className="ascii-sr-only">Loading...</span>
    </div>
  );
}
