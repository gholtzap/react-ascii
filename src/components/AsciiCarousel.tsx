import React, { useCallback, useEffect, useState, useRef } from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";
import { useReducedMotion } from "../internal/useReducedMotion";

export interface AsciiCarouselItem {
  key: string;
  content: string;
}

export interface AsciiCarouselProps {
  items: AsciiCarouselItem[];
  width?: number;
  height?: number;
  border?: BorderStyle;
  animate?: boolean;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const GLITCH_CHARS = "░▒▓█▀▄▌▐─│┼╬";

export function AsciiCarousel({
  items,
  width = 50,
  height = 5,
  border = "single",
  animate = false,
  color,
  className,
  style,
}: AsciiCarouselProps) {
  const [index, setIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [transitionFrame, setTransitionFrame] = useState(0);
  const reduced = useReducedMotion();
  const prevContentRef = useRef<string[]>([]);
  const b = borders[border];
  const inner = width - 2;

  useEffect(() => {
    if (items.length === 0) return;
    if (index < items.length) return;
    setIndex(items.length - 1);
  }, [index, items.length]);

  const startTransition = useCallback((newIndex: number) => {
    if (animate && !reduced) {
      const current = items[index];
      if (current) {
        prevContentRef.current = current.content.split("\n");
      }
      setTransitioning(true);
      setTransitionFrame(0);
      setIndex(newIndex);
    } else {
      setIndex(newIndex);
    }
  }, [animate, reduced, index, items]);

  useEffect(() => {
    if (!transitioning) return;
    if (transitionFrame >= 6) {
      setTransitioning(false);
      return;
    }
    const timer = setTimeout(() => setTransitionFrame((f) => f + 1), 40);
    return () => clearTimeout(timer);
  }, [transitioning, transitionFrame]);

  const prev = useCallback(() => {
    startTransition(index === 0 ? items.length - 1 : index - 1);
  }, [index, items.length, startTransition]);

  const next = useCallback(() => {
    startTransition(index === items.length - 1 ? 0 : index + 1);
  }, [index, items.length, startTransition]);

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
    let text = contentLines[i] ?? "";
    if (transitioning && animate && !reduced) {
      const progress = transitionFrame / 6;
      const chars = (` ${text}`).split("");
      text = " " + chars.slice(1).map((ch, ci) => {
        if (ch === " ") return " ";
        const threshold = ci / chars.length;
        return progress > threshold + 0.2 ? ch : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
      }).join("");
    } else {
      text = ` ${text}`;
    }
    lines.push(b.v + pad(text, inner) + b.v);
  }

  lines.push(b.lm + repeatChar(b.h, inner) + b.rm);

  const dots = items.map((_, i) => (i === index ? "●" : "○")).join(" ");

  lines.push(b.bl + repeatChar(b.h, inner) + b.br);

  return (
    <div
      className={`ascii-lib ascii-carousel ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={`Slide ${index + 1} of ${items.length}`}
    >
      <div style={{ whiteSpace: "pre" }}>
        {lines.slice(0, -2).join("\n")}
      </div>
      <div style={{ whiteSpace: "pre" }}>
        {lines[lines.length - 2]}
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
