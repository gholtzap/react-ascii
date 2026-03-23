import { useState, useEffect } from "react";
import { useReducedMotion } from "./useReducedMotion";

export function useLineReveal(
  totalLines: number,
  speed: number = 50,
  enabled: boolean = true,
): number {
  const reduced = useReducedMotion();
  const [visibleLines, setVisibleLines] = useState(
    enabled && !reduced ? 0 : totalLines
  );

  useEffect(() => {
    if (!enabled || reduced) { setVisibleLines(totalLines); return; }
    setVisibleLines(0);
    let line = 0;
    const timer = setInterval(() => {
      line++;
      setVisibleLines(line);
      if (line >= totalLines) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [totalLines, speed, enabled, reduced]);

  return Math.min(visibleLines, totalLines);
}
