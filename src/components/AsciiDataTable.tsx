import React, { useEffect, useMemo, useState } from "react";
import { borders, pad, repeatChar, type BorderStyle } from "../chars";
import { useControllableState } from "../internal/useControllableState";

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
  height?: number;
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  stickyHeader?: boolean;
  pinnedColumns?: string[];
  resizableColumns?: boolean;
  selectable?: boolean;
  rowKey?: string | ((row: Record<string, unknown>, index: number) => string);
  selectedKeys?: string[];
  defaultSelectedKeys?: string[];
  onSelectedKeysChange?: (keys: string[]) => void;
  onRowClick?: (row: Record<string, unknown>) => void;
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

function getRowId(
  row: Record<string, unknown>,
  index: number,
  rowKey?: string | ((row: Record<string, unknown>, index: number) => string)
) {
  if (typeof rowKey === "function") {
    return rowKey(row, index);
  }

  if (typeof rowKey === "string") {
    return String(row[rowKey] ?? index);
  }

  if (row.id !== undefined) {
    return String(row.id);
  }

  return String(index);
}

export function AsciiDataTable({
  columns,
  data,
  border = "single",
  pageSize = 0,
  height,
  loading = false,
  error,
  emptyMessage = "No rows",
  stickyHeader = true,
  pinnedColumns = [],
  resizableColumns = false,
  selectable = false,
  rowKey,
  selectedKeys,
  defaultSelectedKeys = [],
  onSelectedKeysChange,
  onRowClick,
  className,
  style,
}: AsciiDataTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [page, setPage] = useState(0);
  const [activeRowKey, setActiveRowKey] = useState<string | null>(null);
  const [columnWidthOverrides, setColumnWidthOverrides] = useState<Record<string, number>>({});
  const [resolvedSelectedKeys, setResolvedSelectedKeys] = useControllableState<string[]>({
    value: selectedKeys,
    defaultValue: defaultSelectedKeys,
    onChange: onSelectedKeysChange,
  });

  const b = borders[border];
  const orderedColumns = useMemo(() => {
    const pinned = columns.filter((column) => pinnedColumns.includes(column.key))
      .sort((left, right) => pinnedColumns.indexOf(left.key) - pinnedColumns.indexOf(right.key));
    const remaining = columns.filter((column) => !pinnedColumns.includes(column.key));
    return [...pinned, ...remaining];
  }, [columns, pinnedColumns]);

  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    const column = orderedColumns.find((entry) => entry.key === sortKey);

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
  }, [data, orderedColumns, sortDir, sortKey]);

  const rowMeta = useMemo(
    () => sortedData.map((row, index) => ({
      row,
      id: getRowId(row, index, rowKey),
      cells: orderedColumns.map((column) => {
        const rendered = (column.render ? column.render(row[column.key], row) : row[column.key]) as React.ReactNode;
        return getNodeText(rendered ?? "");
      }),
    })),
    [orderedColumns, rowKey, sortedData]
  );

  const baseColumnWidths = useMemo(
    () => orderedColumns.map((column, columnIndex) => {
      if (column.width) return column.width;

      const indicatorWidth = column.sortable ? 2 : 0;
      const headerWidth = column.header.length + indicatorWidth + (resizableColumns ? 2 : 0) + 2;
      const contentWidth = Math.max(
        ...rowMeta.map((entry) => entry.cells[columnIndex]?.length ?? 0),
        0
      ) + 2;
      const minWidth = column.minWidth ?? 10;
      const maxWidth = column.maxWidth ?? 36;

      return Math.max(minWidth, Math.min(maxWidth, Math.max(headerWidth, contentWidth)));
    }),
    [orderedColumns, resizableColumns, rowMeta]
  );

  const resolvedColumnWidths = orderedColumns.map((column, index) => {
    const override = columnWidthOverrides[column.key];
    const baseWidth = baseColumnWidths[index];

    return typeof override === "number" ? override : baseWidth;
  });

  const totalPages = pageSize > 0 ? Math.max(1, Math.ceil(rowMeta.length / pageSize)) : 1;

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages - 1));
  }, [totalPages]);

  const pagedRows = pageSize > 0
    ? rowMeta.slice(page * pageSize, (page + 1) * pageSize)
    : rowMeta;
  const pageIds = pagedRows.map((entry) => entry.id);

  useEffect(() => {
    if (pagedRows.length === 0) {
      setActiveRowKey(null);
      return;
    }

    if (activeRowKey && pagedRows.some((entry) => entry.id === activeRowKey)) {
      return;
    }

    setActiveRowKey(pagedRows[0].id);
  }, [activeRowKey, pagedRows]);

  const adjustColumnWidth = (columnKey: string, delta: number) => {
    const column = orderedColumns.find((entry) => entry.key === columnKey);
    const columnIndex = orderedColumns.findIndex((entry) => entry.key === columnKey);

    if (!column || columnIndex < 0) return;

    const minWidth = column.minWidth ?? 10;
    const maxWidth = column.maxWidth ?? 48;
    const baseWidth = resolvedColumnWidths[columnIndex];

    setColumnWidthOverrides((currentWidths) => ({
      ...currentWidths,
      [columnKey]: Math.max(minWidth, Math.min(maxWidth, baseWidth + delta)),
    }));
  };

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

  const toggleRowSelection = (id: string) => {
    setResolvedSelectedKeys((currentKeys) => currentKeys.includes(id)
      ? currentKeys.filter((key) => key !== id)
      : [...currentKeys, id]
    );
  };

  const togglePageSelection = () => {
    const allSelected = pageIds.length > 0 && pageIds.every((id) => resolvedSelectedKeys.includes(id));

    setResolvedSelectedKeys((currentKeys) => {
      if (allSelected) {
        return currentKeys.filter((id) => !pageIds.includes(id));
      }

      return Array.from(new Set([...currentKeys, ...pageIds]));
    });
  };

  const makeLine = (left: string, mid: string, right: string, fill: string) => {
    const widths = selectable ? [5, ...resolvedColumnWidths] : resolvedColumnWidths;

    return left + widths.map((columnWidth) => repeatChar(fill, columnWidth)).join(mid) + right;
  };

  const makeRow = (
    cells: string[],
    aligns: ("left" | "center" | "right")[]
  ) => b.v + cells.map((cell, index) => pad(cell, selectable && index === 0 ? 5 : resolvedColumnWidths[selectable ? index - 1 : index], aligns[index])).join(b.v) + b.v;

  const headerAligns = orderedColumns.map((column) => column.align ?? "left");
  const selectionHeader = !selectable
    ? []
    : [pageIds.length > 0 && pageIds.every((id) => resolvedSelectedKeys.includes(id)) ? " [x] " : pageIds.some((id) => resolvedSelectedKeys.includes(id)) ? " [-] " : " [ ] "];
  const headerCells = orderedColumns.map((column) => {
    let indicator = "";

    if (column.sortable) {
      if (sortKey === column.key) indicator = sortDir === "asc" ? " ^" : " v";
      else indicator = " ~";
    }

    if (resizableColumns) {
      indicator += " <>".slice(0, 2);
    }

    return ` ${column.header}${indicator} `;
  });
  const topLine = makeLine(b.tl, b.tm, b.tr, b.h);
  const headerSep = makeLine(b.lm, b.mm, b.rm, b.h);
  const bottomLine = makeLine(b.bl, b.bm, b.br, b.h);
  const sortColumn = sortKey ? orderedColumns.find((column) => column.key === sortKey) : undefined;
  const activeRowIndex = pagedRows.findIndex((entry) => entry.id === activeRowKey);
  const totalInnerWidth = (selectable ? 5 : 0)
    + resolvedColumnWidths.reduce((widthSum, columnWidth) => widthSum + columnWidth, 0)
    + Math.max(0, (selectable ? orderedColumns.length + 1 : orderedColumns.length) - 1);

  const handleBodyKeyDown = (event: React.KeyboardEvent) => {
    if (pagedRows.length === 0) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveRowKey(pagedRows[Math.min(activeRowIndex + 1, pagedRows.length - 1)].id);
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveRowKey(pagedRows[Math.max(activeRowIndex - 1, 0)].id);
        break;
      case "Enter":
        if (activeRowIndex >= 0 && onRowClick) {
          event.preventDefault();
          onRowClick(pagedRows[activeRowIndex].row);
        }
        break;
      case " ":
        if (selectable && activeRowIndex >= 0) {
          event.preventDefault();
          toggleRowSelection(pagedRows[activeRowIndex].id);
        }
        break;
    }
  };

  const makeStatusRow = (message: string) => b.v + pad(` ${message} `, totalInnerWidth) + b.v;

  return (
    <div className={`ascii-lib ascii-datatable ${className ?? ""}`.trim()} style={style}>
      <div className={`ascii-datatable-head${stickyHeader ? " ascii-datatable-head-sticky" : ""}`}>
        <span>{topLine}</span>
        {"\n"}
        <span>
          {b.v}
          {selectable ? (
            <>
              <button
                type="button"
                className="ascii-datatable-sort"
                onClick={togglePageSelection}
                aria-label="Toggle page selection"
              >
                {pad(selectionHeader[0], 5)}
              </button>
              {b.v}
            </>
          ) : null}
          {orderedColumns.map((column, index) => {
            const cell = headerCells[index];
            const interactive = column.sortable || resizableColumns;

            return (
              <React.Fragment key={column.key}>
                {interactive ? (
                  <button
                    type="button"
                    className="ascii-datatable-sort"
                    onClick={() => handleSort(column.key, column.sortable)}
                    onKeyDown={(event) => {
                      if (!resizableColumns || !event.shiftKey) return;

                      if (event.key === "ArrowLeft") {
                        event.preventDefault();
                        adjustColumnWidth(column.key, -2);
                      }

                      if (event.key === "ArrowRight") {
                        event.preventDefault();
                        adjustColumnWidth(column.key, 2);
                      }
                    }}
                    aria-sort={sortKey === column.key ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                  >
                    {pad(cell, resolvedColumnWidths[index], headerAligns[index])}
                  </button>
                ) : (
                  <span>{pad(cell, resolvedColumnWidths[index], headerAligns[index])}</span>
                )}
                {b.v}
              </React.Fragment>
            );
          })}
        </span>
        {"\n"}
        <span>{headerSep}</span>
      </div>
      <div
        className="ascii-datatable-body"
        style={height ? { maxHeight: `${height * 1.5}em` } : undefined}
        tabIndex={pagedRows.length > 0 ? 0 : undefined}
        onKeyDown={handleBodyKeyDown}
      >
        {loading ? (
          <span>{makeStatusRow("Loading...")}</span>
        ) : error ? (
          <span>{makeStatusRow(error)}</span>
        ) : pagedRows.length === 0 ? (
          <span>{makeStatusRow(emptyMessage)}</span>
        ) : (
          pagedRows.map((entry) => {
            const selected = resolvedSelectedKeys.includes(entry.id);
            const aligns = selectable ? ["center" as const, ...headerAligns] : headerAligns;
            const cells = selectable
              ? [` ${selected ? "[x]" : "[ ]"} `, ...entry.cells.map((cell) => ` ${cell} `)]
              : entry.cells.map((cell) => ` ${cell} `);

            return (
              <button
                key={entry.id}
                type="button"
                className={`ascii-datatable-row${entry.id === activeRowKey ? " ascii-datatable-row-active" : ""}${selected ? " ascii-datatable-row-selected" : ""}`}
                onClick={() => {
                  setActiveRowKey(entry.id);
                  if (selectable) {
                    toggleRowSelection(entry.id);
                  }
                  onRowClick?.(entry.row);
                }}
              >
                {makeRow(cells, aligns)}
              </button>
            );
          })
        )}
      </div>
      <span>{bottomLine}</span>
      {(pageSize > 0 && totalPages > 1) || sortColumn || selectable || pinnedColumns.length > 0 || resizableColumns ? (
        <>
          {"\n"}
          <div className="ascii-datatable-pager">
            <div className="ascii-datatable-meta">
              {sortColumn ? `sort: ${sortColumn.header} ${sortDir === "asc" ? "↑" : "↓"}` : `rows: ${rowMeta.length}`}
              {selectable ? `  selected: ${resolvedSelectedKeys.length}` : ""}
              {pinnedColumns.length > 0 ? `  pins: ${pinnedColumns.join(",")}` : ""}
              {resizableColumns ? "  resize: Shift+←/→" : ""}
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
