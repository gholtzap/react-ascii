import React, { useEffect, useMemo, useRef } from "react";
import type { BorderStyle } from "../chars";
import { pad } from "../chars";
import { renderHighlightedText } from "../internal/renderHighlightedText";
import { useControllableState } from "../internal/useControllableState";
import { AsciiWindow } from "./AsciiWindow";

export type AsciiLogLevel = "debug" | "info" | "success" | "warn" | "error";

export interface AsciiLogEntry {
  id?: string;
  timestamp?: string;
  level: AsciiLogLevel;
  source?: string;
  message: string;
}

export interface AsciiLogViewerProps {
  lines: AsciiLogEntry[];
  title?: string;
  width?: number;
  height?: number;
  border?: BorderStyle;
  footer?: React.ReactNode;
  toolbar?: React.ReactNode;
  query?: string;
  levels?: AsciiLogLevel[];
  follow?: boolean;
  defaultFollow?: boolean;
  onFollowChange?: (follow: boolean) => void;
  selectable?: boolean;
  copyable?: boolean;
  bookmarkable?: boolean;
  selectedId?: string;
  defaultSelectedId?: string;
  onSelectedIdChange?: (id: string | undefined) => void;
  bookmarkedIds?: string[];
  defaultBookmarkedIds?: string[];
  onBookmarkedIdsChange?: (ids: string[]) => void;
  onCopyLine?: (line: AsciiLogEntry) => void;
  emptyMessage?: string;
  className?: string;
  style?: React.CSSProperties;
}

const levelLabels: Record<AsciiLogLevel, string> = {
  debug: "DBG",
  info: "INF",
  success: "OK ",
  warn: "WRN",
  error: "ERR",
};

function matchesQuery(line: AsciiLogEntry, query?: string) {
  const normalized = query?.trim().toLowerCase();

  if (!normalized) return true;

  return [line.timestamp, line.source, line.level, line.message]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(normalized));
}

function getLineId(line: AsciiLogEntry, index: number) {
  return line.id ?? `${line.timestamp ?? "t"}-${line.level}-${line.source ?? "src"}-${index}`;
}

function formatLogLine(line: AsciiLogEntry) {
  return [
    line.timestamp ?? "",
    `[${levelLabels[line.level]}]`,
    line.source ?? "",
    line.message,
  ].filter(Boolean).join(" ");
}

export function AsciiLogViewer({
  lines,
  title = "logs",
  width = 64,
  height = 8,
  border = "single",
  footer,
  toolbar,
  query,
  levels,
  follow,
  defaultFollow = true,
  onFollowChange,
  selectable = true,
  copyable = true,
  bookmarkable = true,
  selectedId,
  defaultSelectedId,
  onSelectedIdChange,
  bookmarkedIds,
  defaultBookmarkedIds = [],
  onBookmarkedIdsChange,
  onCopyLine,
  emptyMessage = "No log lines",
  className,
  style,
}: AsciiLogViewerProps) {
  const [resolvedFollow, setResolvedFollow] = useControllableState({
    value: follow,
    defaultValue: defaultFollow,
    onChange: onFollowChange,
  });
  const [resolvedSelectedId, setResolvedSelectedId] = useControllableState<string | undefined>({
    value: selectedId,
    defaultValue: defaultSelectedId,
    onChange: onSelectedIdChange,
  });
  const [resolvedBookmarkedIds, setResolvedBookmarkedIds] = useControllableState<string[]>({
    value: bookmarkedIds,
    defaultValue: defaultBookmarkedIds,
    onChange: onBookmarkedIdsChange,
  });
  const listRef = useRef<HTMLDivElement>(null);
  const filteredLines = useMemo(() => lines.filter((line) => {
    const levelMatches = !levels || levels.length === 0 || levels.includes(line.level);
    return levelMatches && matchesQuery(line, query);
  }), [levels, lines, query]);
  const visibleLines = useMemo(
    () => resolvedFollow ? filteredLines.slice(-height) : filteredLines.slice(0, height),
    [filteredLines, height, resolvedFollow]
  );
  const sourceWidth = Math.min(
    12,
    Math.max(0, ...visibleLines.map((line) => (line.source ?? "").length))
  );
  const bookmarkedSet = useMemo(
    () => new Set(resolvedBookmarkedIds),
    [resolvedBookmarkedIds]
  );

  useEffect(() => {
    if (!selectable || visibleLines.length === 0) return;

    const selectedVisible = visibleLines.some((line, index) => getLineId(line, index) === resolvedSelectedId);

    if (selectedVisible) return;

    const lastVisibleId = getLineId(visibleLines[visibleLines.length - 1], visibleLines.length - 1);
    setResolvedSelectedId(lastVisibleId);
  }, [resolvedSelectedId, selectable, setResolvedSelectedId, visibleLines]);

  useEffect(() => {
    if (!resolvedFollow || !listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [resolvedFollow, visibleLines]);

  const selectedLine = visibleLines.find((line, index) => getLineId(line, index) === resolvedSelectedId);

  const toggleBookmark = () => {
    if (!selectedLine) return;

    const key = getLineId(selectedLine, visibleLines.indexOf(selectedLine));

    setResolvedBookmarkedIds((currentIds) => currentIds.includes(key)
      ? currentIds.filter((id) => id !== key)
      : [...currentIds, key]
    );
  };

  const copySelectedLine = async () => {
    if (!selectedLine) return;

    const payload = formatLogLine(selectedLine);
    onCopyLine?.(selectedLine);

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(payload);
    }
  };

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (!selectable || visibleLines.length === 0) return;

    const currentIndex = Math.max(
      0,
      visibleLines.findIndex((line, index) => getLineId(line, index) === resolvedSelectedId)
    );

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setResolvedSelectedId(getLineId(visibleLines[Math.min(currentIndex + 1, visibleLines.length - 1)], Math.min(currentIndex + 1, visibleLines.length - 1)));
        break;
      case "ArrowUp":
        event.preventDefault();
        setResolvedSelectedId(getLineId(visibleLines[Math.max(currentIndex - 1, 0)], Math.max(currentIndex - 1, 0)));
        break;
      case " ":
      case "b":
      case "B":
        if (bookmarkable) {
          event.preventDefault();
          toggleBookmark();
        }
        break;
      case "c":
      case "C":
        if (copyable) {
          event.preventDefault();
          void copySelectedLine();
        }
        break;
    }
  };

  return (
    <AsciiWindow
      title={title}
      width={width}
      height={height}
      border={border}
      footer={footer}
      className={`ascii-logviewer ${className ?? ""}`.trim()}
      style={style}
    >
      {toolbar || selectable || copyable || bookmarkable ? (
        <div className="ascii-logviewer-toolbar">
          {toolbar}
          <button
            type="button"
            className="ascii-logviewer-action"
            onClick={() => setResolvedFollow((currentFollow) => !currentFollow)}
          >
            {resolvedFollow ? "[pause]" : "[follow]"}
          </button>
          {bookmarkable && selectedLine ? (
            <button
              type="button"
              className="ascii-logviewer-action"
              onClick={toggleBookmark}
            >
              {bookmarkedSet.has(getLineId(selectedLine, visibleLines.indexOf(selectedLine))) ? "[★]" : "[☆]"}
            </button>
          ) : null}
          {copyable && selectedLine ? (
            <button
              type="button"
              className="ascii-logviewer-action"
              onClick={() => {
                void copySelectedLine();
              }}
            >
              [copy]
            </button>
          ) : null}
        </div>
      ) : null}
      <div className="ascii-logviewer-columns">
        <span>{pad("MK", 3)}</span>
        <span>{pad("LVL", 5)}</span>
        <span>{pad("TIME", 7)}</span>
        <span>{sourceWidth > 0 ? ` ${pad("SOURCE", sourceWidth)}` : ""}</span>
        <span>{`  ${pad("MESSAGE", Math.max(7, width - 22))}`}</span>
      </div>
      <div
        ref={listRef}
        className="ascii-logviewer-list"
        role="log"
        aria-live={resolvedFollow ? "polite" : "off"}
        tabIndex={selectable ? 0 : undefined}
        onKeyDown={handleListKeyDown}
      >
        {visibleLines.length === 0 ? (
          <div className="ascii-logviewer-empty">{emptyMessage}</div>
        ) : (
          visibleLines.map((line, index) => {
            const lineId = getLineId(line, index);
            const selected = resolvedSelectedId === lineId;
            const bookmarked = bookmarkedSet.has(lineId);

            return (
              <div
                key={lineId}
                className={`ascii-logviewer-line ascii-logviewer-${line.level}${selected ? " ascii-logviewer-line-selected" : ""}${bookmarked ? " ascii-logviewer-line-bookmarked" : ""}`}
                onClick={() => setResolvedSelectedId(lineId)}
              >
                <span className="ascii-logviewer-mark">{`${selected ? ">" : " "}${bookmarked ? "*" : " "}`}</span>
                <span className="ascii-logviewer-level">[{levelLabels[line.level]}]</span>
                <span className="ascii-logviewer-time">{line.timestamp ? ` ${line.timestamp}` : ""}</span>
                <span className="ascii-logviewer-source">
                  {sourceWidth > 0 ? ` ${pad(line.source ?? "", sourceWidth)}` : ""}
                </span>
                <span className="ascii-logviewer-message">
                  {"  "}
                  {renderHighlightedText(line.message, query)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </AsciiWindow>
  );
}
