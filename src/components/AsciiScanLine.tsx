import React from "react";

export interface AsciiScanLineProps {
  children: React.ReactNode;
  enabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiScanLine({
  children,
  enabled = true,
  className,
  style,
}: AsciiScanLineProps) {
  return (
    <div
      className={`${enabled ? "ascii-animate-scan" : ""} ${className ?? ""}`.trim()}
      style={{ display: "inline-block", ...style }}
    >
      {enabled && <div className="ascii-scan-line-bar" />}
      {children}
    </div>
  );
}
