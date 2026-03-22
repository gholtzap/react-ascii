import React from "react";
import type { BorderStyle } from "../chars";
import { AsciiSurface } from "../internal/AsciiSurface";

export type AsciiStatusGridTone = "neutral" | "info" | "success" | "warn" | "error";

export interface AsciiStatusGridItem {
  key: string;
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  tone?: AsciiStatusGridTone;
}

export interface AsciiStatusGridProps {
  items: AsciiStatusGridItem[];
  title?: string;
  columns?: number;
  width?: number;
  border?: BorderStyle;
  footer?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiStatusGrid({
  items,
  title = "status grid",
  columns = 2,
  width = 56,
  border = "single",
  footer,
  className,
  style,
}: AsciiStatusGridProps) {
  return (
    <AsciiSurface
      width={width}
      border={border}
      title={title}
      footer={footer}
      className={`ascii-statusgrid ${className ?? ""}`.trim()}
      style={style}
      bodyClassName="ascii-statusgrid-body"
    >
      <div
        className="ascii-statusgrid-grid"
        style={{ gridTemplateColumns: `repeat(${Math.max(1, columns)}, minmax(0, 1fr))` }}
      >
        {items.map((item) => (
          <div key={item.key} className={`ascii-statusgrid-cell ascii-statusgrid-${item.tone ?? "neutral"}`}>
            <div className="ascii-statusgrid-label">{item.label}</div>
            <div className="ascii-statusgrid-value">{item.value}</div>
            {item.hint ? <div className="ascii-statusgrid-hint">{item.hint}</div> : null}
          </div>
        ))}
      </div>
    </AsciiSurface>
  );
}
