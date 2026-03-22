import React from "react";
import { createPortal } from "react-dom";

export function AsciiPortal({ children }: { children: React.ReactNode }) {
  if (typeof document === "undefined") return null;

  return createPortal(children, document.body);
}
