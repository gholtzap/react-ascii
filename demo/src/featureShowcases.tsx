import { useEffect, useMemo, useState } from "react";
import {
  AsciiAspectRatio,
  AsciiBadge,
  AsciiBox,
  AsciiButton,
  AsciiCard,
  AsciiCommandPalette,
  AsciiDataTable,
  AsciiDependencyGraph,
  AsciiDiff,
  AsciiDivider,
  AsciiDrawer,
  AsciiDropdownMenu,
  AsciiFileTree,
  AsciiForm,
  AsciiHoverCard,
  AsciiInput,
  AsciiInspector,
  AsciiLabel,
  AsciiLogViewer,
  AsciiModal,
  AsciiPopover,
  AsciiProcessTable,
  AsciiProgress,
  AsciiQueryPlan,
  AsciiRackMap,
  AsciiSequenceDiagram,
  AsciiSheet,
  AsciiSplitPane,
  AsciiStat,
  AsciiStatusGrid,
  AsciiSelect,
  AsciiTag,
  AsciiTerminal,
  AsciiTextarea,
  AsciiTheme,
  AsciiTooltip,
  AsciiTraceTimeline,
  AsciiCheckbox,
  AsciiFlameGraph,
  AsciiWindow,
} from "ascii-lib";

type ShowcaseMode = "dashboard" | "components";

function SurfaceCompositionShowcase({ mode }: { mode: ShowcaseMode }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="feature-demo">
      <AsciiCard
        title="Composable Surfaces"
        width={mode === "dashboard" ? 48 : 60}
        footer={
          <div className="feature-actions">
            <AsciiBadge>beta</AsciiBadge>
            <AsciiButton label="Open modal" border="single" onClick={() => setModalOpen(true)} />
          </div>
        }
      >
        <AsciiStat label="Deploy confidence" value="94%" trend={6.1} width={20} />
        <AsciiProgress value={78} width={22} />
        <div className="feature-actions">
          <AsciiButton label="Open sheet" border="single" onClick={() => setSheetOpen(true)} />
          <AsciiButton label="Open drawer" border="single" onClick={() => setDrawerOpen(true)} />
        </div>
      </AsciiCard>
      <div style={{ marginTop: "0.75rem" }}>
        <AsciiAspectRatio ratio={16 / 9} width={mode === "dashboard" ? 48 : 60} border="double">
          <AsciiWindow title="preview" width={mode === "dashboard" ? 42 : 54} height={4} chrome="none">
            <div>feature rollout</div>
            <div>region: us-east-1</div>
            <div>batch: 03 / 10</div>
          </AsciiWindow>
        </AsciiAspectRatio>
      </div>
      <AsciiModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Deploy Plan"
        width={58}
      >
        <AsciiBadge>canary</AsciiBadge>
        <AsciiBadge>2 regions</AsciiBadge>
        <div>Traffic: 5% → 25% → 100%</div>
        <div>Checks: latency, error-rate, saturation</div>
      </AsciiModal>
      <AsciiSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Release Notes"
        width={54}
        side="right"
      >
        <div>v2.5.1</div>
        <div>- adaptive overlays</div>
        <div>- live diagnostics</div>
        <div>- topology panel</div>
      </AsciiSheet>
      <AsciiDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Ops Drawer"
        width={52}
        side="bottom"
      >
        <div>checkpoint: ready-to-promote</div>
        <div>change budget: 12m remaining</div>
        <div>rollback target: v2.5.0</div>
      </AsciiDrawer>
    </div>
  );
}

function AdaptiveOverlayShowcase() {
  return (
    <div className="feature-demo">
      <div className="feature-inline">
        <AsciiPopover
          asChild
          content={
            <div className="feature-popup-body">
              <div>Canary Shift</div>
              <div>batch: 03 / 10</div>
              <div>next gate: 00:45</div>
            </div>
          }
        >
          <AsciiButton label="Shift Traffic" border="single" />
        </AsciiPopover>
        <AsciiDropdownMenu
          asChild
          trigger={<AsciiButton label="Actions" border="double" />}
          width={26}
          items={[
            { key: "ship", label: "Ship build" },
            { key: "pause", label: "Pause rollout" },
            { key: "sep", label: "", separator: true },
            { key: "rollback", label: "Rollback", danger: true },
          ]}
          onSelect={() => {}}
        />
      </div>
      <div className="feature-inline" style={{ marginTop: "0.75rem" }}>
        <AsciiTooltip
          asChild
          content={
            <div className="feature-popup-body">
              <div>route: /api/checkout</div>
              <div>p99: 84ms</div>
            </div>
          }
        >
          <AsciiBadge>hot path</AsciiBadge>
        </AsciiTooltip>
        <AsciiHoverCard
          asChild
          content={
            <div className="feature-popup-body">
              <div>Owner: platform</div>
              <div>Runbook: ops/deploy</div>
              <div>SLA: 99.95%</div>
            </div>
          }
        >
          <AsciiTag>service-info</AsciiTag>
        </AsciiHoverCard>
      </div>
      <div className="output">Auto-sized popups now accept full React content, not just strings.</div>
    </div>
  );
}

function FormWorkflowShowcase({ mode }: { mode: ShowcaseMode }) {
  const [service, setService] = useState("api-gateway");
  const [environment, setEnvironment] = useState("staging");
  const [notes, setNotes] = useState("Shift traffic after checkout and auth checks clear.");
  const [verificationOnly, setVerificationOnly] = useState(true);
  const [lastAction, setLastAction] = useState("draft synced 12:14");
  const formWidth = mode === "dashboard" ? 58 : 72;
  const fieldWidth = mode === "dashboard" ? 24 : 28;
  const textareaWidth = mode === "dashboard" ? 48 : 60;
  const checkWidth = mode === "dashboard" ? 20 : 24;

  return (
    <AsciiForm
      title="Release Request"
      width={formWidth}
      description="Collect rollout intent, operator notes, and safety gates in one surface."
      status={<AsciiBadge variant="outline">{verificationOnly ? "verify-only" : "live deploy"}</AsciiBadge>}
      summary={
        <div style={{ whiteSpace: "pre-wrap" }}>
          <div>service: {service}</div>
          <div>target: {environment}</div>
          <div>mode: {verificationOnly ? "verification" : "rollout"}</div>
        </div>
      }
      notices={[
        {
          key: "approval",
          tone: "warn",
          label: "gate",
          message: "#platform-release approval required before production.",
        },
      ]}
      sections={[
        {
          key: "target",
          title: "Target",
          description: "Route the change to the correct service and environment.",
          columns: 2,
          children: (
            <>
              <AsciiInput
                label="service:"
                width={fieldWidth}
                value={service}
                onChange={(event) => setService(event.target.value)}
              />
              <div style={{ display: "grid", gap: "0.25rem" }}>
                <AsciiLabel>environment</AsciiLabel>
                <AsciiSelect
                  width={fieldWidth}
                  value={environment}
                  onChange={setEnvironment}
                  options={[
                    { value: "staging", label: "Staging" },
                    { value: "production", label: "Production" },
                    { value: "dev", label: "Development" },
                  ]}
                />
              </div>
            </>
          ),
          aside: (
            <AsciiBox width={checkWidth} title="checks" border="single">
              {"owner: platform\nwindow: 02:00\nrisk: low"}
            </AsciiBox>
          ),
        },
        {
          key: "plan",
          title: "Plan",
          description: "Capture operator intent and safety mode for this rollout.",
          children: (
            <>
              <AsciiTextarea
                label="notes:"
                width={textareaWidth}
                height={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
              <AsciiCheckbox
                label="Run verification only"
                checked={verificationOnly}
                onChange={(event) => setVerificationOnly(event.target.checked)}
              />
            </>
          ),
        },
      ]}
      actions={(
        <>
          <AsciiButton
            label="Save Draft"
            border="single"
            type="button"
            onClick={() => setLastAction("draft synced 12:16")}
          />
          <AsciiButton
            label="Queue Deploy"
            border="double"
            type="button"
            onClick={() => setLastAction(`queued ${service} -> ${environment}`)}
          />
        </>
      )}
      footer={<span>{lastAction}</span>}
    />
  );
}

function TerminalShowcase({ mode }: { mode: ShowcaseMode }) {
  const [streamLines, setStreamLines] = useState<string[]>([
    "watch mode attached",
    "stream source: deploy-controller",
    "",
  ]);

  useEffect(() => {
    const messages = [
      "12:11 batch-03 entered verification",
      "12:12 latency stayed under 90ms",
      "12:13 queue depth dropped to 18",
      "12:14 promotion gate passed",
    ];

    const timer = window.setInterval(() => {
      setStreamLines((current) => {
        const nextMessage = messages[current.length % messages.length];
        return [...current, nextMessage].slice(-8);
      });
    }, 1600);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <AsciiTerminal
      title="ops-shell"
      width={mode === "dashboard" ? 54 : 68}
      height={6}
      prompt="$ "
      streamLines={streamLines}
      filterQuery="12:"
      searchQuery="gate"
      status={<span>live stream • filter: timestamps • search: gate</span>}
      toolbar={
        <div className="feature-toolbar">
          <AsciiBadge>stream</AsciiBadge>
          <AsciiBadge variant="outline">search</AsciiBadge>
        </div>
      }
      onCommand={(command) => {
        if (command === "help") {
          return ["status   current rollout status", "tail     keep stream open", "clear    reset scrollback"];
        }

        if (command === "status") {
          return "rollout gate is green";
        }

        return `command queued: ${command}`;
      }}
    />
  );
}

function LogViewerShowcase({ mode }: { mode: ShowcaseMode }) {
  const logs = useMemo(
    () => [
      { id: "warmup", timestamp: "12:01", level: "info" as const, source: "edge", message: "warmup complete" },
      { id: "shift", timestamp: "12:02", level: "success" as const, source: "deploy", message: "traffic moved to batch-03" },
      { id: "budget", timestamp: "12:03", level: "warn" as const, source: "worker", message: "retry budget at 68%" },
      { id: "lag", timestamp: "12:04", level: "debug" as const, source: "queue", message: "lag sample = 42" },
      { id: "timeout", timestamp: "12:05", level: "error" as const, source: "api", message: "checkout timeout on shard-2" },
      { id: "recover", timestamp: "12:06", level: "info" as const, source: "api", message: "p99 recovered to 84ms" },
    ],
    []
  );

  return (
    <AsciiLogViewer
      title="Live Logs"
      width={mode === "dashboard" ? 56 : 68}
      height={6}
      footer={<span>follow: on</span>}
      query="queue"
      levels={["debug", "warn", "error"]}
      defaultFollow={false}
      defaultSelectedId="budget"
      defaultBookmarkedIds={["budget"]}
      toolbar={
        <div className="feature-toolbar">
          <AsciiBadge>query: queue</AsciiBadge>
          <AsciiBadge variant="outline">levels: dbg,warn,err</AsciiBadge>
        </div>
      }
      lines={logs}
    />
  );
}

function CommandWorkbenchShowcase({ mode }: { mode: ShowcaseMode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState("deploy");

  const commandItems = [
    { key: "deploy", label: "Ship canary", group: "Deploy", shortcut: "D" },
    { key: "rollback", label: "Rollback batch", group: "Deploy", shortcut: "R" },
    { key: "latency", label: "Inspect latency", group: "Observe", shortcut: "L" },
    { key: "queue", label: "Open queue drain", group: "Observe", shortcut: "Q" },
    { key: "config", label: "Edit rollout config", group: "Change", shortcut: "C" },
    { key: "alerts", label: "Adjust alert rules", group: "Change", shortcut: "A" },
  ];

  return (
    <div className="feature-demo">
      <AsciiSplitPane
        width={mode === "dashboard" ? 58 : 72}
        initialSplit={mode === "dashboard" ? 42 : 36}
        leftPanel={{
          title: "Workspace",
          footer: <span>split: command dock</span>,
          content: (
            <div style={{ whiteSpace: "pre-wrap" }}>
              <div>queued: 3</div>
              <div>recent: {selectedCommand}</div>
              <div>shortcut: press open to build recent history</div>
            </div>
          ),
        }}
        rightPanel={{
          title: "Preview",
          footer: <span>palette groups + recent</span>,
          content: (
            <div style={{ whiteSpace: "pre-wrap" }}>
              <div>current command</div>
              <div>{selectedCommand}</div>
              <div style={{ marginTop: "0.5rem" }}>
                <AsciiFileTree
                  title="runbooks"
                  width={mode === "dashboard" ? 24 : 30}
                  height={4}
                  items={[
                    {
                      path: "ops",
                      name: "ops",
                      kind: "folder",
                      expanded: true,
                      children: [
                        { path: "ops/deploy.md", name: "deploy.md", kind: "file", selected: selectedCommand === "deploy" },
                        { path: "ops/rollback.md", name: "rollback.md", kind: "file", selected: selectedCommand === "rollback" },
                      ],
                    },
                  ]}
                />
              </div>
            </div>
          ),
        }}
      />
      <div style={{ marginTop: "0.75rem" }}>
        <AsciiButton label="Open Palette" border="double" onClick={() => setPaletteOpen(true)} />
      </div>
      <AsciiCommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onSelect={(key) => {
          setSelectedCommand(key);
        }}
        items={commandItems}
        placeholder="Search command groups..."
        width={mode === "dashboard" ? 52 : 60}
      />
    </div>
  );
}

function DataTableShowcase({ mode }: { mode: ShowcaseMode }) {
  return (
    <div className="feature-demo">
      <AsciiDataTable
        columns={[
          { key: "name", header: "NAME", width: 16, sortable: true },
          { key: "region", header: "REGION", width: 12, sortable: true },
          { key: "latency", header: "P99", width: 10, align: "right", sortable: true },
          { key: "status", header: "STATUS", width: 14 },
        ]}
        data={[
          { name: "api-gateway", region: "us-east-1", latency: "48ms", status: "● healthy" },
          { name: "checkout", region: "us-west-2", latency: "91ms", status: "◐ draining" },
          { name: "billing", region: "eu-west-1", latency: "63ms", status: "● healthy" },
          { name: "search", region: "ap-southeast", latency: "118ms", status: "○ cold" },
        ]}
        pageSize={3}
        height={5}
        selectable
        rowKey="name"
        defaultSelectedKeys={["checkout"]}
        pinnedColumns={["name"]}
        resizableColumns
      />
      <div style={{ marginTop: "0.75rem" }}>
        <AsciiDataTable
          columns={[
            { key: "env", header: "ENV", width: 10 },
            { key: "state", header: "STATE", width: 20 },
          ]}
          data={[]}
          loading={mode === "dashboard"}
          error={mode === "components" ? "control plane unreachable" : undefined}
        />
      </div>
    </div>
  );
}

function DiffShowcase({ mode }: { mode: ShowcaseMode }) {
  return (
    <AsciiDiff
      title="Config Diff"
      width={mode === "dashboard" ? 58 : 72}
      height={7}
      footer={<span>+12  -4</span>}
      query="gate"
      collapseUnchangedAfter={1}
      toolbar={
        <div className="feature-toolbar">
          <AsciiBadge>search: gate</AsciiBadge>
          <AsciiBadge variant="outline">fold context</AsciiBadge>
        </div>
      }
      lines={[
        { type: "context", oldNumber: 15, newNumber: 15, content: "strategy: rolling" },
        { type: "context", oldNumber: 16, newNumber: 16, content: "region: us-east-1" },
        { type: "context", oldNumber: 17, newNumber: 17, content: "replicas: 3" },
        { type: "remove", oldNumber: 18, content: "maxUnavailable: 1" },
        { type: "add", newNumber: 18, content: "maxUnavailable: 0" },
        { type: "add", newNumber: 19, content: "readinessGate: deploy-ready" },
        { type: "context", oldNumber: 19, newNumber: 20, content: "maxSurge: 1" },
        { type: "context", oldNumber: 20, newNumber: 21, content: "env: production" },
        { type: "add", newNumber: 22, content: "rollbackGate: 10m" },
      ]}
    />
  );
}

function ProcessTableShowcase({ mode }: { mode: ShowcaseMode }) {
  return (
    <AsciiProcessTable
      title="Runtime Processes"
      width={mode === "dashboard" ? 58 : 70}
      height={5}
      footer={<span>host: node-17</span>}
      query="queue"
      sortBy="cpu"
      sortDirection="desc"
      toolbar={
        <div className="feature-toolbar">
          <AsciiBadge>query: queue</AsciiBadge>
          <AsciiBadge variant="outline">sort: cpu desc</AsciiBadge>
        </div>
      }
      processes={[
        { pid: 412, name: "api-gateway", cpu: 18, memory: "256M", state: "ready" },
        { pid: 518, name: "queue-worker", cpu: 74, memory: "612M", state: "scale" },
        { pid: 144, name: "postgres", cpu: 21, memory: "2.1G", state: "ready" },
        { pid: 923, name: "realtime", cpu: 32, memory: "188M", state: "ready" },
        { pid: 731, name: "queue-router", cpu: 9, memory: "92M", state: "idle" },
      ]}
    />
  );
}

function InspectorGridShowcase({ mode }: { mode: ShowcaseMode }) {
  return (
    <div className="feature-demo">
      <AsciiInspector
        title="Deploy Inspector"
        width={mode === "dashboard" ? 50 : 60}
        footer={<span>revision: v2.5.1-rc.2</span>}
        entries={[
          { key: "svc", label: "service", value: "api-gateway", group: "deployment", tone: "info" },
          { key: "batch", label: "batch", value: "03 / 10", tone: "success" },
          { key: "risk", label: "risk", value: "low", group: "policy", tone: "success" },
          { key: "budget", label: "budget", value: "12m remaining", tone: "warn" },
          { key: "owner", label: "owner", value: "platform", group: "routing", meta: "pagerduty: core-apps" },
          { key: "runbook", label: "runbook", value: "ops/deploy/canary" },
        ]}
      />
      <div style={{ marginTop: "0.75rem" }}>
        <AsciiStatusGrid
          title="Status Grid"
          width={mode === "dashboard" ? 50 : 60}
          columns={2}
          items={[
            { key: "latency", label: "Latency", value: "84ms", hint: "p99", tone: "success" },
            { key: "error", label: "Error Rate", value: "0.02%", hint: "5m", tone: "success" },
            { key: "saturation", label: "Queue", value: "68%", hint: "budget", tone: "warn" },
            { key: "users", label: "Sessions", value: "3,291", hint: "active", tone: "info" },
          ]}
        />
      </div>
    </div>
  );
}

function TraceTopologyShowcase({ mode }: { mode: ShowcaseMode }) {
  return (
    <div className="feature-demo">
      <AsciiTraceTimeline
        title="Trace Timeline"
        width={mode === "dashboard" ? 56 : 70}
        height={5}
        footer={<span>trace: 91d3f6</span>}
        spans={[
          { key: "root", label: "GET /checkout", service: "edge", duration: "184ms", status: "success" },
          { key: "auth", label: "authorize", service: "auth", duration: "22ms", depth: 1, status: "success" },
          { key: "cart", label: "hydrate cart", service: "cart", duration: "36ms", depth: 1, status: "success" },
          { key: "inventory", label: "reserve stock", service: "inventory", duration: "74ms", depth: 2, status: "warn" },
          { key: "payment", label: "charge intent", service: "billing", duration: "41ms", depth: 1, status: "success" },
        ]}
      />
      <div style={{ marginTop: "0.75rem" }}>
        <AsciiDependencyGraph
          title="Service Topology"
          width={mode === "dashboard" ? 56 : 70}
          height={6}
          footer={<span>env: production</span>}
          nodes={[
            { id: "edge", label: "edge", meta: "3 regions", status: "success" },
            { id: "api", label: "api-gateway", meta: "batch-03", status: "success" },
            { id: "auth", label: "auth-service", meta: "healthy", status: "success" },
            { id: "queue", label: "queue-worker", meta: "scaling", status: "warn" },
            { id: "db", label: "postgres-main", meta: "primary", status: "success" },
          ]}
          edges={[
            { from: "edge", to: "api", label: "840 rps" },
            { from: "api", to: "auth", label: "48ms" },
            { from: "api", to: "queue", label: "drain" },
            { from: "api", to: "db", label: "12ms" },
          ]}
        />
      </div>
    </div>
  );
}

function SequenceRackShowcase({ mode }: { mode: ShowcaseMode }) {
  return (
    <div className="feature-demo">
      <AsciiSequenceDiagram
        title="Deploy Handshake"
        width={mode === "dashboard" ? 56 : 70}
        height={5}
        footer={<span>batch: 03 / 10</span>}
        participants={["edge", "api", "auth", "db"]}
        messages={[
          { key: "1", from: "edge", to: "api", label: "POST /deploy", tone: "success" },
          { key: "2", from: "api", to: "auth", label: "verify signer", tone: "neutral" },
          { key: "3", from: "auth", to: "api", label: "token ok", tone: "success" },
          { key: "4", from: "api", to: "db", label: "write rollout", note: "84ms", tone: "warn" },
          { key: "5", from: "db", to: "api", label: "commit", tone: "success" },
        ]}
      />
      <div style={{ marginTop: "0.75rem" }}>
        <AsciiRackMap
          title="Rack Heat"
          width={mode === "dashboard" ? 56 : 70}
          height={3}
          footer={<span>zone: us-east-1</span>}
          racks={[
            {
              key: "rack-a",
              label: "rack-a",
              slots: [
                { key: "a1", label: "ap", status: "success" },
                { key: "a2", label: "db", status: "success" },
                { key: "a3", label: "qw", status: "warn" },
                { key: "a4", label: "cd", status: "neutral" },
              ],
            },
            {
              key: "rack-b",
              label: "rack-b",
              slots: [
                { key: "b1", label: "ap", status: "success" },
                { key: "b2", label: "rd", status: "success" },
                { key: "b3", label: "wk", status: "warn" },
                { key: "b4", label: "ml", status: "error" },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
}

function RuntimePlanShowcase({ mode }: { mode: ShowcaseMode }) {
  return (
    <div className="feature-demo">
      <AsciiFlameGraph
        title="CPU Flame"
        width={mode === "dashboard" ? 56 : 70}
        height={5}
        footer={<span>host: node-17</span>}
        frames={[
          { key: "1", label: "requestLoop", depth: 0, span: 100, tone: "success" },
          { key: "2", label: "checkoutRoute", depth: 1, span: 82, tone: "success" },
          { key: "3", label: "inventoryReserve", depth: 2, span: 54, tone: "warn" },
          { key: "4", label: "pricingEngine", depth: 2, span: 33, tone: "neutral" },
          { key: "5", label: "serializeResponse", depth: 1, span: 21, tone: "neutral" },
        ]}
      />
      <div style={{ marginTop: "0.75rem" }}>
        <AsciiQueryPlan
          title="Query Plan"
          width={mode === "dashboard" ? 56 : 70}
          height={5}
          footer={<span>relation: orders</span>}
          steps={[
            { key: "1", label: "Nested Loop", rows: "128", cost: "42", tone: "warn" },
            { key: "2", label: "Index Scan", relation: "orders_idx", depth: 1, rows: "128", cost: "18", tone: "success" },
            { key: "3", label: "Bitmap Heap Scan", relation: "payments", depth: 1, rows: "64", cost: "16", tone: "neutral" },
            { key: "4", label: "Sort", depth: 2, rows: "64", cost: "8", tone: "neutral" },
            { key: "5", label: "Materialize", depth: 2, rows: "64", cost: "5", tone: "success" },
          ]}
        />
      </div>
    </div>
  );
}

const featureShowcases = [
  {
    id: "surface-composition",
    title: "Composable Surfaces",
    description: "Cards, modal-like surfaces, and aspect-ratio frames host full React content and richer workflows.",
    renderDashboard: () => <SurfaceCompositionShowcase mode="dashboard" />,
    renderComponents: () => <SurfaceCompositionShowcase mode="components" />,
  },
  {
    id: "adaptive-overlays",
    title: "Adaptive Overlays",
    description: "Tooltip, hover card, and popover now auto-size around React content and preserve composed trigger props.",
    renderDashboard: () => <AdaptiveOverlayShowcase />,
    renderComponents: () => <AdaptiveOverlayShowcase />,
  },
  {
    id: "form",
    title: "AsciiForm",
    description: "Sectioned forms now support notices, summaries, action bars, and structured rollout workflows.",
    renderDashboard: () => <FormWorkflowShowcase mode="dashboard" />,
    renderComponents: () => <FormWorkflowShowcase mode="components" />,
  },
  {
    id: "terminal",
    title: "AsciiTerminal",
    description: "Terminal sessions can now blend live stream lines with command history, search, and filtered views.",
    renderDashboard: () => <TerminalShowcase mode="dashboard" />,
    renderComponents: () => <TerminalShowcase mode="components" />,
  },
  {
    id: "log-viewer",
    title: "AsciiLogViewer",
    description: "Live logs now support toolbar content, search filtering, bookmarks, copy actions, and follow control.",
    renderDashboard: () => <LogViewerShowcase mode="dashboard" />,
    renderComponents: () => <LogViewerShowcase mode="components" />,
  },
  {
    id: "command-workbench",
    title: "AsciiCommandPalette + AsciiSplitPane",
    description: "Grouped commands now learn recent actions, and split workbenches compose side-by-side task views.",
    renderDashboard: () => <CommandWorkbenchShowcase mode="dashboard" />,
    renderComponents: () => <CommandWorkbenchShowcase mode="components" />,
  },
  {
    id: "data-table",
    title: "AsciiDataTable",
    description: "Data tables now support row selection, keyboard navigation, pinned columns, resize controls, and loading/error states.",
    renderDashboard: () => <DataTableShowcase mode="dashboard" />,
    renderComponents: () => <DataTableShowcase mode="components" />,
  },
  {
    id: "diff",
    title: "AsciiDiff",
    description: "Diffs can search within content and collapse long unchanged regions.",
    renderDashboard: () => <DiffShowcase mode="dashboard" />,
    renderComponents: () => <DiffShowcase mode="components" />,
  },
  {
    id: "process-table",
    title: "AsciiProcessTable",
    description: "Process monitors gained query filtering, sortable summaries, and toolbar composition.",
    renderDashboard: () => <ProcessTableShowcase mode="dashboard" />,
    renderComponents: () => <ProcessTableShowcase mode="components" />,
  },
  {
    id: "inspector-grid",
    title: "AsciiInspector + AsciiStatusGrid",
    description: "New domain components for inspection panels and dense operational status boards.",
    renderDashboard: () => <InspectorGridShowcase mode="dashboard" />,
    renderComponents: () => <InspectorGridShowcase mode="components" />,
  },
  {
    id: "trace-topology",
    title: "AsciiTraceTimeline + AsciiDependencyGraph",
    description: "New observability views for trace spans and service topology relationships.",
    renderDashboard: () => <TraceTopologyShowcase mode="dashboard" />,
    renderComponents: () => <TraceTopologyShowcase mode="components" />,
  },
  {
    id: "sequence-rack",
    title: "AsciiSequenceDiagram + AsciiRackMap",
    description: "New infrastructure views for request choreography and dense rack-level status mapping.",
    renderDashboard: () => <SequenceRackShowcase mode="dashboard" />,
    renderComponents: () => <SequenceRackShowcase mode="components" />,
  },
  {
    id: "runtime-plan",
    title: "AsciiFlameGraph + AsciiQueryPlan",
    description: "New runtime and database diagnostics for hot-path profiling and query planning.",
    renderDashboard: () => <RuntimePlanShowcase mode="dashboard" />,
    renderComponents: () => <RuntimePlanShowcase mode="components" />,
  },
  {
    id: "theming",
    title: "AsciiTheme + color prop",
    description: "First-class theming with AsciiTheme provider, 4 built-in presets, custom overrides, nestable scoped themes, and per-component color prop.",
    renderDashboard: () => <ThemingShowcase mode="dashboard" />,
    renderComponents: () => <ThemingShowcase mode="components" />,
  },
] as const;

function ThemingShowcase({ mode }: { mode: ShowcaseMode }) {
  const w = mode === "dashboard" ? 44 : 56;
  const [liveColor, setLiveColor] = useState("#00e5ff");
  const [liveAccent, setLiveAccent] = useState("#ff00ff");
  const [livePreset, setLivePreset] = useState<"phosphor" | "amber" | "paper" | "mono">("phosphor");

  if (mode === "dashboard") {
    return (
      <div className="feature-demo">
        <div className="feature-inline">
          <AsciiTheme preset="phosphor">
            <AsciiBox width={w} title="phosphor" border="single">
              <AsciiProgress value={72} width={w - 6} />
              {"\n"}
              <AsciiBadge>deploy</AsciiBadge>{" "}<AsciiButton label="Run" />
            </AsciiBox>
          </AsciiTheme>
        </div>
        <div className="feature-inline">
          <AsciiTheme preset="amber">
            <AsciiBox width={w} title="amber" border="single">
              <AsciiProgress value={45} width={w - 6} />
              {"\n"}
              <AsciiBadge>staging</AsciiBadge>{" "}<AsciiButton label="Run" />
            </AsciiBox>
          </AsciiTheme>
        </div>
        <div className="feature-inline">
          <AsciiTheme preset="paper">
            <AsciiBox width={w} title="paper" border="single">
              <AsciiProgress value={91} width={w - 6} />
              {"\n"}
              <AsciiBadge>release</AsciiBadge>{" "}<AsciiButton label="Run" />
            </AsciiBox>
          </AsciiTheme>
        </div>
        <div className="feature-inline">
          <AsciiTheme preset="mono">
            <AsciiBox width={w} title="mono" border="single">
              <AsciiProgress value={60} width={w - 6} />
              {"\n"}
              <AsciiBadge>build</AsciiBadge>{" "}<AsciiButton label="Run" />
            </AsciiBox>
          </AsciiTheme>
        </div>
      </div>
    );
  }

  return (
    <div className="feature-demo">
      <div className="label">interactive color prop</div>
      <div className="feature-inline">
        <input type="color" value={liveColor} onChange={(e) => setLiveColor(e.target.value)} style={{ background: "none", border: "none", width: "2rem", height: "1.5rem", cursor: "pointer", padding: 0 }} />
        <AsciiButton label="Live Color" color={liveColor} />
        <AsciiBadge color={liveColor}>badge</AsciiBadge>
        <AsciiProgress value={65} width={20} color={liveColor} />
      </div>
      <div style={{ marginTop: "0.75rem" }} className="label">interactive custom accent</div>
      <div className="feature-inline">
        <input type="color" value={liveAccent} onChange={(e) => setLiveAccent(e.target.value)} style={{ background: "none", border: "none", width: "2rem", height: "1.5rem", cursor: "pointer", padding: 0 }} />
        {(["phosphor", "amber", "paper", "mono"] as const).map((p) => (
          <AsciiButton key={p} label={p} border={livePreset === p ? "double" : "single"} onClick={() => setLivePreset(p)} />
        ))}
      </div>
      <AsciiTheme preset={livePreset} vars={{ accent: liveAccent }}>
        <AsciiCard title="Custom accent preview" width={w}>
          <AsciiStat label="Score" value="94%" trend={12} width={20} />
          <AsciiProgress value={88} width={w - 6} />
          <div className="feature-inline">
            <AsciiBadge>live</AsciiBadge>
            <AsciiButton label="Action" />
          </div>
        </AsciiCard>
      </AsciiTheme>
      <div style={{ marginTop: "0.75rem" }} className="label">static color prop samples</div>
      <div className="feature-inline">
        <AsciiButton label="Default" />
        <AsciiButton label="Coral" color="#ff6b6b" />
        <AsciiButton label="Cyan" color="#00e5ff" />
        <AsciiButton label="Gold" color="#ffd700" />
        <AsciiButton label="Violet" color="#b388ff" />
      </div>
      <div style={{ marginTop: "0.75rem" }} className="label">nested scoped themes</div>
      <AsciiTheme preset="phosphor">
        <AsciiBox width={w} title="outer: phosphor">
          {"Phosphor shell\n"}
          <AsciiTheme preset="amber">
            <AsciiBox width={w - 6} title="inner: amber">
              {"Amber island"}
            </AsciiBox>
          </AsciiTheme>
        </AsciiBox>
      </AsciiTheme>
    </div>
  );
}

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
