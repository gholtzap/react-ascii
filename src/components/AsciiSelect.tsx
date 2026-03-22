import React, { useState, useRef, useEffect, useCallback } from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

export interface AsciiSelectOption {
  value: string;
  label: string;
}

export interface AsciiSelectProps {
  options: AsciiSelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  width?: number;
  border?: BorderStyle;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  width = 30,
  border = "single",
  disabled,
  className,
  style,
}: AsciiSelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const b = borders[border];
  const inner = width - 2;

  const selected = options.find((o) => o.value === value);
  const displayText = selected ? selected.label : placeholder;

  // Close on outside click — only when open
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

  // Set initial active index when opening
  useEffect(() => {
    if (open) {
      const selectedIdx = options.findIndex((o) => o.value === value);
      setActiveIndex(selectedIdx >= 0 ? selectedIdx : 0);
    }
  }, [open, options, value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) {
          setOpen(true);
        } else {
          setActiveIndex((i) => Math.min(i + 1, options.length - 1));
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (open) {
          setActiveIndex((i) => Math.max(i - 1, 0));
        }
        break;
      case "Home":
        if (open) {
          e.preventDefault();
          setActiveIndex(0);
        }
        break;
      case "End":
        if (open) {
          e.preventDefault();
          setActiveIndex(options.length - 1);
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open && activeIndex >= 0) {
          onChange?.(options[activeIndex].value);
          setOpen(false);
        } else {
          setOpen(true);
        }
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          setOpen(false);
        }
        break;
    }
  };

  const arrow = open ? "^" : "v";
  const triggerLine =
    b.v + pad(` ${displayText}`, inner - 2) + ` ${arrow} ` + b.v;

  return (
    <div
      ref={ref}
      className={`ascii-lib ascii-select-wrapper ${className ?? ""}`.trim()}
      style={style}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className="ascii-select-trigger"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {b.tl + repeatChar(b.h, inner) + b.tr}
        {"\n"}
        {triggerLine}
        {"\n"}
        {b.bl + repeatChar(b.h, inner) + b.br}
      </button>

      {open && (
        <div className="ascii-select-dropdown" role="listbox" tabIndex={-1}>
          {b.tl + repeatChar(b.h, inner) + b.tr}
          {"\n"}
          {options.map((opt, i) => {
            const marker = opt.value === value ? ">" : " ";
            const line = b.v + pad(`${marker} ${opt.label}`, inner) + b.v;
            const isActive = i === activeIndex;
            return (
              <React.Fragment key={opt.value}>
                <div
                  className={`ascii-select-option${isActive ? " ascii-select-option-active" : ""}`}
                  role="option"
                  aria-selected={opt.value === value}
                  onClick={() => {
                    onChange?.(opt.value);
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
