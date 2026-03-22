import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { borders, pad, repeatChar, type BorderStyle } from "../chars";
import { AsciiPortal } from "../internal/AsciiPortal";
import { useAsciiListNavigation } from "../internal/useAsciiListNavigation";
import { useAsciiOverlay } from "../internal/useAsciiOverlay";

export interface AsciiCommandItem {
  key: string;
  label: string;
  group?: string;
  shortcut?: string;
}

export interface AsciiCommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onSelect: (key: string) => void;
  items: AsciiCommandItem[];
  placeholder?: string;
  width?: number;
  maxVisible?: number;
  recentLimit?: number;
  showRecent?: boolean;
  emptyMessage?: string;
  ariaLabel?: string;
  border?: BorderStyle;
  className?: string;
  style?: React.CSSProperties;
}

interface VisibleCommand extends AsciiCommandItem {
  section: string;
  recent?: boolean;
}

function scoreContains(value: string, query: string) {
  const matchIndex = value.indexOf(query);

  if (matchIndex === -1) return null;

  return 320 - matchIndex * 4 - (value.length - query.length);
}

function scoreFuzzy(value: string, query: string) {
  let lastIndex = -1;
  let gaps = 0;

  for (const char of query) {
    const nextIndex = value.indexOf(char, lastIndex + 1);

    if (nextIndex === -1) return null;

    if (lastIndex >= 0) {
      gaps += nextIndex - lastIndex - 1;
    }

    lastIndex = nextIndex;
  }

  return 180 - gaps - Math.max(0, value.length - query.length);
}

function getCommandScore(item: AsciiCommandItem, query: string, recentIndex: number) {
  if (!query) {
    return recentIndex >= 0 ? 120 - recentIndex * 10 : 0;
  }

  const label = item.label.toLowerCase();
  const group = item.group?.toLowerCase() ?? "";
  const shortcut = item.shortcut?.toLowerCase() ?? "";
  const scores = [
    scoreContains(label, query),
    scoreContains(group, query) !== null ? (scoreContains(group, query) ?? 0) - 60 : null,
    scoreContains(shortcut, query) !== null ? (scoreContains(shortcut, query) ?? 0) - 90 : null,
    scoreFuzzy(label, query),
  ].filter((value): value is number => value !== null);

  if (scores.length === 0) return null;

  const baseScore = Math.max(...scores);
  const recentBonus = recentIndex >= 0 ? Math.max(0, 28 - recentIndex * 4) : 0;

  return baseScore + recentBonus;
}

function createSections(
  items: AsciiCommandItem[],
  query: string,
  maxVisible: number,
  recentKeys: string[],
  showRecent: boolean,
  recentLimit: number
) {
  const recentLookup = new Map(recentKeys.map((key, index) => [key, index]));
  const ranked = items
    .map((item) => ({
      item,
      recentIndex: recentLookup.get(item.key) ?? -1,
      score: getCommandScore(item, query, recentLookup.get(item.key) ?? -1),
    }))
    .filter((entry) => entry.score !== null)
    .sort((left, right) => {
      if ((right.score ?? 0) !== (left.score ?? 0)) {
        return (right.score ?? 0) - (left.score ?? 0);
      }

      return left.item.label.localeCompare(right.item.label);
    });

  const sections = new Map<string, VisibleCommand[]>();
  const usedKeys = new Set<string>();
  let visibleCount = 0;

  if (!query && showRecent) {
    const recentItems = ranked
      .filter((entry) => entry.recentIndex >= 0)
      .sort((left, right) => left.recentIndex - right.recentIndex)
      .slice(0, recentLimit);

    if (recentItems.length > 0) {
      sections.set("Recent", []);

      recentItems.forEach(({ item }) => {
        if (visibleCount >= maxVisible) return;
        sections.get("Recent")?.push({
          ...item,
          section: "Recent",
          recent: true,
        });
        usedKeys.add(item.key);
        visibleCount += 1;
      });
    }
  }

  ranked.forEach(({ item }) => {
    if (visibleCount >= maxVisible || usedKeys.has(item.key)) return;

    const section = item.group?.trim() || "Commands";

    if (!sections.has(section)) {
      sections.set(section, []);
    }

    sections.get(section)?.push({
      ...item,
      section,
    });
    visibleCount += 1;
  });

  return Array.from(sections.entries()).map(([label, sectionItems]) => ({
    label,
    items: sectionItems,
  }));
}

export function AsciiCommandPalette({
  open,
  onClose,
  onSelect,
  items,
  placeholder = "Type a command...",
  width = 50,
  maxVisible = 8,
  recentLimit = 4,
  showRecent = true,
  emptyMessage = "No results",
  ariaLabel = "Command palette",
  border = "round",
  className,
  style,
}: AsciiCommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [recentKeys, setRecentKeys] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const sections = useMemo(
    () => createSections(items, query.trim().toLowerCase(), maxVisible, recentKeys, showRecent, recentLimit),
    [items, maxVisible, query, recentKeys, recentLimit, showRecent]
  );
  const visibleItems = useMemo(
    () => sections.reduce<VisibleCommand[]>((allItems, section) => [...allItems, ...section.items], []),
    [sections]
  );
  const {
    activeIndex,
    activeItem,
    moveNext,
    movePrev,
    reset,
  } = useAsciiListNavigation<VisibleCommand>({
    items: visibleItems,
    loop: true,
  });

  useAsciiOverlay({
    open,
    onClose,
    contentRef,
    initialFocusRef: inputRef,
  });

  useEffect(() => {
    if (!open) return;
    setQuery("");
    reset(0);
  }, [open, reset]);

  useEffect(() => {
    if (!open) return;
    reset(0);
  }, [open, query, reset, sections]);

  const selectItem = (item: AsciiCommandItem) => {
    setRecentKeys((currentKeys) => [
      item.key,
      ...currentKeys.filter((key) => key !== item.key),
    ].slice(0, recentLimit));
    onSelect(item.key);
    onClose();
  };

  const handleInputKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveNext();
        break;
      case "ArrowUp":
        event.preventDefault();
        movePrev();
        break;
      case "Enter":
        event.preventDefault();
        if (activeItem) {
          selectItem(activeItem);
        }
        break;
    }
  };

  if (!open) return null;

  const b = borders[border];
  const inner = width - 2;
  const activeId = activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined;
  const topLine = b.tl + repeatChar(b.h, inner) + b.tr;
  const sepLine = b.lm + repeatChar(b.h, inner) + b.rm;
  const botLine = b.bl + repeatChar(b.h, inner) + b.br;
  let itemIndex = 0;

  return (
    <AsciiPortal>
      <div
        className="ascii-lib ascii-cmdpalette-overlay"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div
          ref={contentRef}
          className={`ascii-cmdpalette ${className ?? ""}`.trim()}
          style={style}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          tabIndex={-1}
        >
          {topLine}
          {"\n"}
          {b.v + " "}
          <input
            ref={inputRef}
            type="text"
            className="ascii-cmdpalette-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={placeholder}
            role="combobox"
            aria-expanded={true}
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-activedescendant={activeId}
            style={{ width: `${inner - 2}ch` }}
          />
          {" " + b.v}
          {"\n"}
          {sepLine}
          {"\n"}
          <div id={listboxId} role="listbox">
            {visibleItems.length === 0 ? (
              <>
                {b.v + pad(`  ${emptyMessage}`, inner) + b.v}
                {"\n"}
              </>
            ) : (
              sections.map((section) => (
                <React.Fragment key={section.label}>
                  {b.v + pad(` ${section.label.toUpperCase()}`, inner) + b.v}
                  {"\n"}
                  {section.items.map((item) => {
                    const currentIndex = itemIndex++;
                    const isActive = currentIndex === activeIndex;
                    const marker = isActive ? ">" : " ";
                    const shortcut = item.shortcut ? `  ${item.shortcut}` : "";
                    const recentBadge = item.recent ? " *" : "";
                    const reservedWidth = shortcut.length + recentBadge.length;
                    const labelSpace = Math.max(1, inner - 2 - reservedWidth);
                    const label = item.label.length > labelSpace
                      ? item.label.slice(0, labelSpace - 1) + "…"
                      : item.label;

                    return (
                      <React.Fragment key={item.key}>
                        <div
                          id={`${listboxId}-${currentIndex}`}
                          className={`ascii-cmdpalette-item${isActive ? " ascii-cmdpalette-item-active" : ""}${item.recent ? " ascii-cmdpalette-item-recent" : ""}`}
                          role="option"
                          aria-selected={isActive}
                          onMouseEnter={() => reset(currentIndex)}
                          onClick={() => selectItem(item)}
                        >
                          {b.v}
                          {pad(`${marker} ${label}`, inner - reservedWidth)}
                          {recentBadge}
                          {shortcut}
                          {b.v}
                        </div>
                        {"\n"}
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              ))
            )}
          </div>
          {botLine}
        </div>
      </div>
    </AsciiPortal>
  );
}
