import React from "react";

export interface AsciiLabelProps {
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiLabel({
  htmlFor,
  required,
  children,
  color,
  className,
  style,
}: AsciiLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`ascii-lib ascii-label ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
    >
      {children}{required ? " *" : ""}
    </label>
  );
}
