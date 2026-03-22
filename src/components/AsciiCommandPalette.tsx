import React, { useState, useEffect, useCallback, useRef, useId } from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const inputId = useId();

  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const visible = filtered.slice(0, maxVisible);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
    }
  }, [open]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    },
    [open, onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, handleKeyDown]);

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, visible.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (visible[activeIndex]) {
          onSelect(visible[activeIndex].key);
          onClose();
        }
        break;
    }
  };

  if (!open) return null;

  const b = borders[border];
  const inner = width - 2;

  const topLine = b.tl + repeatChar(b.h, inner) + b.tr;
  const sepLine = b.lm + repeatChar(b.h, inner) + b.rm;
  const botLine = b.bl + repeatChar(b.h, inner) + b.br;

  return (
    <div
      ref={overlayRef}
      className="ascii-lib ascii-cmdpalette-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div className={`ascii-cmdpalette ${className ?? ""}`.trim()} style={style}>
        {topLine}
        {"\n"}
        {b.v + " "}
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          className="ascii-cmdpalette-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={true}
          aria-autocomplete="list"
          style={{ width: `${inner - 2}ch` }}
        />
        {" " + b.v}
        {"\n"}
        {sepLine}
        {"\n"}
        {visible.length === 0 ? (
          <>
            {b.v + pad("  No results", inner) + b.v}
            {"\n"}
          </>
        ) : (
          visible.map((item, i) => {
            const isActive = i === activeIndex;
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
                  className={`ascii-cmdpalette-item${isActive ? " ascii-cmdpalette-item-active" : ""}`}
                  role="option"
                  aria-selected={isActive}
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
        {botLine}
      </div>
    </div>
  );
}
