import React, { useEffect, useCallback, useRef, useState } from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";
import { useReducedMotion } from "../internal/useReducedMotion";

export type ToastVariant = "info" | "success" | "warning" | "error";

export interface AsciiToastItem {
  id: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface AsciiToastProps {
  toasts: AsciiToastItem[];
  onDismiss: (id: string) => void;
  width?: number;
  border?: BorderStyle;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  animate?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const variantIcons: Record<ToastVariant, string> = {
  info: "i",
  success: "*",
  warning: "!",
  error: "x",
};

function ToastItem({
  toast,
  onDismiss,
  width,
  border,
  animate,
}: {
  toast: AsciiToastItem;
  onDismiss: (id: string) => void;
  width: number;
  border: BorderStyle;
  animate: boolean;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const reduced = useReducedMotion();
  const [expandProgress, setExpandProgress] = useState(animate && !reduced ? 0 : 1);
  const [typeIndex, setTypeIndex] = useState(0);

  useEffect(() => {
    const duration = toast.duration ?? 4000;
    if (duration > 0) {
      timerRef.current = setTimeout(() => onDismiss(toast.id), duration);
      return () => clearTimeout(timerRef.current);
    }
  }, [toast.id, toast.duration, onDismiss]);

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

  const b = borders[border];
  const inner = width - 2;
  const icon = variantIcons[toast.variant ?? "info"];

  if (animate && !reduced && expandProgress < 1) {
    const currentWidth = Math.max(4, Math.floor(expandProgress * width));
    const ci = currentWidth - 2;
    const lines = [
      b.tl + repeatChar(b.h, ci) + b.tr,
      b.v + " ".repeat(ci) + b.v,
      b.bl + repeatChar(b.h, ci) + b.br,
    ];
    return (
      <div className="ascii-toast-item" role="status" aria-live="polite">
        <span aria-hidden="true">{lines.join("\n")}</span>
        <span className="ascii-sr-only">{`${toast.variant ?? "info"}: ${toast.message}`}</span>
      </div>
    );
  }

  const displayMsg = animate && !reduced ? toast.message.slice(0, typeIndex) : toast.message;

  const lines: string[] = [];
  lines.push(b.tl + repeatChar(b.h, inner) + b.tr);
  lines.push(
    b.v + pad(` [${icon}] ${displayMsg}`, inner - 4) + " [x] " + b.v
  );
  lines.push(b.bl + repeatChar(b.h, inner) + b.br);

  return (
    <div className="ascii-toast-item" role="status" aria-live="polite">
      <span aria-hidden="true">{lines.join("\n")}</span>
      <button
        type="button"
        className="ascii-toast-close"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
      >
        {" "}
      </button>
      <span className="ascii-sr-only">{`${toast.variant ?? "info"}: ${toast.message}`}</span>
    </div>
  );
}

export function AsciiToast({
  toasts,
  onDismiss,
  width = 50,
  border = "single",
  position = "top-right",
  animate = false,
  className,
  style,
}: AsciiToastProps) {
  const handleDismiss = useCallback(
    (id: string) => onDismiss(id),
    [onDismiss]
  );

  if (toasts.length === 0) return null;

  return (
    <div
      className={`ascii-lib ascii-toast ascii-toast-${position} ${className ?? ""}`.trim()}
      style={style}
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={handleDismiss}
          width={width}
          border={border}
          animate={animate}
        />
      ))}
    </div>
  );
}
