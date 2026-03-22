import React from "react";
import type { BorderStyle } from "../chars";
import { pad } from "../chars";
import { renderHighlightedText } from "../internal/renderHighlightedText";
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
  toolbar?: React.ReactNode;
  query?: string;
  levels?: AsciiLogLevel[];
  follow?: boolean;
  emptyMessage?: string;
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

function matchesQuery(line: AsciiLogEntry, query?: string) {
  const normalized = query?.trim().toLowerCase();

  if (!normalized) return true;

  return [line.timestamp, line.source, line.level, line.message]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(normalized));
}

export function AsciiLogViewer({
  lines,
  title = "logs",
  width = 64,
  height = 8,
  border = "single",
  footer,
  toolbar,
  query,
  levels,
  follow = true,
  emptyMessage = "No log lines",
  className,
  style,
}: AsciiLogViewerProps) {
  const filteredLines = lines.filter((line) => {
    const levelMatches = !levels || levels.length === 0 || levels.includes(line.level);
    return levelMatches && matchesQuery(line, query);
  });
  const visibleLines = follow ? filteredLines.slice(-height) : filteredLines.slice(0, height);
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
      {toolbar ? <div className="ascii-logviewer-toolbar">{toolbar}</div> : null}
      <div className="ascii-logviewer-columns">
        <span>{pad("LVL", 5)}</span>
        <span>{pad("TIME", 7)}</span>
        <span>{sourceWidth > 0 ? ` ${pad("SOURCE", sourceWidth)}` : ""}</span>
        <span>{`  ${pad("MESSAGE", Math.max(7, width - 20))}`}</span>
      </div>
      <div className="ascii-logviewer-list" role="log" aria-live="polite">
        {visibleLines.length === 0 ? (
          <div className="ascii-logviewer-empty">{emptyMessage}</div>
        ) : (
          visibleLines.map((line, index) => (
            <div
              key={line.id ?? `${line.timestamp ?? "t"}-${line.message}-${index}`}
              className={`ascii-logviewer-line ascii-logviewer-${line.level}`}
            >
              <span className="ascii-logviewer-level">[{levelLabels[line.level]}]</span>
              <span className="ascii-logviewer-time">{line.timestamp ? ` ${line.timestamp}` : ""}</span>
              <span className="ascii-logviewer-source">
                {sourceWidth > 0 ? ` ${pad(line.source ?? "", sourceWidth)}` : ""}
              </span>
              <span className="ascii-logviewer-message">
                {"  "}
                {renderHighlightedText(line.message, query)}
              </span>
            </div>
          ))
        )}
      </div>
    </AsciiWindow>
  );
}
