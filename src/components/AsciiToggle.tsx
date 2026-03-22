import React, { useId } from "react";

export interface AsciiToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  width?: number;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiToggle({
  checked = false,
  onChange,
  label,
  width = 10,
  disabled,
  className,
  style,
}: AsciiToggleProps) {
  const id = useId();
  const trackWidth = Math.max(4, width);
  const innerWidth = trackWidth - 2; // subtract brackets

  const filledCount = checked ? innerWidth - 1 : 0;
  const emptyCount = innerWidth - 1 - filledCount;

  const track = checked
    ? `[${"\u2550".repeat(filledCount)}\u25CF${" ".repeat(emptyCount)}]`
    : `[${" ".repeat(emptyCount)}\u25CF${"\u2550".repeat(filledCount)}]`;

  const handleClick = () => {
    if (!disabled) onChange?.(!checked);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange?.(!checked);
    }
  };

  return (
    <label
      htmlFor={id}
      className={`ascii-lib ascii-toggle ${className ?? ""}`.trim()}
      style={style}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0, pointerEvents: "none" }}
      />
      <span
        className="ascii-toggle-track"
        role="switch"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {track}
      </span>
      {label && <span className="ascii-toggle-label"> {label}</span>}
    </label>
  );
}
