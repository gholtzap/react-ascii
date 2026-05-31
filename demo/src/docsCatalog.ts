import { demoComponents } from "./demoRegistry";
import { generatedDocsProps } from "./generatedDocsProps";

export interface DocsProp {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
}

export interface DocsExample {
  title: string;
  description: string;
  code: string;
}

export interface DocsComponent {
  name: string;
  category: string;
  description: string;
  importPath: string;
  useCases: string[];
  accessibility: string[];
  props: DocsProp[];
  examples: DocsExample[];
}

const catalogOverrides: Record<string, Partial<DocsComponent>> = {
  AsciiButton: {
    description: "A command button rendered with ASCII borders and optional hover animation.",
    useCases: ["Primary actions", "Toolbar commands", "Terminal-style control panels"],
    accessibility: ["Renders a native button", "Supports disabled state", "Uses the label as the accessible name"],
    examples: [
      {
        title: "Deploy action",
        description: "Use a concise label and animation for high-frequency commands.",
        code: `<AsciiButton label="Deploy" border="single" animate onClick={handleDeploy} />`,
      },
    ],
  },
  AsciiInput: {
    description: "A bordered text input with optional prompt-style label and fixed character width.",
    useCases: ["Search fields", "Command filters", "Configuration forms"],
    accessibility: ["Renders a native input", "Supports placeholder text", "Pass through aria attributes for custom labels"],
    examples: [
      {
        title: "Filter field",
        description: "Pair with deferred filtering for large component or log lists.",
        code: `<AsciiInput label="filter:" width={36} value={query} onChange={(event) => setQuery(event.target.value)} />`,
      },
    ],
  },
  AsciiDataTable: {
    description: "A dense data grid for selectable, sortable, paged, and pinned operational data.",
    useCases: ["Resource inventories", "User tables", "Incident queues"],
    accessibility: ["Uses table semantics", "Supports keyboard row navigation", "Exposes loading and error states"],
    examples: [
      {
        title: "Service inventory",
        description: "Use pinned columns and loading states for production dashboards.",
        code: `<AsciiDataTable columns={columns} rows={services} selectable pageSize={8} />`,
      },
    ],
  },
  AsciiCommandPalette: {
    description: "A searchable command launcher with groups, shortcuts, active item navigation, and dialog semantics.",
    useCases: ["Global actions", "Admin shortcuts", "Workbench navigation"],
    accessibility: ["Uses dialog and combobox roles", "Supports arrow key navigation", "Closes with Escape"],
    examples: [
      {
        title: "Global launcher",
        description: "Bind Cmd+K or Ctrl+K in the host app and pass grouped command items.",
        code: `<AsciiCommandPalette open={open} onClose={() => setOpen(false)} onSelect={runCommand} items={commands} />`,
      },
    ],
  },
  AsciiLogViewer: {
    description: "A live log surface with levels, filtering, follow mode, bookmarks, and toolbar composition.",
    useCases: ["Deployment logs", "Request streams", "Agent run output"],
    accessibility: ["Uses log role", "Can announce followed updates", "Supports keyboard selection when selectable"],
    examples: [
      {
        title: "Deployment stream",
        description: "Use toolbar slots for filters, copy actions, and follow controls.",
        code: `<AsciiLogViewer entries={entries} follow query={query} toolbar={<AsciiButton label="Copy" />} />`,
      },
    ],
  },
  AsciiRunbook: {
    description: "A structured operational checklist for incidents, rollouts, and approval flows.",
    useCases: ["Incident response", "Release procedures", "Human approval gates"],
    accessibility: ["Renders steps as a list", "Marks the active step", "Supports keyboard movement between steps"],
    examples: [
      {
        title: "Rollback procedure",
        description: "Make state and evidence visible before destructive operations.",
        code: `<AsciiRunbook title="Rollback" steps={steps} selectedKey={activeStep} onStepSelect={setActiveStep} />`,
      },
    ],
  },
};

function sentenceFromName(name: string, category: string) {
  const readableName = name.replace(/^Ascii/, "").replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();

  return `ASCII-first ${readableName} component for ${category.toLowerCase()} workflows.`;
}

function defaultEntry(name: string, category: string): DocsComponent {
  return {
    name,
    category,
    description: sentenceFromName(name, category),
    importPath: `ascii-lib`,
    useCases: [`${category} demos`, "ASCII-styled interfaces", "Composable React workflows"],
    accessibility: ["Pass through standard React props where supported", "Rendered in the demo for visual inspection"],
    props: generatedDocsProps[name] ?? [],
    examples: [
      {
        title: "Basic usage",
        description: "Import the component directly from the package entry point.",
        code: `import { ${name} } from "ascii-lib";`,
      },
    ],
  };
}

export const docsComponents: DocsComponent[] = demoComponents.map((component) => {
  const base = defaultEntry(component.name, component.category);
  const override = catalogOverrides[component.name];

  return {
    ...base,
    ...override,
    props: generatedDocsProps[component.name] ?? base.props,
    examples: override?.examples ?? base.examples,
    useCases: override?.useCases ?? base.useCases,
    accessibility: override?.accessibility ?? base.accessibility,
  };
});

export const docsComponentCount = docsComponents.length;
export const generatedDocsPropTableCount = Object.keys(generatedDocsProps).length;
export const generatedDocsPropCount = Object.values(generatedDocsProps).reduce((total, props) => total + props.length, 0);

export const docsCategories = [...new Set(docsComponents.map((component) => component.category))].sort();

export function filterDocsComponents(search: string, category: string) {
  const query = search.trim().toLowerCase();

  return docsComponents.filter((component) => {
    const matchesCategory = category === "All" || component.category === category;
    const matchesQuery =
      !query ||
      component.name.toLowerCase().includes(query) ||
      component.category.toLowerCase().includes(query) ||
      component.description.toLowerCase().includes(query) ||
      component.useCases.some((useCase) => useCase.toLowerCase().includes(query));

    return matchesCategory && matchesQuery;
  });
}

export function getDocsComponent(name: string) {
  return docsComponents.find((component) => component.name === name) ?? docsComponents[0];
}
