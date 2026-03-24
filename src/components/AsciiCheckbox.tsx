import React, { useId, useState, useEffect } from "react";
import { useReducedMotion } from "../internal/useReducedMotion";

export interface AsciiCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "style"> {
  label: string;
  animate?: boolean;
  color?: string;
  style?: React.CSSProperties;
}

export function AsciiCheckbox({
  label,
  checked,
  animate = false,
  color,
  className,
  style,
  onChange,
  ...rest
}: AsciiCheckboxProps) {
  const id = useId();
  const inputId = rest.id ?? id;
  const reduced = useReducedMotion();
  const [transitioning, setTransitioning] = useState(false);
  const [showSlash, setShowSlash] = useState(false);

  useEffect(() => {
    if (!animate || reduced || !transitioning) return;
    const timer = setTimeout(() => {
      setShowSlash(false);
      setTransitioning(false);
    }, 80);
    return () => clearTimeout(timer);
  }, [transitioning, animate, reduced]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (animate && !reduced && e.target.checked) {
      setTransitioning(true);
      setShowSlash(true);
    }
    onChange?.(e);
  };

  let marker: string;
  if (showSlash && transitioning) {
    marker = "/";
  } else {
    marker = checked ? "x" : " ";
  }

  const animClass = animate ? " ascii-check-snap" : "";

  return (
    <label
      htmlFor={inputId}
      className={`ascii-lib ascii-check${animClass} ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
    >
      <input type="checkbox" id={inputId} checked={checked} onChange={handleChange} {...rest} />
      <span className="ascii-check-box">[{marker}]</span>
      <span>{label}</span>
    </label>
  );
}
