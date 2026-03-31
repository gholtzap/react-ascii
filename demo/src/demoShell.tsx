import { AsciiButtonGroup } from "ascii-lib";
import { demoComponentCount } from "./demoRegistry";

const BANNER = `
    ___   _____ ______________   __    ________
   /   | / ___// ____/  _/  _/  / /   /  _/ __ )
  / /| | \\__ \\/ /    / / / /   / /    / // __  |
 / ___ |___/ / /____/ /_/ /   / /____/ // /_/ /
/_/  |_/____/\\____/___/___/  /_____/___/_____/
`;

interface DemoViewSwitcherProps {
  view: "dashboard" | "components" | "index";
  onChange: (view: "dashboard" | "components" | "index") => void;
}

interface DemoControlsProps {
  theme: string;
  density: string;
  onThemeChange: (theme: string) => void;
  onDensityChange: (density: string) => void;
}

export function DemoHeader() {
  return (
    <header className="demo-header">
      <span aria-hidden="true">{BANNER}</span>
      <h1 className="sr-only">ascii-lib</h1>
      <div className="subtitle">
        Every component is ASCII. A React component library
        {"\n"}
        rendered entirely with box-drawing characters.
      </div>
    </header>
  );
}

export function DemoViewSwitcher({ view, onChange }: DemoViewSwitcherProps) {
  return (
    <nav className="view-switcher">
      <button
        className={`view-tab ${view === "dashboard" ? "view-tab-active" : ""}`}
        onClick={() => onChange("dashboard")}
      >
        {"[ Dashboard ]"}
      </button>
      <button
        className={`view-tab ${view === "components" ? "view-tab-active" : ""}`}
        onClick={() => onChange("components")}
      >
        {"[ Components ]"}
      </button>
      <button
        className={`view-tab ${view === "index" ? "view-tab-active" : ""}`}
        onClick={() => onChange("index")}
      >
        {"[ Index ]"}
      </button>
    </nav>
  );
}

export function DemoControls({
  theme,
  density,
  onThemeChange,
  onDensityChange,
}: DemoControlsProps) {
  return (
    <div className="demo-controls">
      <div className="demo-control">
        <span className="label">theme</span>
        <AsciiButtonGroup
          items={[
            { key: "phosphor", label: "Phosphor" },
            { key: "amber", label: "Amber" },
            { key: "paper", label: "Paper" },
            { key: "mono", label: "Mono" },
          ]}
          value={theme}
          onChange={(nextTheme) => onThemeChange(nextTheme as string)}
        />
      </div>
      <div className="demo-control">
        <span className="label">density</span>
        <AsciiButtonGroup
          items={[
            { key: "compact", label: "Compact" },
            { key: "cozy", label: "Cozy" },
            { key: "roomy", label: "Roomy" },
          ]}
          value={density}
          onChange={(nextDensity) => onDensityChange(nextDensity as string)}
          border="double"
        />
      </div>
    </div>
  );
}

export function DemoFooter() {
  return (
    <footer>
      <pre>
{`  ┌─────────────────────────────────────────┐
  │  ascii-lib ~ every pixel is a character │
  │                                         │
  │  5 border styles / ${String(demoComponentCount).padEnd(2, " ")} components        │
  │  typescript / accessible / zero deps    │
  └─────────────────────────────────────────┘`}
      </pre>
    </footer>
  );
}
