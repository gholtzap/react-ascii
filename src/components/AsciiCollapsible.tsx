import React, { useState, useId } from "react";

export interface AsciiCollapsibleProps {
  title: string;
  children: string;
  defaultOpen?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiCollapsible({
  title,
  children,
  defaultOpen = false,
  className,
  style,
}: AsciiCollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const arrow = open ? "v" : ">";

  return (
    <div
      className={`ascii-lib ascii-collapsible ${className ?? ""}`.trim()}
      style={style}
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
          {children.split("\n").map((line, i) => (
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
