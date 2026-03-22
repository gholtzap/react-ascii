import React from "react";

export interface AsciiTreeNode {
  label: string;
  children?: AsciiTreeNode[];
}

export interface AsciiTreeProps {
  data: AsciiTreeNode[];
  /** Guide character style */
  guides?: "unicode" | "ascii";
  className?: string;
  style?: React.CSSProperties;
}

interface LineChars {
  branch: string;
  last: string;
  pipe: string;
  space: string;
}

const unicodeChars: LineChars = {
  branch: "├── ",
  last: "└── ",
  pipe: "│   ",
  space: "    ",
};

const asciiChars: LineChars = {
  branch: "|-- ",
  last: "`-- ",
  pipe: "|   ",
  space: "    ",
};

function renderTree(nodes: AsciiTreeNode[], chars: LineChars, prefix: string = ""): string[] {
  const lines: string[] = [];
  nodes.forEach((node, i) => {
    const isLast = i === nodes.length - 1;
    const connector = isLast ? chars.last : chars.branch;
    lines.push(prefix + connector + node.label);
    if (node.children && node.children.length > 0) {
      const childPrefix = prefix + (isLast ? chars.space : chars.pipe);
      lines.push(...renderTree(node.children, chars, childPrefix));
    }
  });
  return lines;
}

export function AsciiTree({
  data,
  guides = "unicode",
  className,
  style,
}: AsciiTreeProps) {
  const chars = guides === "ascii" ? asciiChars : unicodeChars;
  const lines = renderTree(data, chars);

  return (
    <div
      className={`ascii-lib ascii-tree ${className ?? ""}`.trim()}
      style={style}
      role="tree"
    >
      {lines.join("\n")}
    </div>
  );
}
