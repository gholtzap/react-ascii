import React from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

export interface AsciiTableColumn {
  key: string;
  header: string;
  width?: number;
  align?: "left" | "center" | "right";
}

export interface AsciiTableProps {
  columns: AsciiTableColumn[];
  data: Record<string, string | number>[];
  border?: BorderStyle;
  "aria-label"?: string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiTable({
  columns,
  data,
  border = "single",
  "aria-label": ariaLabel,
  color,
  className,
  style,
}: AsciiTableProps) {
  const b = borders[border];

  // Calculate column widths
  const cols = columns.map((col) => {
    const dataWidths = data.map((row) => String(row[col.key] ?? "").length);
    const maxData = Math.max(col.header.length, ...dataWidths);
    return {
      ...col,
      width: col.width ?? maxData + 2,
    };
  });

  const makeRow = (cells: string[], left: string, mid: string, right: string, sep: string) => {
    return left + cells.map((_, i) => repeatChar(sep, cols[i].width)).join(mid) + right;
  };

  const makeDataRow = (cells: string[]) => {
    return (
      b.v +
      cells
        .map((cell, i) => pad(` ${cell}`, cols[i].width - 1, cols[i].align) + " ")
        .join(b.v) +
      b.v
    );
  };

  const lines: string[] = [];

  // Top border
  lines.push(makeRow(cols.map(() => ""), b.tl, b.tm, b.tr, b.h));

  // Header row
  lines.push(makeDataRow(cols.map((c) => c.header)));

  // Header separator
  lines.push(makeRow(cols.map(() => ""), b.lm, b.mm, b.rm, b.h));

  // Data rows
  for (const row of data) {
    lines.push(makeDataRow(cols.map((c) => String(row[c.key] ?? ""))));
  }

  // Bottom border
  lines.push(makeRow(cols.map(() => ""), b.bl, b.bm, b.br, b.h));

  return (
    <div className={`ascii-lib ascii-table ${className ?? ""}`.trim()} style={color ? { ...style, color } : style}>
      <span aria-hidden="true">{lines.join("\n")}</span>
      <table className="ascii-sr-only" aria-label={ariaLabel}>
        <thead>
          <tr>
            {cols.map((c) => (
              <th key={c.key} scope="col">{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, ri) => (
            <tr key={ri}>
              {cols.map((c) => (
                <td key={c.key}>{String(row[c.key] ?? "")}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
