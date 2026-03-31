import { AsciiDivider } from "ascii-lib";
import { featureShowcases } from "./featureShowcaseRegistry";

export function DashboardFeatureShowcases() {
  return (
    <div className="dash-section">
      <AsciiDivider width={72} border="double" label="FEATURED UPGRADES" />
      <div className="dash-feature-grid">
        {featureShowcases.map((showcase) => (
          <div key={showcase.id} className="feature-card">
            <h3 className="dash-section-title">{showcase.title}</h3>
            {showcase.renderDashboard()}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ComponentFeatureShowcases() {
  return (
    <>
      <AsciiDivider width={80} border="double" label="FEATURED UPGRADES" className="divider-full" />
      {featureShowcases.map((showcase) => (
        <div key={showcase.id} className="section">
          <h2 className="section-title">{showcase.title}</h2>
          <p className="section-desc">{showcase.description}</p>
          {showcase.renderComponents()}
        </div>
      ))}
    </>
  );
}
