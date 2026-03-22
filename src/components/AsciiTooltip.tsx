import React, { useState, useId } from "react";
import { borders, repeatChar, type BorderStyle } from "../chars";

export interface AsciiTooltipProps {
  text: string;
  children: React.ReactNode;
  border?: BorderStyle;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiTooltip({
  text,
  children,
  border = "single",
  className,
  style,
}: AsciiTooltipProps) {
  const [visible, setVisible] = useState(false);
  const tooltipId = useId();
  const b = borders[border];
  const inner = text.length + 2;

  const tooltip = [
    b.tl + repeatChar(b.h, inner) + b.tr,
    b.v + ` ${text} ` + b.v,
    b.bl + repeatChar(b.h, inner) + b.br,
  ].join("\n");

  return (
    <span
      className={`ascii-lib ascii-tooltip-wrapper ${className ?? ""}`.trim()}
      style={style}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      tabIndex={0}
      aria-describedby={visible ? tooltipId : undefined}
    >
      {visible && (
        <span className="ascii-tooltip-content" role="tooltip" id={tooltipId}>
          {tooltip}
        </span>
      )}
      {children}
    </span>
  );
}
