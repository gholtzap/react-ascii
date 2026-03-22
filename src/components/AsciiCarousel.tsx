import React, { useCallback, useEffect, useState } from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

export interface AsciiCarouselItem {
  key: string;
  content: string;
}

export interface AsciiCarouselProps {
  items: AsciiCarouselItem[];
  width?: number;
  height?: number;
  border?: BorderStyle;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiCarousel({
  items,
  width = 50,
  height = 5,
  border = "single",
  className,
  style,
}: AsciiCarouselProps) {
  const [index, setIndex] = useState(0);
  const b = borders[border];
  const inner = width - 2;

  useEffect(() => {
    if (items.length === 0) return;
    if (index < items.length) return;
    setIndex(items.length - 1);
  }, [index, items.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i === 0 ? items.length - 1 : i - 1));
  }, [items.length]);

  const next = useCallback(() => {
    setIndex((i) => (i === items.length - 1 ? 0 : i + 1));
  }, [items.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    if (e.key === "ArrowRight") { e.preventDefault(); next(); }
  };

  const current = items[index];
  if (!current) return null;

  const contentLines = current.content.split("\n");
  const lines: string[] = [];
  lines.push(b.tl + repeatChar(b.h, inner) + b.tr);

  for (let i = 0; i < height; i++) {
    const text = contentLines[i] ?? "";
    lines.push(b.v + pad(` ${text}`, inner) + b.v);
  }

  lines.push(b.lm + repeatChar(b.h, inner) + b.rm);

  const dots = items.map((_, i) => (i === index ? "●" : "○")).join(" ");
  const nav = `< ${dots} >`;
  lines.push(b.v + pad(nav, inner, "center") + b.v);
  lines.push(b.bl + repeatChar(b.h, inner) + b.br);

  return (
    <div
      className={`ascii-lib ascii-carousel ${className ?? ""}`.trim()}
      style={style}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={`Slide ${index + 1} of ${items.length}`}
    >
      <div style={{ whiteSpace: "pre" }}>
        {lines.slice(0, -3).join("\n")}
      </div>
      <div style={{ whiteSpace: "pre" }}>
        {lines[lines.length - 3]}
      </div>
      <div style={{ whiteSpace: "pre" }}>
        <span>{b.v}</span>
        <button type="button" className="ascii-carousel-nav" onClick={prev} aria-label="Previous slide">
          {"<"}
        </button>
        <span>{pad(` ${dots} `, inner - 4, "center")}</span>
        <button type="button" className="ascii-carousel-nav" onClick={next} aria-label="Next slide">
          {">"}
        </button>
        <span>{b.v}</span>
      </div>
      <div style={{ whiteSpace: "pre" }}>
        {lines[lines.length - 1]}
      </div>
    </div>
  );
}
