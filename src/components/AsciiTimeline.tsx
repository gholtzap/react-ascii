import React from "react";

export interface AsciiTimelineEvent {
  key: string;
  timestamp: string;
  title: string;
  description?: string;
}

export interface AsciiTimelineProps {
  events: AsciiTimelineEvent[];
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiTimeline({
  events,
  className,
  style,
}: AsciiTimelineProps) {
  if (events.length === 0) return null;

  const lines: string[] = [];

  events.forEach((event, i) => {
    const isLast = i === events.length - 1;
    const connector = isLast ? "└" : "├";
    const pipe = isLast ? " " : "│";

    lines.push(`${connector}── ${event.timestamp}  ${event.title}`);
    if (event.description) {
      const descLines = event.description.split("\n");
      for (const dl of descLines) {
        lines.push(`${pipe}   ${dl}`);
      }
    }
    if (!isLast) {
      lines.push(`${pipe}`);
    }
  });

  return (
    <div
      className={`ascii-lib ascii-timeline ${className ?? ""}`.trim()}
      style={style}
    >
      {lines.join("\n")}
    </div>
  );
}
