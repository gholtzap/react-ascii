import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

export interface BorderDrawInResult {
  progress: number;
  done: boolean;
}

export function useBorderDrawIn(
  totalChars: number,
  speed: number = 8,
  enabled: boolean = true,
): BorderDrawInResult {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(enabled && !reduced ? 0 : 1);
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    if (!enabled || reduced) { setProgress(1); return; }
    setProgress(0);
  }, [enabled, reduced]);

  useEffect(() => {
    if (!enabled || reduced || progress >= 1) return;
    const charsPerTick = Math.max(1, Math.ceil(totalChars / (totalChars * speed / 16)));
    const timer = setInterval(() => {
      setProgress((p) => Math.min(1, p + charsPerTick / totalChars));
    }, speed);
    return () => clearInterval(timer);
  }, [progress, totalChars, speed, enabled, reduced]);

  return { progress: Math.min(1, progress), done: progress >= 1 };
}
