import React from "react";
import { borders, repeatChar, type BorderStyle } from "../chars";

export interface AsciiInputGroupProps {
  prefix?: string;
  suffix?: string;
  width?: number;
  border?: BorderStyle;
  children: React.ReactElement;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiInputGroup({
  prefix,
  suffix,
  width = 36,
  border = "single",
  children,
  className,
  style,
}: AsciiInputGroupProps) {
  const b = borders[border];
  const inner = width - 2;
  const prefixLen = prefix ? prefix.length + 1 : 0;
  const suffixLen = suffix ? suffix.length + 1 : 0;
  const inputWidth = inner - prefixLen - suffixLen - 2;

  const topLine = b.tl + repeatChar(b.h, inner) + b.tr;
  const botLine = b.bl + repeatChar(b.h, inner) + b.br;

  return (
    <div
      className={`ascii-lib ascii-input-group ${className ?? ""}`.trim()}
      style={style}
    >
      <span>{topLine}</span>
      {"\n"}
      <span>{b.v}</span>
      {prefix && <span className="ascii-input-group-addon">{prefix}{b.v}</span>}
      <span> </span>
      {React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        className: "ascii-input-group-native",
        style: { width: `${Math.max(1, inputWidth)}ch` },
      })}
      <span> </span>
      {suffix && <span className="ascii-input-group-addon">{b.v}{suffix}</span>}
      <span>{b.v}</span>
      {"\n"}
      <span>{botLine}</span>
    </div>
  );
}
