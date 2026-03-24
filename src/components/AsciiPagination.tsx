import React from "react";
import { borders, repeatChar, type BorderStyle } from "../chars";

export interface AsciiPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  border?: BorderStyle;
  siblingCount?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

function getPageRange(page: number, totalPages: number, siblings: number): (number | "...")[] {
  const range: (number | "...")[] = [];

  const left = Math.max(2, page - siblings);
  const right = Math.min(totalPages - 1, page + siblings);

  range.push(1);

  if (left > 2) range.push("...");

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (right < totalPages - 1) range.push("...");

  if (totalPages > 1) range.push(totalPages);

  return range;
}

export function AsciiPagination({
  page,
  totalPages,
  onPageChange,
  border = "single",
  siblingCount = 1,
  color,
  className,
  style,
}: AsciiPaginationProps) {
  const b = borders[border];
  const pages = getPageRange(page, totalPages, siblingCount);

  return (
    <nav
      className={`ascii-lib ascii-pagination ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
      aria-label="Pagination"
    >
      <button
        type="button"
        className="ascii-pagination-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        {b.tl + repeatChar(b.h, 3) + b.tr}
        {"\n"}
        {b.v + " < " + b.v}
        {"\n"}
        {b.bl + repeatChar(b.h, 3) + b.br}
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="ascii-pagination-ellipsis">
            {" "}{"..."}{" "}
          </span>
        ) : (
          <button
            key={p}
            type="button"
            className={`ascii-pagination-btn${p === page ? " ascii-pagination-active" : ""}`}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
            aria-label={`Page ${p}`}
          >
            {b.tl + repeatChar(b.h, String(p).length + 2) + b.tr}
            {"\n"}
            {b.v + ` ${p} ` + b.v}
            {"\n"}
            {b.bl + repeatChar(b.h, String(p).length + 2) + b.br}
          </button>
        )
      )}
      <button
        type="button"
        className="ascii-pagination-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        {b.tl + repeatChar(b.h, 3) + b.tr}
        {"\n"}
        {b.v + " > " + b.v}
        {"\n"}
        {b.bl + repeatChar(b.h, 3) + b.br}
      </button>
    </nav>
  );
}
