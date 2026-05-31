import React from "react";
import { useControllableState } from "../internal/useControllableState";

export type AsciiStepperStatus = "complete" | "current" | "upcoming" | "warning" | "error" | "disabled";

export interface AsciiStepperStep {
  key?: string;
  label: string;
  description?: string;
  meta?: string;
  status?: AsciiStepperStatus;
  disabled?: boolean;
}

export interface AsciiStepperProps {
  steps: AsciiStepperStep[];
  current?: number;
  defaultCurrent?: number;
  onChange?: (index: number) => void;
  orientation?: "horizontal" | "vertical";
  compact?: boolean;
  "aria-label"?: string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const statusMarks: Record<AsciiStepperStatus, string> = {
  complete: "✓",
  current: "●",
  upcoming: " ",
  warning: "!",
  error: "×",
  disabled: "-",
};

function clampIndex(index: number, length: number) {
  if (length === 0) return 0;

  return Math.max(0, Math.min(length - 1, index));
}

function getStepStatus(step: AsciiStepperStep, index: number, current: number): AsciiStepperStatus {
  if (step.disabled) return "disabled";
  if (step.status) return step.status;
  if (index < current) return "complete";
  if (index === current) return "current";
  return "upcoming";
}

function getNextIndex(currentIndex: number, key: string, length: number) {
  if (key === "ArrowRight" || key === "ArrowDown") return clampIndex(currentIndex + 1, length);
  if (key === "ArrowLeft" || key === "ArrowUp") return clampIndex(currentIndex - 1, length);
  if (key === "Home") return 0;
  if (key === "End") return Math.max(0, length - 1);
  return currentIndex;
}

export function AsciiStepper({
  steps,
  current,
  defaultCurrent = 0,
  onChange,
  orientation = "horizontal",
  compact = false,
  "aria-label": ariaLabel = "Progress steps",
  color,
  className,
  style,
}: AsciiStepperProps) {
  const [selectedIndex, setSelectedIndex] = useControllableState({
    value: current,
    defaultValue: defaultCurrent,
    onChange,
  });

  if (steps.length === 0) return null;

  const activeIndex = clampIndex(selectedIndex, steps.length);
  const selectable = Boolean(onChange);

  const selectStep = (index: number) => {
    const step = steps[index];

    if (!selectable || step.disabled || step.status === "disabled") return;

    setSelectedIndex(index);
  };

  return (
    <div
      className={`ascii-lib ascii-stepper ascii-stepper-${orientation} ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
      role="navigation"
      aria-label={ariaLabel}
    >
      <ol className="ascii-stepper-list">
        {steps.map((step, index) => {
          const status = getStepStatus(step, index, activeIndex);
          const active = index === activeIndex;
          const disabled = step.disabled || status === "disabled";
          const key = step.key ?? `${index}-${step.label}`;
          const content = (
            <>
              <span className="ascii-stepper-marker">{`[${statusMarks[status]}]`}</span>
              <span className="ascii-stepper-label">{step.label}</span>
              {!compact && step.meta ? <span className="ascii-stepper-meta">{step.meta}</span> : null}
            </>
          );

          return (
            <li key={key} className={`ascii-stepper-item ascii-stepper-${status}`}>
              {selectable ? (
                <button
                  type="button"
                  className={`ascii-stepper-trigger ${active ? "ascii-stepper-active" : ""}`.trim()}
                  disabled={disabled}
                  aria-current={active ? "step" : undefined}
                  onClick={() => selectStep(index)}
                  onKeyDown={(event) => {
                    const nextIndex = getNextIndex(index, event.key, steps.length);

                    if (nextIndex === index) return;

                    event.preventDefault();
                    selectStep(nextIndex);
                    const focusNext = () => {
                      document.querySelector<HTMLButtonElement>(`[data-ascii-stepper-index="${nextIndex}"]`)?.focus();
                    };
                    if (typeof requestAnimationFrame === "function") {
                      requestAnimationFrame(focusNext);
                    } else {
                      setTimeout(focusNext, 0);
                    }
                  }}
                  data-ascii-stepper-index={index}
                >
                  {content}
                </button>
              ) : (
                <span className={`ascii-stepper-static ${active ? "ascii-stepper-active" : ""}`.trim()} aria-current={active ? "step" : undefined}>
                  {content}
                </span>
              )}
              {!compact && active && step.description ? (
                <span className="ascii-stepper-description">{step.description}</span>
              ) : null}
              {index < steps.length - 1 ? <span className="ascii-stepper-connector" aria-hidden="true">{orientation === "horizontal" ? "──" : "│"}</span> : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
