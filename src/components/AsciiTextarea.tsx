import React, { useId } from "react";
import { borders, repeatChar, type BorderStyle } from "../chars";

export interface AsciiTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "style"> {
  label?: string;
  width?: number;
  height?: number;
  border?: BorderStyle;
  color?: string;
  style?: React.CSSProperties;
}

export function AsciiTextarea({
  label,
  width = 40,
  height = 5,
  border = "single",
  color,
  className,
  style,
  ...rest
}: AsciiTextareaProps) {
  const id = useId();
  const inputId = rest.id ?? id;
  const b = borders[border];
  const inner = width - 2;

  const topLine = b.tl + repeatChar(b.h, inner) + b.tr;
  const botLine = b.bl + repeatChar(b.h, inner) + b.br;
  const sideLine = b.v;

  return (
    <div className={`ascii-lib ascii-textarea-wrapper ${className ?? ""}`.trim()} style={color ? { ...style, color } : style}>
      {label && (
        <>
          <label htmlFor={inputId}>{label}</label>
          {"\n"}
        </>
      )}
      <span>{topLine}</span>
      {"\n"}
      <span style={{ display: "inline-flex" }}>
        <span>{sideLine}</span>
        <textarea
          {...rest}
          id={inputId}
          className="ascii-textarea-native"
          style={{
            width: `${inner - 2}ch`,
            height: `${height * 1.4}em`,
            padding: "0 0.5ch",
          }}
        />
        <span>{sideLine}</span>
      </span>
      {"\n"}
      <span>{botLine}</span>
    </div>
  );
}
