import React from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

export interface AsciiBoxProps {
  children?: React.ReactNode;
  width?: number;
  border?: BorderStyle;
  title?: string;
  padding?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiBox({
  children,
  width = 40,
  border = "single",
  title,
  padding = 1,
  className,
  style,
}: AsciiBoxProps) {
  const b = borders[border];
  const innerWidth = width - 2; // subtract border columns
  const contentWidth = innerWidth - padding * 2;

  const maxTitleLen = Math.max(0, innerWidth - 4);
  const clampedTitle = title && title.length > maxTitleLen ? title.slice(0, maxTitleLen) : title;

  const topLine = clampedTitle
    ? b.tl + b.h + " " + clampedTitle + " " + repeatChar(b.h, innerWidth - clampedTitle.length - 3) + b.tr
    : b.tl + repeatChar(b.h, innerWidth) + b.tr;

  const bottomLine = b.bl + repeatChar(b.h, innerWidth) + b.br;
  const emptyLine = b.v + " ".repeat(innerWidth) + b.v;

  const paddingLines = Array(padding).fill(emptyLine);

  // Convert children to lines for proper border containment
  const text = typeof children === "string" ? children : undefined;
  const contentLines = text
    ? wrapText(text, contentWidth).map(
        (line) => b.v + " ".repeat(padding) + pad(line, contentWidth) + " ".repeat(padding) + b.v
      )
    : null;

  return (
    <div className={`ascii-lib ascii-box ${className ?? ""}`.trim()} style={style}>
      <span>{topLine}</span>
      {"\n"}
      {paddingLines.map((line, i) => (
        <React.Fragment key={`pt-${i}`}>
          <span>{line}</span>
          {"\n"}
        </React.Fragment>
      ))}
      {contentLines ? (
        contentLines.map((line, i) => (
          <React.Fragment key={`c-${i}`}>
            <span>{line}</span>
            {"\n"}
          </React.Fragment>
        ))
      ) : (
        <>
          <span>{b.v}{" ".repeat(padding)}</span>
          <span className="ascii-box-content"
            style={{ display: "inline", whiteSpace: "pre-wrap", maxWidth: contentWidth + "ch" }}
          >
            {children}
          </span>
          <span>{" ".repeat(padding)}{b.v}</span>
          {"\n"}
        </>
      )}
      {paddingLines.map((line, i) => (
        <React.Fragment key={`pb-${i}`}>
          <span>{line}</span>
          {"\n"}
        </React.Fragment>
      ))}
      <span>{bottomLine}</span>
    </div>
  );
}

function wrapText(text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  for (const raw of text.split("\n")) {
    if (raw.length <= maxWidth) {
      lines.push(raw);
      continue;
    }
    let remaining = raw;
    while (remaining.length > maxWidth) {
      let breakAt = remaining.lastIndexOf(" ", maxWidth);
      if (breakAt <= 0) breakAt = maxWidth;
      lines.push(remaining.slice(0, breakAt));
      remaining = remaining.slice(breakAt).replace(/^ /, "");
    }
    if (remaining) lines.push(remaining);
  }
  return lines.length > 0 ? lines : [""];
}
