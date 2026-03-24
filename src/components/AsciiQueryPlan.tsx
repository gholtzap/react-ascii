import React from "react";
import type { BorderStyle } from "../chars";
import { pad } from "../chars";
import { AsciiWindow } from "./AsciiWindow";

export type AsciiQueryPlanTone = "neutral" | "success" | "warn" | "error";

export interface AsciiQueryPlanStep {
  key: string;
  label: string;
  rows: string;
  cost: string;
  relation?: string;
  depth?: number;
  tone?: AsciiQueryPlanTone;
}

export interface AsciiQueryPlanProps {
  steps: AsciiQueryPlanStep[];
  title?: string;
  width?: number;
  height?: number;
  border?: BorderStyle;
  footer?: React.ReactNode;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiQueryPlan({
  steps,
  title = "query plan",
  width = 68,
  height = 6,
  border = "single",
  footer,
  color,
  className,
  style,
}: AsciiQueryPlanProps) {
  const visibleSteps = steps.slice(0, height);
  const operationWidth = Math.max(20, width - 22);

  return (
    <AsciiWindow
      title={title}
      width={width}
      height={height + 1}
      border={border}
      footer={footer}
      className={`ascii-queryplan ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
    >
      <div className="ascii-queryplan-header">
        <span>{pad("OPERATION", operationWidth)}</span>
        <span>{pad("ROWS", 8, "right")}</span>
        <span>{pad("COST", 8, "right")}</span>
      </div>
      <div className="ascii-queryplan-list" role="list" aria-label={title}>
        {visibleSteps.map((step) => {
          const depth = Math.max(0, step.depth ?? 0);
          const prefix = depth > 0 ? `${" ".repeat(depth * 2)}└─ ` : "";
          const label = `${prefix}${step.label}${step.relation ? ` (${step.relation})` : ""}`;

          return (
            <div key={step.key} className={`ascii-queryplan-row ascii-tone-${step.tone ?? "neutral"}`} role="listitem">
              <span className="ascii-queryplan-operation">{pad(label, operationWidth)}</span>
              <span className="ascii-queryplan-rows">{pad(step.rows, 8, "right")}</span>
              <span className="ascii-queryplan-cost">{pad(step.cost, 8, "right")}</span>
            </div>
          );
        })}
      </div>
    </AsciiWindow>
  );
}
