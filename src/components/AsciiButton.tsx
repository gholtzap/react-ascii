import React from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

export interface AsciiButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  label: string;
  border?: BorderStyle;
  width?: number;
  style?: React.CSSProperties;
}

export function AsciiButton({
  label,
  border = "single",
  width,
  className,
  style,
  ...rest
}: AsciiButtonProps) {
  const b = borders[border];
  const inner = width ? width - 2 : label.length + 2;

  const top = b.tl + repeatChar(b.h, inner) + b.tr;
  const mid = b.v + pad(label, inner, "center") + b.v;
  const bot = b.bl + repeatChar(b.h, inner) + b.br;

  return (
    <button
      className={`ascii-lib ascii-btn ${className ?? ""}`.trim()}
      style={style}
      {...rest}
    >
      {top}
      {"\n"}
      {mid}
      {"\n"}
      {bot}
    </button>
  );
}
