import React from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

export interface AsciiButtonGroupItem {
  key: string;
  label: string;
  disabled?: boolean;
}

export interface AsciiButtonGroupProps {
  items: AsciiButtonGroupItem[];
  value?: string;
  onChange?: (key: string) => void;
  border?: BorderStyle;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiButtonGroup({
  items,
  value,
  onChange,
  border = "single",
  className,
  style,
}: AsciiButtonGroupProps) {
  const b = borders[border];

  const cellWidths = items.map((item) => item.label.length + 2);

  let top = b.tl;
  let mid = "";
  let bot = b.bl;

  items.forEach((item, i) => {
    const w = cellWidths[i];
    top += repeatChar(b.h, w);
    top += i < items.length - 1 ? b.tm : b.tr;
    bot += repeatChar(b.h, w);
    bot += i < items.length - 1 ? b.bm : b.br;

    const isActive = item.key === value;
    const label = isActive ? `>${item.label}<` : ` ${item.label} `;
    mid += b.v + pad(label, w, "center");
  });
  mid += b.v;

  return (
    <div
      className={`ascii-lib ascii-button-group ${className ?? ""}`.trim()}
      style={style}
      role="group"
    >
      <span>{top}</span>
      {"\n"}
      <span>
        {items.map((item, i) => {
          const w = cellWidths[i];
          const isActive = item.key === value;
          const label = isActive ? `>${item.label}<` : ` ${item.label} `;
          const prefix = i === 0 ? b.v : "";
          return (
            <React.Fragment key={item.key}>
              {prefix}
              <button
                type="button"
                className={`ascii-btngroup-btn${isActive ? " ascii-btngroup-btn-active" : ""}`}
                disabled={item.disabled}
                onClick={() => onChange?.(item.key)}
                aria-pressed={isActive}
              >
                {pad(label, w, "center")}
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
