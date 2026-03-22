import React, { useState, useCallback, useRef } from "react";

export interface AsciiResizableProps {
  left: React.ReactNode;
  right: React.ReactNode;
  width?: number;
  initialSplit?: number;
  minLeft?: number;
  minRight?: number;
  dividerChar?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiResizable({
  left,
  right,
  width,
  initialSplit = 50,
  minLeft = 10,
  minRight = 10,
  dividerChar = "│",
  className,
  style,
}: AsciiResizableProps) {
  const [split, setSplit] = useState(initialSplit);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragging.current = true;

      const handleMove = (ev: MouseEvent) => {
        if (!dragging.current || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        const pct = Math.max(minLeft, Math.min(100 - minRight, (x / rect.width) * 100));
        setSplit(pct);
      };

      const handleUp = () => {
        dragging.current = false;
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleUp);
      };

      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleUp);
    },
    [minLeft, minRight]
  );

  return (
    <div
      ref={containerRef}
      className={`ascii-lib ascii-resizable ${className ?? ""}`.trim()}
      style={{
        display: "flex",
        width: width ? `${width}ch` : "100%",
        ...style,
      }}
    >
      <div className="ascii-resizable-left" style={{ width: `${split}%`, overflow: "auto" }}>
        {left}
      </div>
      <div
        className="ascii-resizable-divider"
        onMouseDown={handleMouseDown}
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={Math.round(split)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            setSplit((s) => Math.max(minLeft, s - 2));
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            setSplit((s) => Math.min(100 - minRight, s + 2));
          }
        }}
      >
        {dividerChar}
      </div>
      <div className="ascii-resizable-right" style={{ flex: 1, overflow: "auto" }}>
        {right}
      </div>
    </div>
  );
}
