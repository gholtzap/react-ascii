export interface DocsRecipe {
  id: string;
  title: string;
  summary: string;
  components: string[];
  outcomes: string[];
  code: string;
}

export const docsRecipes: DocsRecipe[] = [
  {
    id: "incident-console",
    title: "Incident Console",
    summary: "Triage active alerts with logs, runbook steps, service health, and command actions in one ASCII workbench.",
    components: ["AsciiAlert", "AsciiLogViewer", "AsciiRunbook", "AsciiStatusGrid", "AsciiCommandPalette"],
    outcomes: ["show active risk", "preserve operator context", "keep remediation steps explicit"],
    code: `<AsciiAlert variant="warning">Checkout latency is above SLO</AsciiAlert>
<AsciiLogViewer entries={entries} query={query} follow />
<AsciiRunbook steps={steps} selectedKey={activeStep} onStepSelect={setActiveStep} />`,
  },
  {
    id: "deploy-dashboard",
    title: "Deploy Dashboard",
    summary: "Track rollout progress, service health, endpoint latency, and approval gates during a production deploy.",
    components: ["AsciiProgress", "AsciiDataTable", "AsciiGauge", "AsciiStepper", "AsciiTabs"],
    outcomes: ["make rollout state scannable", "separate deploy phases", "surface rollback signals"],
    code: `<AsciiProgress value={rolloutPercent} width={50} aria-label="Deploy progress" />
<AsciiStepper steps={steps} activeKey={phase} onStepChange={setPhase} />
<AsciiDataTable columns={columns} rows={services} selectable />`,
  },
  {
    id: "log-explorer",
    title: "Log Explorer",
    summary: "Build a keyboard-friendly log review surface with filters, bookmarks, copy actions, and follow mode.",
    components: ["AsciiInput", "AsciiLogViewer", "AsciiButtonGroup", "AsciiBadge", "AsciiScrollArea"],
    outcomes: ["filter high-volume streams", "mark evidence", "copy exact context"],
    code: `<AsciiInput label="filter:" value={query} onChange={(event) => setQuery(event.target.value)} />
<AsciiButtonGroup items={levelItems} value={level} onChange={setLevel} />
<AsciiLogViewer entries={filteredEntries} follow={follow} selectable />`,
  },
  {
    id: "database-inspection",
    title: "Database Inspection",
    summary: "Inspect query plans, hot paths, and table-level impact without leaving a terminal-style interface.",
    components: ["AsciiQueryPlan", "AsciiFlameGraph", "AsciiDataTable", "AsciiInspector", "AsciiDiff"],
    outcomes: ["compare plan changes", "spot expensive steps", "keep evidence beside actions"],
    code: `<AsciiQueryPlan steps={planSteps} title="EXPLAIN ANALYZE" />
<AsciiFlameGraph frames={frames} title="Query CPU" />
<AsciiDiff oldText={before} newText={after} title="Index change" />`,
  },
  {
    id: "terminal-admin-ui",
    title: "Terminal Admin UI",
    summary: "Compose terminal sessions, file navigation, command launchers, and process views for internal tools.",
    components: ["AsciiTerminal", "AsciiFileTree", "AsciiProcessTable", "AsciiSplitPane", "AsciiMenubar"],
    outcomes: ["support repeated operator workflows", "keep controls dense", "preserve command history"],
    code: `<AsciiSplitPane left={<AsciiFileTree nodes={files} />} right={<AsciiTerminal lines={lines} />} />
<AsciiProcessTable processes={processes} />
<AsciiCommandPalette open={open} items={commands} onSelect={runCommand} />`,
  },
];

export const docsRecipeCount = docsRecipes.length;

export function getDocsRecipe(id: string) {
  return docsRecipes.find((recipe) => recipe.id === id) ?? docsRecipes[0];
}
