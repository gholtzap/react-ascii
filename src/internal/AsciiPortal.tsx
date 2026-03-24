import React, { useContext } from "react";
import { createPortal } from "react-dom";
import { AsciiThemeContext } from "./AsciiThemeContext";

export function AsciiPortal({ children }: { children: React.ReactNode }) {
  const themeVars = useContext(AsciiThemeContext);

  if (typeof document === "undefined") return null;

  const hasTheme = Object.keys(themeVars).length > 0;

  const content = hasTheme ? (
    <div className="ascii-theme" style={themeVars as React.CSSProperties}>
      {children}
    </div>
  ) : (
    children
  );

  return createPortal(content, document.body);
}
