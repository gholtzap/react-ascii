import React, { useId } from "react";

export interface AsciiCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "style"> {
  label: string;
  style?: React.CSSProperties;
}

export function AsciiCheckbox({
  label,
  checked,
  className,
  style,
  ...rest
}: AsciiCheckboxProps) {
  const id = useId();
  const inputId = rest.id ?? id;
  const marker = checked ? "x" : " ";

  return (
    <label
      htmlFor={inputId}
      className={`ascii-lib ascii-check ${className ?? ""}`.trim()}
      style={style}
    >
      <input type="checkbox" id={inputId} checked={checked} {...rest} />
      <span className="ascii-check-box">[{marker}]</span>
      <span>{label}</span>
    </label>
  );
}
