import React from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

export interface AsciiCodeProps {
  children: string;
  title?: string;
  showLineNumbers?: boolean;
  startLine?: number;
  width?: number;
  border?: BorderStyle;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiCode({
  children,
  title,
  showLineNumbers = true,
  startLine = 1,
  width,
  border = "single",
  className,
  style,
}: AsciiCodeProps) {
  const b = borders[border];
  const codeLines = children.replace(/\n$/, "").split("\n");
  const lineCount = codeLines.length;
  const gutterWidth = showLineNumbers ? String(startLine + lineCount - 1).length + 1 : 0;

  // Auto-calculate width if not provided
  const maxContentWidth = Math.max(...codeLines.map((l) => l.length));
  const innerWidth = (width ? width - 2 : Math.max(maxContentWidth + gutterWidth + 3, (title?.length ?? 0) + 4));
  const totalWidth = innerWidth + 2;

  const lines: string[] = [];

  // Top border
  const maxTitleLen = Math.max(0, innerWidth - 4);
  const clampedTitle = title && title.length > maxTitleLen ? title.slice(0, maxTitleLen) : title;

  if (clampedTitle) {
    lines.push(b.tl + b.h + " " + clampedTitle + " " + repeatChar(b.h, innerWidth - clampedTitle.length - 3) + b.tr);
    lines.push(b.lm + repeatChar(b.h, innerWidth) + b.rm);
  } else {
    lines.push(b.tl + repeatChar(b.h, innerWidth) + b.tr);
  }

  // Code lines
  for (let i = 0; i < codeLines.length; i++) {
    const lineNum = startLine + i;
    const gutter = showLineNumbers
      ? pad(String(lineNum), gutterWidth, "right") + " " + b.v + " "
      : " ";
    const content = gutter + codeLines[i];
    lines.push(b.v + pad(content, innerWidth) + b.v);
  }

  // Bottom border
  lines.push(b.bl + repeatChar(b.h, innerWidth) + b.br);

  return (
    <div className={`ascii-lib ascii-code ${className ?? ""}`.trim()} style={style}>
      <pre style={{ margin: 0, font: "inherit", lineHeight: "inherit" }}>
        {lines.join("\n")}
      </pre>
    </div>
  );
}
