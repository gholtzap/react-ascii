import React from "react";

export interface AsciiLabelProps {
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiLabel({
  htmlFor,
  required,
  children,
  className,
  style,
}: AsciiLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`ascii-lib ascii-label ${className ?? ""}`.trim()}
      style={style}
    >
      {children}{required ? " *" : ""}
    </label>
  );
}
