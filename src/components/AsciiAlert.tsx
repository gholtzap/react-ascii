import React from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

export type AlertVariant = "info" | "success" | "warning" | "error";

const variantIcons: Record<AlertVariant, string> = {
  info: "i",
  success: "*",
  warning: "!",
  error: "x",
};

export interface AsciiAlertProps {
  variant?: AlertVariant;
  children: string;
  width?: number;
  border?: BorderStyle;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiAlert({
  variant = "info",
  children,
  width = 50,
  border = "single",
  className,
  style,
}: AsciiAlertProps) {
  const b = borders[border];
  const icon = variantIcons[variant];
  const inner = width - 2;

  const lines: string[] = [];
  lines.push(b.tl + repeatChar(b.h, inner) + b.tr);
  lines.push(b.v + pad(` [${icon}] ${children}`, inner) + b.v);
  lines.push(b.bl + repeatChar(b.h, inner) + b.br);

  const roleMap: Record<AlertVariant, string> = {
    info: "status",
    success: "status",
    warning: "alert",
    error: "alert",
  };

  return (
    <div
      className={`ascii-lib ascii-alert ${className ?? ""}`.trim()}
      style={style}
      role={roleMap[variant]}
    >
      {lines.join("\n")}
    </div>
  );
}
