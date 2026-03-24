import React, { useState, useEffect } from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";
import { useReducedMotion } from "../internal/useReducedMotion";

export interface AsciiButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  label: string;
  border?: BorderStyle;
  width?: number;
  animate?: boolean;
  color?: string;
  style?: React.CSSProperties;
}

export const AsciiButton = React.forwardRef<HTMLButtonElement, AsciiButtonProps>(function AsciiButton({
  label,
  border = "single",
  width,
  animate = false,
  color,
  className,
  style,
  onClick,
  ...rest
}, ref) {
  const b = borders[border];
  const inner = width ? width - 2 : label.length + 2;
  const reduced = useReducedMotion();
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!pressed) return;
    const timer = setTimeout(() => setPressed(false), 120);
    return () => clearTimeout(timer);
  }, [pressed]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (animate && !reduced) setPressed(true);
    onClick?.(e);
  };

  const displayLabel = pressed && animate && !reduced
    ? `>${label}<`
    : ` ${label} `;

  const top = b.tl + repeatChar(b.h, inner) + b.tr;
  const mid = b.v + pad(displayLabel, inner, "center") + b.v;
  const bot = b.bl + repeatChar(b.h, inner) + b.br;

  const animClasses = animate ? " ascii-btn-press" : "";

  return (
    <button
      ref={ref}
      className={`ascii-lib ascii-btn${animClasses} ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
      onClick={handleClick}
      {...rest}
    >
      {top}
      {"\n"}
      {mid}
      {"\n"}
      {bot}
    </button>
  );
});
