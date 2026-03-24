import React, { useId } from "react";

export interface AsciiSwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiSwitch({
  checked = false,
  onChange,
  label,
  disabled,
  color,
  className,
  style,
}: AsciiSwitchProps) {
  const id = useId();

  const display = checked ? "[ON /off]" : "[on/ OFF]";

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
      className={`ascii-lib ascii-switch ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
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
        className="ascii-switch-track"
        role="switch"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
      >
        {display}
      </span>
      {label && <span className="ascii-switch-label"> {label}</span>}
    </label>
  );
}
