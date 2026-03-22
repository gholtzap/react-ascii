import React, { useId } from "react";

export interface AsciiRadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "style"> {
  label: string;
  style?: React.CSSProperties;
}

export function AsciiRadio({
  label,
  checked,
  className,
  style,
  ...rest
}: AsciiRadioProps) {
  const id = useId();
  const inputId = rest.id ?? id;
  const marker = checked ? "o" : " ";

  return (
    <label
      htmlFor={inputId}
      className={`ascii-lib ascii-radio ${className ?? ""}`.trim()}
      style={style}
    >
      <input type="radio" id={inputId} checked={checked} {...rest} />
      <span className="ascii-radio-dot">({marker})</span>
      <span>{label}</span>
    </label>
  );
}
