import React from "react";

export interface AsciiKbdProps {
  keys: string[];
  separator?: string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiKbd({
  keys,
  separator = " + ",
  color,
  className,
  style,
}: AsciiKbdProps) {
  return (
    <kbd
      className={`ascii-lib ascii-kbd ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
    >
      {keys.map((key, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="ascii-kbd-sep">{separator}</span>}
          <span className="ascii-kbd-key">[{key}]</span>
        </React.Fragment>
      ))}
    </kbd>
  );
}
