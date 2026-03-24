import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { borders, pad, repeatChar, type BorderStyle } from "../chars";
import { useAsciiListNavigation } from "../internal/useAsciiListNavigation";
import { useDismissableLayer } from "../internal/useDismissableLayer";

export interface AsciiComboboxOption {
  value: string;
  label: string;
}

export interface AsciiComboboxProps {
  options: AsciiComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  width?: number;
  border?: BorderStyle;
  disabled?: boolean;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiCombobox({
  options,
  value,
  onChange,
  placeholder = "Search...",
  width = 30,
  border = "single",
  disabled,
  color,
  className,
  style,
}: AsciiComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();
  const b = borders[border];
  const inner = width - 2;

  const filtered = useMemo(
    () => options.filter((option) =>
      option.label.toLowerCase().includes(query.toLowerCase())
    ),
    [options, query]
  );
  const selected = options.find((option) => option.value === value);
  const {
    activeIndex,
    activeItem,
    moveNext,
    movePrev,
    moveFirst,
    moveLast,
    setActiveIndex,
    reset,
  } = useAsciiListNavigation({
    items: filtered,
    loop: true,
  });

  useEffect(() => {
    if (open) reset(0);
  }, [open, query]);

  useDismissableLayer({
    open,
    onDismiss: () => setOpen(false),
    refs: [ref],
  });

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        moveNext();
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        movePrev();
        break;
      case "Home":
        if (open) {
          event.preventDefault();
          moveFirst();
        }
        break;
      case "End":
        if (open) {
          event.preventDefault();
          moveLast();
        }
        break;
      case "Enter":
        event.preventDefault();
        if (open && activeItem) {
          onChange?.(activeItem.value);
          setQuery("");
          setOpen(false);
        }
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        break;
    }
  };

  const topLine = b.tl + repeatChar(b.h, inner) + b.tr;
  const botLine = b.bl + repeatChar(b.h, inner) + b.br;
  const activeId = open && activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined;

  return (
    <div
      ref={ref}
      className={`ascii-lib ascii-combobox-wrapper ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
      onKeyDown={handleKeyDown}
    >
      <div className="ascii-combobox-trigger">
        <span>{topLine}</span>
        {"\n"}
        <span>{b.v} </span>
        <input
          ref={inputRef}
          className="ascii-combobox-input"
          style={{ width: `${inner - 4}ch` }}
          placeholder={selected ? selected.label : placeholder}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          disabled={disabled}
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={activeId}
        />
        <span> {open ? "^" : "v"} </span>
        <span>{b.v}</span>
        {"\n"}
        <span>{botLine}</span>
      </div>

      {open && filtered.length > 0 && (
        <div id={listboxId} className="ascii-combobox-dropdown" role="listbox">
          {b.tl + repeatChar(b.h, inner) + b.tr}
          {"\n"}
          {filtered.map((option, index) => {
            const marker = option.value === value ? ">" : " ";
            const isActive = index === activeIndex;
            const line = b.v + pad(`${marker} ${option.label}`, inner) + b.v;

            return (
              <React.Fragment key={option.value}>
                <div
                  id={`${listboxId}-${index}`}
                  className={`ascii-combobox-option${isActive ? " ascii-combobox-option-active" : ""}`}
                  role="option"
                  aria-selected={option.value === value}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => {
                    onChange?.(option.value);
                    setQuery("");
                    setOpen(false);
                  }}
                >
                  {line}
                </div>
                {"\n"}
              </React.Fragment>
            );
          })}
          {b.bl + repeatChar(b.h, inner) + b.br}
        </div>
      )}
    </div>
  );
}
