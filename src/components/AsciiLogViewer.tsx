import React from "react";
import type { BorderStyle } from "../chars";
import { pad } from "../chars";
import { AsciiWindow } from "./AsciiWindow";

export type AsciiLogLevel = "debug" | "info" | "success" | "warn" | "error";

export interface AsciiLogEntry {
  id?: string;
  timestamp?: string;
  level: AsciiLogLevel;
  source?: string;
  message: string;
}

export interface AsciiLogViewerProps {
  lines: AsciiLogEntry[];
  title?: string;
  width?: number;
  height?: number;
  border?: BorderStyle;
  footer?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const levelLabels: Record<AsciiLogLevel, string> = {
  debug: "DBG",
  info: "INF",
  success: "OK ",
  warn: "WRN",
  error: "ERR",
};

export function AsciiLogViewer({
  lines,
  title = "logs",
  width = 64,
  height = 8,
  border = "single",
  footer,
  className,
  style,
}: AsciiLogViewerProps) {
  const visibleLines = lines.slice(-height);
  const sourceWidth = Math.min(
    12,
    Math.max(0, ...visibleLines.map((line) => (line.source ?? "").length))
  );

  return (
    <AsciiWindow
      title={title}
      width={width}
      height={height}
      border={border}
      footer={footer}
      className={`ascii-logviewer ${className ?? ""}`.trim()}
      style={style}
    >
      <div className="ascii-logviewer-list" role="log" aria-live="polite">
        {visibleLines.map((line, index) => (
          <div
            key={line.id ?? `${line.timestamp ?? "t"}-${line.message}-${index}`}
            className={`ascii-logviewer-line ascii-logviewer-${line.level}`}
          >
            <span className="ascii-logviewer-level">[{levelLabels[line.level]}]</span>
            <span className="ascii-logviewer-time">{line.timestamp ? ` ${line.timestamp}` : ""}</span>
            <span className="ascii-logviewer-source">
              {sourceWidth > 0 ? ` ${pad(line.source ?? "", sourceWidth)}` : ""}
            </span>
            <span className="ascii-logviewer-message">{`  ${line.message}`}</span>
          </div>
        ))}
      </div>
    </AsciiWindow>
  );
}
