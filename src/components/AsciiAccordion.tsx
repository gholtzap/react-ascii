import React, { useState, useId } from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

export interface AsciiAccordionItem {
  key: string;
  title: string;
  content: string;
}

export interface AsciiAccordionProps {
  items: AsciiAccordionItem[];
  width?: number;
  border?: BorderStyle;
  multiple?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiAccordion({
  items,
  width = 50,
  border = "single",
  multiple = false,
  className,
  style,
}: AsciiAccordionProps) {
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set());
  const idPrefix = useId();
  const b = borders[border];
  const inner = width - 2;

  const toggle = (key: string) => {
    setOpenKeys((prev) => {
      const next = new Set(multiple ? prev : []);
      if (prev.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div className={`ascii-lib ascii-accordion ${className ?? ""}`.trim()} style={style}>
      {items.map((item, i) => {
        const isOpen = openKeys.has(item.key);
        const arrow = isOpen ? "v" : ">";
        const headerId = `${idPrefix}-header-${item.key}`;
        const panelId = `${idPrefix}-panel-${item.key}`;

        const parts: string[] = [];

        // Top border (only for first item)
        if (i === 0) {
          parts.push(b.tl + repeatChar(b.h, inner) + b.tr);
          parts.push("\n");
        }

        // Content lines
        const contentParts: string[] = [];
        if (isOpen) {
          contentParts.push(b.lm + repeatChar(b.h, inner) + b.rm);
          const contentLines = item.content.split("\n");
          for (const cl of contentLines) {
            contentParts.push(b.v + pad(` ${cl}`, inner) + b.v);
          }
        }

        // Separator or bottom
        const bottomLine = i < items.length - 1
          ? b.lm + repeatChar(b.h, inner) + b.rm
          : b.bl + repeatChar(b.h, inner) + b.br;

        return (
          <React.Fragment key={item.key}>
            {parts.join("")}
            <button
              id={headerId}
              className="ascii-accordion-header"
              onClick={() => toggle(item.key)}
              aria-expanded={isOpen}
              aria-controls={panelId}
            >
              {b.v + pad(` ${arrow} ${item.title}`, inner) + b.v}
            </button>
            {"\n"}
            {isOpen && (
              <div id={panelId} role="region" aria-labelledby={headerId}>
                {contentParts.join("\n")}
                {"\n"}
              </div>
            )}
            {bottomLine}
            {i < items.length - 1 && "\n"}
          </React.Fragment>
        );
      })}
    </div>
  );
}
