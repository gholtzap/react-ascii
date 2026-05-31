export interface DocsRecipe {
  id: string;
  title: string;
  summary: string;
  components: string[];
  structure: string[];
  outcomes: string[];
  actions: string[];
  code: string;
}

export const docsRecipes: DocsRecipe[] = [
  {
    id: "ops-dashboard",
    title: "Ops Dashboard",
    summary: "Run the main operations room with health summaries, service inventory, traffic views, and event context.",
    components: ["AsciiStat", "AsciiDataTable", "AsciiStatusGrid", "AsciiTraceTimeline", "AsciiCommandPalette"],
    structure: ["top command bar", "service health grid", "traffic and error panels", "event timeline", "global command launcher"],
    outcomes: ["make fleet health scannable", "keep service and event context together", "support fast operator commands"],
    actions: ["filter by environment", "open service detail", "launch global action", "copy incident context"],
    code: `<AsciiCommandPalette open={paletteOpen} items={commands} onSelect={runCommand} />
<AsciiStatusGrid items={serviceHealth} columns={4} />
<AsciiDataTable columns={serviceColumns} rows={services} selectable />
<AsciiTraceTimeline spans={recentSpans} />`,
  },
  {
    id: "incident-console",
    title: "Incident Console",
    summary: "Triage active alerts with logs, runbook steps, service health, and command actions in one ASCII workbench.",
    components: ["AsciiAlert", "AsciiLogViewer", "AsciiRunbook", "AsciiStatusGrid", "AsciiCommandPalette"],
    structure: ["active incident banner", "live evidence stream", "runbook checklist", "impacted services", "response commands"],
    outcomes: ["show active risk", "preserve operator context", "keep remediation steps explicit"],
    actions: ["acknowledge incident", "assign owner", "bookmark log evidence", "trigger rollback"],
    code: `<AsciiAlert variant="warning">Checkout latency is above SLO</AsciiAlert>
<AsciiLogViewer entries={entries} query={query} follow />
<AsciiRunbook steps={steps} selectedKey={activeStep} onStepSelect={setActiveStep} />`,
  },
  {
    id: "deployment-review",
    title: "Deployment Review",
    summary: "Track rollout progress, service health, endpoint latency, and approval gates during a production deploy.",
    components: ["AsciiProgress", "AsciiDataTable", "AsciiGauge", "AsciiStepper", "AsciiTabs"],
    structure: ["release metadata", "phase stepper", "rollout progress", "service comparison table", "approval and rollback rail"],
    outcomes: ["make rollout state scannable", "separate deploy phases", "surface rollback signals"],
    actions: ["approve release", "pause rollout", "open diff", "start rollback"],
    code: `<AsciiProgress value={rolloutPercent} width={50} aria-label="Deploy progress" />
<AsciiStepper steps={steps} activeKey={phase} onStepChange={setPhase} />
<AsciiDataTable columns={columns} rows={services} selectable />`,
  },
  {
    id: "log-explorer",
    title: "Log Explorer",
    summary: "Build a keyboard-friendly log review surface with filters, bookmarks, copy actions, and follow mode.",
    components: ["AsciiInput", "AsciiLogViewer", "AsciiButtonGroup", "AsciiBadge", "AsciiScrollArea"],
    structure: ["query and level toolbar", "streaming log pane", "bookmark rail", "selected line inspector", "copy/export actions"],
    outcomes: ["filter high-volume streams", "mark evidence", "copy exact context"],
    actions: ["change log level", "toggle follow mode", "bookmark line", "copy selected range"],
    code: `<AsciiInput label="filter:" value={query} onChange={(event) => setQuery(event.target.value)} />
<AsciiButtonGroup items={levelItems} value={level} onChange={setLevel} />
<AsciiLogViewer entries={filteredEntries} follow={follow} selectable />`,
  },
  {
    id: "trace-debugger",
    title: "Trace Debugger",
    summary: "Inspect request paths, service topology, span timing, runtime hotspots, and query impact in one debugging surface.",
    components: ["AsciiTraceTimeline", "AsciiDependencyGraph", "AsciiFlameGraph", "AsciiQueryPlan", "AsciiInspector"],
    structure: ["trace search header", "span waterfall", "dependency topology", "hot path profile", "selected span inspector"],
    outcomes: ["connect latency to services", "explain request fanout", "preserve span evidence beside runtime data"],
    actions: ["jump to slow span", "filter failed edges", "compare traces", "export evidence"],
    code: `<AsciiTraceTimeline spans={spans} selectedKey={spanKey} onSpanSelect={setSpanKey} />
<AsciiDependencyGraph nodes={nodes} edges={edges} activeNode={serviceKey} />
<AsciiFlameGraph frames={frames} title="Hot path" />
<AsciiQueryPlan steps={planSteps} title="Query impact" />`,
  },
  {
    id: "admin-settings",
    title: "Admin Settings",
    summary: "Manage account, environment, access, feature flags, and audit settings with dense ASCII form layouts.",
    components: ["AsciiForm", "AsciiField", "AsciiSwitch", "AsciiSelect", "AsciiAlertDialog"],
    structure: ["settings navigation", "sectioned form body", "policy summary", "danger zone", "confirmation dialog"],
    outcomes: ["keep risky settings explicit", "separate policy from account fields", "make save state visible"],
    actions: ["save changes", "reset section", "confirm destructive action", "review audit log"],
    code: `<AsciiForm title="Workspace Settings" sections={sections} actions={actions} />
<AsciiSwitch checked={ssoRequired} onChange={setSsoRequired} label="Require SSO" />
<AsciiAlertDialog open={confirmOpen} title="Rotate keys" onConfirm={rotateKeys} />`,
  },
  {
    id: "command-workbench",
    title: "Command Workbench",
    summary: "Compose terminal sessions, file navigation, command launchers, and process views for internal tools.",
    components: ["AsciiTerminal", "AsciiFileTree", "AsciiProcessTable", "AsciiSplitPane", "AsciiMenubar", "AsciiCommandPalette"],
    structure: ["menu bar", "file tree", "terminal session", "process monitor", "command palette"],
    outcomes: ["support repeated operator workflows", "keep controls dense", "preserve command history"],
    actions: ["run command", "open file", "kill process", "switch workspace"],
    code: `<AsciiSplitPane left={<AsciiFileTree nodes={files} />} right={<AsciiTerminal lines={lines} />} />
<AsciiProcessTable processes={processes} />
<AsciiCommandPalette open={open} items={commands} onSelect={runCommand} />`,
  },
];

export const docsRecipeCount = docsRecipes.length;

export function getDocsRecipe(id: string) {
  return docsRecipes.find((recipe) => recipe.id === id) ?? docsRecipes[0];
}
