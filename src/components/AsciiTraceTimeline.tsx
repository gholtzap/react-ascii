import React from "react";
import type { BorderStyle } from "../chars";
import { pad } from "../chars";
import { AsciiWindow } from "./AsciiWindow";

export type AsciiTraceStatus = "neutral" | "success" | "warn" | "error";

export interface AsciiTraceSpan {
  key: string;
  label: string;
  service?: string;
  duration: string;
  depth?: number;
  status?: AsciiTraceStatus;
}

export interface AsciiTraceTimelineProps {
  spans: AsciiTraceSpan[];
  title?: string;
  width?: number;
  height?: number;
  border?: BorderStyle;
  footer?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const traceMarkers: Record<AsciiTraceStatus, string> = {
  neutral: "•",
  success: "✓",
  warn: "!",
  error: "×",
};

export function AsciiTraceTimeline({
  spans,
  title = "trace",
  width = 64,
  height = 8,
  border = "single",
  footer,
  className,
  style,
}: AsciiTraceTimelineProps) {
  const visibleSpans = spans.slice(0, height);

  return (
    <AsciiWindow
      title={title}
      width={width}
      height={height}
      border={border}
      footer={footer}
      className={`ascii-trace ${className ?? ""}`.trim()}
      style={style}
    >
      <div className="ascii-trace-columns">
        <span>{pad("SPAN", 28)}</span>
        <span>{pad("SERVICE", 16)}</span>
        <span>{pad("DUR", 8, "right")}</span>
      </div>
      <div className="ascii-trace-list" role="list" aria-label={title}>
        {visibleSpans.map((span) => {
          const depth = Math.max(0, span.depth ?? 0);
          const prefix = `${" ".repeat(depth * 2)}${traceMarkers[span.status ?? "neutral"]} `;

          return (
            <div key={span.key} className={`ascii-trace-row ascii-trace-${span.status ?? "neutral"}`} role="listitem">
              <span className="ascii-trace-label">{pad(`${prefix}${span.label}`, 28)}</span>
              <span className="ascii-trace-service">{pad(span.service ?? "", 16)}</span>
              <span className="ascii-trace-duration">{pad(span.duration, 8, "right")}</span>
            </div>
          );
        })}
      </div>
    </AsciiWindow>
  );
}
