import { AsciiBox } from "../../src/components/AsciiBox";
import { AsciiCode } from "../../src/components/AsciiCode";

export function PackageErgonomicsSummary() {
  return (
    <AsciiBox title="Package Imports" width={38} border="single">
      {"ascii-lib/button\nascii-lib/data-table\nascii-lib/styles.css"}
    </AsciiBox>
  );
}

export function PackageErgonomicsPanel() {
  return (
    <div className="package-ergonomics-panel">
      <PackageErgonomicsSummary />
      <AsciiCode title="imports.tsx" border="single">
        {`import { AsciiButton } from "ascii-lib/button";
import { AsciiDataTable } from "ascii-lib/data-table";
import "ascii-lib/styles.css";`}
      </AsciiCode>
    </div>
  );
}
