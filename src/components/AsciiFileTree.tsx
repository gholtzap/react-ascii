import React from "react";
import type { BorderStyle } from "../chars";
import { AsciiWindow } from "./AsciiWindow";

export interface AsciiFileTreeNode {
  path: string;
  name: string;
  kind: "file" | "folder";
  children?: AsciiFileTreeNode[];
  expanded?: boolean;
  selected?: boolean;
  meta?: string;
}

export interface AsciiFileTreeProps {
  items: AsciiFileTreeNode[];
  title?: string;
  width?: number;
  height?: number;
  border?: BorderStyle;
  footer?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

interface RenderedTreeLine {
  key: string;
  text: string;
  selected?: boolean;
}

function renderTreeLines(
  items: AsciiFileTreeNode[],
  prefix = "",
  siblingFlags: boolean[] = []
): RenderedTreeLine[] {
  return items.reduce<RenderedTreeLine[]>((accumulator, item, index) => {
    const isLast = index === items.length - 1;
    const branch = prefix + (isLast ? "└─ " : "├─ ");
    const guides = siblingFlags.map((hasNext) => (hasNext ? "│  " : "   ")).join("");
    const icon = item.kind === "folder" ? (item.expanded ? "▾" : "▸") : "•";
    const meta = item.meta ? `  ${item.meta}` : "";

    accumulator.push({
      key: item.path,
      text: `${guides}${branch}${item.selected ? ">" : " "} ${icon} ${item.name}${meta}`,
      selected: item.selected,
    });

    if (item.kind === "folder" && item.expanded && item.children?.length) {
      accumulator.push(...renderTreeLines(item.children, prefix, [...siblingFlags, !isLast]));
    }

    return accumulator;
  }, []);
}

export function AsciiFileTree({
  items,
  title = "files",
  width = 52,
  height = 8,
  border = "single",
  footer,
  className,
  style,
}: AsciiFileTreeProps) {
  const lines = renderTreeLines(items).slice(0, height);

  return (
    <AsciiWindow
      title={title}
      width={width}
      height={height}
      border={border}
      footer={footer}
      className={`ascii-filetree ${className ?? ""}`.trim()}
      style={style}
    >
      <div className="ascii-filetree-list" role="tree" aria-label={title}>
        {lines.map((line) => (
          <div
            key={line.key}
            className={`ascii-filetree-line${line.selected ? " ascii-filetree-selected" : ""}`}
            role="treeitem"
            aria-selected={line.selected}
          >
            {line.text}
          </div>
        ))}
      </div>
    </AsciiWindow>
  );
}
