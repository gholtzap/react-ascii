import React, { useState, useEffect, useCallback, useRef } from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

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
}: {
  toast: AsciiToastItem;
  onDismiss: (id: string) => void;
  width: number;
  border: BorderStyle;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const duration = toast.duration ?? 4000;
    if (duration > 0) {
      timerRef.current = setTimeout(() => onDismiss(toast.id), duration);
      return () => clearTimeout(timerRef.current);
    }
  }, [toast.id, toast.duration, onDismiss]);

  const b = borders[border];
  const inner = width - 2;
  const icon = variantIcons[toast.variant ?? "info"];

  const lines: string[] = [];
  lines.push(b.tl + repeatChar(b.h, inner) + b.tr);
  lines.push(
    b.v + pad(` [${icon}] ${toast.message}`, inner - 4) + " [x] " + b.v
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
        />
      ))}
    </div>
  );
}
