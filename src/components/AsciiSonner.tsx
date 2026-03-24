import React, { useState, useCallback, useRef, useEffect } from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";
import { useReducedMotion } from "../internal/useReducedMotion";

export type SonnerVariant = "default" | "success" | "error" | "info";

interface SonnerToast {
  id: number;
  message: string;
  variant: SonnerVariant;
}

const variantIcons: Record<SonnerVariant, string> = {
  default: "-",
  success: "*",
  info: "i",
  error: "x",
};

export interface AsciiSonnerProps {
  width?: number;
  border?: BorderStyle;
  className?: string;
  style?: React.CSSProperties;
}

export interface SonnerRef {
  toast: (message: string, variant?: SonnerVariant) => void;
}

let globalId = 0;

export function useAsciiSonner() {
  const [toasts, setToasts] = useState<SonnerToast[]>([]);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    return () => {
      timers.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const toast = useCallback((message: string, variant: SonnerVariant = "default") => {
    const id = ++globalId;
    setToasts((prev) => [...prev, { id, message, variant }]);
    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timers.current.delete(id);
    }, 3000);
    timers.current.set(id, timer);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  return { toasts, toast, dismiss };
}

function SonnerItem({
  toast,
  dismiss,
  width,
  border,
  animate,
}: {
  toast: SonnerToast;
  dismiss: (id: number) => void;
  width: number;
  border: BorderStyle;
  animate: boolean;
}) {
  const reduced = useReducedMotion();
  const [expandProgress, setExpandProgress] = useState(animate && !reduced ? 0 : 1);
  const [typeIndex, setTypeIndex] = useState(0);
  const b = borders[border];
  const inner = width - 2;
  const icon = variantIcons[toast.variant];

  useEffect(() => {
    if (!animate || reduced) { setExpandProgress(1); return; }
    let step = 0;
    const totalSteps = 8;
    const timer = setInterval(() => {
      step++;
      setExpandProgress(step / totalSteps);
      if (step >= totalSteps) clearInterval(timer);
    }, 25);
    return () => clearInterval(timer);
  }, [animate, reduced]);

  useEffect(() => {
    if (!animate || reduced || expandProgress < 1) return;
    if (typeIndex >= toast.message.length) return;
    const timer = setTimeout(() => setTypeIndex((i) => i + 1), 20);
    return () => clearTimeout(timer);
  }, [typeIndex, toast.message, animate, reduced, expandProgress]);

  if (animate && !reduced && expandProgress < 1) {
    const currentWidth = Math.max(4, Math.floor(expandProgress * width));
    const ci = currentWidth - 2;
    const lines = [
      b.tl + repeatChar(b.h, ci) + b.tr,
      b.v + " ".repeat(ci) + b.v,
      b.bl + repeatChar(b.h, ci) + b.br,
    ];
    return (
      <div className="ascii-sonner-item" role="status">
        {lines.join("\n")}
      </div>
    );
  }

  const displayMsg = animate && !reduced ? toast.message.slice(0, typeIndex) : toast.message;

  const lines = [
    b.tl + repeatChar(b.h, inner) + b.tr,
    b.v + pad(` [${icon}] ${displayMsg}`, inner) + b.v,
    b.bl + repeatChar(b.h, inner) + b.br,
  ];

  return (
    <div
      className="ascii-sonner-item"
      onClick={() => dismiss(toast.id)}
      role="status"
    >
      {lines.join("\n")}
    </div>
  );
}

export interface AsciiSonnerContainerProps {
  toasts: SonnerToast[];
  dismiss: (id: number) => void;
  width?: number;
  border?: BorderStyle;
  animate?: boolean;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiSonner({
  toasts,
  dismiss,
  width = 40,
  border = "single",
  animate = false,
  color,
  className,
  style,
}: AsciiSonnerContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className={`ascii-lib ascii-sonner ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
    >
      {toasts.map((t) => (
        <SonnerItem
          key={t.id}
          toast={t}
          dismiss={dismiss}
          width={width}
          border={border}
          animate={animate}
        />
      ))}
    </div>
  );
}
