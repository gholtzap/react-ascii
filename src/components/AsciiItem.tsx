import React from "react";

export interface AsciiItemProps {
  label: string;
  description?: string;
  icon?: string;
  trailing?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiItem({
  label,
  description,
  icon,
  trailing,
  selected,
  disabled,
  onClick,
  className,
  style,
}: AsciiItemProps) {
  const prefix = icon ? `${icon} ` : "";
  const marker = selected ? "> " : "  ";
  const suffix = trailing ? `  ${trailing}` : "";

  const content = onClick ? (
    <button
      type="button"
      className={`ascii-item-btn${selected ? " ascii-item-active" : ""}${disabled ? " ascii-item-disabled" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {`${marker}${prefix}${label}${suffix}`}
      {description && `\n    ${description}`}
    </button>
  ) : (
    <span className={selected ? "ascii-item-active" : ""}>
      {`${marker}${prefix}${label}${suffix}`}
      {description && `\n    ${description}`}
    </span>
  );

  return (
    <div
      className={`ascii-lib ascii-item ${className ?? ""}`.trim()}
      style={style}
    >
      {content}
    </div>
  );
}
