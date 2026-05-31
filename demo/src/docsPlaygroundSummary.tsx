import { AsciiBox } from "../../src/components/AsciiBox";

export function DocsPlaygroundSummary() {
  return (
    <div className="docs-playground-summary">
      <AsciiBox title="Live Playground" width={36} border="single">
        {"prop controls\neditable JSX\ncopy action"}
      </AsciiBox>
      <AsciiBox title="Preview Modes" width={36} border="single">
        {"theme toggle\ndensity toggle\ndashboard context"}
      </AsciiBox>
    </div>
  );
}
