import React, { useState, useRef, useEffect, useCallback } from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

export interface AsciiDropdownMenuItem {
  key: string;
  label: string;
  disabled?: boolean;
  danger?: boolean;
  separator?: boolean;
}

export interface AsciiDropdownMenuProps {
  items: AsciiDropdownMenuItem[];
  onSelect: (key: string) => void;
  trigger?: string;
  width?: number;
  border?: BorderStyle;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiDropdownMenu({
  items,
  onSelect,
  trigger = "⋮",
  width = 24,
  border = "single",
  className,
  style,
}: AsciiDropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const b = borders[border];
  const inner = width - 2;

  const actionItems = items.filter((item) => !item.separator);

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
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) {
          setOpen(true);
        } else {
          setActiveIndex((i) => {
            let next = i + 1;
            while (next < actionItems.length && actionItems[next].disabled) next++;
            return next < actionItems.length ? next : i;
          });
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (open) {
          setActiveIndex((i) => {
            let next = i - 1;
            while (next >= 0 && actionItems[next].disabled) next--;
            return next >= 0 ? next : i;
          });
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
          setActiveIndex(actionItems.length - 1);
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open && activeIndex >= 0 && !actionItems[activeIndex].disabled) {
          onSelect(actionItems[activeIndex].key);
          setOpen(false);
        } else if (!open) {
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

  let actionIdx = 0;

  return (
    <div
      ref={ref}
      className={`ascii-lib ascii-dropdown-wrapper ${className ?? ""}`.trim()}
      style={style}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className="ascii-dropdown-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Actions menu"
      >
        [{trigger}]
      </button>

      {open && (
        <div className="ascii-dropdown-menu" role="menu" tabIndex={-1}>
          {b.tl + repeatChar(b.h, inner) + b.tr}
          {"\n"}
          {items.map((item, i) => {
            if (item.separator) {
              return (
                <React.Fragment key={`sep-${i}`}>
                  {b.lm + repeatChar(b.h, inner) + b.rm}
                  {"\n"}
                </React.Fragment>
              );
            }

            const currentActionIdx = actionIdx++;
            const isActive = currentActionIdx === activeIndex;
            const marker = isActive ? ">" : " ";
            const line = b.v + pad(`${marker} ${item.label}`, inner) + b.v;

            return (
              <React.Fragment key={item.key}>
                <div
                  className={`ascii-dropdown-item${isActive ? " ascii-dropdown-item-active" : ""}${item.disabled ? " ascii-dropdown-item-disabled" : ""}`}
                  role="menuitem"
                  aria-disabled={item.disabled}
                  onClick={() => {
                    if (!item.disabled) {
                      onSelect(item.key);
                      setOpen(false);
                    }
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
