import React from "react";

export interface AsciiTagProps {
  children: string;
  onDismiss?: () => void;
  variant?: "default" | "outline";
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiTag({
  children,
  onDismiss,
  variant = "default",
  className,
  style,
}: AsciiTagProps) {
  const open = variant === "outline" ? "( " : "[ ";
  const close = variant === "outline" ? " )" : " ]";
  const dismissible = onDismiss !== undefined;

  return (
    <span
      className={`ascii-lib ascii-tag ${className ?? ""}`.trim()}
      style={style}
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
}
