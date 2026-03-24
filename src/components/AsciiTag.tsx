import React from "react";

export interface AsciiTagProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> {
  children: string;
  onDismiss?: () => void;
  variant?: "default" | "outline";
  color?: string;
}

export const AsciiTag = React.forwardRef<HTMLSpanElement, AsciiTagProps>(function AsciiTag({
  children,
  onDismiss,
  variant = "default",
  color,
  className,
  style,
  ...rest
}, ref) {
  const open = variant === "outline" ? "( " : "[ ";
  const close = variant === "outline" ? " )" : " ]";
  const dismissible = onDismiss !== undefined;

  return (
    <span
      ref={ref}
      className={`ascii-lib ascii-tag ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
      {...rest}
    >
      {open}{children}
      {dismissible ? (
        <>
          {" "}
          <button
            type="button"
            className="ascii-tag-dismiss"
            onClick={onDismiss}
            aria-label={`Remove ${children}`}
          >
            x
          </button>
          {close}
        </>
      ) : (
        close
      )}
    </span>
  );
});
