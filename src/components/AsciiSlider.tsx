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
  const activePointerId = useRef<number | null>(null);

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

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;
      e.preventDefault();
      activePointerId.current = e.pointerId;
      trackRef.current?.setPointerCapture?.(e.pointerId);
      updateFromX(e.clientX);

      const handleMove = (ev: PointerEvent) => {
        if (activePointerId.current === ev.pointerId) {
          updateFromX(ev.clientX);
        }
      };
      const handleUp = (ev: PointerEvent) => {
        if (activePointerId.current !== ev.pointerId) return;
        activePointerId.current = null;
        document.removeEventListener("pointermove", handleMove);
        document.removeEventListener("pointerup", handleUp);
        document.removeEventListener("pointercancel", handleUp);
      };
      document.addEventListener("pointermove", handleMove);
      document.addEventListener("pointerup", handleUp);
      document.addEventListener("pointercancel", handleUp);
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
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
      >
        {track}
      </span>
      {valStr}
    </span>
  );
}
