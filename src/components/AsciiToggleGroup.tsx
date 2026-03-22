import React from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

export interface AsciiToggleGroupItem {
  key: string;
  label: string;
  disabled?: boolean;
}

export interface AsciiToggleGroupProps {
  items: AsciiToggleGroupItem[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  border?: BorderStyle;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiToggleGroup({
  items,
  value,
  onChange,
  multiple = false,
  border = "single",
  className,
  style,
}: AsciiToggleGroupProps) {
  const b = borders[border];
  const selected = Array.isArray(value) ? value : value ? [value] : [];

  const handleClick = (key: string) => {
    if (multiple) {
      const next = selected.includes(key)
        ? selected.filter((k) => k !== key)
        : [...selected, key];
      onChange?.(next);
    } else {
      onChange?.(key);
    }
  };

  const cellWidths = items.map((item) => item.label.length + 2);

  let top = b.tl;
  let bot = b.bl;

  items.forEach((_, i) => {
    top += repeatChar(b.h, cellWidths[i]);
    top += i < items.length - 1 ? b.tm : b.tr;
    bot += repeatChar(b.h, cellWidths[i]);
    bot += i < items.length - 1 ? b.bm : b.br;
  });

  return (
    <div
      className={`ascii-lib ascii-toggle-group ${className ?? ""}`.trim()}
      style={style}
      role="group"
    >
      <span>{top}</span>
      {"\n"}
      <span>
        {items.map((item, i) => {
          const isActive = selected.includes(item.key);
          const label = isActive ? `[${item.label}]` : ` ${item.label} `;
          const prefix = i === 0 ? b.v : "";
          return (
            <React.Fragment key={item.key}>
              {prefix}
              <button
                type="button"
                className={`ascii-togglegroup-btn${isActive ? " ascii-togglegroup-btn-active" : ""}`}
                disabled={item.disabled}
                onClick={() => handleClick(item.key)}
                aria-pressed={isActive}
              >
                {pad(label, cellWidths[i], "center")}
              </button>
              {b.v}
            </React.Fragment>
          );
        })}
      </span>
      {"\n"}
      <span>{bot}</span>
    </div>
  );
}
