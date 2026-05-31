import { useDeferredValue, useMemo, useState } from "react";
import { AsciiBadge } from "../../src/components/AsciiBadge";
import { AsciiBox } from "../../src/components/AsciiBox";
import { AsciiButtonGroup } from "../../src/components/AsciiButtonGroup";
import { AsciiCode } from "../../src/components/AsciiCode";
import { AsciiDivider } from "../../src/components/AsciiDivider";
import { AsciiEmpty } from "../../src/components/AsciiEmpty";
import { AsciiInput } from "../../src/components/AsciiInput";
import { AsciiTable } from "../../src/components/AsciiTable";
import { AsciiTag } from "../../src/components/AsciiTag";
import { docsCategories, docsComponentCount, filterDocsComponents, getDocsComponent } from "./docsCatalog";

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

export function DocsView() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedName, setSelectedName] = useState("AsciiButton");
  const deferredSearch = useDeferredValue(search);
  const filtered = useMemo(() => filterDocsComponents(deferredSearch, category), [deferredSearch, category]);
  const selected = getDocsComponent(selectedName);
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
