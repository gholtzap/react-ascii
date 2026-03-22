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

  return (
    <div
      className={`ascii-lib ascii-field${error ? " ascii-field-error" : ""} ${className ?? ""}`.trim()}
      style={style}
    >
      <label htmlFor={id} className="ascii-field-label">
        {label}{required ? " *" : ""}
      </label>
      {"\n"}
      {React.cloneElement(children as React.ReactElement<Record<string, unknown>>, { id })}
      {hint && !error && (
        <>
          {"\n"}
          <span className="ascii-field-hint">{"  ~ " + hint}</span>
        </>
      )}
      {error && (
        <>
          {"\n"}
          <span className="ascii-field-error-msg" role="alert">{"  ! " + error}</span>
        </>
      )}
    </div>
  );
}
