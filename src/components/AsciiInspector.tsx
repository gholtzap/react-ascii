import React from "react";
import type { BorderStyle } from "../chars";
import { AsciiSurface } from "../internal/AsciiSurface";

export type AsciiInspectorTone = "neutral" | "info" | "success" | "warn" | "error";

export interface AsciiInspectorEntry {
  key: string;
  label: string;
  value: React.ReactNode;
  group?: string;
  meta?: string;
  tone?: AsciiInspectorTone;
}

export interface AsciiInspectorProps {
  entries: AsciiInspectorEntry[];
  title?: string;
  width?: number;
  border?: BorderStyle;
  footer?: React.ReactNode;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiInspector({
  entries,
  title = "inspector",
  width = 52,
  border = "single",
  footer,
  color,
  className,
  style,
}: AsciiInspectorProps) {
  const labelWidth = Math.min(
    16,
    Math.max(8, ...entries.map((entry) => entry.label.length))
  );

  return (
    <AsciiSurface
      width={width}
      border={border}
      title={title}
      footer={footer}
      className={`ascii-inspector ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
      bodyClassName="ascii-inspector-body"
    >
      {entries.map((entry, index) => {
        const previousGroup = index > 0 ? entries[index - 1]?.group : undefined;
        const showGroup = entry.group && entry.group !== previousGroup;

        return (
          <React.Fragment key={entry.key}>
            {showGroup ? <div className="ascii-inspector-group">{entry.group}</div> : null}
            <div className={`ascii-inspector-row ascii-inspector-${entry.tone ?? "neutral"}`}>
              <span className="ascii-inspector-label" style={{ width: `${labelWidth}ch` }}>
                {entry.label}
              </span>
              <span className="ascii-inspector-separator"> : </span>
              <span className="ascii-inspector-value">{entry.value}</span>
              {entry.meta ? <span className="ascii-inspector-meta">{`  ${entry.meta}`}</span> : null}
            </div>
          </React.Fragment>
        );
      })}
    </AsciiSurface>
  );
}
