import React from "react";

export interface AsciiTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: string;
  onDismiss?: () => void;
  variant?: "default" | "outline";
}

export const AsciiTag = React.forwardRef<HTMLSpanElement, AsciiTagProps>(function AsciiTag({
  children,
  onDismiss,
  variant = "default",
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
      style={style}
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
