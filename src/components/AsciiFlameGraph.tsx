import React from "react";
import type { BorderStyle } from "../chars";
import { pad } from "../chars";
import { AsciiWindow } from "./AsciiWindow";

export type AsciiFlameTone = "neutral" | "success" | "warn" | "error";

export interface AsciiFlameFrame {
  key: string;
  label: string;
  span: number;
  depth?: number;
  tone?: AsciiFlameTone;
}

export interface AsciiFlameGraphProps {
  frames: AsciiFlameFrame[];
  title?: string;
  width?: number;
  height?: number;
  border?: BorderStyle;
  footer?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function clampSpan(span: number) {
  return Math.max(1, Math.min(100, span));
}

export function AsciiFlameGraph({
  frames,
  title = "flame",
  width = 66,
  height = 6,
  border = "single",
  footer,
  className,
  style,
}: AsciiFlameGraphProps) {
  const visibleFrames = frames.slice(0, height);
  const barWidth = Math.max(16, width - 24);

  return (
    <AsciiWindow
      title={title}
      width={width}
      height={height}
      border={border}
      footer={footer}
      className={`ascii-flamegraph ${className ?? ""}`.trim()}
      style={style}
    >
      <div className="ascii-flame-list" role="list" aria-label={title}>
        {visibleFrames.map((frame) => {
          const indent = " ".repeat(Math.max(0, frame.depth ?? 0) * 2);
          const filled = Math.max(1, Math.round((barWidth - indent.length) * clampSpan(frame.span) / 100));
          const bar = `${indent}${"█".repeat(filled)}`;

          return (
            <div key={frame.key} className={`ascii-flame-row ascii-tone-${frame.tone ?? "neutral"}`} role="listitem">
              <span className="ascii-flame-bar">{pad(bar, barWidth)}</span>
              <span className="ascii-flame-label">{pad(frame.label, 16)}</span>
              <span className="ascii-flame-span">{pad(`${clampSpan(frame.span)}%`, 5, "right")}</span>
            </div>
          );
        })}
      </div>
    </AsciiWindow>
  );
}
