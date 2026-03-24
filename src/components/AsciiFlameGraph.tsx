import React, { useState, useEffect } from "react";
import type { BorderStyle } from "../chars";
import { pad } from "../chars";
import { AsciiWindow } from "./AsciiWindow";
import { useReducedMotion } from "../internal/useReducedMotion";

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
  animate?: boolean;
  color?: string;
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
  animate = false,
  color,
  className,
  style,
}: AsciiFlameGraphProps) {
  const visibleFrames = frames.slice(0, height);
  const barWidth = Math.max(16, width - 24);
  const reduced = useReducedMotion();

  const [revealedLayers, setRevealedLayers] = useState(
    animate && !reduced ? 0 : visibleFrames.length
  );
  const [barProgress, setBarProgress] = useState(animate && !reduced ? 0 : 1);

  useEffect(() => {
    if (!animate || reduced) {
      setRevealedLayers(visibleFrames.length);
      setBarProgress(1);
      return;
    }
    setRevealedLayers(0);
    setBarProgress(0);

    let layer = 0;
    const layerTimer = setInterval(() => {
      layer++;
      setRevealedLayers(layer);
      if (layer >= visibleFrames.length) clearInterval(layerTimer);
    }, 120);

    let step = 0;
    const totalSteps = 15;
    const barTimer = setInterval(() => {
      step++;
      setBarProgress(step / totalSteps);
      if (step >= totalSteps) clearInterval(barTimer);
    }, 40);

    return () => {
      clearInterval(layerTimer);
      clearInterval(barTimer);
    };
  }, [animate, reduced, visibleFrames.length]);

  return (
    <AsciiWindow
      title={title}
      width={width}
      height={height}
      border={border}
      footer={footer}
      className={`ascii-flamegraph ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
    >
      <div className="ascii-flame-list" role="list" aria-label={title}>
        {visibleFrames.map((frame, idx) => {
          if (idx >= revealedLayers) {
            return (
              <div key={frame.key} className="ascii-flame-row ascii-tone-neutral" role="listitem">
                <span className="ascii-flame-bar">{pad("", barWidth)}</span>
                <span className="ascii-flame-label">{pad("", 16)}</span>
                <span className="ascii-flame-span">{pad("", 5)}</span>
              </div>
            );
          }

          const indent = " ".repeat(Math.max(0, frame.depth ?? 0) * 2);
          const maxFilled = Math.max(1, Math.round((barWidth - indent.length) * clampSpan(frame.span) / 100));
          const filled = animate && !reduced
            ? Math.max(1, Math.round(maxFilled * Math.min(1, barProgress)))
            : maxFilled;
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
