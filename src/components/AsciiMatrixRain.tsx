import React, { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "../internal/useReducedMotion";

export interface AsciiMatrixRainProps {
  width?: number;
  height?: number;
  speed?: number;
  chars?: string;
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;':\",./<>?░▒▓█";

export function AsciiMatrixRain({
  width = 40,
  height = 10,
  speed = 80,
  chars = DEFAULT_CHARS,
  className,
  style,
}: AsciiMatrixRainProps) {
  const reduced = useReducedMotion();
  const [grid, setGrid] = useState<string[][]>(() =>
    Array.from({ length: height }, () =>
      Array.from({ length: width }, () => " ")
    )
  );
  const dropsRef = useRef<number[]>(
    Array.from({ length: width }, () => Math.random() * -height)
  );

  useEffect(() => {
    if (reduced) return;

    const timer = setInterval(() => {
      const drops = dropsRef.current;
      setGrid((prev) => {
        const next = prev.map((row) => [...row]);

        for (let col = 0; col < width; col++) {
          const dropRow = Math.floor(drops[col]);

          for (let row = 0; row < height; row++) {
            const distFromHead = dropRow - row;
            if (distFromHead < 0 || distFromHead > height * 0.6) {
              if (Math.random() < 0.05) {
                next[row][col] = chars[Math.floor(Math.random() * chars.length)];
              } else {
                next[row][col] = " ";
              }
            } else if (distFromHead === 0) {
              next[row][col] = chars[Math.floor(Math.random() * chars.length)];
            } else if (distFromHead < 3) {
              next[row][col] = chars[Math.floor(Math.random() * chars.length)];
            } else {
              if (Math.random() < 0.15) {
                next[row][col] = " ";
              } else if (Math.random() < 0.3) {
                next[row][col] = chars[Math.floor(Math.random() * chars.length)];
              }
            }
          }

          drops[col] += 0.5 + Math.random() * 0.5;
          if (drops[col] > height + 10) {
            drops[col] = Math.random() * -height;
          }
        }

        return next;
      });
    }, speed);

    return () => clearInterval(timer);
  }, [width, height, speed, chars, reduced]);

  if (reduced) {
    return (
      <div
        className={`ascii-lib ascii-matrix-rain ${className ?? ""}`.trim()}
        style={{ display: "inline-block", whiteSpace: "pre", ...style }}
        aria-hidden="true"
      >
        {Array.from({ length: height }, () => "░".repeat(width)).join("\n")}
      </div>
    );
  }

  return (
    <div
      className={`ascii-lib ascii-matrix-rain ${className ?? ""}`.trim()}
      style={{ display: "inline-block", whiteSpace: "pre", ...style }}
      aria-hidden="true"
    >
      {grid.map((row) => row.join("")).join("\n")}
    </div>
  );
}
