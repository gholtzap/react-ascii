import React, { useState, useId } from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

export interface AsciiHoverCardProps {
  content: string;
  width?: number;
  border?: BorderStyle;
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiHoverCard({
  content,
  width = 30,
  border = "single",
  asChild,
  children,
  className,
  style,
}: AsciiHoverCardProps) {
  const [visible, setVisible] = useState(false);
  const cardId = useId();
  const b = borders[border];
  const inner = width - 2;

  const contentLines = content.split("\n");
  const lines: string[] = [];
  lines.push(b.tl + repeatChar(b.h, inner) + b.tr);
  for (const cl of contentLines) {
    lines.push(b.v + pad(` ${cl}`, inner) + b.v);
  }
  lines.push(b.bl + repeatChar(b.h, inner) + b.br);

  const triggerProps = {
    onMouseEnter: () => setVisible(true),
    onMouseLeave: () => setVisible(false),
    onFocus: () => setVisible(true),
    onBlur: () => setVisible(false),
    "aria-describedby": visible ? cardId : undefined,
  };

  return (
    <span
      className={`ascii-lib ascii-hovercard-wrapper ${className ?? ""}`.trim()}
      style={style}
    >
      {visible && (
        <span className="ascii-hovercard-content" id={cardId} role="tooltip">
          {lines.join("\n")}
        </span>
      )}
      {asChild && React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
          ...(children.props as Record<string, unknown>),
          ...triggerProps,
        })
        : (
          <span tabIndex={0} {...triggerProps}>
            {children}
          </span>
        )}
    </span>
  );
}
