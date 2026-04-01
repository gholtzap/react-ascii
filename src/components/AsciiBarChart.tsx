import React, { useState, useEffect } from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";
import { useReducedMotion } from "../internal/useReducedMotion";

export interface AsciiBarChartBar {
  label: string;
  value: number;
  color?: string;
}

export interface AsciiBarChartProps {
  bars: AsciiBarChartBar[];
  width?: number;
  max?: number;
  border?: BorderStyle;
  showValues?: boolean;
  fillChar?: string;
  emptyChar?: string;
  animate?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const FILL_STAGES = ["░", "▒", "▓", "█"];

export function AsciiBarChart({
  bars,
  width = 50,
  max: maxOverride,
  border = "single",
  showValues = true,
  fillChar = "█",
  emptyChar = "░",
  animate = false,
  className,
  style,
}: AsciiBarChartProps) {
  if (bars.length === 0) return null;

  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(animate && !reduced ? 0 : 1);
  const animationKey = bars.map((bar) => `${bar.label}\u0000${bar.value}\u0000${bar.color ?? ""}`).join("\u0001");

  useEffect(() => {
    if (!animate || reduced) { setProgress(1); return; }
    setProgress(0);
    let step = 0;
    const totalSteps = 20;
    const timer = setInterval(() => {
      step++;
      setProgress(step / totalSteps);
      if (step >= totalSteps) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [animate, reduced, animationKey]);

  const b = borders[border];
  const inner = width - 2;
  const maxVal = maxOverride ?? Math.max(...bars.map((d) => d.value));
  const maxLabelLen = Math.max(...bars.map((d) => d.label.length));
  const maxValStr = showValues ? String(maxVal).length + 1 : 0;
  const barSpace = inner - maxLabelLen - 3 - maxValStr;

  const lines: string[] = [];
  lines.push(b.tl + repeatChar(b.h, inner) + b.tr);

  for (let i = 0; i < bars.length; i++) {
    const d = bars[i];
    const label = pad(d.label, maxLabelLen, "right");
    const ratio = maxVal > 0 ? d.value / maxVal : 0;
    const targetFilled = Math.round(ratio * barSpace);
    const currentFilled = Math.round(targetFilled * Math.min(1, progress));
    const empty = barSpace - currentFilled;

    let barStr: string;
    if (animate && !reduced && progress < 1) {
      const stageIndex = Math.min(Math.floor(progress * FILL_STAGES.length), FILL_STAGES.length - 1);
      const currentFillChar = FILL_STAGES[stageIndex];
      barStr = repeatChar(currentFillChar, currentFilled) + repeatChar(emptyChar, empty);
    } else {
      barStr = repeatChar(fillChar, currentFilled) + repeatChar(emptyChar, empty);
    }

    const valStr = showValues ? ` ${d.value}` : "";
    const barLine = ` ${label} ${barStr}${valStr}`;
    lines.push(b.v + pad(barLine, inner) + b.v);
  }

  lines.push(b.bl + repeatChar(b.h, inner) + b.br);

  return (
    <div
      className={`ascii-lib ascii-barchart ${className ?? ""}`.trim()}
      style={style}
      role="img"
      aria-label={`Bar chart: ${bars.map((d) => `${d.label}: ${d.value}`).join(", ")}`}
    >
      {lines.join("\n")}
    </div>
  );
}
