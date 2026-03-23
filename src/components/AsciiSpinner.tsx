import React, { useState, useEffect } from "react";

export type SpinnerPreset = "default" | "braille" | "dots" | "blocks" | "arrows" | "bounce";

export interface AsciiSpinnerProps {
  frames?: string[];
  preset?: SpinnerPreset;
  interval?: number;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

const PRESETS: Record<SpinnerPreset, string[]> = {
  default: ["|", "/", "-", "\\"],
  braille: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
  dots: ["⠄", "⠆", "⠇", "⠋", "⠙", "⠸", "⠰", "⠠"],
  blocks: ["▖", "▘", "▝", "▗"],
  arrows: ["←", "↖", "↑", "↗", "→", "↘", "↓", "↙"],
  bounce: ["⠁", "⠂", "⠄", "⡀", "⢀", "⠠", "⠐", "⠈"],
};

export function AsciiSpinner({
  frames,
  preset = "default",
  interval = 100,
  label,
  className,
  style,
}: AsciiSpinnerProps) {
  const activeFrames = frames ?? PRESETS[preset];
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);

    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % activeFrames.length);
    }, interval);
    return () => clearInterval(timer);
  }, [activeFrames.length, interval, reducedMotion]);

  return (
    <span
      className={`ascii-lib ascii-spinner ${className ?? ""}`.trim()}
      style={style}
      role="status"
      aria-label={label ?? "Loading"}
    >
      {activeFrames[index]}{label ? ` ${label}` : ""}
    </span>
  );
}
