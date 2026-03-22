import React, { useState, useMemo } from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

export interface AsciiDataTableColumn {
  key: string;
  header: string;
  width?: number;
  align?: "left" | "center" | "right";
  sortable?: boolean;
}

export interface AsciiDataTableProps {
  columns: AsciiDataTableColumn[];
  data: Record<string, unknown>[];
  border?: BorderStyle;
  pageSize?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiDataTable({
  columns,
  data,
  border = "single",
  pageSize = 0,
  className,
  style,
}: AsciiDataTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);

  const b = borders[border];
  const colWidths = columns.map((c) =>
    c.width ?? Math.max(c.header.length + 2, 10)
  );

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const av = String(a[sortKey] ?? "");
      const bv = String(b[sortKey] ?? "");
      const numA = parseFloat(av);
      const numB = parseFloat(bv);
      if (!isNaN(numA) && !isNaN(numB)) {
        return sortDir === "asc" ? numA - numB : numB - numA;
      }
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [data, sortKey, sortDir]);

  const pagedData = pageSize > 0
    ? sortedData.slice(page * pageSize, (page + 1) * pageSize)
    : sortedData;

  const totalPages = pageSize > 0 ? Math.ceil(sortedData.length / pageSize) : 1;

  const handleSort = (key: string, sortable?: boolean) => {
    if (!sortable) return;
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(0);
  };

  const makeLine = (left: string, mid: string, right: string, fill: string) => {
    return left + colWidths.map((w) => repeatChar(fill, w)).join(mid) + right;
  };

  const makeRow = (cells: string[], aligns: ("left" | "center" | "right")[]) => {
    return b.v + cells.map((cell, i) => pad(cell, colWidths[i], aligns[i])).join(b.v) + b.v;
  };

  const headerCells = columns.map((col) => {
    let indicator = "";
    if (col.sortable) {
      if (sortKey === col.key) indicator = sortDir === "asc" ? " ^" : " v";
      else indicator = " ~";
    }
    return ` ${col.header}${indicator} `;
  });

  const headerAligns = columns.map((c) => c.align ?? "left");
  const topLine = makeLine(b.tl, b.tm, b.tr, b.h);
  const headerSep = makeLine(b.lm, b.mm, b.rm, b.h);
  const bottomLine = makeLine(b.bl, b.bm, b.br, b.h);

  return (
    <div className={`ascii-lib ascii-datatable ${className ?? ""}`.trim()} style={style}>
      <span>{topLine}</span>
      {"\n"}
      <span>
        {b.v}
        {columns.map((col, i) => {
          const cell = headerCells[i];
          return (
            <React.Fragment key={col.key}>
              {col.sortable ? (
                <button
                  type="button"
                  className="ascii-datatable-sort"
                  onClick={() => handleSort(col.key, col.sortable)}
                >
                  {pad(cell, colWidths[i], headerAligns[i])}
                </button>
              ) : (
                <span>{pad(cell, colWidths[i], headerAligns[i])}</span>
              )}
              {b.v}
            </React.Fragment>
          );
        })}
      </span>
      {"\n"}
      <span>{headerSep}</span>
      {"\n"}
      {pagedData.map((row, ri) => {
        const cells = columns.map((col) => ` ${String(row[col.key] ?? "")} `);
        return (
          <React.Fragment key={ri}>
            <span>{makeRow(cells, headerAligns)}</span>
            {"\n"}
          </React.Fragment>
        );
      })}
      <span>{bottomLine}</span>
      {pageSize > 0 && totalPages > 1 && (
        <>
          {"\n"}
          <div className="ascii-datatable-pager">
            <button
              type="button"
              className="ascii-datatable-page-btn"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              {"[<]"}
            </button>
            <span>{` ${page + 1}/${totalPages} `}</span>
            <button
              type="button"
              className="ascii-datatable-page-btn"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              {"[>]"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
