import React, { useMemo } from "react";
import type { BorderStyle } from "../chars";
import { useControllableState } from "../internal/useControllableState";
import { AsciiSurface } from "../internal/AsciiSurface";

export type AsciiRunbookStatus = "pending" | "running" | "blocked" | "passed" | "failed" | "skipped";

export interface AsciiRunbookStep {
  key: string;
  title: string;
  status: AsciiRunbookStatus;
  description?: React.ReactNode;
  owner?: string;
  timestamp?: string;
  command?: string;
  output?: React.ReactNode;
  evidence?: React.ReactNode;
  actions?: React.ReactNode;
}

export interface AsciiRunbookProps {
  steps: AsciiRunbookStep[];
  title?: string;
  width?: number;
  border?: BorderStyle;
  compact?: boolean;
  activeStepKey?: string;
  defaultActiveStepKey?: string;
  onActiveStepChange?: (key: string) => void;
  footer?: React.ReactNode;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const statusMarks: Record<AsciiRunbookStatus, string> = {
  pending: "○",
  running: "◐",
  blocked: "!",
  passed: "●",
  failed: "×",
  skipped: "-",
};

const statusLabels: Record<AsciiRunbookStatus, string> = {
  pending: "pending",
  running: "running",
  blocked: "blocked",
  passed: "passed",
  failed: "failed",
  skipped: "skipped",
};

function getInitialStepKey(steps: AsciiRunbookStep[], defaultActiveStepKey?: string) {
  if (defaultActiveStepKey && steps.some((step) => step.key === defaultActiveStepKey)) return defaultActiveStepKey;

  return steps.find((step) => ["running", "blocked", "failed"].includes(step.status))?.key ?? steps[0]?.key ?? "";
}

function getNextIndex(currentIndex: number, key: string, length: number) {
  if (key === "ArrowDown" || key === "ArrowRight") return Math.min(length - 1, currentIndex + 1);
  if (key === "ArrowUp" || key === "ArrowLeft") return Math.max(0, currentIndex - 1);
  if (key === "Home") return 0;
  if (key === "End") return length - 1;
  return currentIndex;
}

export function AsciiRunbook({
  steps,
  title = "runbook",
  width = 72,
  border = "single",
  compact = false,
  activeStepKey,
  defaultActiveStepKey,
  onActiveStepChange,
  footer,
  color,
  className,
  style,
}: AsciiRunbookProps) {
  const fallbackStepKey = getInitialStepKey(steps, defaultActiveStepKey);
  const [selectedStepKey, setSelectedStepKey] = useControllableState({
    value: activeStepKey,
    defaultValue: fallbackStepKey,
    onChange: onActiveStepChange,
  });

  const activeStep = useMemo(
    () => steps.find((step) => step.key === selectedStepKey) ?? steps.find((step) => step.key === fallbackStepKey) ?? steps[0],
    [fallbackStepKey, selectedStepKey, steps]
  );

  const selectedKey = activeStep?.key ?? "";
  const completedCount = steps.filter((step) => step.status === "passed" || step.status === "skipped").length;
  const summary = `${completedCount}/${steps.length} complete`;

  if (steps.length === 0) {
    return (
      <AsciiSurface
        width={width}
        border={border}
        title={title}
        footer={footer}
        className={`ascii-runbook ${className ?? ""}`.trim()}
        style={color ? { ...style, color } : style}
        bodyClassName="ascii-runbook-body"
      >
        <div className="ascii-runbook-empty">No runbook steps</div>
      </AsciiSurface>
    );
  }

  return (
    <AsciiSurface
      width={width}
      border={border}
      title={title}
      footer={footer}
      className={`ascii-runbook ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
      bodyClassName="ascii-runbook-body"
    >
      <div className="ascii-runbook-summary">{summary}</div>
      <div className="ascii-runbook-steps" role="list" aria-label={title}>
        {steps.map((step, index) => {
          const selected = step.key === selectedKey;
          const isLast = index === steps.length - 1;
          const connector = isLast ? "└" : "├";
          const status = statusLabels[step.status];
          const meta = [step.owner, step.timestamp].filter(Boolean).join(" · ");

          return (
            <div key={step.key} className={`ascii-runbook-step ascii-runbook-${step.status}`} role="listitem">
              <button
                type="button"
                className={`ascii-runbook-step-trigger ${selected ? "ascii-runbook-step-active" : ""}`.trim()}
                aria-expanded={selected}
                aria-current={selected ? "step" : undefined}
                onClick={() => setSelectedStepKey(step.key)}
                onKeyDown={(event) => {
                  const nextIndex = getNextIndex(index, event.key, steps.length);

                  if (nextIndex === index) return;

                  event.preventDefault();
                  const nextStep = steps[nextIndex];
                  setSelectedStepKey(nextStep.key);
                  const focusNext = () => {
                    document.querySelector<HTMLButtonElement>(`[data-ascii-runbook-index="${nextIndex}"]`)?.focus();
                  };
                  if (typeof requestAnimationFrame === "function") {
                    requestAnimationFrame(focusNext);
                  } else {
                    setTimeout(focusNext, 0);
                  }
                }}
                data-ascii-runbook-index={index}
              >
                <span className="ascii-runbook-line">{`${connector}─[${statusMarks[step.status]}]`}</span>
                <span className="ascii-runbook-step-title">{step.title}</span>
                <span className="ascii-runbook-step-status">{status}</span>
              </button>
              {!compact && selected ? (
                <div className="ascii-runbook-detail">
                  {meta ? <div className="ascii-runbook-meta">{meta}</div> : null}
                  {step.description ? <div className="ascii-runbook-description">{step.description}</div> : null}
                  {step.command ? <pre className="ascii-runbook-command">{`$ ${step.command}`}</pre> : null}
                  {step.output ? <div className="ascii-runbook-output">{step.output}</div> : null}
                  {step.evidence ? <div className="ascii-runbook-evidence">{step.evidence}</div> : null}
                  {step.actions ? <div className="ascii-runbook-actions">{step.actions}</div> : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </AsciiSurface>
  );
}
