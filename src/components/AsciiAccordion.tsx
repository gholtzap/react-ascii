import React, { useState, useId, useEffect } from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";
import { useReducedMotion } from "../internal/useReducedMotion";

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
  animate?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

function AnimatedContent({
  lines,
  animate,
}: {
  lines: string[];
  animate: boolean;
}) {
  const reduced = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(animate && !reduced ? 0 : lines.length);

  useEffect(() => {
    if (!animate || reduced) { setVisibleCount(lines.length); return; }
    setVisibleCount(0);
    let count = 0;
    const timer = setInterval(() => {
      count++;
      setVisibleCount(count);
      if (count >= lines.length) clearInterval(timer);
    }, 35);
    return () => clearInterval(timer);
  }, [lines.length, animate, reduced]);

  return (
    <>
      {lines.slice(0, visibleCount).map((line, i) => (
        <React.Fragment key={i}>
          {line}
          {i < visibleCount - 1 && "\n"}
        </React.Fragment>
      ))}
      {visibleCount < lines.length && "\n" + " ".repeat(lines[0]?.length ?? 0)}
    </>
  );
}

export function AsciiAccordion({
  items,
  width = 50,
  border = "single",
  multiple = false,
  animate = false,
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

        if (i === 0) {
          parts.push(b.tl + repeatChar(b.h, inner) + b.tr);
          parts.push("\n");
        }

        const contentParts: string[] = [];
        if (isOpen) {
          contentParts.push(b.lm + repeatChar(b.h, inner) + b.rm);
          const contentLines = item.content.split("\n");
          for (const cl of contentLines) {
            contentParts.push(b.v + pad(` ${cl}`, inner) + b.v);
          }
        }

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
                {animate ? (
                  <AnimatedContent lines={contentParts} animate={animate} />
                ) : (
                  contentParts.join("\n")
                )}
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
