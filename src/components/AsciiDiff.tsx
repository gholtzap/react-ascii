import React from "react";
import type { BorderStyle } from "../chars";
import { pad } from "../chars";
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
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiDiff({
  lines,
  title = "diff",
  width = 72,
  height = 8,
  border = "single",
  footer,
  className,
  style,
}: AsciiDiffProps) {
  const visibleLines = lines.slice(0, height);

  return (
    <AsciiWindow
      title={title}
      width={width}
      height={height}
      border={border}
      footer={footer}
      className={`ascii-diff ${className ?? ""}`.trim()}
      style={style}
    >
      <div className="ascii-diff-list" role="list" aria-label={title}>
        {visibleLines.map((line, index) => (
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
            <span className="ascii-diff-content">{line.content}</span>
          </div>
        ))}
      </div>
    </AsciiWindow>
  );
}
