import React, { useId } from "react";

export interface AsciiFieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactElement;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiField({
  label,
  error,
  hint,
  required,
  children,
  className,
  style,
}: AsciiFieldProps) {
  const id = useId();
  const childId = (children.props as { id?: string }).id ?? id;
  const hintId = hint ? `${childId}-hint` : undefined;
  const errorId = error ? `${childId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div
      className={`ascii-lib ascii-field${error ? " ascii-field-error" : ""} ${className ?? ""}`.trim()}
      style={style}
    >
      <label htmlFor={childId} className="ascii-field-label">
        {label}{required ? " *" : ""}
      </label>
      {"\n"}
      {React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        id: childId,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
      })}
      {hint && !error && (
        <>
          {"\n"}
          <span id={hintId} className="ascii-field-hint">{"  ~ " + hint}</span>
        </>
      )}
      {error && (
        <>
          {"\n"}
          <span id={errorId} className="ascii-field-error-msg" role="alert">{"  ! " + error}</span>
        </>
      )}
    </div>
  );
}
