import { useState, useEffect } from "react";
import { useReducedMotion } from "./useReducedMotion";

const GLITCH_CHARS = "░▒▓█▀▄▌▐─│┌┐└┘├┤┬┴┼╔╗╚╝═║@#$%&*!?<>{}[]";

export function useGlitchText(
  text: string,
  duration: number = 600,
  enabled: boolean = true,
): string {
  const reduced = useReducedMotion();
  const [output, setOutput] = useState(text);
  const [active, setActive] = useState(enabled);

  useEffect(() => {
    if (!enabled) { setOutput(text); return; }
    setActive(true);
  }, [text, enabled]);

  useEffect(() => {
    if (!active || reduced) { setOutput(text); return; }

    const steps = Math.ceil(duration / 40);
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      const result = text.split("").map((ch, i) => {
        if (ch === " " || ch === "\n") return ch;
        const threshold = i / text.length;
        if (progress > threshold + 0.3) return ch;
        return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
      }).join("");

      setOutput(result);

      if (step >= steps) {
        clearInterval(timer);
        setOutput(text);
        setActive(false);
      }
    }, 40);

    return () => clearInterval(timer);
  }, [active, text, duration, reduced]);

  return output;
}
