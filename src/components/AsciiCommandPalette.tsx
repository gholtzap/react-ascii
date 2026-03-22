import React, { useEffect, useId, useRef, useState } from "react";
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
  border?: BorderStyle;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiCommandPalette({
  open,
  onClose,
  onSelect,
  items,
  placeholder = "Type a command...",
  width = 50,
  maxVisible = 8,
  border = "round",
  className,
  style,
}: AsciiCommandPaletteProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const visible = filtered.slice(0, maxVisible);
  const {
    activeIndex,
    activeItem,
    moveNext,
    movePrev,
    reset,
  } = useAsciiListNavigation({
    items: visible,
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
  }, [open]);

  useEffect(() => {
    reset(0);
  }, [query, reset]);

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
          onSelect(activeItem.key);
          onClose();
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
          aria-label="Command palette"
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
            {visible.length === 0 ? (
              <>
                {b.v + pad("  No results", inner) + b.v}
                {"\n"}
              </>
            ) : (
              visible.map((item, index) => {
                const isActive = index === activeIndex;
                const marker = isActive ? ">" : " ";
                const shortcut = item.shortcut ? `  ${item.shortcut}` : "";
                const labelSpace = inner - 2 - shortcut.length;
                const label = item.label.length > labelSpace
                  ? item.label.slice(0, labelSpace - 1) + "…"
                  : item.label;
                const line =
                  b.v +
                  pad(`${marker} ${label}`, inner - shortcut.length) +
                  shortcut +
                  b.v;

                return (
                  <React.Fragment key={item.key}>
                    <div
                      id={`${listboxId}-${index}`}
                      className={`ascii-cmdpalette-item${isActive ? " ascii-cmdpalette-item-active" : ""}`}
                      role="option"
                      aria-selected={isActive}
                      onMouseEnter={() => reset(index)}
                      onClick={() => {
                        onSelect(item.key);
                        onClose();
                      }}
                    >
                      {line}
                    </div>
                    {"\n"}
                  </React.Fragment>
                );
              })
            )}
          </div>
          {botLine}
        </div>
      </div>
    </AsciiPortal>
  );
}
