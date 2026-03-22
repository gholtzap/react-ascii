import React from "react";

export interface AsciiBadgeProps {
  children: React.ReactNode;
  variant?: "default" | "outline";
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiBadge({
  children,
  variant = "default",
  className,
  style,
}: AsciiBadgeProps) {
  const text = typeof children === "string" ? children : "";

  const rendered =
    variant === "outline" ? `( ${text} )` : `[ ${text} ]`;

  return (
    <span
      className={`ascii-lib ascii-badge ${className ?? ""}`.trim()}
      style={style}
    >
      {rendered}
    </span>
  );
}
