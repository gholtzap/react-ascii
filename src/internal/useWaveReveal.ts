import { useState, useEffect } from "react";
import { useReducedMotion } from "./useReducedMotion";

export function useWaveReveal(
  rows: number,
  cols: number,
  speed: number = 40,
  enabled: boolean = true,
): number {
  const reduced = useReducedMotion();
  const totalDiags = rows + cols - 1;
  const [revealed, setRevealed] = useState(enabled && !reduced ? 0 : totalDiags);

  useEffect(() => {
    if (!enabled || reduced) { setRevealed(totalDiags); return; }
    setRevealed(0);
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setRevealed(step);
      if (step >= totalDiags) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [rows, cols, speed, enabled, reduced, totalDiags]);

  return revealed;
}
