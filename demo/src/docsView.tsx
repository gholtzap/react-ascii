import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { AsciiAlert, type AlertVariant } from "../../src/components/AsciiAlert";
import { AsciiBadge } from "../../src/components/AsciiBadge";
import { AsciiBox } from "../../src/components/AsciiBox";
import { AsciiButton } from "../../src/components/AsciiButton";
import { AsciiButtonGroup } from "../../src/components/AsciiButtonGroup";
import { AsciiCode } from "../../src/components/AsciiCode";
import { AsciiDivider } from "../../src/components/AsciiDivider";
import { AsciiEmpty } from "../../src/components/AsciiEmpty";
import { AsciiInput } from "../../src/components/AsciiInput";
import { AsciiProgress } from "../../src/components/AsciiProgress";
import { AsciiSelect } from "../../src/components/AsciiSelect";
import { AsciiSlider } from "../../src/components/AsciiSlider";
import { AsciiSwitch } from "../../src/components/AsciiSwitch";
import { AsciiTable } from "../../src/components/AsciiTable";
import { AsciiTag } from "../../src/components/AsciiTag";
import { AsciiTextarea } from "../../src/components/AsciiTextarea";
import { AsciiTheme } from "../../src/components/AsciiTheme";
import type { BorderStyle } from "../../src/chars";
import type { DensityPreset, ThemePreset } from "../../src/themes";
import { docsCategories, docsComponentCount, filterDocsComponents, getDocsComponent } from "./docsCatalog";
import { docsRecipes, getDocsRecipe } from "./docsRecipes";

const categoryItems = [
  { key: "All", label: "All" },
  ...docsCategories.map((category) => ({ key: category, label: category })),
];

const propColumns = [
  { key: "name", header: "PROP", width: 18 },
  { key: "type", header: "TYPE", width: 28 },
  { key: "defaultValue", header: "DEFAULT", width: 12 },
  { key: "description", header: "DESCRIPTION", width: 42 },
];

const borderOptions = [
  { key: "single", label: "single" },
  { key: "double", label: "double" },
  { key: "bold", label: "bold" },
  { key: "round", label: "round" },
  { key: "ascii", label: "ascii" },
];

const alertVariantOptions = [
  { value: "info", label: "info" },
  { value: "success", label: "success" },
  { value: "warning", label: "warning" },
  { value: "error", label: "error" },
];

const playgroundThemeOptions = [
  { key: "phosphor", label: "phosphor" },
  { key: "amber", label: "amber" },
  { key: "paper", label: "paper" },
  { key: "mono", label: "mono" },
];

const playgroundDensityOptions = [
  { key: "compact", label: "compact" },
  { key: "cozy", label: "cozy" },
  { key: "roomy", label: "roomy" },
];

function literal(value: string) {
  return JSON.stringify(value);
}

function LivePlayground({ componentName }: { componentName: string }) {
  const [theme, setTheme] = useState<ThemePreset>("phosphor");
  const [density, setDensity] = useState<DensityPreset>("cozy");
  const [dashboardContext, setDashboardContext] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("Deploy");
  const [buttonBorder, setButtonBorder] = useState("single");
  const [buttonAnimate, setButtonAnimate] = useState(true);
  const [inputLabel, setInputLabel] = useState("filter:");
  const [inputPlaceholder, setInputPlaceholder] = useState("search logs...");
  const [inputWidth, setInputWidth] = useState(36);
  const [progressValue, setProgressValue] = useState(64);
  const [alertVariant, setAlertVariant] = useState("warning");
  const [alertMessage, setAlertMessage] = useState("Memory usage crossed 80%");
  const [badgeLabel, setBadgeLabel] = useState("healthy");
  const [copied, setCopied] = useState(false);

  const supported = ["AsciiButton", "AsciiInput", "AsciiProgress", "AsciiAlert", "AsciiBadge"].includes(componentName);

  const generatedCode = useMemo(() => {
    if (componentName === "AsciiButton") {
      return `<AsciiButton label=${literal(buttonLabel)} border=${literal(buttonBorder)}${buttonAnimate ? " animate" : ""} />`;
    }

    if (componentName === "AsciiInput") {
      return `<AsciiInput
  label=${literal(inputLabel)}
  width={${inputWidth}}
  placeholder=${literal(inputPlaceholder)}
  value={value}
  onChange={(event) => setValue(event.target.value)}
/>`;
    }

    if (componentName === "AsciiProgress") {
      return `<AsciiProgress value={${progressValue}} width={42} aria-label="Task progress" />`;
    }

    if (componentName === "AsciiAlert") {
      return `<AsciiAlert variant=${literal(alertVariant)} width={52}>
  ${alertMessage}
</AsciiAlert>`;
    }

    if (componentName === "AsciiBadge") {
      return `<AsciiBadge>${badgeLabel}</AsciiBadge>`;
    }

    return `import { ${componentName} } from "ascii-lib";

<${componentName} />`;
  }, [alertMessage, alertVariant, badgeLabel, buttonAnimate, buttonBorder, buttonLabel, componentName, inputLabel, inputPlaceholder, inputWidth, progressValue]);

  const [editableCode, setEditableCode] = useState(generatedCode);

  useEffect(() => {
    setEditableCode(generatedCode);
  }, [generatedCode]);

  const copyCode = async () => {
    if (!editableCode) return;
    await navigator.clipboard?.writeText(editableCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  const playgroundPreview = (
    <div className="docs-preview-stage">
      {componentName === "AsciiButton" && <AsciiButton label={buttonLabel} border={buttonBorder as BorderStyle} animate={buttonAnimate} />}
      {componentName === "AsciiInput" && <AsciiInput label={inputLabel} width={inputWidth} placeholder={inputPlaceholder} value="" onChange={() => {}} />}
      {componentName === "AsciiProgress" && <AsciiProgress value={progressValue} width={42} aria-label="Task progress" />}
      {componentName === "AsciiAlert" && <AsciiAlert variant={alertVariant as AlertVariant} width={52}>{alertMessage}</AsciiAlert>}
      {componentName === "AsciiBadge" && <AsciiBadge>{badgeLabel}</AsciiBadge>}
      {!supported && (
        <AsciiEmpty
          title="Editable example"
          description="This component page has generated JSX ready to adapt while live controls are added."
        />
      )}
    </div>
  );

  const themedPreview = (
    <AsciiTheme preset={theme} density={density}>
      {dashboardContext ? (
        <div className="docs-dashboard-context">
          <div className="docs-dashboard-context-top">
            <span className="green"><AsciiBadge>production</AsciiBadge></span>
            <span className="blue"><AsciiTag>{componentName}</AsciiTag></span>
            <span className="dim">dashboard slot</span>
          </div>
          <div className="docs-dashboard-context-body">
            <div>
              <div className="label">service health</div>
              {playgroundPreview}
            </div>
            <AsciiBox title="Context" width={28} border="single">
              {"route: /api/deploy\nowner: platform\nstatus: review"}
            </AsciiBox>
          </div>
        </div>
      ) : (
        playgroundPreview
      )}
    </AsciiTheme>
  );

  return (
    <div className="docs-playground">
      <div className="docs-playground-toolbar">
        <div className="docs-playground-control">
          <span className="label">theme</span>
          <AsciiButtonGroup
            items={playgroundThemeOptions}
            value={theme}
            onChange={(value) => setTheme(value as ThemePreset)}
          />
        </div>
        <div className="docs-playground-control">
          <span className="label">density</span>
          <AsciiButtonGroup
            items={playgroundDensityOptions}
            value={density}
            onChange={(value) => setDensity(value as DensityPreset)}
            border="double"
          />
        </div>
        <div className="docs-playground-actions">
          <AsciiButton
            label={dashboardContext ? "Close Dashboard Context" : "Open Dashboard Context"}
            border="single"
            onClick={() => setDashboardContext((current) => !current)}
          />
          <AsciiButton label={copied ? "Copied" : "Copy JSX"} border="single" onClick={copyCode} />
        </div>
      </div>

      {supported ? (
        <div className="docs-playground-controls">
          {componentName === "AsciiButton" && (
            <>
              <AsciiInput label="label:" width={30} value={buttonLabel} onChange={(event) => setButtonLabel(event.target.value)} />
              <AsciiButtonGroup items={borderOptions} value={buttonBorder} onChange={(value) => setButtonBorder(value as string)} />
              <AsciiSwitch checked={buttonAnimate} onChange={setButtonAnimate} label="animate" />
            </>
          )}
          {componentName === "AsciiInput" && (
            <>
              <AsciiInput label="label:" width={28} value={inputLabel} onChange={(event) => setInputLabel(event.target.value)} />
              <AsciiInput label="placeholder:" width={36} value={inputPlaceholder} onChange={(event) => setInputPlaceholder(event.target.value)} />
              <AsciiSlider label="width" value={inputWidth} min={24} max={54} width={30} onChange={setInputWidth} />
            </>
          )}
          {componentName === "AsciiProgress" && (
            <AsciiSlider label="value" value={progressValue} min={0} max={100} width={42} onChange={setProgressValue} />
          )}
          {componentName === "AsciiAlert" && (
            <>
              <AsciiSelect options={alertVariantOptions} value={alertVariant} onChange={setAlertVariant} width={24} />
              <AsciiInput label="message:" width={44} value={alertMessage} onChange={(event) => setAlertMessage(event.target.value)} />
            </>
          )}
          {componentName === "AsciiBadge" && (
            <AsciiInput label="label:" width={30} value={badgeLabel} onChange={(event) => setBadgeLabel(event.target.value)} />
          )}
        </div>
      ) : (
        <AsciiEmpty
          title="Generated starter"
          description="Edit the JSX, copy it, and review the component in the selected theme while rich prop controls are added."
        />
      )}

      <div className="docs-playground-preview">
        <div className="docs-preview-panel">
          <div className="label">{dashboardContext ? "dashboard context" : "preview"}</div>
          {themedPreview}
        </div>
        <div className="docs-code-panel">
          <AsciiTextarea
            label="editable example:"
            width={72}
            height={Math.max(5, editableCode.split("\n").length + 1)}
            value={editableCode}
            onChange={(event) => setEditableCode(event.target.value)}
          />
        </div>
        <div className="docs-code-panel">
          <AsciiCode title="generated.tsx" border="single">
            {editableCode}
          </AsciiCode>
        </div>
      </div>
    </div>
  );
}

export function DocsView() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedName, setSelectedName] = useState("AsciiButton");
  const [selectedRecipeId, setSelectedRecipeId] = useState("incident-console");
  const deferredSearch = useDeferredValue(search);
  const filtered = useMemo(() => filterDocsComponents(deferredSearch, category), [deferredSearch, category]);
  const selected = getDocsComponent(selectedName);
  const selectedRecipe = getDocsRecipe(selectedRecipeId);
  const isStale = search !== deferredSearch;

  return (
    <div className="docs-view">
      <AsciiDivider width={80} border="double" label={`DOCS PLAYGROUND (${docsComponentCount})`} className="divider-full" />

      <div className="docs-hero">
        <div>
          <h2 className="section-title">Component docs</h2>
          <p className="section-desc">Search the library, inspect component guidance, and start from runnable import examples.</p>
        </div>
        <div className="docs-hero-stats">
          <span className="green"><AsciiBadge>{`${filtered.length} shown`}</AsciiBadge></span>
          <span className="blue"><AsciiTag>{category}</AsciiTag></span>
          <span className="dim"><AsciiTag>{`${docsCategories.length} categories`}</AsciiTag></span>
        </div>
      </div>

      <div className="docs-controls">
        <AsciiInput
          label="search:"
          width={42}
          placeholder="component, category, or use case..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <AsciiButtonGroup
          items={categoryItems}
          value={category}
          onChange={(value) => {
            setCategory(value as string);
            const nextFiltered = filterDocsComponents(search, value as string);
            setSelectedName(nextFiltered[0]?.name ?? selectedName);
          }}
        />
      </div>

      <AsciiDivider width={80} border="single" label="RECIPES" className="divider-full" />

      <div className="docs-recipes">
        <div className="docs-recipe-list">
          {docsRecipes.map((recipe) => (
            <button
              key={recipe.id}
              type="button"
              className={`docs-recipe-item ${recipe.id === selectedRecipe.id ? "docs-recipe-item-active" : ""}`}
              onClick={() => setSelectedRecipeId(recipe.id)}
            >
              <span>{recipe.title}</span>
              <span>{recipe.components.slice(0, 3).join(" + ")}</span>
            </button>
          ))}
        </div>
        <div className="docs-recipe-detail">
          <div className="docs-detail-header">
            <div>
              <h2 className="section-title">{selectedRecipe.title}</h2>
              <p className="section-desc">{selectedRecipe.summary}</p>
            </div>
            <span className="green"><AsciiBadge>{`${selectedRecipe.components.length} components`}</AsciiBadge></span>
          </div>
          <div className="docs-detail-grid">
            <AsciiBox title="Components" width={42} border="single">
              {selectedRecipe.components.map((component) => `- ${component}`).join("\n")}
            </AsciiBox>
            <AsciiBox title="Outcomes" width={48} border="single">
              {selectedRecipe.outcomes.map((outcome) => `- ${outcome}`).join("\n")}
            </AsciiBox>
          </div>
          <div className="docs-recipe-code">
            <AsciiCode title={`${selectedRecipe.id}.tsx`} border="single">
              {selectedRecipe.code}
            </AsciiCode>
          </div>
        </div>
      </div>

      <div className="docs-layout">
        <aside className="docs-sidebar" aria-busy={isStale}>
          {filtered.length > 0 ? (
            filtered.map((component) => {
              const active = component.name === selected.name;

              return (
                <button
                  key={component.name}
                  type="button"
                  className={`docs-nav-item ${active ? "docs-nav-item-active" : ""}`}
                  onClick={() => setSelectedName(component.name)}
                >
                  <span>{`<${component.name} />`}</span>
                  <span>{component.category}</span>
                </button>
              );
            })
          ) : (
            <AsciiEmpty title="No docs found" description="Try another search or category." />
          )}
        </aside>

        <section className="docs-detail">
          <div className="docs-detail-header">
            <div>
              <h2 className="section-title">{`<${selected.name}>`}</h2>
              <p className="section-desc">{selected.description}</p>
            </div>
            <span className="green"><AsciiBadge>{selected.category}</AsciiBadge></span>
          </div>

          <div className="docs-detail-grid">
            <AsciiBox title="Use Cases" width={38} border="single">
              {selected.useCases.map((useCase) => `- ${useCase}`).join("\n")}
            </AsciiBox>
            <AsciiBox title="Accessibility" width={46} border="single">
              {selected.accessibility.map((item) => `- ${item}`).join("\n")}
            </AsciiBox>
          </div>

          <AsciiDivider width={72} border="single" label="PROPS" />
          <AsciiTable columns={propColumns} data={selected.props} />

          <AsciiDivider width={72} border="single" label="LIVE PLAYGROUND" />
          <LivePlayground componentName={selected.name} />

          <AsciiDivider width={72} border="single" label="EXAMPLES" />
          <div className="docs-examples">
            {selected.examples.map((example) => (
              <div key={example.title} className="docs-example">
                <div>
                  <h3 className="dash-section-title">{example.title}</h3>
                  <p className="section-desc">{example.description}</p>
                </div>
                <AsciiCode title={selected.importPath} border="single">
                  {example.code}
                </AsciiCode>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
