import { useState } from "react";
import {
  AsciiAspectRatio,
  AsciiBadge,
  AsciiButton,
  AsciiCard,
  AsciiDiff,
  AsciiDivider,
  AsciiDrawer,
  AsciiDropdownMenu,
  AsciiFileTree,
  AsciiHoverCard,
  AsciiLogViewer,
  AsciiModal,
  AsciiPopover,
  AsciiProcessTable,
  AsciiProgress,
  AsciiSheet,
  AsciiStat,
  AsciiTag,
  AsciiTooltip,
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
        <div>- new diff viewer</div>
        <div>- live log stream</div>
        <div>- mobile-safe drag interactions</div>
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

function TriggerCompositionShowcase({ mode }: { mode: ShowcaseMode }) {
  return (
    <div className="feature-demo">
      <div className="feature-inline">
        <AsciiPopover
          asChild
          content={"Live traffic shift\nCurrent batch: 03\nNext check: 00:45"}
          width={28}
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
        <AsciiTooltip asChild text="hot path">
          <AsciiBadge>api-gateway</AsciiBadge>
        </AsciiTooltip>
        <AsciiHoverCard
          asChild
          content={"Owner: platform\nRunbook: ops/deploy\nSLA: 99.95%"}
          width={24}
        >
          <AsciiTag>service-info</AsciiTag>
        </AsciiHoverCard>
      </div>
      {mode === "components" && (
        <div className="output">`asChild` now works with buttons, badges, and other interactive children.</div>
      )}
    </div>
  );
}

function WindowShowcase({ mode }: { mode: ShowcaseMode }) {
  return (
    <AsciiWindow
      title="Incident Console"
      width={mode === "dashboard" ? 50 : 62}
      height={6}
      footer={<span>operator: oncall-2</span>}
    >
      <div>region ........ us-east-1</div>
      <div>incident ...... queue saturation</div>
      <div>mitigation .... autoscale + drain</div>
      <div>status ........ stable</div>
    </AsciiWindow>
  );
}

function LogViewerShowcase({ mode }: { mode: ShowcaseMode }) {
  return (
    <AsciiLogViewer
      title="Live Logs"
      width={mode === "dashboard" ? 56 : 68}
      height={6}
      footer={<span>follow: on</span>}
      lines={[
        { timestamp: "12:01", level: "info", source: "edge", message: "warmup complete" },
        { timestamp: "12:02", level: "success", source: "deploy", message: "traffic moved to batch-03" },
        { timestamp: "12:03", level: "warn", source: "worker", message: "retry budget at 68%" },
        { timestamp: "12:04", level: "debug", source: "queue", message: "lag sample = 42" },
        { timestamp: "12:05", level: "error", source: "api", message: "checkout timeout on shard-2" },
        { timestamp: "12:06", level: "info", source: "api", message: "p99 recovered to 84ms" },
      ]}
    />
  );
}

function DiffShowcase({ mode }: { mode: ShowcaseMode }) {
  return (
    <AsciiDiff
      title="Config Diff"
      width={mode === "dashboard" ? 58 : 72}
      height={6}
      footer={<span>+12  -4</span>}
      lines={[
        { type: "context", oldNumber: 18, newNumber: 18, content: "strategy: rolling" },
        { type: "remove", oldNumber: 19, content: "maxUnavailable: 1" },
        { type: "add", newNumber: 19, content: "maxUnavailable: 0" },
        { type: "add", newNumber: 20, content: "readinessGate: deploy-ready" },
        { type: "context", oldNumber: 20, newNumber: 21, content: "maxSurge: 1" },
        { type: "add", newNumber: 22, content: "rollbackWindow: 10m" },
      ]}
    />
  );
}

function FileTreeShowcase({ mode }: { mode: ShowcaseMode }) {
  return (
    <AsciiFileTree
      title="Repo Tree"
      width={mode === "dashboard" ? 48 : 56}
      height={6}
      footer={<span>branch: codex/ops-upgrades</span>}
      items={[
        {
          path: "src",
          name: "src",
          kind: "folder",
          expanded: true,
          children: [
            { path: "src/app.tsx", name: "app.tsx", kind: "file", meta: "3.2kB" },
            { path: "src/ops", name: "ops", kind: "folder", expanded: true, children: [
              { path: "src/ops/log-viewer.tsx", name: "log-viewer.tsx", kind: "file", meta: "new", selected: true },
              { path: "src/ops/diff.tsx", name: "diff.tsx", kind: "file", meta: "new" },
            ] },
          ],
        },
        { path: "README.md", name: "README.md", kind: "file", meta: "updated" },
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
      processes={[
        { pid: 412, name: "api-gateway", cpu: 18, memory: "256M", state: "ready" },
        { pid: 518, name: "queue-worker", cpu: 74, memory: "612M", state: "scale" },
        { pid: 144, name: "postgres", cpu: 21, memory: "2.1G", state: "ready" },
        { pid: 923, name: "realtime", cpu: 32, memory: "188M", state: "ready" },
        { pid: 731, name: "scheduler", cpu: 9, memory: "92M", state: "idle" },
      ]}
    />
  );
}

const featureShowcases = [
  {
    id: "surface-composition",
    title: "Composable Surfaces",
    description: "Cards, modal-like surfaces, and aspect-ratio frames now host real React content.",
    renderDashboard: () => <SurfaceCompositionShowcase mode="dashboard" />,
    renderComponents: () => <SurfaceCompositionShowcase mode="components" />,
  },
  {
    id: "trigger-composition",
    title: "Composable Triggers",
    description: "Popover, dropdown, tooltip, and hover card triggers can now attach to existing components.",
    renderDashboard: () => <TriggerCompositionShowcase mode="dashboard" />,
    renderComponents: () => <TriggerCompositionShowcase mode="components" />,
  },
  {
    id: "window",
    title: "AsciiWindow",
    description: "A reusable terminal-window shell for richer app panels.",
    renderDashboard: () => <WindowShowcase mode="dashboard" />,
    renderComponents: () => <WindowShowcase mode="components" />,
  },
  {
    id: "log-viewer",
    title: "AsciiLogViewer",
    description: "Live log streams with levels, timestamps, and source columns.",
    renderDashboard: () => <LogViewerShowcase mode="dashboard" />,
    renderComponents: () => <LogViewerShowcase mode="components" />,
  },
  {
    id: "diff",
    title: "AsciiDiff",
    description: "Unified diffs for config, code review, and change previews.",
    renderDashboard: () => <DiffShowcase mode="dashboard" />,
    renderComponents: () => <DiffShowcase mode="components" />,
  },
  {
    id: "file-tree",
    title: "AsciiFileTree",
    description: "Project and deployment trees with file metadata and active selection.",
    renderDashboard: () => <FileTreeShowcase mode="dashboard" />,
    renderComponents: () => <FileTreeShowcase mode="components" />,
  },
  {
    id: "process-table",
    title: "AsciiProcessTable",
    description: "A process monitor view tuned for infrastructure dashboards.",
    renderDashboard: () => <ProcessTableShowcase mode="dashboard" />,
    renderComponents: () => <ProcessTableShowcase mode="components" />,
  },
] as const;

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
