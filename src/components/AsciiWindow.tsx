import React from "react";
import type { BorderStyle } from "../chars";
import { AsciiSurface } from "../internal/AsciiSurface";

export interface AsciiWindowProps {
  title?: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  width?: number;
  height?: number;
  border?: BorderStyle;
  chrome?: "dots" | "ascii" | "none";
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiWindow({
  title = "window",
  footer,
  children,
  width = 56,
  height = 8,
  border = "single",
  chrome = "dots",
  className,
  style,
}: AsciiWindowProps) {
  const chromePrefix = chrome === "dots"
    ? "● ● ●  "
    : chrome === "ascii"
      ? "[x] [ ] [_]  "
      : "";

  return (
    <AsciiSurface
      width={width}
      border={border}
      title={`${chromePrefix}${title}`}
      footer={footer}
      minBodyRows={height}
      className={`ascii-window ${className ?? ""}`.trim()}
      style={style}
      bodyClassName="ascii-window-body"
      footerClassName="ascii-window-footer"
    >
      {children}
    </AsciiSurface>
  );
}
