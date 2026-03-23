import React, { useId, useState, useEffect } from "react";
import { useReducedMotion } from "../internal/useReducedMotion";

export interface AsciiToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  width?: number;
  disabled?: boolean;
  animate?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiToggle({
  checked = false,
  onChange,
  label,
  width = 10,
  disabled,
  animate = false,
  className,
  style,
}: AsciiToggleProps) {
  const id = useId();
  const trackWidth = Math.max(4, width);
  const innerWidth = trackWidth - 2;
  const reduced = useReducedMotion();

  const [slidePos, setSlidePos] = useState(checked ? innerWidth - 1 : 0);

  useEffect(() => {
    if (!animate || reduced) {
      setSlidePos(checked ? innerWidth - 1 : 0);
      return;
    }
    const target = checked ? innerWidth - 1 : 0;
    if (slidePos === target) return;

    const step = target > slidePos ? 1 : -1;
    const timer = setInterval(() => {
      setSlidePos((p) => {
        const next = p + step;
        if ((step > 0 && next >= target) || (step < 0 && next <= target)) {
          clearInterval(timer);
          return target;
        }
        return next;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [checked, innerWidth, animate, reduced]);

  const currentPos = animate && !reduced ? slidePos : (checked ? innerWidth - 1 : 0);
  const beforeKnob = currentPos;
  const afterKnob = innerWidth - 1 - currentPos;

  const track = `[${"\u2550".repeat(beforeKnob)}\u25CF${" ".repeat(afterKnob)}]`;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange?.(!checked);
    }
  };

  const animClass = animate ? " ascii-toggle-snap" : "";

  return (
    <label
      htmlFor={id}
      className={`ascii-lib ascii-toggle${animClass} ${className ?? ""}`.trim()}
      style={style}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        tabIndex={-1}
      />
      <span
        className="ascii-toggle-track"
        role="switch"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
      >
        {track}
      </span>
      {label && <span className="ascii-toggle-label"> {label}</span>}
    </label>
  );
}
