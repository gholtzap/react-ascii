import React, { useId } from "react";
import { borders, repeatChar, type BorderStyle } from "../chars";

export interface AsciiInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "style" | "width"> {
  label?: string;
  width?: number;
  border?: BorderStyle;
  color?: string;
  style?: React.CSSProperties;
}

export function AsciiInput({
  label,
  width = 30,
  border = "single",
  color,
  className,
  style,
  ...rest
}: AsciiInputProps) {
  const id = useId();
  const inputId = rest.id ?? id;
  const b = borders[border];
  const inner = width - 2;

  const topLine = b.tl + repeatChar(b.h, inner) + b.tr;
  const botLine = b.bl + repeatChar(b.h, inner) + b.br;

  return (
    <div className={`ascii-lib ascii-input-wrapper ${className ?? ""}`.trim()} style={color ? { ...style, color } : style}>
      {label && (
        <>
          <label htmlFor={inputId}>{label}</label>
          {"\n"}
        </>
      )}
      <span>{topLine}</span>
      {"\n"}
      <span>{b.v} </span>
      <input
        {...rest}
        id={inputId}
        className="ascii-input-native"
        style={{ width: `${inner - 2}ch` }}
      />
      <span> {b.v}</span>
      {"\n"}
      <span>{botLine}</span>
    </div>
  );
}
