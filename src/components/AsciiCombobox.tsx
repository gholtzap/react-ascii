import React, { useState, useRef, useEffect, useCallback } from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

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
  className,
  style,
}: AsciiComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const b = borders[border];
  const inner = width - 2;

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase())
  );

  const selected = options.find((o) => o.value === value);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open, handleClickOutside]);

  useEffect(() => {
    if (open) setActiveIndex(0);
  }, [open, query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) setOpen(true);
        else setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (open) setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (open && filtered[activeIndex]) {
          onChange?.(filtered[activeIndex].value);
          setQuery("");
          setOpen(false);
        }
        break;
      case "Escape":
        if (open) { e.preventDefault(); setOpen(false); }
        break;
    }
  };

  const topLine = b.tl + repeatChar(b.h, inner) + b.tr;
  const botLine = b.bl + repeatChar(b.h, inner) + b.br;

  return (
    <div
      ref={ref}
      className={`ascii-lib ascii-combobox-wrapper ${className ?? ""}`.trim()}
      style={style}
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
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          disabled={disabled}
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
        />
        <span> {open ? "^" : "v"} </span>
        <span>{b.v}</span>
        {"\n"}
        <span>{botLine}</span>
      </div>

      {open && filtered.length > 0 && (
        <div className="ascii-combobox-dropdown" role="listbox">
          {b.tl + repeatChar(b.h, inner) + b.tr}
          {"\n"}
          {filtered.map((opt, i) => {
            const marker = opt.value === value ? ">" : " ";
            const isActive = i === activeIndex;
            const line = b.v + pad(`${marker} ${opt.label}`, inner) + b.v;
            return (
              <React.Fragment key={opt.value}>
                <div
                  className={`ascii-combobox-option${isActive ? " ascii-combobox-option-active" : ""}`}
                  role="option"
                  aria-selected={opt.value === value}
                  onClick={() => {
                    onChange?.(opt.value);
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
