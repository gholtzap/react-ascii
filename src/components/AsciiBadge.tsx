import React from "react";

export interface AsciiBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: "default" | "outline";
}

export const AsciiBadge = React.forwardRef<HTMLSpanElement, AsciiBadgeProps>(function AsciiBadge({
  children,
  variant = "default",
  className,
  style,
  ...rest
}, ref) {
  const text = typeof children === "string" ? children : "";

  const rendered =
    variant === "outline" ? `( ${text} )` : `[ ${text} ]`;

  return (
    <span
      ref={ref}
      className={`ascii-lib ascii-badge ${className ?? ""}`.trim()}
      style={style}
      {...rest}
    >
      {rendered}
    </span>
  );
});
