import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

export function useAnimatedValue(
  target: number,
  duration: number = 500,
  enabled: boolean = true,
): number {
  const reduced = useReducedMotion();
  const [current, setCurrent] = useState(enabled && !reduced ? 0 : target);
  const startRef = useRef(0);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (!enabled || reduced) { setCurrent(target); return; }

    startRef.current = current;
    startTimeRef.current = performance.now();

    let raf: number;
    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = startRef.current + (target - startRef.current) * eased;
      setCurrent(value);
      if (progress < 1) raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, enabled, reduced]);

  return current;
}
