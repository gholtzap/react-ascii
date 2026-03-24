import React from "react";

export interface AsciiAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join("");
}

export function AsciiAvatar({
  name,
  size = "md",
  color,
  className,
  style,
}: AsciiAvatarProps) {
  const initials = getInitials(name);

  let rendered: string;
  switch (size) {
    case "sm":
      rendered = `[${initials}]`;
      break;
    case "lg":
      rendered = `┌────┐\n│ ${initials.padEnd(2)} │\n└────┘`;
      break;
    default:
      rendered = `[${initials.padEnd(2)}]`;
      break;
  }

  return (
    <span
      className={`ascii-lib ascii-avatar ascii-avatar-${size} ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
      role="img"
      aria-label={name}
    >
      {rendered}
    </span>
  );
}
