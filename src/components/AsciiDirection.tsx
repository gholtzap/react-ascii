import React from "react";

export type AsciiDir = "ltr" | "rtl";

export interface AsciiDirectionProps {
  dir: AsciiDir;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiDirection({
  dir,
  children,
  className,
  style,
}: AsciiDirectionProps) {
  return (
    <div
      className={`ascii-lib ascii-direction ${className ?? ""}`.trim()}
      style={{ direction: dir, ...style }}
      dir={dir}
    >
      {children}
    </div>
  );
}
