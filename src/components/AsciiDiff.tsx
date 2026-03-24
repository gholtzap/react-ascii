import React from "react";
import type { BorderStyle } from "../chars";
import { pad } from "../chars";
import { renderHighlightedText } from "../internal/renderHighlightedText";
import { AsciiWindow } from "./AsciiWindow";

export type AsciiDiffLineType = "context" | "add" | "remove";

export interface AsciiDiffLine {
  id?: string;
  type: AsciiDiffLineType;
  oldNumber?: number;
  newNumber?: number;
  content: string;
}

export interface AsciiDiffProps {
  lines: AsciiDiffLine[];
  title?: string;
  width?: number;
  height?: number;
  border?: BorderStyle;
  footer?: React.ReactNode;
  toolbar?: React.ReactNode;
  query?: string;
  collapseUnchangedAfter?: number;
  emptyMessage?: string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

type VisibleDiffEntry =
  | { kind: "line"; value: AsciiDiffLine }
  | { kind: "collapsed"; count: number };

function buildVisibleEntries(lines: AsciiDiffLine[], collapseUnchangedAfter: number) {
  if (collapseUnchangedAfter <= 0) {
    return lines.map((line) => ({ kind: "line" as const, value: line }));
  }

  const entries: VisibleDiffEntry[] = [];
  let contextBuffer: AsciiDiffLine[] = [];

  const flushContext = () => {
    if (contextBuffer.length <= collapseUnchangedAfter * 2) {
      entries.push(...contextBuffer.map((line) => ({ kind: "line" as const, value: line })));
    } else {
      entries.push(...contextBuffer.slice(0, collapseUnchangedAfter).map((line) => ({ kind: "line" as const, value: line })));
      entries.push({ kind: "collapsed" as const, count: contextBuffer.length - collapseUnchangedAfter * 2 });
      entries.push(...contextBuffer.slice(-collapseUnchangedAfter).map((line) => ({ kind: "line" as const, value: line })));
    }

    contextBuffer = [];
  };

  for (const line of lines) {
    if (line.type === "context") {
      contextBuffer.push(line);
      continue;
    }

    flushContext();
    entries.push({ kind: "line", value: line });
  }

  flushContext();

  return entries;
}

function matchesDiffQuery(line: AsciiDiffLine, query?: string) {
  const normalized = query?.trim().toLowerCase();

  if (!normalized) return true;

  return line.content.toLowerCase().includes(normalized);
}

export function AsciiDiff({
  lines,
  title = "diff",
  width = 72,
  height = 8,
  border = "single",
  footer,
  toolbar,
  query,
  collapseUnchangedAfter = 0,
  emptyMessage = "No diff lines",
  color,
  className,
  style,
}: AsciiDiffProps) {
  const filteredLines = query
    ? lines.filter((line) => line.type !== "context" || matchesDiffQuery(line, query))
    : lines;
  const visibleEntries = buildVisibleEntries(filteredLines, collapseUnchangedAfter).slice(0, height);

  return (
    <AsciiWindow
      title={title}
      width={width}
      height={height}
      border={border}
      footer={footer}
      className={`ascii-diff ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
    >
      {toolbar ? <div className="ascii-diff-toolbar">{toolbar}</div> : null}
      <div className="ascii-diff-columns">
        <span>{pad("OLD", 3, "right")}</span>
        <span>{pad("NEW", 3, "right")}</span>
        <span> Δ </span>
        <span>CONTENT</span>
      </div>
      <div className="ascii-diff-list" role="list" aria-label={title}>
        {visibleEntries.length === 0 ? (
          <div className="ascii-diff-empty">{emptyMessage}</div>
        ) : (
          visibleEntries.map((entry, index) => {
            if (entry.kind === "collapsed") {
              return (
                <div key={`collapsed-${index}`} className="ascii-diff-collapsed" role="listitem">
                  {`… ${entry.count} unchanged lines …`}
                </div>
              );
            }

            const line = entry.value;

            return (
              <div
                key={line.id ?? `${line.type}-${line.oldNumber ?? "x"}-${line.newNumber ?? "x"}-${index}`}
                className={`ascii-diff-line ascii-diff-${line.type}`}
                role="listitem"
              >
                <span className="ascii-diff-lineno">{pad(line.oldNumber ? String(line.oldNumber) : "", 3, "right")}</span>
                <span className="ascii-diff-lineno">{pad(line.newNumber ? String(line.newNumber) : "", 3, "right")}</span>
                <span className="ascii-diff-marker">
                  {line.type === "add" ? "+" : line.type === "remove" ? "-" : " "}
                </span>
                <span className="ascii-diff-content">{renderHighlightedText(line.content, query)}</span>
              </div>
            );
          })
        )}
      </div>
    </AsciiWindow>
  );
}
