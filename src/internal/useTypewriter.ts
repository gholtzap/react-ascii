import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

export function useTypewriter(
  text: string,
  speed: number = 30,
  enabled: boolean = true,
): { displayed: string; done: boolean } {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const prevText = useRef(text);

  useEffect(() => {
    if (text !== prevText.current) {
      setIndex(0);
      prevText.current = text;
    }
  }, [text]);

  useEffect(() => {
    if (!enabled || reduced || index >= text.length) return;
    const timer = setTimeout(() => setIndex((i) => i + 1), speed);
    return () => clearTimeout(timer);
  }, [index, text, speed, enabled, reduced]);

  if (!enabled || reduced) return { displayed: text, done: true };
  return { displayed: text.slice(0, index), done: index >= text.length };
}
