import React, { useRef, useState, useCallback, useEffect } from "react";
import { borders, repeatChar, type BorderStyle } from "../chars";

export interface AsciiScrollAreaProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
  border?: BorderStyle;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiScrollArea({
  children,
  width = 40,
  height = 10,
  border = "single",
  color,
  className,
  style,
}: AsciiScrollAreaProps) {
  const b = borders[border];
  const inner = width - 2;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollRatio, setScrollRatio] = useState(0);
  const [showBar, setShowBar] = useState(false);

  const updateScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const canScroll = el.scrollHeight > el.clientHeight;
    setShowBar(canScroll);
    if (canScroll) {
      setScrollRatio(el.scrollTop / (el.scrollHeight - el.clientHeight));
    }
  }, []);

  useEffect(() => {
    updateScroll();
    const el = scrollRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateScroll);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateScroll]);

  const trackHeight = height - 2;
  const thumbPos = Math.round(scrollRatio * (trackHeight - 1));

  const topLine = b.tl + repeatChar(b.h, inner) + b.tr;
  const botLine = b.bl + repeatChar(b.h, inner) + b.br;

  return (
    <div
      className={`ascii-lib ascii-scrollarea ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
    >
      <span>{topLine}</span>
      {"\n"}
      <div style={{ display: "flex" }}>
        <span>{b.v}</span>
        <div
          ref={scrollRef}
          className="ascii-scrollarea-viewport"
          style={{
            width: `${inner - (showBar ? 2 : 0)}ch`,
            height: `${trackHeight}lh`,
            overflowY: "auto",
            scrollbarWidth: "none",
          }}
          onScroll={updateScroll}
        >
          {children}
        </div>
        {showBar && (
          <span className="ascii-scrollarea-track" style={{ whiteSpace: "pre" }}>
            {Array.from({ length: trackHeight }).map((_, i) => (
              <React.Fragment key={i}>
                {i === thumbPos ? "█" : "░"}
                {i < trackHeight - 1 ? "\n" : ""}
              </React.Fragment>
            ))}
          </span>
        )}
        <span style={{ whiteSpace: "pre" }}>
          {Array.from({ length: trackHeight }).map((_, i) => (
            <React.Fragment key={i}>
              {b.v}
              {i < trackHeight - 1 ? "\n" : ""}
            </React.Fragment>
          ))}
        </span>
      </div>
      {"\n"}
      <span>{botLine}</span>
    </div>
  );
}
