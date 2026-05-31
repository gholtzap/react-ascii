import { useMemo, useState } from "react";
import { AsciiAlert } from "../../src/components/AsciiAlert";
import { AsciiBadge } from "../../src/components/AsciiBadge";
import { AsciiBox } from "../../src/components/AsciiBox";
import { AsciiButton } from "../../src/components/AsciiButton";
import { AsciiButtonGroup } from "../../src/components/AsciiButtonGroup";
import { AsciiCode } from "../../src/components/AsciiCode";
import { AsciiProgress } from "../../src/components/AsciiProgress";
import { AsciiSwitch } from "../../src/components/AsciiSwitch";
import { AsciiTheme } from "../../src/components/AsciiTheme";
import type { BorderStyle } from "../../src/chars";
import { themes, type DensityPreset, type ThemeVars } from "../../src/themes";

const themeBuilderDensityItems = [
  { key: "compact", label: "compact" },
  { key: "cozy", label: "cozy" },
  { key: "roomy", label: "roomy" },
];

const themeBuilderBorderItems = [
  { key: "single", label: "single" },
  { key: "double", label: "double" },
  { key: "bold", label: "bold" },
  { key: "round", label: "round" },
  { key: "ascii", label: "ascii" },
];

const editableThemeKeys: Array<keyof Pick<ThemeVars, "bg" | "fg" | "dim" | "accent" | "accent2" | "accent3" | "warning" | "surface" | "border">> = [
  "bg",
  "fg",
  "dim",
  "accent",
  "accent2",
  "accent3",
  "warning",
  "surface",
  "border",
];

export function ThemeBuilderSummary() {
  return (
    <AsciiBox title="Theme Builder" width={36} border="single">
      {"color tokens\ndensity and border controls\nexportable JSON"}
    </AsciiBox>
  );
}

export function ThemeBuilder() {
  const [vars, setVars] = useState<ThemeVars>(themes.phosphor);
  const [density, setDensity] = useState<DensityPreset>("cozy");
  const [border, setBorder] = useState<BorderStyle>("single");
  const [animate, setAnimate] = useState(true);
  const [contrast, setContrast] = useState(false);
  const [copied, setCopied] = useState(false);

  const previewVars = useMemo<ThemeVars>(() => {
    if (!contrast) return vars;
    return {
      ...vars,
      bg: "#000000",
      fg: "#ffffff",
      dim: "#d6d6d6",
      border: "#ffffff",
      surface: "#050505",
    };
  }, [contrast, vars]);

  const tokenExport = useMemo(() => JSON.stringify({ preset: "custom", density, border, animate, contrast, vars: previewVars }, null, 2), [animate, border, contrast, density, previewVars]);

  const copyTokens = async () => {
    await navigator.clipboard?.writeText(tokenExport);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="theme-builder">
      <div className="theme-builder-controls">
        <div className="theme-builder-swatches">
          {editableThemeKeys.map((key) => (
            <label key={key} className="theme-builder-swatch">
              <span className="label">{key}</span>
              <input
                type="color"
                value={vars[key]}
                onChange={(event) => setVars((current) => ({ ...current, [key]: event.target.value }))}
              />
            </label>
          ))}
        </div>
        <div className="theme-builder-options">
          <div>
            <span className="label">density</span>
            <AsciiButtonGroup items={themeBuilderDensityItems} value={density} onChange={(value) => setDensity(value as DensityPreset)} />
          </div>
          <div>
            <span className="label">border</span>
            <AsciiButtonGroup items={themeBuilderBorderItems} value={border} onChange={(value) => setBorder(value as BorderStyle)} border="double" />
          </div>
          <AsciiSwitch checked={animate} onChange={setAnimate} label="animate" />
          <AsciiSwitch checked={contrast} onChange={setContrast} label="contrast" />
          <AsciiButton label={copied ? "Copied" : "Copy Tokens"} border={border} onClick={copyTokens} />
        </div>
      </div>

      <div className="theme-builder-preview">
        <AsciiTheme density={density} vars={previewVars}>
          <div className="theme-builder-stage">
            <span className="green"><AsciiBadge>custom theme</AsciiBadge></span>
            <AsciiAlert variant="info" width={54} border={border} animate={animate}>
              Theme preview updates from the token controls.
            </AsciiAlert>
            <AsciiProgress value={68} width={42} animate={animate} aria-label="Theme preview progress" />
            <AsciiButton label="Run Preview" border={border} animate={animate} />
          </div>
        </AsciiTheme>
        <AsciiCode title="ascii-theme.json" border="single">
          {tokenExport}
        </AsciiCode>
      </div>
    </div>
  );
}
