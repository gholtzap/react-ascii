import React, { useMemo } from "react";
import {
  themes,
  densities,
  themeToCustomProperties,
  densityToCustomProperties,
} from "../themes";
import type { ThemePreset, DensityPreset, ThemeVars } from "../themes";
import { AsciiThemeContext } from "../internal/AsciiThemeContext";

export interface AsciiThemeProps {
  preset?: ThemePreset;
  density?: DensityPreset;
  vars?: Partial<ThemeVars>;
  children: React.ReactNode;
  name?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiTheme({
  preset = "phosphor",
  density,
  vars,
  children,
  name,
  className,
  style,
}: AsciiThemeProps) {
  const themeStyle = useMemo(() => {
    const base = themes[preset];
    const merged = vars ? { ...base, ...vars } : base;
    const customProps = themeToCustomProperties(merged);
    if (density) {
      Object.assign(customProps, densityToCustomProperties(densities[density]));
    }
    return customProps;
  }, [preset, density, vars]);

  return (
    <AsciiThemeContext.Provider value={themeStyle}>
      <div
        className={`ascii-theme ${className ?? ""}`.trim()}
        style={{ ...themeStyle, ...style } as React.CSSProperties}
        data-ascii-theme={preset}
        data-ascii-density={density}
        data-ascii-theme-name={name}
      >
        {children}
      </div>
    </AsciiThemeContext.Provider>
  );
}
