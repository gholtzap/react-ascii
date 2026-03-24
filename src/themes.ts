export interface ThemeVars {
  bg: string;
  fg: string;
  dim: string;
  accent: string;
  accent2: string;
  accent3: string;
  warning: string;
  surface: string;
  border: string;
  overlay: string;
}

export type ThemePreset = "phosphor" | "amber" | "paper" | "mono";
export type DensityPreset = "compact" | "cozy" | "roomy";

export const themes: Record<ThemePreset, ThemeVars> = {
  phosphor: {
    bg: "#07140f",
    fg: "#d7ffe8",
    dim: "#6ea487",
    accent: "#57ff9b",
    accent2: "#ff8577",
    accent3: "#86d4ff",
    warning: "#ffd56f",
    surface: "#0c1d16",
    border: "#204333",
    overlay: "rgba(3, 17, 12, 0.72)",
  },
  amber: {
    bg: "#181107",
    fg: "#ffe0a8",
    dim: "#b78a47",
    accent: "#ffbf52",
    accent2: "#ff8b5a",
    accent3: "#ffd98a",
    warning: "#fff17a",
    surface: "#221709",
    border: "#61401b",
    overlay: "rgba(24, 17, 7, 0.76)",
  },
  paper: {
    bg: "#f5efe2",
    fg: "#2e2419",
    dim: "#7e6a52",
    accent: "#6c5030",
    accent2: "#9a4d37",
    accent3: "#49667a",
    warning: "#a87c1c",
    surface: "#fbf7ef",
    border: "#ccbda7",
    overlay: "rgba(83, 66, 48, 0.18)",
  },
  mono: {
    bg: "#090909",
    fg: "#f3f3f3",
    dim: "#9d9d9d",
    accent: "#f3f3f3",
    accent2: "#c9c9c9",
    accent3: "#d9d9d9",
    warning: "#efefef",
    surface: "#141414",
    border: "#4b4b4b",
    overlay: "rgba(0, 0, 0, 0.72)",
  },
};

export interface DensityVars {
  lineHeight: string;
  letterSpacing: string;
  fontSize: string;
}

export const densities: Record<DensityPreset, DensityVars> = {
  compact: {
    lineHeight: "1.24",
    letterSpacing: "-0.01em",
    fontSize: "0.94em",
  },
  cozy: {
    lineHeight: "1.4",
    letterSpacing: "0",
    fontSize: "inherit",
  },
  roomy: {
    lineHeight: "1.58",
    letterSpacing: "0.01em",
    fontSize: "1.03em",
  },
};

export function themeToCustomProperties(vars: Partial<ThemeVars>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(vars)) {
    if (value !== undefined) {
      result[`--ascii-${key}`] = value;
    }
  }
  return result;
}

export function densityToCustomProperties(vars: DensityVars): Record<string, string> {
  return {
    "--ascii-line-height": vars.lineHeight,
    "--ascii-letter-spacing": vars.letterSpacing,
    "--ascii-font-size": vars.fontSize,
  };
}
