import React from "react";

export type AsciiDir = "ltr" | "rtl";

export interface AsciiDirectionProps {
  dir: AsciiDir;
  children: React.ReactNode;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiDirection({
  dir,
  children,
  color,
  className,
  style,
}: AsciiDirectionProps) {
  return (
    <div
      className={`ascii-lib ascii-direction ${className ?? ""}`.trim()}
      style={color ? { direction: dir, ...style, color } : { direction: dir, ...style }}
      dir={dir}
    >
      {children}
    </div>
  );
}
