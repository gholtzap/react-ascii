import React, { useRef, useCallback, useId } from "react";

export interface AsciiSliderProps {
  value: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  width?: number;
  label?: string;
  showValue?: boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  width = 30,
  label,
  showValue = true,
  disabled,
  className,
  style,
}: AsciiSliderProps) {
  const id = useId();
  const trackRef = useRef<HTMLSpanElement>(null);
  const dragging = useRef(false);

  const range = max - min || 1;
  const ratio = Math.max(0, Math.min(1, (value - min) / range));
  const trackWidth = Math.max(4, width - 2);
  const pos = Math.round(ratio * (trackWidth - 1));

  const track =
    "[" +
    "─".repeat(pos) +
    "●" +
    "─".repeat(trackWidth - 1 - pos) +
    "]";

  const valStr = showValue ? ` ${value}` : "";

  const clamp = useCallback(
    (v: number) => {
      const stepped = Math.round(v / step) * step;
      return Math.max(min, Math.min(max, stepped));
    },
    [min, max, step]
  );

  const updateFromX = useCallback(
    (clientX: number) => {
      if (!trackRef.current || disabled) return;
      const rect = trackRef.current.getBoundingClientRect();
      const charWidth = rect.width / (trackWidth + 2);
      const relX = clientX - rect.left - charWidth;
      const trackPixelWidth = charWidth * trackWidth;
      const r = Math.max(0, Math.min(1, relX / trackPixelWidth));
      onChange?.(clamp(min + r * range));
    },
    [trackWidth, range, min, onChange, clamp, disabled]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      dragging.current = true;
      updateFromX(e.clientX);

      const handleMove = (ev: MouseEvent) => {
        if (dragging.current) updateFromX(ev.clientX);
      };
      const handleUp = () => {
        dragging.current = false;
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleUp);
      };
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleUp);
    },
    [disabled, updateFromX]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      let next = value;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        next = clamp(value + step);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        next = clamp(value - step);
      } else if (e.key === "Home") {
        e.preventDefault();
        next = min;
      } else if (e.key === "End") {
        e.preventDefault();
        next = max;
      } else {
        return;
      }
      onChange?.(next);
    },
    [disabled, value, step, min, max, onChange, clamp]
  );

  return (
    <span
      className={`ascii-lib ascii-slider ${className ?? ""}`.trim()}
      style={style}
    >
      {label && (
        <label htmlFor={id} className="ascii-slider-label">
          {label}{" "}
        </label>
      )}
      <span
        ref={trackRef}
        id={id}
        className="ascii-slider-track"
        role="slider"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
      >
        {track}
      </span>
      {valStr}
    </span>
  );
}
