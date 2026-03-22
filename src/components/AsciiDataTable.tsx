import React, { useEffect, useMemo, useState } from "react";
import { borders, pad, repeatChar, type BorderStyle } from "../chars";

export interface AsciiDataTableColumn {
  key: string;
  header: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
  sortValue?: (value: unknown, row: Record<string, unknown>) => unknown;
  compare?: (a: Record<string, unknown>, b: Record<string, unknown>) => number;
}

export interface AsciiDataTableProps {
  columns: AsciiDataTableColumn[];
  data: Record<string, unknown>[];
  border?: BorderStyle;
  pageSize?: number;
  emptyMessage?: string;
  className?: string;
  style?: React.CSSProperties;
}

type SortDirection = "asc" | "desc";

function getNodeText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map((entry) => getNodeText(entry)).join("");
  }

  if (React.isValidElement(node)) {
    return getNodeText((node as React.ReactElement<{ children?: React.ReactNode }>).props.children);
  }

  return "";
}

function parseRelativeAge(value: string) {
  const normalized = value.trim().toLowerCase();

  if (normalized === "now") return 0;

  const match = normalized.match(/^(\d+(?:\.\d+)?)\s*([smhdw])\s+ago$/);

  if (!match) return null;

  const amount = Number.parseFloat(match[1]);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    s: 1_000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
    w: 604_800_000,
  };

  return amount * multipliers[unit];
}

function parseUnitValue(value: string) {
  const normalized = value.trim().toLowerCase();

  const percentMatch = normalized.match(/^(-?\d+(?:\.\d+)?)%$/);

  if (percentMatch) {
    return Number.parseFloat(percentMatch[1]);
  }

  const byteMatch = normalized.match(/^(-?\d+(?:\.\d+)?)\s*(b|kb|mb|gb|tb|pb|k|m|g|t|p)$/);

  if (byteMatch) {
    const amount = Number.parseFloat(byteMatch[1]);
    const unit = byteMatch[2];
    const powers: Record<string, number> = {
      b: 0,
      kb: 1,
      mb: 2,
      gb: 3,
      tb: 4,
      pb: 5,
      k: 1,
      m: 2,
      g: 3,
      t: 4,
      p: 5,
    };

    return amount * 1024 ** powers[unit];
  }

  const durationMatch = normalized.match(/^(-?\d+(?:\.\d+)?)\s*(ms|s|m|h|d)$/);

  if (durationMatch) {
    const amount = Number.parseFloat(durationMatch[1]);
    const unit = durationMatch[2];
    const multipliers: Record<string, number> = {
      ms: 1,
      s: 1_000,
      m: 60_000,
      h: 3_600_000,
      d: 86_400_000,
    };

    return amount * multipliers[unit];
  }

  return null;
}

function normalizeSortValue(value: unknown) {
  if (typeof value === "number") return { type: "number" as const, value };
  if (value instanceof Date) return { type: "number" as const, value: value.getTime() };

  const text = typeof value === "string" ? value : String(value ?? "");
  const trimmed = text.trim();

  if (trimmed.length === 0) {
    return { type: "text" as const, value: "" };
  }

  const numeric = Number(trimmed);

  if (!Number.isNaN(numeric)) {
    return { type: "number" as const, value: numeric };
  }

  const relativeAge = parseRelativeAge(trimmed);

  if (relativeAge !== null) {
    return { type: "number" as const, value: relativeAge };
  }

  const unitValue = parseUnitValue(trimmed);

  if (unitValue !== null) {
    return { type: "number" as const, value: unitValue };
  }

  const date = Date.parse(trimmed);

  if (!Number.isNaN(date)) {
    return { type: "number" as const, value: date };
  }

  return { type: "text" as const, value: trimmed.toLowerCase() };
}

function compareValues(a: unknown, b: unknown) {
  const left = normalizeSortValue(a);
  const right = normalizeSortValue(b);

  if (left.type === "number" && right.type === "number") {
    return left.value - right.value;
  }

  return String(left.value).localeCompare(String(right.value));
}

export function AsciiDataTable({
  columns,
  data,
  border = "single",
  pageSize = 0,
  emptyMessage = "No rows",
  className,
  style,
}: AsciiDataTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [page, setPage] = useState(0);

  const b = borders[border];

  const displayRows = useMemo(
    () => data.map((row) => columns.map((column) => {
      const rendered = (column.render ? column.render(row[column.key], row) : row[column.key]) as React.ReactNode;
      return getNodeText(rendered ?? "");
    })),
    [columns, data]
  );

  const colWidths = useMemo(
    () => columns.map((column, columnIndex) => {
      if (column.width) return column.width;

      const indicatorWidth = column.sortable ? 2 : 0;
      const headerWidth = column.header.length + indicatorWidth + 2;
      const contentWidth = Math.max(
        ...displayRows.map((row) => row[columnIndex]?.length ?? 0),
        0
      ) + 2;
      const minWidth = column.minWidth ?? 10;
      const maxWidth = column.maxWidth ?? 36;

      return Math.max(minWidth, Math.min(maxWidth, Math.max(headerWidth, contentWidth)));
    }),
    [columns, displayRows]
  );

  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    const column = columns.find((entry) => entry.key === sortKey);

    if (!column) return data;

    return [...data].sort((leftRow, rightRow) => {
      const baseComparison = column.compare
        ? column.compare(leftRow, rightRow)
        : compareValues(
            column.sortValue ? column.sortValue(leftRow[sortKey], leftRow) : leftRow[sortKey],
            column.sortValue ? column.sortValue(rightRow[sortKey], rightRow) : rightRow[sortKey]
          );

      return sortDir === "asc" ? baseComparison : -baseComparison;
    });
  }, [columns, data, sortDir, sortKey]);

  const totalPages = pageSize > 0 ? Math.max(1, Math.ceil(sortedData.length / pageSize)) : 1;

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages - 1));
  }, [totalPages]);

  const pagedData = pageSize > 0
    ? sortedData.slice(page * pageSize, (page + 1) * pageSize)
    : sortedData;

  const handleSort = (key: string, sortable?: boolean) => {
    if (!sortable) return;

    if (sortKey === key) {
      setSortDir((currentDir) => currentDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }

    setPage(0);
  };

  const makeLine = (left: string, mid: string, right: string, fill: string) =>
    left + colWidths.map((columnWidth) => repeatChar(fill, columnWidth)).join(mid) + right;

  const makeRow = (cells: string[], aligns: ("left" | "center" | "right")[]) =>
    b.v + cells.map((cell, index) => pad(cell, colWidths[index], aligns[index])).join(b.v) + b.v;

  const headerCells = columns.map((column) => {
    let indicator = "";

    if (column.sortable) {
      if (sortKey === column.key) indicator = sortDir === "asc" ? " ^" : " v";
      else indicator = " ~";
    }

    return ` ${column.header}${indicator} `;
  });

  const headerAligns = columns.map((column) => column.align ?? "left");
  const topLine = makeLine(b.tl, b.tm, b.tr, b.h);
  const headerSep = makeLine(b.lm, b.mm, b.rm, b.h);
  const bottomLine = makeLine(b.bl, b.bm, b.br, b.h);
  const sortColumn = sortKey ? columns.find((column) => column.key === sortKey) : undefined;

  return (
    <div className={`ascii-lib ascii-datatable ${className ?? ""}`.trim()} style={style}>
      <span>{topLine}</span>
      {"\n"}
      <span>
        {b.v}
        {columns.map((column, index) => {
          const cell = headerCells[index];
          return (
            <React.Fragment key={column.key}>
              {column.sortable ? (
                <button
                  type="button"
                  className="ascii-datatable-sort"
                  onClick={() => handleSort(column.key, column.sortable)}
                  aria-sort={sortKey === column.key ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                >
                  {pad(cell, colWidths[index], headerAligns[index])}
                </button>
              ) : (
                <span>{pad(cell, colWidths[index], headerAligns[index])}</span>
              )}
              {b.v}
            </React.Fragment>
          );
        })}
      </span>
      {"\n"}
      <span>{headerSep}</span>
      {"\n"}
      {pagedData.length === 0 ? (
        <>
          <span>{makeRow([` ${emptyMessage} `, ...columns.slice(1).map(() => " ")], ["left", ...headerAligns.slice(1)])}</span>
          {"\n"}
        </>
      ) : (
        pagedData.map((row, rowIndex) => {
          const cells = columns.map((column) => {
            const rendered = (column.render ? column.render(row[column.key], row) : row[column.key]) as React.ReactNode;
            return ` ${getNodeText(rendered ?? "")} `;
          });

          return (
            <React.Fragment key={rowIndex}>
              <span>{makeRow(cells, headerAligns)}</span>
              {"\n"}
            </React.Fragment>
          );
        })
      )}
      <span>{bottomLine}</span>
      {(pageSize > 0 && totalPages > 1) || sortColumn ? (
        <>
          {"\n"}
          <div className="ascii-datatable-pager">
            <div className="ascii-datatable-meta">
              {sortColumn
                ? `sort: ${sortColumn.header} ${sortDir === "asc" ? "↑" : "↓"}`
                : `rows: ${sortedData.length}`}
            </div>
            {pageSize > 0 && totalPages > 1 && (
              <div className="ascii-datatable-page-controls">
                <button
                  type="button"
                  className="ascii-datatable-page-btn"
                  disabled={page === 0}
                  onClick={() => setPage((currentPage) => currentPage - 1)}
                >
                  {"[<]"}
                </button>
                <span>{` ${page + 1}/${totalPages} `}</span>
                <button
                  type="button"
                  className="ascii-datatable-page-btn"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((currentPage) => currentPage + 1)}
                >
                  {"[>]"}
                </button>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
