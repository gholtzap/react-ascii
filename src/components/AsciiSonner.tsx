import React, { useState, useCallback, useRef, useEffect } from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

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

export interface AsciiSonnerContainerProps {
  toasts: SonnerToast[];
  dismiss: (id: number) => void;
  width?: number;
  border?: BorderStyle;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiSonner({
  toasts,
  dismiss,
  width = 40,
  border = "single",
  className,
  style,
}: AsciiSonnerContainerProps) {
  const b = borders[border];
  const inner = width - 2;

  if (toasts.length === 0) return null;

  return (
    <div
      className={`ascii-lib ascii-sonner ${className ?? ""}`.trim()}
      style={style}
    >
      {toasts.map((t) => {
        const icon = variantIcons[t.variant];
        const lines = [
          b.tl + repeatChar(b.h, inner) + b.tr,
          b.v + pad(` [${icon}] ${t.message}`, inner) + b.v,
          b.bl + repeatChar(b.h, inner) + b.br,
        ];
        return (
          <div
            key={t.id}
            className="ascii-sonner-item"
            onClick={() => dismiss(t.id)}
            role="status"
          >
            {lines.join("\n")}
          </div>
        );
      })}
    </div>
  );
}
