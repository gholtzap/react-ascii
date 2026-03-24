import React from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";
import { useAnimatedValue } from "../internal/useAnimatedValue";

export interface AsciiGaugeProps {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  width?: number;
  border?: BorderStyle;
  showValue?: boolean;
  animate?: boolean;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiGauge({
  value,
  min = 0,
  max = 100,
  label,
  width = 30,
  border = "single",
  showValue = true,
  animate = false,
  color,
  className,
  style,
}: AsciiGaugeProps) {
  const b = borders[border];
  const inner = width - 2;
  const range = max - min || 1;

  const animatedValue = useAnimatedValue(value, 800, animate);
  const displayValue = animate ? animatedValue : value;
  const ratio = Math.max(0, Math.min(1, (displayValue - min) / range));

  const arcChars = "▁▂▃▄▅▆▇█";
  const arcWidth = inner - 2;
  const midpoint = Math.floor(arcWidth / 2);

  const arcLine = Array.from({ length: arcWidth }, (_, i) => {
    const dist = Math.abs(i - midpoint);
    const height = Math.max(0, midpoint - dist);
    const maxHeight = midpoint;
    const charIndex = Math.min(
      Math.round((height / maxHeight) * (arcChars.length - 1)),
      arcChars.length - 1
    );
    return arcChars[charIndex];
  });

  const needlePos = Math.round(ratio * (arcWidth - 1));
  const needleLine = " ".repeat(needlePos) + "▲" + " ".repeat(arcWidth - needlePos - 1);

  const lines: string[] = [];
  lines.push(b.tl + repeatChar(b.h, inner) + b.tr);

  if (label) {
    lines.push(b.v + pad(` ${label}`, inner) + b.v);
    lines.push(b.lm + repeatChar(b.h, inner) + b.rm);
  }

  lines.push(b.v + " " + arcLine.join("") + " " + b.v);
  lines.push(b.v + " " + needleLine + " " + b.v);

  if (showValue) {
    const valStr = `${Math.round(displayValue)}`;
    const minStr = String(min);
    const maxStr = String(max);
    const scaleRow = ` ${minStr}${" ".repeat(Math.max(0, arcWidth - minStr.length - maxStr.length))}${maxStr} `;
    lines.push(b.v + pad(scaleRow, inner) + b.v);
    lines.push(b.v + pad(valStr, inner, "center") + b.v);
  }

  lines.push(b.bl + repeatChar(b.h, inner) + b.br);

  return (
    <div
      className={`ascii-lib ascii-gauge ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
      role="meter"
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-label={label ?? "Gauge"}
    >
      {lines.join("\n")}
    </div>
  );
}
