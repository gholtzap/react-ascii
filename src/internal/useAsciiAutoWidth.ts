import { ReactNode, RefObject, useEffect, useRef, useState } from "react";

interface UseAsciiAutoWidthOptions {
  content: ReactNode;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  padding?: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getLongestLineLength(content: ReactNode): number | null {
  if (typeof content === "string") {
    return Math.max(...content.split("\n").map((line) => line.length), 0);
  }

  if (typeof content === "number") {
    return String(content).length;
  }

  if (Array.isArray(content)) {
    const lengths = content
      .map((entry) => getLongestLineLength(entry))
      .filter((value): value is number => value !== null);

    if (lengths.length === 0) return null;

    return Math.max(...lengths);
  }

  return null;
}

export function useAsciiAutoWidth({
  content,
  width,
  minWidth = 16,
  maxWidth = 72,
  padding = 1,
}: UseAsciiAutoWidthOptions): {
  resolvedWidth: number;
  measureRef: RefObject<HTMLElement | null>;
  charMeasureRef: RefObject<HTMLElement | null>;
  shouldMeasure: boolean;
} {
  const estimate = getLongestLineLength(content);
  const initialWidth = width ?? clamp((estimate ?? minWidth - 2) + padding * 2 + 2, minWidth, maxWidth);
  const [resolvedWidth, setResolvedWidth] = useState(initialWidth);
  const measureRef = useRef<HTMLElement>(null);
  const charMeasureRef = useRef<HTMLElement>(null);
  const shouldMeasure = width === undefined && estimate === null;

  useEffect(() => {
    if (width !== undefined) {
      setResolvedWidth(width);
      return;
    }

    if (estimate !== null) {
      setResolvedWidth(clamp(estimate + padding * 2 + 2, minWidth, maxWidth));
      return;
    }

    if (!measureRef.current || !charMeasureRef.current || typeof ResizeObserver === "undefined") return;

    const updateWidth = () => {
      if (!measureRef.current || !charMeasureRef.current) return;

      const charWidth = charMeasureRef.current.getBoundingClientRect().width / 10 || 8;
      const measuredWidth = measureRef.current.getBoundingClientRect().width;
      const bodyChars = Math.ceil(measuredWidth / charWidth);
      setResolvedWidth(clamp(bodyChars + padding * 2 + 2, minWidth, maxWidth));
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(measureRef.current);
    observer.observe(charMeasureRef.current);

    return () => observer.disconnect();
  }, [content, estimate, maxWidth, minWidth, padding, width]);

  return {
    resolvedWidth,
    measureRef,
    charMeasureRef,
    shouldMeasure,
  };
}
