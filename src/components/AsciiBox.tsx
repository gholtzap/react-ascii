import React from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";
import { useBorderDrawIn } from "../internal/useBorderDrawIn";

export interface AsciiBoxProps {
  children?: React.ReactNode;
  width?: number;
  border?: BorderStyle;
  title?: string;
  padding?: number;
  animate?: boolean;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiBox({
  children,
  width = 40,
  border = "single",
  title,
  padding = 1,
  animate = false,
  color,
  className,
  style,
}: AsciiBoxProps) {
  const b = borders[border];
  const innerWidth = width - 2;
  const contentWidth = innerWidth - padding * 2;

  const text = typeof children === "string" ? children : undefined;
  const contentLines = text ? wrapText(text, contentWidth) : null;
  const bodyLines = contentLines ? contentLines.length : 1;
  const totalHeight = 2 + padding * 2 + bodyLines;
  const perimeter = (innerWidth + totalHeight) * 2;
  const { progress } = useBorderDrawIn(perimeter, 6, animate);
  const visibleChars = Math.floor(progress * perimeter);

  const maxTitleLen = Math.max(0, innerWidth - 4);
  const clampedTitle = title && title.length > maxTitleLen ? title.slice(0, maxTitleLen) : title;

  const fullTopLine = clampedTitle
    ? b.tl + b.h + " " + clampedTitle + " " + repeatChar(b.h, innerWidth - clampedTitle.length - 3) + b.tr
    : b.tl + repeatChar(b.h, innerWidth) + b.tr;

  const fullBottomLine = b.bl + repeatChar(b.h, innerWidth) + b.br;
  const emptyLine = b.v + " ".repeat(innerWidth) + b.v;

  const topChars = Math.min(visibleChars, innerWidth + 2);
  const rightChars = Math.max(0, Math.min(visibleChars - (innerWidth + 2), totalHeight - 2));
  const bottomChars = Math.max(0, Math.min(visibleChars - (innerWidth + 2) - (totalHeight - 2), innerWidth + 2));
  const leftChars = Math.max(0, visibleChars - (innerWidth + 2) * 2 - (totalHeight - 2));

  const done = progress >= 1;

  const maskLine = (line: string, rowIndex: number) => {
    if (done) return line;
    const hasLeft = leftChars >= (totalHeight - 2 - rowIndex);
    const hasRight = rightChars > rowIndex;
    const lChar = hasLeft ? line[0] : " ";
    const rChar = hasRight ? line[line.length - 1] : " ";
    return lChar + line.slice(1, -1) + rChar;
  };

  const topLine = done ? fullTopLine : fullTopLine.slice(0, topChars) + " ".repeat(Math.max(0, innerWidth + 2 - topChars));
  const bottomLine = done ? fullBottomLine
    : " ".repeat(Math.max(0, innerWidth + 2 - bottomChars)) + fullBottomLine.slice(Math.max(0, innerWidth + 2 - bottomChars));

  const paddingLines = Array(padding).fill(emptyLine);

  const formattedContentLines = contentLines
    ? contentLines.map(
        (line) => b.v + " ".repeat(padding) + pad(line, contentWidth) + " ".repeat(padding) + b.v
      )
    : null;

  const allMiddleLines = [
    ...paddingLines,
    ...(formattedContentLines ?? [emptyLine]),
    ...paddingLines,
  ];

  return (
    <div className={`ascii-lib ascii-box ${className ?? ""}`.trim()} style={color ? { ...style, color } : style}>
      <span>{topLine}</span>
      {"\n"}
      {formattedContentLines ? (
        allMiddleLines.map((line, i) => (
          <React.Fragment key={`m-${i}`}>
            <span>{maskLine(line, i)}</span>
            {"\n"}
          </React.Fragment>
        ))
      ) : (
        <>
          {paddingLines.map((line, i) => (
            <React.Fragment key={`pt-${i}`}>
              <span>{maskLine(line, i)}</span>
              {"\n"}
            </React.Fragment>
          ))}
          <span>{maskLine(b.v + " ".repeat(padding), padding)}</span>
          <span className="ascii-box-content"
            style={{ display: "inline", whiteSpace: "pre-wrap", maxWidth: contentWidth + "ch" }}
          >
            {children}
          </span>
          <span>{maskLine(" ".repeat(padding) + b.v, padding)}</span>
          {"\n"}
          {paddingLines.map((line, i) => (
            <React.Fragment key={`pb-${i}`}>
              <span>{maskLine(line, padding + 1 + i)}</span>
              {"\n"}
            </React.Fragment>
          ))}
        </>
      )}
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
