import React, { useState, useId, useEffect } from "react";
import { useReducedMotion } from "../internal/useReducedMotion";

export interface AsciiCollapsibleProps {
  title: string;
  children: string;
  defaultOpen?: boolean;
  animate?: boolean;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiCollapsible({
  title,
  children,
  defaultOpen = false,
  animate = false,
  color,
  className,
  style,
}: AsciiCollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const arrow = open ? "v" : ">";
  const reduced = useReducedMotion();
  const allLines = children.split("\n");

  const [visibleLines, setVisibleLines] = useState(open ? allLines.length : 0);

  useEffect(() => {
    if (!open) { setVisibleLines(0); return; }
    if (!animate || reduced) { setVisibleLines(allLines.length); return; }
    setVisibleLines(0);
    let count = 0;
    const timer = setInterval(() => {
      count++;
      setVisibleLines(count);
      if (count >= allLines.length) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [open, allLines.length, animate, reduced]);

  return (
    <div
      className={`ascii-lib ascii-collapsible ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
    >
      <button
        type="button"
        className="ascii-collapsible-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
      >
        {`[${arrow}] ${title}`}
      </button>
      {"\n"}
      {open && (
        <div id={panelId} className="ascii-collapsible-content" role="region">
          {allLines.slice(0, visibleLines).map((line, i) => (
            <React.Fragment key={i}>
              {`    ${line}`}
              {"\n"}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
