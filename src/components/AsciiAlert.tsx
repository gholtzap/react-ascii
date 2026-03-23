import React from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";
import { useTypewriter } from "../internal/useTypewriter";
import { useBorderDrawIn } from "../internal/useBorderDrawIn";

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
  animate?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiAlert({
  variant = "info",
  children,
  width = 50,
  border = "single",
  animate = false,
  className,
  style,
}: AsciiAlertProps) {
  const b = borders[border];
  const icon = variantIcons[variant];
  const inner = width - 2;

  const { displayed } = useTypewriter(children, 25, animate);
  const perimeter = (inner * 2) + 2;
  const { progress, done: borderDone } = useBorderDrawIn(perimeter, 6, animate);

  const visibleChars = Math.floor(progress * perimeter);
  const topEdge = Math.min(visibleChars, inner);
  const rightSide = Math.min(Math.max(visibleChars - inner, 0), 3);
  const bottomEdge = Math.min(Math.max(visibleChars - inner - 3, 0), inner);
  const leftSide = Math.min(Math.max(visibleChars - inner * 2 - 3, 0), 3);

  const topLine = borderDone
    ? b.tl + repeatChar(b.h, inner) + b.tr
    : b.tl + repeatChar(b.h, topEdge) + " ".repeat(Math.max(0, inner - topEdge)) + (visibleChars > inner ? b.tr : " ");

  const midContent = pad(` [${icon}] ${displayed}`, inner);
  const midLine = (leftSide >= 2 ? b.v : " ") + midContent + (rightSide >= 2 ? b.v : " ");

  const botLine = borderDone
    ? b.bl + repeatChar(b.h, inner) + b.br
    : (leftSide >= 3 ? b.bl : " ") + repeatChar(b.h, bottomEdge) + " ".repeat(Math.max(0, inner - bottomEdge)) + (rightSide >= 3 ? b.br : " ");

  const lines = [topLine, midLine, botLine];

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
