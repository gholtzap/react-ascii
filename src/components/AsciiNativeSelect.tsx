import React, { useId } from "react";
import { borders, repeatChar, type BorderStyle } from "../chars";

export interface AsciiNativeSelectOption {
  value: string;
  label: string;
}

export interface AsciiNativeSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "style" | "width"> {
  options: AsciiNativeSelectOption[];
  label?: string;
  width?: number;
  border?: BorderStyle;
  style?: React.CSSProperties;
}

export function AsciiNativeSelect({
  options,
  label,
  width = 30,
  border = "single",
  className,
  style,
  ...rest
}: AsciiNativeSelectProps) {
  const id = useId();
  const selectId = rest.id ?? id;
  const b = borders[border];
  const inner = width - 2;

  const topLine = b.tl + repeatChar(b.h, inner) + b.tr;
  const botLine = b.bl + repeatChar(b.h, inner) + b.br;

  return (
    <div className={`ascii-lib ascii-native-select ${className ?? ""}`.trim()} style={style}>
      {label && (
        <>
          <label htmlFor={selectId}>{label}</label>
          {"\n"}
        </>
      )}
      <span>{topLine}</span>
      {"\n"}
      <span>{b.v} </span>
      <select
        {...rest}
        id={selectId}
        className="ascii-native-select-el"
        style={{ width: `${inner - 2}ch` }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span> {b.v}</span>
      {"\n"}
      <span>{botLine}</span>
    </div>
  );
}
