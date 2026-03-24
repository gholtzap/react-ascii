import React from "react";

export interface AsciiStepperStep {
  label: string;
  description?: string;
}

export interface AsciiStepperProps {
  steps: AsciiStepperStep[];
  current: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiStepper({
  steps,
  current,
  color,
  className,
  style,
}: AsciiStepperProps) {
  if (steps.length === 0) return null;

  const parts: string[] = [];
  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    const marker =
      i < current ? "[✓]" : i === current ? "[●]" : "[ ]";
    parts.push(`${marker} ${s.label}`);
    if (i < steps.length - 1) {
      parts.push(" ── ");
    }
  }

  const mainLine = parts.join("");

  const descLines: string[] = [];
  for (let i = 0; i < steps.length; i++) {
    if (i === current && steps[i].description) {
      const offset = parts
        .slice(0, i * 2)
        .reduce((sum, p) => sum + p.length, 0);
      descLines.push(" ".repeat(offset) + "     " + steps[i].description);
    }
  }

  return (
    <div
      className={`ascii-lib ascii-stepper ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
      role="navigation"
      aria-label="Progress steps"
    >
      {mainLine}
      {descLines.length > 0 && "\n" + descLines.join("\n")}
    </div>
  );
}
