import { useState, useEffect } from "react";
import {
  AsciiBox,
  AsciiButton,
  AsciiInput,
  AsciiCheckbox,
  AsciiRadio,
  AsciiSelect,
  AsciiTable,
  AsciiTabs,
  AsciiAccordion,
  AsciiModal,
  AsciiAlert,
  AsciiBadge,
  AsciiProgress,
  AsciiSpinner,
  AsciiTooltip,
  AsciiDivider,
  AsciiCard,
  AsciiTree,
  AsciiToggle,
  AsciiCode,
  AsciiTextarea,
  AsciiBarChart,
  AsciiHeatmap,
  AsciiGauge,
  AsciiSlider,
  AsciiStepper,
  AsciiDatePicker,
  AsciiTerminal,
  AsciiKbd,
  AsciiAsciiText,
  AsciiResizable,
  AsciiSplitPane,
  AsciiSheet,
  AsciiAlertDialog,
  AsciiAspectRatio,
  AsciiButtonGroup,
  AsciiCalendar,
  AsciiCarousel,
  AsciiCollapsible,
  AsciiCombobox,
  AsciiContextMenu,
  AsciiDataTable,
  AsciiDirection,
  AsciiDrawer,
  AsciiEmpty,
  AsciiField,
  AsciiForm,
  AsciiHoverCard,
  AsciiInputGroup,
  AsciiInputOTP,
  AsciiItem,
  AsciiLabel,
  AsciiMenubar,
  AsciiNativeSelect,
  AsciiNavigationMenu,
  AsciiPopover,
  AsciiScrollArea,
  AsciiSonner,
  useAsciiSonner,
  AsciiSwitch,
  AsciiToggleGroup,
  AsciiTypography,
  AsciiStat,
  AsciiSparkline,
  AsciiTimeline,
  AsciiAvatar,
  AsciiCommandPalette,
  AsciiDropdownMenu,
  AsciiBreadcrumb,
  AsciiTag,
  AsciiSkeleton,
  AsciiPagination,
  AsciiMatrixRain,
  AsciiScanLine,
  AsciiFlameGraph,
  AsciiTheme,
} from "ascii-lib";
import type { ThemePreset, DensityPreset } from "ascii-lib";
import "./App.css";
import { ComponentFeatureShowcases, DashboardFeatureShowcases } from "./featureShowcases";
import { DemoControls, DemoFooter, DemoHeader, DemoViewSwitcher } from "./demoShell";

// ─── Dashboard Tab ──────────────────────────────────────────

function Dashboard() {
  const [deployOpen, setDeployOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("logs");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [darkAlerts, setDarkAlerts] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [envSelect, setEnvSelect] = useState("production");
  const [deployProgress, setDeployProgress] = useState(73);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [dashNav, setDashNav] = useState("overview");
  const [viewMode, setViewMode] = useState("expanded");
  const [endpointPage, setEndpointPage] = useState(1);
  const sonner = useAsciiSonner();

  useEffect(() => {
    if (deployProgress >= 100) return;
    const t = setTimeout(() => setDeployProgress((p) => Math.min(100, p + 1)), 600);
    return () => clearTimeout(t);
  }, [deployProgress]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const envServices: Record<string, Array<{name: string; status: string; cpu: string; mem: string; pods: string}>> = {
    production: [
      { name: "api-gateway", status: "\u25CF healthy", cpu: "12%", mem: "256M", pods: "3/3" },
      { name: "auth-service", status: "\u25CF healthy", cpu: "8%", mem: "128M", pods: "2/2" },
      { name: "web-frontend", status: "\u25CF healthy", cpu: "3%", mem: "64M", pods: "4/4" },
      { name: "worker-queue", status: "\u25D0 scaling", cpu: "78%", mem: "512M", pods: "2/5" },
      { name: "postgres-main", status: "\u25CF healthy", cpu: "22%", mem: "2.1G", pods: "1/1" },
      { name: "redis-cache", status: "\u25CF healthy", cpu: "1%", mem: "48M", pods: "3/3" },
    ],
    staging: [
      { name: "api-gateway", status: "\u25CF healthy", cpu: "5%", mem: "128M", pods: "1/1" },
      { name: "auth-service", status: "\u25CF healthy", cpu: "3%", mem: "64M", pods: "1/1" },
      { name: "web-frontend", status: "\u25D0 starting", cpu: "1%", mem: "32M", pods: "1/2" },
      { name: "worker-queue", status: "\u25CF healthy", cpu: "12%", mem: "128M", pods: "1/1" },
    ],
    development: [
      { name: "api-gateway", status: "\u25CF running", cpu: "2%", mem: "64M", pods: "1/1" },
      { name: "web-frontend", status: "\u25CF running", cpu: "1%", mem: "32M", pods: "1/1" },
      { name: "postgres-dev", status: "\u25CF running", cpu: "4%", mem: "256M", pods: "1/1" },
    ],
  };

  const envStats: Record<string, {requests: string; latency: string; errorRate: string; users: string; reqTrend: number; latTrend: number; errTrend: number; userTrend: number}> = {
    production: { requests: "12,847", latency: "34ms", errorRate: "0.02%", users: "3,291", reqTrend: 4.2, latTrend: -12, errTrend: 0, userTrend: 18 },
    staging: { requests: "1,204", latency: "52ms", errorRate: "0.15%", users: "84", reqTrend: 1.5, latTrend: 8, errTrend: 0.1, userTrend: -5 },
    development: { requests: "47", latency: "120ms", errorRate: "2.4%", users: "3", reqTrend: 0, latTrend: 15, errTrend: 1.2, userTrend: 0 },
  };

  const currentServices = (envServices[envSelect] || envServices.production).filter(r => !searchVal || r.name.includes(searchVal));
  const stats = envStats[envSelect] || envStats.production;

  const allEndpoints = [
    { route: "/api/health", p99: "2ms", rps: "840" },
    { route: "/api/auth/*", p99: "48ms", rps: "320" },
    { route: "/api/users/*", p99: "31ms", rps: "580" },
    { route: "/api/deploy", p99: "1.2s", rps: "12" },
    { route: "/api/metrics", p99: "8ms", rps: "200" },
    { route: "/api/status", p99: "3ms", rps: "150" },
    { route: "/api/config", p99: "12ms", rps: "45" },
    { route: "/api/webhooks", p99: "84ms", rps: "90" },
    { route: "/api/sessions", p99: "22ms", rps: "180" },
    { route: "/api/events", p99: "15ms", rps: "260" },
  ];
  const endpointsPerPage = 3;
  const totalEndpointPages = Math.ceil(allEndpoints.length / endpointsPerPage);
  const pagedEndpoints = allEndpoints.slice((endpointPage - 1) * endpointsPerPage, endpointPage * endpointsPerPage);

  return (
    <div className="dashboard">
      <div className="dash-menubar green">
        <AsciiMenubar
          menus={[
            {
              key: "file",
              label: "File",
              items: [
                { key: "export", label: "Export Report" },
                { key: "print", label: "Print View" },
                { key: "sep", label: "", separator: true },
                { key: "quit", label: "Quit" },
              ],
            },
            {
              key: "view",
              label: "View",
              items: [
                { key: "compact", label: "Compact" },
                { key: "expanded", label: "Expanded" },
                { key: "sep", label: "", separator: true },
                { key: "refresh", label: "Force Refresh" },
              ],
            },
            {
              key: "deploy",
              label: "Deploy",
              items: [
                { key: "new", label: "New Deploy" },
                { key: "rollback", label: "Rollback" },
                { key: "sep", label: "", separator: true },
                { key: "history", label: "History" },
              ],
            },
            {
              key: "help",
              label: "Help",
              items: [
                { key: "shortcuts", label: "Shortcuts" },
                { key: "docs", label: "Documentation" },
                { key: "about", label: "About NEXUS" },
              ],
            },
          ]}
          onSelect={(_: string, itemKey: string) => {
            if (itemKey === "new") setDeployOpen(true);
            if (itemKey === "rollback") setDeployProgress(0);
            sonner.toast(`Action: ${itemKey}`, "info");
          }}
        />
      </div>

      <div className="dash-breadcrumb-row">
        <AsciiBreadcrumb
          items={[
            { label: "Home" },
            { label: "Infrastructure" },
            { label: envSelect.charAt(0).toUpperCase() + envSelect.slice(1) },
          ]}
          separator=" / "
        />
        <div className="dash-user-area">
          <AsciiAvatar name="Admin" size="sm" />
          <AsciiDropdownMenu
            trigger="admin ▾"
            width={20}
            items={[
              { key: "profile", label: "Profile" },
              { key: "settings", label: "Settings" },
              { key: "sep", label: "", separator: true },
              { key: "logout", label: "Logout", danger: true },
            ]}
            onSelect={(key: string) => sonner.toast(`${key}`, "info")}
          />
          <AsciiSpinner frames={["◠", "◡"]} interval={800} label="" />
          <span className="dim">live</span>
        </div>
      </div>

      <div className="dash-nav">
        <AsciiNavigationMenu
          items={[
            { key: "overview", label: "Overview" },
            { key: "services", label: "Services" },
            { key: "deploys", label: "Deployments" },
            { key: "monitoring", label: "Monitoring" },
          ]}
          activeKey={dashNav}
          onSelect={setDashNav}
        />
      </div>

      <div className="dash-controls">
        <AsciiSelect
          width={24}
          options={[
            { value: "production", label: "production" },
            { value: "staging", label: "staging" },
            { value: "development", label: "development" },
          ]}
          value={envSelect}
          onChange={setEnvSelect}
        />
        <AsciiSwitch checked={autoRefresh} onChange={setAutoRefresh} label="auto-refresh" />
        <AsciiToggle checked={darkAlerts} onChange={setDarkAlerts} label="mute alerts" width={10} animate />
        <AsciiButtonGroup
          items={[
            { key: "compact", label: "Compact" },
            { key: "expanded", label: "Expanded" },
          ]}
          value={viewMode}
          onChange={setViewMode}
        />
      </div>

      {!darkAlerts && (
        <div className="dash-alert-strip warning">
          <AsciiAlert variant="warning" width={72} animate>
            Memory usage on web-02 at 87% — autoscaler triggered
          </AsciiAlert>
        </div>
      )}

      <div className="dash-stats">
        <div className="green">
          <AsciiStat label="Requests / min" value={stats.requests} trend={stats.reqTrend} trendLabel="from last hour" width={28} sparkline={viewMode === "expanded" ? [40, 42, 38, 45, 50, 48, 52, 58, 55, 60, 62, 65] : undefined} />
        </div>
        <div className="blue">
          <AsciiStat label="Avg Latency" value={stats.latency} trend={stats.latTrend} trendLabel="from last hour" width={28} sparkline={viewMode === "expanded" ? [48, 45, 42, 38, 35, 36, 34, 33, 35, 34, 33, 34] : undefined} />
        </div>
        <div className="green">
          <AsciiStat label="Error Rate" value={stats.errorRate} trend={stats.errTrend} trendLabel="stable" width={28} sparkline={viewMode === "expanded" ? [2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 2, 2] : undefined} />
        </div>
        <div className="accent2">
          <AsciiStat label="Active Users" value={stats.users} trend={stats.userTrend} trendLabel="from yesterday" width={28} sparkline={viewMode === "expanded" ? [20, 22, 24, 25, 28, 30, 29, 31, 32, 30, 33, 33] : undefined} />
        </div>
      </div>

      {viewMode === "expanded" && (
        <div className="dash-gauges">
          <div className="green">
            <AsciiGauge value={23} label="CPU" width={24} animate />
          </div>
          <div className="blue">
            <AsciiGauge value={67} label="Memory" width={24} border="double" animate />
          </div>
          <div className="warning">
            <AsciiGauge value={87} label="web-02 MEM" width={24} border="bold" animate />
          </div>
          <div className="green">
            <AsciiGauge value={42} label="Disk" width={24} animate />
          </div>
        </div>
      )}

      <div className="dash-deploy-section">
        <AsciiDivider width={72} border="single" label="DEPLOYMENT v2.5.0-rc.3" />
        <div className="dash-deploy-row">
          <div className="green">
            <AsciiProgress value={deployProgress} width={50} aria-label="Deploy progress" animate />
          </div>
          <div className="dash-deploy-badges">
            <span className="green"><AsciiBadge>ROLLING</AsciiBadge></span>
            <span className="dim"><AsciiBadge variant="outline">{`${deployProgress}%`}</AsciiBadge></span>
            <span className="blue"><AsciiTag>k8s</AsciiTag></span>
            <span className="green"><AsciiTag>us-east-1</AsciiTag></span>
          </div>
        </div>
        <div className="dash-deploy-actions">
          <div className="green">
            <AsciiButton label="Deploy New" border="single" animate onClick={() => setDeployOpen(true)} />
          </div>
          <div className="red">
            <AsciiButton label="Rollback" border="bold" animate onClick={() => { setDeployProgress(0); sonner.toast("Rolling back...", "info"); }} />
          </div>
          <div className="dim">
            <AsciiPopover content={"Strategy: rolling\nMax surge: 1\nMax unavail: 0\nTimeout: 600s"} width={26}>
              [deploy config]
            </AsciiPopover>
          </div>
        </div>
      </div>

      <div className="dash-grid">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
            <h3 className="dash-section-title" style={{ marginBottom: 0 }}>Services</h3>
            <AsciiInput
              width={24}
              placeholder="search..."
              value={searchVal}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchVal(e.target.value)}
            />
          </div>
          <div className="green">
            <AsciiTable
              columns={[
                { key: "name", header: "SERVICE", width: 16 },
                { key: "status", header: "STATUS", width: 10 },
                { key: "cpu", header: "CPU", width: 7, align: "right" },
                { key: "mem", header: "MEM", width: 7, align: "right" },
                { key: "pods", header: "PODS", width: 6, align: "right" },
              ]}
              data={currentServices}
            />
          </div>
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <span className="green"><AsciiTag>microservice</AsciiTag></span>
            <span className="blue"><AsciiTag>kubernetes</AsciiTag></span>
            <span className="dim"><AsciiTag>auto-scaled</AsciiTag></span>
          </div>
          <div style={{ marginTop: "0.5rem" }}>
            <span className="green">
              <AsciiHoverCard content={"Service: api-gateway\nCPU: 12%  MEM: 256M\nPods: 3/3\nRegion: us-east-1\nUptime: 14d 6h 32m"} width={30}>
                [hover: api-gateway details]
              </AsciiHoverCard>
            </span>
          </div>
        </div>
        <div>
          <h3 className="dash-section-title">Traffic by Service</h3>
          <div className="green">
            <AsciiBarChart
              width={40}
              animate
              bars={[
                { label: "api-gw", value: 847 },
                { label: "auth", value: 320 },
                { label: "web", value: 580 },
                { label: "worker", value: 1200 },
                { label: "cache", value: 95 },
              ]}
            />
          </div>
          <h3 className="dash-section-title" style={{ marginTop: "1rem" }}>Weekly Activity</h3>
          <div className="blue">
            <AsciiHeatmap
              animate
              data={[
                [0, 1, 3, 5, 2, 0, 1, 4, 8, 6, 3, 1],
                [1, 2, 4, 7, 3, 1, 2, 5, 9, 7, 4, 2],
                [0, 1, 2, 4, 5, 3, 4, 6, 7, 5, 3, 1],
                [2, 3, 5, 8, 6, 4, 3, 7, 10, 8, 5, 2],
                [1, 2, 3, 6, 4, 2, 1, 4, 6, 5, 3, 1],
                [0, 0, 1, 3, 2, 1, 0, 2, 4, 3, 2, 0],
                [1, 1, 2, 4, 3, 2, 1, 3, 5, 4, 2, 1],
              ]}
              yLabels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
              aria-label="Weekly request heatmap"
            />
          </div>
        </div>
      </div>

      <div className="dash-grid">
        <div>
          <div className="green">
            <AsciiTabs
              activeKey={activeSection}
              onTabChange={setActiveSection}
              tabs={[
                {
                  key: "logs",
                  label: "Request Log",
                  content: (
                    <AsciiScrollArea width={44} height={8}>
                      <div style={{ whiteSpace: "pre" }} className="dim">
                        {"  [14:32:01] GET  /api/health       200   2ms\n"}
                        {"  [14:32:03] POST /api/auth/token   201  48ms\n"}
                        {"  [14:32:05] GET  /api/users?p=1    200  14ms\n"}
                        {"  [14:32:06] PUT  /api/users/291    200  31ms\n"}
                        {"  [14:32:08] POST /api/deploy       202 1.2s\n"}
                        {"  [14:32:11] GET  /api/metrics      200   8ms\n"}
                        {"  [14:32:14] DEL  /api/sessions/old 204  22ms\n"}
                        {"  [14:32:16] GET  /api/health       200   1ms\n"}
                        {"  [14:32:18] POST /api/webhooks     200  84ms\n"}
                        {"  [14:32:20] GET  /api/status       200   3ms\n"}
                        {"  [14:32:22] PUT  /api/config       200  12ms\n"}
                        {"  [14:32:25] GET  /api/health       200   2ms"}
                      </div>
                    </AsciiScrollArea>
                  ),
                },
                {
                  key: "deploys",
                  label: "Deploys",
                  content: (
                    <div style={{ padding: "0.75rem 0", whiteSpace: "pre" }}>
                      <span className="green">  ✓ v2.5.0-rc.3  rolling   admin   2m ago{"\n"}</span>
                      <span className="green">  ✓ v2.5.0-rc.2  complete  admin   1h ago{"\n"}</span>
                      <span className="red">  ✗ v2.5.0-rc.1  failed    ci/cd   3h ago{"\n"}</span>
                      <span className="green">  ✓ v2.4.1       complete  ci/cd   2d ago{"\n"}</span>
                      <span className="green">  ✓ v2.4.0       complete  admin   5d ago</span>
                    </div>
                  ),
                },
                {
                  key: "incidents",
                  label: "Incidents",
                  content: (
                    <div style={{ padding: "0.75rem 0", whiteSpace: "pre" }}>
                      <span className="warning">  ⚠ MEM-HIGH   web-02 memory 87%       open   14:28{"\n"}</span>
                      <span className="green">  ✓ LATENCY    p99 spike resolved     closed 13:45{"\n"}</span>
                      <span className="green">  ✓ CERT-EXP   TLS cert renewed       closed 09:00</span>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
        <div>
          <h3 className="dash-section-title">Recent Events</h3>
          <div className="green">
            <AsciiTimeline
              events={[
                { key: "1", timestamp: "14:32", title: "Deploy v2.5.0-rc.3 started", description: "Rolling update to 3 pods" },
                { key: "2", timestamp: "14:28", title: "Memory alert triggered", description: "web-02 at 87%" },
                { key: "3", timestamp: "13:45", title: "Latency spike resolved", description: "p99 back to normal" },
                { key: "4", timestamp: "12:00", title: "TLS cert renewed", description: "Auto via cert-manager" },
                { key: "5", timestamp: "09:30", title: "v2.5.0-rc.2 deployed", description: "All health checks passing" },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="dash-split">
        <div className="dash-split-left">
          <h3 className="dash-section-title">Infrastructure</h3>
          <div className="blue">
            <AsciiTree
              data={[
                {
                  label: "k8s-production",
                  children: [
                    {
                      label: "us-east-1",
                      children: [
                        { label: "web-01 (healthy)" },
                        { label: "web-02 (warning)" },
                        { label: "worker-01 (scaling)" },
                      ],
                    },
                    {
                      label: "eu-west-1",
                      children: [
                        { label: "web-03 (healthy)" },
                        { label: "web-04 (healthy)" },
                      ],
                    },
                    {
                      label: "ap-south-1",
                      children: [
                        { label: "web-05 (healthy)" },
                      ],
                    },
                  ],
                },
              ]}
            />
          </div>
        </div>
        <div className="dash-split-right">
          <h3 className="dash-section-title">Endpoints</h3>
          <div className="green">
            <AsciiTable
              columns={[
                { key: "route", header: "ROUTE", width: 20 },
                { key: "p99", header: "P99", width: 8, align: "right" },
                { key: "rps", header: "RPS", width: 8, align: "right" },
              ]}
              data={pagedEndpoints}
            />
          </div>
          <div style={{ marginTop: "0.5rem" }}>
            <AsciiPagination page={endpointPage} totalPages={totalEndpointPages} onPageChange={setEndpointPage} />
          </div>
        </div>
      </div>

      <div className="dash-section">
        <AsciiDivider width={72} border="single" label="CONFIGURATION" />
        <div className="dash-grid" style={{ marginTop: "0.75rem" }}>
          <div className="green">
            <AsciiCode title="deployment.yaml" border="single">
{`apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: api
        image: nexus/api:v2.5.0-rc.3`}
            </AsciiCode>
          </div>
          <div>
            <AsciiAccordion
              width={40}
              border="single"
              animate
              items={[
                {
                  key: "env",
                  title: "Environment Variables",
                  content: `NODE_ENV=production
DATABASE_URL=postgres://...
REDIS_URL=redis://cache:6379
LOG_LEVEL=info`,
                },
                {
                  key: "alerts",
                  title: "Alert Rules",
                  content: `- name: high-memory
  condition: mem > 80%
  action: autoscale + notify
- name: error-rate
  condition: err > 1%
  action: page oncall`,
                },
              ]}
            />
            <div style={{ marginTop: "0.75rem" }} className="dim">
              <AsciiSkeleton width={38} lines={2} shimmer />
            </div>
          </div>
        </div>
      </div>

      <DashboardFeatureShowcases />

      <div className="dash-kbd-hints">
        <span className="dim">Shortcuts:</span>
        <span><AsciiKbd keys={["⌘", "K"]} /> command palette</span>
        <span><AsciiKbd keys={["R"]} /> refresh</span>
        <span><AsciiKbd keys={["D"]} /> deploy</span>
        <span><AsciiKbd keys={["?"]} /> help</span>
      </div>

      <AsciiModal
        open={deployOpen}
        onClose={() => setDeployOpen(false)}
        title="New Deployment"
        width={50}
        border="double"
      >
        {"Target:   production (us-east-1, eu-west-1)\nImage:    nexus/api:v2.5.1\nStrategy: rolling (max-surge 1)\n\n  [Enter] confirm   [Esc] cancel"}
      </AsciiModal>

      <AsciiCommandPalette
        open={cmdPaletteOpen}
        onClose={() => setCmdPaletteOpen(false)}
        onSelect={(key: string) => {
          setCmdPaletteOpen(false);
          if (key === "deploy") setDeployOpen(true);
          if (key === "rollback") setDeployProgress(0);
          sonner.toast(`Executed: ${key}`, "success");
        }}
        items={[
          { key: "deploy", label: "New Deployment", group: "Deploy", shortcut: "D" },
          { key: "rollback", label: "Rollback", group: "Deploy", shortcut: "R" },
          { key: "logs", label: "View Logs", group: "Monitor" },
          { key: "metrics", label: "View Metrics", group: "Monitor" },
          { key: "scale", label: "Scale Service", group: "Services" },
          { key: "restart", label: "Restart Service", group: "Services" },
          { key: "config", label: "Edit Config", group: "Settings" },
          { key: "alerts", label: "Alert Rules", group: "Settings" },
        ]}
        placeholder="Search commands..."
      />

      <AsciiSonner toasts={sonner.toasts} dismiss={sonner.dismiss} width={40} animate />
    </div>
  );
}

// ─── Components Tab ─────────────────────────────────────────

function Components() {
  const [inputVal, setInputVal] = useState("");
  const [check1, setCheck1] = useState(true);
  const [check2, setCheck2] = useState(false);
  const [radio, setRadio] = useState("a");
  const [selectVal, setSelectVal] = useState("react");
  const [buttonClicks, setButtonClicks] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [progress, setProgress] = useState(42);
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(false);
  const [textareaVal, setTextareaVal] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [sliderVal, setSliderVal] = useState(42);
  const [slider2Val, setSlider2Val] = useState(75);
  const [stepperIdx, setStepperIdx] = useState(1);
  const [pickerDate, setPickerDate] = useState<Date | undefined>(undefined);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetSide, setSheetSide] = useState<"left" | "right" | "bottom">("right");
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [btnGroupVal, setBtnGroupVal] = useState("grid");
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(undefined);
  const [comboVal, setComboVal] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [fieldVal, setFieldVal] = useState("");
  const [formService, setFormService] = useState("api-gateway");
  const [formEnv, setFormEnv] = useState("staging");
  const [formNotes, setFormNotes] = useState("Roll through checkout after auth settles.");
  const [formWindow, setFormWindow] = useState<Date | undefined>(new Date(2026, 3, 2));
  const [formDryRun, setFormDryRun] = useState(true);
  const [formOutput, setFormOutput] = useState("waiting for submit");
  const [otpVal, setOtpVal] = useState("");
  const [navKey, setNavKey] = useState("home");
  const [nativeVal, setNativeVal] = useState("usd");
  const [switch1, setSwitch1] = useState(true);
  const [switch2, setSwitch2] = useState(false);
  const [toggleGroupVal, setToggleGroupVal] = useState("bold");
  const [componentPaletteOpen, setComponentPaletteOpen] = useState(false);
  const sonner = useAsciiSonner();

  return (
    <div className="components">

      <AsciiDivider width={80} border="double" label="LAYOUT" className="divider-full" />

      {/* ── Box ─────────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiBox>"}</h2>
        <p className="section-desc">
          Bordered containers with title support and 5 border styles.
        </p>
        <div className="demo-row">
          <div className="demo-col green">
            <span className="label">single</span>
            <AsciiBox width={28} title="Status" border="single">
              All systems go
            </AsciiBox>
          </div>
          <div className="demo-col blue">
            <span className="label">double</span>
            <AsciiBox width={28} title="Info" border="double">
              Double border
            </AsciiBox>
          </div>
          <div className="demo-col red">
            <span className="label">bold</span>
            <AsciiBox width={28} title="Alert" border="bold">
              Bold border
            </AsciiBox>
          </div>
        </div>
        <div className="demo-row">
          <div className="demo-col white">
            <span className="label">round</span>
            <AsciiBox width={28} border="round" title="Rounded">
              Soft corners
            </AsciiBox>
          </div>
          <div className="demo-col dim">
            <span className="label">ascii</span>
            <AsciiBox width={28} border="ascii" title="Retro">
              Pure ASCII
            </AsciiBox>
          </div>
        </div>
      </div>

      {/* ── Card ────────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiCard>"}</h2>
        <p className="section-desc">Structured cards with title, body, and footer sections.</p>
        <div className="demo-row">
          <div className="green">
            <AsciiCard title="Server #1" footer="uptime: 99.97%" width={32} border="single">
              {"cpu: 23%\nmem: 1.2G / 4G\ndisk: 42G free"}
            </AsciiCard>
          </div>
          <div className="blue">
            <AsciiCard title="Deployment" footer="v2.4.1" width={32} border="double">
              {"status: healthy\nreplicas: 3/3\nregion: us-east-1"}
            </AsciiCard>
          </div>
        </div>
      </div>

      {/* ── Divider ─────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiDivider>"}</h2>
        <p className="section-desc">Horizontal rules with optional centered labels.</p>
        <div className="demo-col" style={{ gap: "0.75rem" }}>
          <div className="green">
            <AsciiDivider width={60} border="single" />
          </div>
          <div className="blue">
            <AsciiDivider width={60} border="double" label="SECTION" />
          </div>
          <div className="red">
            <AsciiDivider width={60} border="bold" label="END" />
          </div>
          <div className="dim">
            <AsciiDivider width={60} border="ascii" label="---" />
          </div>
        </div>
      </div>

      <AsciiDivider width={80} border="double" label="FORM CONTROLS" className="divider-full" />

      {/* ── Button ──────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiButton>"}</h2>
        <p className="section-desc">Clickable buttons with box-drawn borders.</p>
        <div className="demo-row">
          <div className="green">
            <AsciiButton
              label="Deploy"
              border="single"
              animate
              onClick={() => setButtonClicks((c) => c + 1)}
            />
          </div>
          <div className="red">
            <AsciiButton label="Cancel" border="bold" animate onClick={() => setButtonClicks(0)} />
          </div>
          <div className="blue">
            <AsciiButton label="Info" border="double" />
          </div>
          <div className="dim">
            <AsciiButton label="Disabled" border="ascii" disabled />
          </div>
        </div>
        <div className="output">clicks: {buttonClicks}</div>
      </div>

      {/* ── Input ───────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiInput>"}</h2>
        <p className="section-desc">Text input wrapped in an ASCII border.</p>
        <div className="demo-row">
          <div className="green">
            <AsciiInput
              label="hostname:"
              width={36}
              placeholder="enter a value..."
              value={inputVal}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputVal(e.target.value)}
            />
          </div>
        </div>
        <div className="output">value: "{inputVal}"</div>
      </div>

      {/* ── Checkbox ────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiCheckbox>"}</h2>
        <p className="section-desc">[x] and [ ] toggles.</p>
        <div className="demo-col green">
          <AsciiCheckbox
            label="Enable logging"
            checked={check1}
            animate
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheck1(e.target.checked)}
          />
          <AsciiCheckbox
            label="Verbose mode"
            checked={check2}
            animate
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheck2(e.target.checked)}
          />
          <AsciiCheckbox label="Read-only" checked disabled onChange={() => {}} />
        </div>
        <div className="output">
          logging: {check1 ? "on" : "off"}, verbose: {check2 ? "on" : "off"}
        </div>
      </div>

      {/* ── Radio ───────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiRadio>"}</h2>
        <p className="section-desc">(o) and ( ) selectors.</p>
        <div className="demo-col blue">
          {["a", "b", "c"].map((v) => (
            <AsciiRadio
              key={v}
              name="demo-radio"
              label={`Option ${v.toUpperCase()}`}
              value={v}
              checked={radio === v}
              onChange={() => setRadio(v)}
            />
          ))}
        </div>
        <div className="output">selected: {radio}</div>
      </div>

      {/* ── Toggle ──────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiToggle>"}</h2>
        <p className="section-desc">On/off switches with sliding indicator.</p>
        <div className="demo-col" style={{ gap: "0.75rem" }}>
          <div className="green">
            <AsciiToggle checked={toggle1} onChange={setToggle1} label="Dark mode" width={12} animate />
          </div>
          <div className="blue">
            <AsciiToggle checked={toggle2} onChange={setToggle2} label="Notifications" width={12} animate />
          </div>
          <div className="dim">
            <AsciiToggle checked disabled label="Locked" width={12} />
          </div>
        </div>
        <div className="output">
          dark: {toggle1 ? "on" : "off"}, notifications: {toggle2 ? "on" : "off"}
        </div>
      </div>

      {/* ── Textarea ─────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiTextarea>"}</h2>
        <p className="section-desc">Multi-line text input with ASCII borders.</p>
        <div className="demo-row">
          <div className="green">
            <AsciiTextarea
              label="notes:"
              width={44}
              height={4}
              placeholder="Type something..."
              value={textareaVal}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTextareaVal(e.target.value)}
            />
          </div>
        </div>
        <div className="output">lines: {textareaVal.split("\n").length}</div>
      </div>

      {/* ── Select ──────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiSelect>"}</h2>
        <p className="section-desc">Dropdown with ASCII-drawn chrome.</p>
        <div className="demo-row green">
          <AsciiSelect
            width={32}
            options={[
              { value: "react", label: "React" },
              { value: "vue", label: "Vue" },
              { value: "svelte", label: "Svelte" },
              { value: "solid", label: "SolidJS" },
            ]}
            value={selectVal}
            onChange={setSelectVal}
          />
        </div>
        <div className="output">framework: {selectVal}</div>
      </div>

      <AsciiDivider width={80} border="double" label="FEEDBACK" className="divider-full" />

      {/* ── Alert ───────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiAlert>"}</h2>
        <p className="section-desc">Status banners with variant icons.</p>
        <div className="demo-col" style={{ gap: "0.5rem" }}>
          <div className="blue">
            <AsciiAlert variant="info" width={55}>
              Deployment queued for review.
            </AsciiAlert>
          </div>
          <div className="green">
            <AsciiAlert variant="success" width={55}>
              Build completed successfully.
            </AsciiAlert>
          </div>
          <div className="warning">
            <AsciiAlert variant="warning" width={55}>
              Memory usage above 80%.
            </AsciiAlert>
          </div>
          <div className="red">
            <AsciiAlert variant="error" width={55}>
              Connection to database lost.
            </AsciiAlert>
          </div>
        </div>
      </div>

      {/* ── Badge ───────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiBadge>"}</h2>
        <p className="section-desc">Inline status labels.</p>
        <div className="demo-row" style={{ gap: "1rem", alignItems: "center" }}>
          <span className="green">
            <AsciiBadge>ONLINE</AsciiBadge>
          </span>
          <span className="red">
            <AsciiBadge>ERROR</AsciiBadge>
          </span>
          <span className="blue">
            <AsciiBadge variant="outline">v2.4.1</AsciiBadge>
          </span>
          <span className="dim">
            <AsciiBadge variant="outline">BETA</AsciiBadge>
          </span>
        </div>
      </div>

      {/* ── Progress ────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiProgress>"}</h2>
        <p className="section-desc">Block-character progress bars.</p>
        <div className="demo-col" style={{ gap: "0.75rem" }}>
          <div className="green">
            <AsciiProgress value={progress} width={50} aria-label="Deployment progress" />
          </div>
          <div className="blue">
            <AsciiProgress value={78} width={50} filled="#" empty="." aria-label="Upload progress" />
          </div>
          <div className="red">
            <AsciiProgress value={95} width={50} filled="=" empty="-" aria-label="Build progress" />
          </div>
        </div>
        <div className="demo-row" style={{ marginTop: "0.75rem", gap: "0.5rem" }}>
          <button className="ascii-lib ascii-btn green" onClick={() => setProgress((p) => Math.min(100, p + 10))}>
            [+10]
          </button>
          <button className="ascii-lib ascii-btn red" onClick={() => setProgress((p) => Math.max(0, p - 10))}>
            [-10]
          </button>
          <button className="ascii-lib ascii-btn dim" onClick={() => setProgress(0)}>
            [reset]
          </button>
        </div>
      </div>

      {/* ── Spinner ─────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiSpinner>"}</h2>
        <p className="section-desc">Animated loading indicators.</p>
        <div className="demo-row" style={{ gap: "2rem", alignItems: "center" }}>
          <span className="green">
            <AsciiSpinner label="deploying..." />
          </span>
          <span className="blue">
            <AsciiSpinner frames={["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]} label="loading" />
          </span>
          <span className="red">
            <AsciiSpinner frames={["[    ]", "[=   ]", "[==  ]", "[=== ]", "[====]", "[ ===]", "[  ==]", "[   =]"]} interval={120} />
          </span>
        </div>
      </div>

      {/* ── Tooltip ─────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiTooltip>"}</h2>
        <p className="section-desc">Hover to reveal ASCII-boxed tooltips.</p>
        <div className="demo-row" style={{ gap: "2rem" }}>
          <span className="green">
            <AsciiTooltip text="System is healthy">
              [hover me]
            </AsciiTooltip>
          </span>
          <span className="blue">
            <AsciiTooltip text="Click to copy" border="double">
              [or me]
            </AsciiTooltip>
          </span>
        </div>
      </div>

      <AsciiDivider width={80} border="double" label="COMPOUND" className="divider-full" />

      {/* ── Table ───────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiTable>"}</h2>
        <p className="section-desc">
          Full tables with headers, column alignment, and auto-sizing.
        </p>
        <div className="green">
          <AsciiTable
            columns={[
              { key: "pid", header: "PID", width: 8, align: "right" },
              { key: "name", header: "PROCESS", width: 20 },
              { key: "cpu", header: "CPU%", width: 8, align: "right" },
              { key: "mem", header: "MEM", width: 10, align: "right" },
              { key: "status", header: "STATUS", width: 10 },
            ]}
            data={[
              { pid: 1, name: "systemd", cpu: "0.0", mem: "12M", status: "running" },
              { pid: 442, name: "node server.js", cpu: "2.4", mem: "148M", status: "running" },
              { pid: 891, name: "postgres", cpu: "1.1", mem: "256M", status: "running" },
              { pid: 1204, name: "redis-server", cpu: "0.3", mem: "32M", status: "idle" },
              { pid: 1567, name: "nginx", cpu: "0.1", mem: "8M", status: "running" },
            ]}
          />
        </div>
        <div style={{ marginTop: "1rem" }} className="blue">
          <AsciiTable
            border="double"
            columns={[
              { key: "route", header: "ROUTE", width: 22 },
              { key: "method", header: "METHOD", width: 10 },
              { key: "latency", header: "P99", width: 10, align: "right" },
            ]}
            data={[
              { route: "/api/users", method: "GET", latency: "12ms" },
              { route: "/api/users/:id", method: "PATCH", latency: "34ms" },
              { route: "/api/deploy", method: "POST", latency: "1.2s" },
            ]}
          />
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiTabs>"}</h2>
        <p className="section-desc">Tabbed navigation with ASCII chrome.</p>
        <div className="green">
          <AsciiTabs
            activeKey={activeTab}
            onTabChange={setActiveTab}
            tabs={[
              {
                key: "overview",
                label: "Overview",
                content: (
                  <div className="demo-tab-content">
                    {"  System:   production-us-east-1\n"}
                    {"  Uptime:   14d 6h 32m\n"}
                    {"  Version:  2.4.1"}
                  </div>
                ),
              },
              {
                key: "logs",
                label: "Logs",
                content: (
                  <div className="demo-tab-content dim">
                    {"  [09:41:02] GET  /api/health  200  2ms\n"}
                    {"  [09:41:05] POST /api/deploy  201  1.2s\n"}
                    {"  [09:41:12] GET  /api/users   200  14ms"}
                  </div>
                ),
              },
              {
                key: "config",
                label: "Config",
                content: (
                  <div className="demo-tab-content">
                    {"  replicas:  3\n"}
                    {"  memory:    4Gi\n"}
                    {"  cpu:       2000m"}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>

      {/* ── Accordion ───────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiAccordion>"}</h2>
        <p className="section-desc">Collapsible sections.</p>
        <div className="blue">
          <AsciiAccordion
            width={55}
            border="single"
            items={[
              {
                key: "what",
                title: "What is ascii-lib?",
                content: "A React component library where every\nUI element is rendered with ASCII and\nbox-drawing characters.",
              },
              {
                key: "how",
                title: "How do I install it?",
                content: "npm install ascii-lib",
              },
              {
                key: "why",
                title: "Why would I use this?",
                content: "Because terminals are beautiful and\neverything should look like one.",
              },
            ]}
          />
        </div>
      </div>

      {/* ── Tree ────────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiTree>"}</h2>
        <p className="section-desc">File trees and hierarchies with box-drawing connectors.</p>
        <div className="demo-row">
          <div className="green">
            <AsciiTree
              data={[
                {
                  label: "src/",
                  children: [
                    {
                      label: "components/",
                      children: [
                        { label: "AsciiBox.tsx" },
                        { label: "AsciiButton.tsx" },
                        { label: "AsciiTree.tsx" },
                      ],
                    },
                    { label: "chars.ts" },
                    { label: "index.ts" },
                  ],
                },
                { label: "package.json" },
                { label: "tsconfig.json" },
              ]}
            />
          </div>
          <div className="blue">
            <AsciiTree
              guides="ascii"
              data={[
                {
                  label: "production",
                  children: [
                    {
                      label: "us-east-1",
                      children: [
                        { label: "web-01 (healthy)" },
                        { label: "web-02 (healthy)" },
                      ],
                    },
                    {
                      label: "eu-west-1",
                      children: [
                        { label: "web-03 (healthy)" },
                      ],
                    },
                  ],
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* ── Code ─────────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiCode>"}</h2>
        <p className="section-desc">Code blocks with line numbers and ASCII borders.</p>
        <div className="demo-row">
          <div className="green">
            <AsciiCode title="server.ts" border="single">
{`import express from "express";

const app = express();

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.listen(3000);`}
            </AsciiCode>
          </div>
          <div className="blue">
            <AsciiCode title="config.yaml" border="double" showLineNumbers={false}>
{`replicas: 3
memory: 4Gi
cpu: 2000m
image: app:v2.4.1`}
            </AsciiCode>
          </div>
        </div>
      </div>

      {/* ── Modal ───────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiModal>"}</h2>
        <p className="section-desc">
          Overlay dialog with keyboard dismiss (Esc) and backdrop click.
        </p>
        <div className="green">
          <AsciiButton
            label="Open Modal"
            border="single"
            onClick={() => setModalOpen(true)}
          />
        </div>
        <AsciiModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Confirm Deploy"
          width={46}
          border="double"
        >
          {"Are you sure you want to deploy\nto production?\n\n  [Enter] confirm  [Esc] cancel"}
        </AsciiModal>
      </div>

      {/* ── Sheet ────────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiSheet>"}</h2>
        <p className="section-desc">Slide-in panel from left, right, or bottom.</p>
        <div className="demo-row">
          <div className="green">
            <AsciiButton label="Right Sheet" border="single" onClick={() => { setSheetSide("right"); setSheetOpen(true); }} />
          </div>
          <div className="blue">
            <AsciiButton label="Left Sheet" border="single" onClick={() => { setSheetSide("left"); setSheetOpen(true); }} />
          </div>
          <div className="red">
            <AsciiButton label="Bottom Sheet" border="single" onClick={() => { setSheetSide("bottom"); setSheetOpen(true); }} />
          </div>
        </div>
        <AsciiSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          side={sheetSide}
          title={`${sheetSide} panel`}
          width={40}
          border="double"
        >
          {"Sheet content goes here.\n\nSlides in from the side.\nPress Esc or click backdrop\nto close."}
        </AsciiSheet>
      </div>

      <AsciiDivider width={80} border="double" label="DATA VISUALIZATION" className="divider-full" />

      <div className="section">
        <h2 className="section-title">{"<AsciiStat>"}</h2>
        <p className="section-desc">Metric cards with optional inline sparkline graphs.</p>
        <div className="demo-row">
          <div className="green">
            <AsciiStat label="Revenue" value="$48,290" trend={12.5} trendLabel="from last month" width={28} sparkline={[10, 14, 18, 15, 22, 28, 25, 30, 35, 32, 38, 42]} />
          </div>
          <div className="blue">
            <AsciiStat label="Latency" value="34ms" trend={-8} trendLabel="improved" width={28} />
          </div>
          <div className="accent2">
            <AsciiStat label="Uptime" value="99.97%" trend={0} trendLabel="stable" width={28} border="double" sparkline={[99, 99, 100, 99, 100, 100, 99, 100, 100, 100, 99, 100]} />
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">{"<AsciiSparkline>"}</h2>
        <p className="section-desc">Inline sparkline graphs using Unicode block characters.</p>
        <div className="demo-row">
          <div className="demo-col">
            <span className="label">upward trend</span>
            <span className="green"><AsciiSparkline data={[10, 12, 15, 14, 18, 22, 20, 25, 28, 30, 32, 35]} /></span>
          </div>
          <div className="demo-col">
            <span className="label">volatile</span>
            <span className="red"><AsciiSparkline data={[5, 20, 3, 18, 8, 25, 2, 22, 6, 19, 4, 21]} /></span>
          </div>
          <div className="demo-col">
            <span className="label">stable</span>
            <span className="blue"><AsciiSparkline data={[10, 11, 10, 10, 11, 10, 11, 10, 10, 11, 10, 10]} /></span>
          </div>
        </div>
      </div>

      {/* ── Bar Chart ────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiBarChart>"}</h2>
        <p className="section-desc">Horizontal bar charts with block fill characters.</p>
        <div className="demo-row">
          <div className="green">
            <AsciiBarChart
              width={50}
              bars={[
                { label: "api-gw", value: 847 },
                { label: "auth", value: 320 },
                { label: "web", value: 580 },
                { label: "worker", value: 1200 },
                { label: "cache", value: 95 },
              ]}
            />
          </div>
          <div className="blue">
            <AsciiBarChart
              width={40}
              border="double"
              fillChar="#"
              emptyChar="."
              bars={[
                { label: "Mon", value: 42 },
                { label: "Tue", value: 78 },
                { label: "Wed", value: 63 },
                { label: "Thu", value: 91 },
                { label: "Fri", value: 55 },
              ]}
            />
          </div>
        </div>
      </div>

      {/* ── Heatmap ──────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiHeatmap>"}</h2>
        <p className="section-desc">Grid heatmaps using density characters.</p>
        <div className="demo-row">
          <div className="green">
            <AsciiHeatmap
              data={[
                [0, 1, 3, 5, 2, 0, 1, 4, 8, 6, 3, 1],
                [1, 2, 4, 7, 3, 1, 2, 5, 9, 7, 4, 2],
                [0, 1, 2, 4, 5, 3, 4, 6, 7, 5, 3, 1],
                [2, 3, 5, 8, 6, 4, 3, 7, 10, 8, 5, 2],
                [1, 2, 3, 6, 4, 2, 1, 4, 6, 5, 3, 1],
                [0, 0, 1, 3, 2, 1, 0, 2, 4, 3, 2, 0],
                [1, 1, 2, 4, 3, 2, 1, 3, 5, 4, 2, 1],
              ]}
              yLabels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
              aria-label="Weekly activity heatmap"
            />
          </div>
        </div>
      </div>

      {/* ── Gauge ────────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiGauge>"}</h2>
        <p className="section-desc">Meter gauges with arc visualization.</p>
        <div className="demo-row">
          <div className="green">
            <AsciiGauge value={73} label="CPU Usage" width={30} />
          </div>
          <div className="blue">
            <AsciiGauge value={2.1} min={0} max={8} label="Memory (GB)" width={30} border="double" />
          </div>
          <div className="red">
            <AsciiGauge value={92} label="Disk" width={24} border="bold" />
          </div>
        </div>
      </div>

      <AsciiDivider width={80} border="double" label="INTERACTIVE" className="divider-full" />

      {/* ── Slider ───────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiSlider>"}</h2>
        <p className="section-desc">Draggable range input with keyboard support.</p>
        <div className="demo-col" style={{ gap: "0.75rem" }}>
          <div className="green">
            <AsciiSlider value={sliderVal} onChange={setSliderVal} width={40} label="Volume" />
          </div>
          <div className="blue">
            <AsciiSlider value={slider2Val} onChange={setSlider2Val} width={40} label="Brightness" min={0} max={255} step={5} />
          </div>
          <div className="dim">
            <AsciiSlider value={50} disabled width={40} label="Locked" />
          </div>
        </div>
        <div className="output">volume: {sliderVal}, brightness: {slider2Val}</div>
      </div>

      {/* ── Stepper ──────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiStepper>"}</h2>
        <p className="section-desc">Multi-step wizard progress indicator.</p>
        <div className="demo-col" style={{ gap: "1rem" }}>
          <div className="green">
            <AsciiStepper
              current={stepperIdx}
              steps={[
                { label: "Config", description: "Set up environment" },
                { label: "Build", description: "Compile assets" },
                { label: "Test", description: "Run test suite" },
                { label: "Deploy" },
              ]}
            />
          </div>
          <div className="demo-row" style={{ gap: "0.5rem" }}>
            <AsciiButton label="Prev" border="single" onClick={() => setStepperIdx((i) => Math.max(0, i - 1))} />
            <AsciiButton label="Next" border="single" onClick={() => setStepperIdx((i) => Math.min(3, i + 1))} />
          </div>
        </div>
      </div>

      {/* ── Date Picker ──────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiDatePicker>"}</h2>
        <p className="section-desc">Calendar grid with month navigation.</p>
        <div className="demo-row">
          <div className="green">
            <AsciiDatePicker value={pickerDate} onChange={setPickerDate} width={28} />
          </div>
          <div className="blue">
            <AsciiDatePicker value={pickerDate} onChange={setPickerDate} width={28} border="double" />
          </div>
        </div>
        <div className="output">selected: {pickerDate ? pickerDate.toLocaleDateString() : "none"}</div>
      </div>

      <AsciiDivider width={80} border="double" label="TERMINAL" className="divider-full" />

      {/* ── Terminal ─────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiTerminal>"}</h2>
        <p className="section-desc">Interactive terminal with command history and custom handlers.</p>
        <div className="green">
          <AsciiTerminal
            title="nexus-prod"
            width={60}
            height={10}
            initialLines={[
              "Welcome to NEXUS terminal v2.5.0",
              "Type 'help' for available commands.",
              "",
            ]}
            onCommand={(cmd: string) => {
              if (cmd === "help") return ["  status  - show system status", "  uptime  - show uptime", "  whoami  - current user", "  clear   - clear screen"];
              if (cmd === "status") return "  all systems operational ●";
              if (cmd === "uptime") return "  14d 6h 32m";
              if (cmd === "whoami") return "  admin@nexus.io";
              return `  command not found: ${cmd}`;
            }}
          />
        </div>
      </div>

      {/* ── Kbd ──────────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiKbd>"}</h2>
        <p className="section-desc">Keyboard shortcut badges.</p>
        <div className="demo-row" style={{ gap: "2rem", alignItems: "center" }}>
          <span className="green">
            <AsciiKbd keys={["⌘", "K"]} />
          </span>
          <span className="blue">
            <AsciiKbd keys={["Ctrl", "Shift", "P"]} />
          </span>
          <span className="red">
            <AsciiKbd keys={["Esc"]} />
          </span>
          <span className="dim">
            <AsciiKbd keys={["⌘", "⇧", "Enter"]} separator=" " />
          </span>
        </div>
      </div>

      {/* ── Ascii Text ───────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiAsciiText>"}</h2>
        <p className="section-desc">Large banner text rendered with block characters.</p>
        <div className="demo-col" style={{ gap: "1.5rem" }}>
          <div className="green">
            <AsciiAsciiText text="NEXUS" />
          </div>
          <div className="blue">
            <AsciiAsciiText text="ASCII" />
          </div>
          <div className="red">
            <AsciiAsciiText text="404" />
          </div>
        </div>
      </div>

      <AsciiDivider width={80} border="double" label="LAYOUT" className="divider-full" />

      {/* ── Resizable ────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiResizable>"}</h2>
        <p className="section-desc">Draggable split panes. Grab the divider to resize.</p>
        <div className="green">
          <AsciiResizable
            left={
              <div style={{ whiteSpace: "pre", padding: "0.5rem" }}>
                {"Left panel\n\nDrag the │ divider\nto resize."}
              </div>
            }
            right={
              <div style={{ whiteSpace: "pre", padding: "0.5rem" }}>
                {"Right panel\n\nContent adjusts\nautomatically."}
              </div>
            }
            initialSplit={40}
          />
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">{"<AsciiSplitPane>"}</h2>
        <p className="section-desc">Workbench-style split panes built on top of the resizable primitive.</p>
        <div className="green">
          <AsciiSplitPane
            initialSplit={42}
            leftPanel={{
              title: "Timeline",
              footer: <span>drag to rebalance</span>,
              content: (
                <div style={{ whiteSpace: "pre-wrap" }}>
                  <div>12:01 deploy created</div>
                  <div>12:03 canary approved</div>
                  <div>12:05 traffic 25%</div>
                </div>
              ),
            }}
            rightPanel={{
              title: "Notes",
              footer: <span>linked workbench panel</span>,
              content: (
                <div style={{ whiteSpace: "pre-wrap" }}>
                  <div>owner: platform</div>
                  <div>risk: low</div>
                  <div>rollback: ready</div>
                </div>
              ),
            }}
          />
        </div>
      </div>

      <AsciiDivider width={80} border="double" label="NEW COMPONENTS" className="divider-full" />

      {/* ── Alert Dialog ──────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiAlertDialog>"}</h2>
        <p className="section-desc">Confirmation dialog with confirm/cancel actions.</p>
        <div className="green">
          <AsciiButton label="Delete Item" border="bold" onClick={() => setAlertDialogOpen(true)} />
        </div>
        <AsciiAlertDialog
          open={alertDialogOpen}
          onConfirm={() => setAlertDialogOpen(false)}
          onCancel={() => setAlertDialogOpen(false)}
          title="Are you sure?"
          width={46}
          border="double"
        >
          {"This action cannot be undone.\nAll data will be permanently deleted."}
        </AsciiAlertDialog>
      </div>

      {/* ── Aspect Ratio ──────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiAspectRatio>"}</h2>
        <p className="section-desc">Container that enforces an aspect ratio.</p>
        <div className="demo-row">
          <div className="green">
            <span className="label">16:9</span>
            <AsciiAspectRatio ratio={16 / 9} width={36}>
              {" 16:9 content area"}
            </AsciiAspectRatio>
          </div>
          <div className="blue">
            <span className="label">4:3</span>
            <AsciiAspectRatio ratio={4 / 3} width={28}>
              {" 4:3 content area"}
            </AsciiAspectRatio>
          </div>
          <div className="red">
            <span className="label">1:1</span>
            <AsciiAspectRatio ratio={1} width={20}>
              {" square"}
            </AsciiAspectRatio>
          </div>
        </div>
      </div>

      {/* ── Button Group ──────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiButtonGroup>"}</h2>
        <p className="section-desc">Segmented button group with single selection.</p>
        <div className="demo-col" style={{ gap: "0.75rem" }}>
          <div className="green">
            <AsciiButtonGroup
              items={[
                { key: "list", label: "List" },
                { key: "grid", label: "Grid" },
                { key: "board", label: "Board" },
              ]}
              value={btnGroupVal}
              onChange={setBtnGroupVal}
            />
          </div>
          <div className="blue">
            <AsciiButtonGroup
              items={[
                { key: "s", label: "S" },
                { key: "m", label: "M" },
                { key: "l", label: "L" },
                { key: "xl", label: "XL" },
              ]}
              value="m"
              border="double"
            />
          </div>
        </div>
        <div className="output">view: {btnGroupVal}</div>
      </div>

      {/* ── Calendar ──────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiCalendar>"}</h2>
        <p className="section-desc">Standalone calendar with month navigation.</p>
        <div className="demo-row">
          <div className="green">
            <AsciiCalendar value={calendarDate} onChange={setCalendarDate} width={28} />
          </div>
          <div className="blue">
            <AsciiCalendar value={calendarDate} onChange={setCalendarDate} width={28} border="double" />
          </div>
        </div>
        <div className="output">selected: {calendarDate ? calendarDate.toLocaleDateString() : "none"}</div>
      </div>

      {/* ── Carousel ──────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiCarousel>"}</h2>
        <p className="section-desc">Cycle through items with arrow navigation.</p>
        <div className="green">
          <AsciiCarousel
            width={50}
            height={4}
            items={[
              { key: "1", content: " Deploy v2.5.0\n\n Status: rolling\n Region: us-east-1" },
              { key: "2", content: " Database Migration\n\n Tables: 12 updated\n Duration: 4.2s" },
              { key: "3", content: " Cache Flush\n\n Entries: 48,291\n Status: complete" },
            ]}
          />
        </div>
      </div>

      {/* ── Collapsible ───────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiCollapsible>"}</h2>
        <p className="section-desc">Simple collapsible section without borders.</p>
        <div className="demo-col green" style={{ gap: "0.25rem" }}>
          <AsciiCollapsible title="System Requirements">
            {"Node.js >= 18\nReact >= 17\nTypeScript >= 4.7"}
          </AsciiCollapsible>
          <AsciiCollapsible title="Installation" defaultOpen>
            {"npm install ascii-lib"}
          </AsciiCollapsible>
          <AsciiCollapsible title="License">
            {"MIT License\nCopyright (c) 2025"}
          </AsciiCollapsible>
        </div>
      </div>

      {/* ── Combobox ──────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiCombobox>"}</h2>
        <p className="section-desc">Searchable dropdown with type-ahead filtering.</p>
        <div className="demo-row green">
          <AsciiCombobox
            width={32}
            options={[
              { value: "react", label: "React" },
              { value: "vue", label: "Vue" },
              { value: "svelte", label: "Svelte" },
              { value: "solid", label: "SolidJS" },
              { value: "angular", label: "Angular" },
              { value: "preact", label: "Preact" },
            ]}
            value={comboVal}
            onChange={setComboVal}
            placeholder="Search frameworks..."
          />
        </div>
        <div className="output">selected: {comboVal || "none"}</div>
      </div>

      {/* ── Context Menu ──────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiContextMenu>"}</h2>
        <p className="section-desc">Right-click to open a context menu.</p>
        <div className="green">
          <AsciiContextMenu
            width={22}
            items={[
              { key: "cut", label: "Cut", shortcut: "^X" },
              { key: "copy", label: "Copy", shortcut: "^C" },
              { key: "paste", label: "Paste", shortcut: "^V" },
              { key: "sep1", label: "", separator: true },
              { key: "delete", label: "Delete" },
            ]}
            onSelect={() => {}}
          >
            <AsciiBox width={36} border="single">
              {"  right-click here"}
            </AsciiBox>
          </AsciiContextMenu>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">{"<AsciiCommandPalette>"}</h2>
        <p className="section-desc">Grouped command palette with recent actions and fuzzy ranking.</p>
        <div className="green">
          <AsciiButton label="Open Command Palette" border="double" onClick={() => setComponentPaletteOpen(true)} />
        </div>
        <AsciiCommandPalette
          open={componentPaletteOpen}
          onClose={() => setComponentPaletteOpen(false)}
          onSelect={(key: string) => {
            setComponentPaletteOpen(false);
            sonner.toast(`palette: ${key}`, "info");
          }}
          items={[
            { key: "deploy", label: "Ship canary", group: "Deploy", shortcut: "D" },
            { key: "rollback", label: "Rollback build", group: "Deploy", shortcut: "R" },
            { key: "latency", label: "Inspect latency", group: "Observe", shortcut: "L" },
            { key: "queue", label: "Open queue drain", group: "Observe", shortcut: "Q" },
            { key: "config", label: "Edit config", group: "Change", shortcut: "C" },
            { key: "alerts", label: "Adjust alerts", group: "Change", shortcut: "A" },
          ]}
          placeholder="Search grouped commands..."
        />
      </div>

      {/* ── Data Table ────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiDataTable>"}</h2>
        <p className="section-desc">Selectable table with pinned columns, keyboard navigation, resize controls, and loading/error states.</p>
        <div className="demo-row">
          <div className="green">
            <AsciiDataTable
              columns={[
                { key: "name", header: "NAME", width: 16, sortable: true },
                { key: "role", header: "ROLE", width: 12, sortable: true },
                { key: "status", header: "STATUS", width: 14 },
                { key: "last", header: "LAST SEEN", width: 12, align: "right", sortable: true },
              ]}
              data={[
                { name: "alice", role: "admin", status: "● online", last: "now" },
                { name: "bob", role: "editor", status: "● online", last: "2m ago" },
                { name: "carol", role: "viewer", status: "○ offline", last: "1h ago" },
                { name: "dave", role: "admin", status: "● online", last: "5m ago" },
                { name: "eve", role: "editor", status: "○ offline", last: "3d ago" },
              ]}
              pageSize={3}
              height={5}
              selectable
              rowKey="name"
              defaultSelectedKeys={["bob"]}
              pinnedColumns={["name"]}
              resizableColumns
            />
          </div>
          <div className="blue" style={{ display: "grid", gap: "0.75rem" }}>
            <AsciiDataTable
              columns={[
                { key: "env", header: "ENV", width: 10 },
                { key: "state", header: "STATE", width: 18 },
              ]}
              data={[]}
              height={3}
              loading
            />
            <AsciiDataTable
              columns={[
                { key: "env", header: "ENV", width: 10 },
                { key: "state", header: "STATE", width: 18 },
              ]}
              data={[]}
              height={3}
              error="control plane unavailable"
            />
          </div>
        </div>
      </div>

      {/* ── Direction ─────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiDirection>"}</h2>
        <p className="section-desc">LTR/RTL direction wrapper.</p>
        <div className="demo-row">
          <div className="green">
            <AsciiDirection dir="ltr">
              <AsciiBox width={24} title="LTR" border="single">
                {"Left to right"}
              </AsciiBox>
            </AsciiDirection>
          </div>
          <div className="blue">
            <AsciiDirection dir="rtl">
              <AsciiBox width={24} title="RTL" border="single">
                {"Right to left"}
              </AsciiBox>
            </AsciiDirection>
          </div>
        </div>
      </div>

      {/* ── Drawer ────────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiDrawer>"}</h2>
        <p className="section-desc">Overlay panel from any edge. Like Sheet but with top/bottom support.</p>
        <div className="demo-row">
          <div className="green">
            <AsciiButton label="Open Drawer" border="single" onClick={() => setDrawerOpen(true)} />
          </div>
        </div>
        <AsciiDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          side="right"
          title="Drawer Panel"
          width={40}
          border="double"
        >
          {"Drawer content here.\n\nSlides in from any edge.\nPress Esc to close."}
        </AsciiDrawer>
      </div>

      {/* ── Empty ─────────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiEmpty>"}</h2>
        <p className="section-desc">Empty state placeholder.</p>
        <div className="demo-row">
          <div className="dim">
            <AsciiEmpty
              title="No results found"
              description="Try adjusting your search"
              width={36}
            />
          </div>
          <div className="blue">
            <AsciiEmpty
              icon="[+]"
              title="No projects yet"
              description="Create your first project\nto get started"
              width={36}
              border="double"
            />
          </div>
        </div>
      </div>

      {/* ── Field ─────────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiField>"}</h2>
        <p className="section-desc">Form field wrapper with label, hint, and error states.</p>
        <div className="demo-col" style={{ gap: "0.75rem" }}>
          <div className="green">
            <AsciiField label="Username" hint="3-20 characters" required>
              <input
                className="ascii-input-native"
                placeholder="enter username..."
                value={fieldVal}
                onChange={(e) => setFieldVal(e.target.value)}
                style={{ width: "24ch" }}
              />
            </AsciiField>
          </div>
          <div className="red">
            <AsciiField label="Email" error="Invalid email address" required>
              <input
                className="ascii-input-native"
                value="not-an-email"
                readOnly
                style={{ width: "24ch" }}
              />
            </AsciiField>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">{"<AsciiForm>"}</h2>
        <p className="section-desc">Sectioned form surface with notices, summaries, and action bars.</p>
        <div className="green">
          <AsciiForm
            title="Deploy Request"
            width={72}
            description="Compose multi-step operational forms from existing ASCII inputs without losing semantic form behavior."
            status={<AsciiBadge variant="outline">{formDryRun ? "dry-run" : "live"}</AsciiBadge>}
            summary={
              <AsciiBox width={30} title="Preview" border="single">
                {`service: ${formService}\nenv: ${formEnv}\nwindow: ${formWindow ? formWindow.toLocaleDateString() : "unset"}`}
              </AsciiBox>
            }
            notices={[
              {
                key: "approval",
                tone: "warn",
                label: "gate",
                message: "Two reviewers required before production rollout.",
              },
            ]}
            sections={[
              {
                key: "target",
                title: "Target",
                description: "Choose the service and destination environment.",
                columns: 2,
                children: (
                  <>
                    <AsciiInput
                      label="service:"
                      width={28}
                      value={formService}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFormService(event.target.value)}
                    />
                    <div style={{ display: "grid", gap: "0.25rem" }}>
                      <AsciiLabel>environment</AsciiLabel>
                      <AsciiSelect
                        width={28}
                        value={formEnv}
                        onChange={setFormEnv}
                        options={[
                          { value: "staging", label: "Staging" },
                          { value: "production", label: "Production" },
                          { value: "development", label: "Development" },
                        ]}
                      />
                    </div>
                  </>
                ),
                aside: (
                  <AsciiBox width={22} title="policy" border="single">
                    {"owner: platform\nrisk: medium\nwindow: 15m"}
                  </AsciiBox>
                ),
              },
              {
                key: "controls",
                title: "Controls",
                description: "Capture scheduling and operator notes.",
                columns: 2,
                children: (
                  <>
                    <AsciiTextarea
                      label="notes:"
                      width={32}
                      height={4}
                      value={formNotes}
                      onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setFormNotes(event.target.value)}
                    />
                    <div style={{ display: "grid", gap: "0.75rem" }}>
                      <div style={{ display: "grid", gap: "0.25rem" }}>
                        <AsciiLabel>maintenance window</AsciiLabel>
                        <AsciiDatePicker value={formWindow} onChange={setFormWindow} width={28} />
                      </div>
                      <AsciiCheckbox
                        label="Run verification only"
                        checked={formDryRun}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFormDryRun(event.target.checked)}
                      />
                    </div>
                  </>
                ),
              },
            ]}
            actions={(
              <>
                <AsciiButton
                  label="Reset"
                  type="button"
                  border="single"
                  onClick={() => {
                    setFormService("api-gateway");
                    setFormEnv("staging");
                    setFormNotes("Roll through checkout after auth settles.");
                    setFormWindow(new Date(2026, 3, 2));
                    setFormDryRun(true);
                    setFormOutput("draft reset");
                  }}
                />
                <AsciiButton label="Queue Deploy" type="submit" border="double" />
              </>
            )}
            footer={<span>{formOutput}</span>}
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              setFormOutput(`queued ${formService} -> ${formEnv}${formDryRun ? " [dry-run]" : ""}`);
            }}
          />
        </div>
        <div className="output">last submit: {formOutput}</div>
      </div>

      {/* ── Hover Card ────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiHoverCard>"}</h2>
        <p className="section-desc">Rich content card on hover.</p>
        <div className="demo-row" style={{ gap: "2rem" }}>
          <span className="green">
            <AsciiHoverCard content={"role: admin\nlast login: 2m ago\nregion: us-east-1"} width={28}>
              [hover: @admin]
            </AsciiHoverCard>
          </span>
          <span className="blue">
            <AsciiHoverCard content={"status: healthy\ncpu: 12%\nmem: 256M"} width={24} border="double">
              [hover: api-gw]
            </AsciiHoverCard>
          </span>
        </div>
      </div>

      {/* ── Input Group ───────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiInputGroup>"}</h2>
        <p className="section-desc">Input with prefix/suffix addons.</p>
        <div className="demo-col green" style={{ gap: "0.75rem" }}>
          <AsciiInputGroup prefix="https://" width={44}>
            <input placeholder="example.com" />
          </AsciiInputGroup>
          <AsciiInputGroup suffix=".00 USD" width={44}>
            <input placeholder="0" />
          </AsciiInputGroup>
        </div>
      </div>

      {/* ── Input OTP ─────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiInputOTP>"}</h2>
        <p className="section-desc">One-time password input with auto-advance.</p>
        <div className="demo-col" style={{ gap: "0.75rem" }}>
          <div className="green">
            <AsciiInputOTP length={6} value={otpVal} onChange={setOtpVal} />
          </div>
          <div className="blue">
            <AsciiInputOTP length={4} value="" onChange={() => {}} border="double" separator="-" />
          </div>
        </div>
        <div className="output">otp: "{otpVal}"</div>
      </div>

      {/* ── Item ──────────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiItem>"}</h2>
        <p className="section-desc">Generic list item with icon, label, and description.</p>
        <div className="demo-col green" style={{ gap: "0.25rem" }}>
          <AsciiItem icon="◆" label="Dashboard" trailing="^D" onClick={() => {}} selected />
          <AsciiItem icon="◆" label="Settings" description="Manage preferences" trailing="^S" onClick={() => {}} />
          <AsciiItem icon="◆" label="Logout" onClick={() => {}} />
          <AsciiItem icon="◆" label="Disabled" disabled onClick={() => {}} />
        </div>
      </div>

      {/* ── Label ─────────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiLabel>"}</h2>
        <p className="section-desc">Form label with optional required indicator.</p>
        <div className="demo-col green" style={{ gap: "0.5rem" }}>
          <AsciiLabel>Username</AsciiLabel>
          <AsciiLabel required>Email</AsciiLabel>
          <AsciiLabel>Description</AsciiLabel>
        </div>
      </div>

      {/* ── Menubar ───────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiMenubar>"}</h2>
        <p className="section-desc">Horizontal menu bar with dropdown menus.</p>
        <div className="green">
          <AsciiMenubar
            menus={[
              {
                key: "file",
                label: "File",
                items: [
                  { key: "new", label: "New File" },
                  { key: "open", label: "Open..." },
                  { key: "save", label: "Save" },
                  { key: "sep", label: "", separator: true },
                  { key: "quit", label: "Quit" },
                ],
              },
              {
                key: "edit",
                label: "Edit",
                items: [
                  { key: "undo", label: "Undo" },
                  { key: "redo", label: "Redo" },
                  { key: "sep", label: "", separator: true },
                  { key: "cut", label: "Cut" },
                  { key: "copy", label: "Copy" },
                  { key: "paste", label: "Paste" },
                ],
              },
              {
                key: "view",
                label: "View",
                items: [
                  { key: "zoom-in", label: "Zoom In" },
                  { key: "zoom-out", label: "Zoom Out" },
                  { key: "reset", label: "Reset Zoom" },
                ],
              },
            ]}
            onSelect={() => {}}
          />
        </div>
      </div>

      {/* ── Native Select ─────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiNativeSelect>"}</h2>
        <p className="section-desc">Native HTML select with ASCII borders.</p>
        <div className="demo-row green">
          <AsciiNativeSelect
            label="currency:"
            width={28}
            options={[
              { value: "usd", label: "USD ($)" },
              { value: "eur", label: "EUR (€)" },
              { value: "gbp", label: "GBP (£)" },
              { value: "jpy", label: "JPY (¥)" },
            ]}
            value={nativeVal}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNativeVal(e.target.value)}
          />
        </div>
        <div className="output">currency: {nativeVal}</div>
      </div>

      {/* ── Navigation Menu ───────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiNavigationMenu>"}</h2>
        <p className="section-desc">Inline navigation with separators.</p>
        <div className="demo-col" style={{ gap: "0.75rem" }}>
          <div className="green">
            <AsciiNavigationMenu
              items={[
                { key: "home", label: "Home" },
                { key: "docs", label: "Docs" },
                { key: "api", label: "API" },
                { key: "blog", label: "Blog" },
              ]}
              activeKey={navKey}
              onSelect={setNavKey}
            />
          </div>
          <div className="blue">
            <AsciiNavigationMenu
              items={[
                { key: "overview", label: "Overview" },
                { key: "analytics", label: "Analytics" },
                { key: "settings", label: "Settings" },
              ]}
              activeKey="overview"
              separator=" / "
            />
          </div>
        </div>
        <div className="output">active: {navKey}</div>
      </div>

      {/* ── Popover ───────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiPopover>"}</h2>
        <p className="section-desc">Click to toggle positioned popup content.</p>
        <div className="demo-row" style={{ gap: "2rem" }}>
          <span className="green">
            <AsciiPopover content={"Status: online\nUptime: 14d 6h"} width={24}>
              [click me]
            </AsciiPopover>
          </span>
          <span className="blue">
            <AsciiPopover content={"v2.5.0-rc.3\nBuild #1847"} width={20} side="top" border="double">
              [version info]
            </AsciiPopover>
          </span>
        </div>
      </div>

      {/* ── Scroll Area ───────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiScrollArea>"}</h2>
        <p className="section-desc">Scrollable container with ASCII scrollbar.</p>
        <div className="green">
          <AsciiScrollArea width={40} height={8}>
            <div style={{ whiteSpace: "pre" }}>
              {" Line 1: api-gateway\n Line 2: auth-service\n Line 3: web-frontend\n Line 4: worker-queue\n Line 5: postgres-main\n Line 6: redis-cache\n Line 7: monitoring\n Line 8: log-aggregator\n Line 9: cdn-edge\n Line 10: load-balancer\n Line 11: scheduler\n Line 12: notification-svc\n Line 13: billing-service\n Line 14: search-index\n Line 15: file-storage"}
            </div>
          </AsciiScrollArea>
        </div>
      </div>

      {/* ── Sonner ────────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiSonner>"}</h2>
        <p className="section-desc">Toast notifications with auto-dismiss.</p>
        <div className="demo-row" style={{ gap: "0.5rem" }}>
          <div className="green">
            <AsciiButton label="Success" border="single" onClick={() => sonner.toast("Deployed successfully!", "success")} />
          </div>
          <div className="red">
            <AsciiButton label="Error" border="single" onClick={() => sonner.toast("Build failed", "error")} />
          </div>
          <div className="blue">
            <AsciiButton label="Info" border="single" onClick={() => sonner.toast("New version available", "info")} />
          </div>
        </div>
        <AsciiSonner toasts={sonner.toasts} dismiss={sonner.dismiss} width={40} />
      </div>

      {/* ── Switch ────────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiSwitch>"}</h2>
        <p className="section-desc">ON/OFF switch with text indicator.</p>
        <div className="demo-col" style={{ gap: "0.75rem" }}>
          <div className="green">
            <AsciiSwitch checked={switch1} onChange={setSwitch1} label="Maintenance mode" />
          </div>
          <div className="blue">
            <AsciiSwitch checked={switch2} onChange={setSwitch2} label="Debug logging" />
          </div>
          <div className="dim">
            <AsciiSwitch checked disabled label="Feature locked" />
          </div>
        </div>
        <div className="output">
          maintenance: {switch1 ? "on" : "off"}, debug: {switch2 ? "on" : "off"}
        </div>
      </div>

      {/* ── Toggle Group ──────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiToggleGroup>"}</h2>
        <p className="section-desc">Exclusive or multi-select toggle buttons.</p>
        <div className="demo-col" style={{ gap: "0.75rem" }}>
          <div className="green">
            <AsciiToggleGroup
              items={[
                { key: "bold", label: "B" },
                { key: "italic", label: "I" },
                { key: "underline", label: "U" },
                { key: "strike", label: "S" },
              ]}
              value={toggleGroupVal}
              onChange={(v: string | string[]) => setToggleGroupVal(v as string)}
            />
          </div>
          <div className="blue">
            <AsciiToggleGroup
              items={[
                { key: "left", label: "Left" },
                { key: "center", label: "Center" },
                { key: "right", label: "Right" },
              ]}
              value="center"
              border="double"
            />
          </div>
        </div>
        <div className="output">selected: {toggleGroupVal}</div>
      </div>

      {/* ── Typography ────────────────────────────── */}
      <div className="section">
        <h2 className="section-title">{"<AsciiTypography>"}</h2>
        <p className="section-desc">Text styling with markdown-inspired variants.</p>
        <div className="demo-col" style={{ gap: "0.25rem" }}>
          <div className="green"><AsciiTypography variant="h1">Heading One</AsciiTypography></div>
          <div className="blue"><AsciiTypography variant="h2">Heading Two</AsciiTypography></div>
          <div className="green"><AsciiTypography variant="h3">Heading Three</AsciiTypography></div>
          <div className="blue"><AsciiTypography variant="h4">Heading Four</AsciiTypography></div>
          <div className="white"><AsciiTypography variant="body">Body text for paragraphs.</AsciiTypography></div>
          <div className="dim"><AsciiTypography variant="caption">Caption or helper text</AsciiTypography></div>
          <div className="green"><AsciiTypography variant="code">const x = 42;</AsciiTypography></div>
          <div className="dim"><AsciiTypography variant="overline">overline label</AsciiTypography></div>
        </div>
      </div>

      <ComponentFeatureShowcases />

      <AsciiDivider width={80} border="double" label="ANIMATIONS" className="divider-full" />

      <AnimationsShowcase />

      <AsciiDivider width={80} border="double" className="divider-full" />
    </div>
  );
}

// ─── Animations Showcase ─────────────────────────────────────

function AnimationsShowcase() {
  const [alertKey, setAlertKey] = useState(0);
  const [barKey, setBarKey] = useState(0);
  const [heatKey, setHeatKey] = useState(0);
  const [flameKey, setFlameKey] = useState(0);
  const [gaugeVal, setGaugeVal] = useState(25);
  const [progressVal, setProgressVal] = useState(0);
  const [animBox, setAnimBox] = useState(0);
  const [sparkKey, setSparkKey] = useState(0);
  const [collKey, setCollKey] = useState(0);
  const [carouselKey, setCarouselKey] = useState(0);
  const [toggleDemo, setToggleDemo] = useState(false);
  const [checkDemo, setCheckDemo] = useState(false);

  useEffect(() => {
    if (progressVal >= 100) return;
    const t = setTimeout(() => setProgressVal((p) => Math.min(100, p + 2)), 50);
    return () => clearTimeout(t);
  }, [progressVal]);

  return (
    <div className="components">

      <div className="section">
        <h2 className="section-title">Border Draw-In</h2>
        <p className="section-desc">Boxes trace their border on mount. Click to replay.</p>
        <div className="demo-row">
          <div className="green" onClick={() => setAnimBox((k) => k + 1)} style={{ cursor: "pointer" }}>
            <AsciiBox key={animBox} width={32} title="Draw-In" border="single" animate>
              Borders animate in
            </AsciiBox>
          </div>
          <div className="blue" onClick={() => setAnimBox((k) => k + 1)} style={{ cursor: "pointer" }}>
            <AsciiBox key={`d-${animBox}`} width={32} title="Double" border="double" animate>
              Click to replay
            </AsciiBox>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Typewriter + Border Animation</h2>
        <p className="section-desc">Alert text types in while the border draws. Click to replay.</p>
        <div className="demo-col" onClick={() => setAlertKey((k) => k + 1)} style={{ cursor: "pointer" }}>
          <div className="green">
            <AsciiAlert key={`s-${alertKey}`} variant="success" width={56} animate>
              Deployment v2.5.1 completed successfully
            </AsciiAlert>
          </div>
          <div className="warning">
            <AsciiAlert key={`w-${alertKey}`} variant="warning" width={56} animate>
              Memory usage approaching threshold
            </AsciiAlert>
          </div>
          <div className="red">
            <AsciiAlert key={`e-${alertKey}`} variant="error" width={56} animate>
              Connection to database lost
            </AsciiAlert>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Bar Chart Grow</h2>
        <p className="section-desc">Bars fill with ░▒▓█ progression. Click to replay.</p>
        <div className="green" onClick={() => setBarKey((k) => k + 1)} style={{ cursor: "pointer" }}>
          <AsciiBarChart
            key={barKey}
            width={50}
            animate
            bars={[
              { label: "api-gw", value: 847 },
              { label: "auth", value: 320 },
              { label: "web", value: 580 },
              { label: "worker", value: 1200 },
              { label: "cache", value: 95 },
            ]}
          />
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Gauge Sweep + Sparkline Trace</h2>
        <p className="section-desc">Gauges animate to target value. Sparklines draw point-by-point.</p>
        <div className="demo-row">
          <div className="green">
            <AsciiGauge key={gaugeVal} value={gaugeVal} label="CPU" width={28} animate />
          </div>
          <div className="blue">
            <AsciiGauge key={`m-${gaugeVal}`} value={gaugeVal + 30} label="Memory" width={28} animate border="double" />
          </div>
          <div>
            <AsciiButton label="Randomize" border="single" animate onClick={() => setGaugeVal(Math.floor(Math.random() * 90) + 5)} />
          </div>
        </div>
        <div className="demo-row" style={{ marginTop: "0.5rem" }}>
          <span className="label">Sparkline trace:</span>
          <span className="green">
            <AsciiSparkline key={sparkKey} data={[2, 4, 3, 7, 5, 8, 6, 9, 7, 10, 8, 12, 10, 14]} animate />
          </span>
          <span className="blue">
            <AsciiSparkline key={`b-${sparkKey}`} data={[10, 8, 9, 6, 7, 4, 5, 3, 4, 2, 3, 1, 2, 1]} animate />
          </span>
          <AsciiButton label="Replay" border="single" onClick={() => setSparkKey((k) => k + 1)} />
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Heatmap Wave + Flame Graph Build</h2>
        <p className="section-desc">Heatmap cells reveal in a diagonal wave. Flame stacks grow upward.</p>
        <div className="demo-row">
          <div className="blue" onClick={() => setHeatKey((k) => k + 1)} style={{ cursor: "pointer" }}>
            <AsciiHeatmap
              key={heatKey}
              animate
              data={[
                [0, 1, 3, 5, 2, 0, 1, 4, 8, 6],
                [1, 2, 4, 7, 3, 1, 2, 5, 9, 7],
                [0, 1, 2, 4, 5, 3, 4, 6, 7, 5],
                [2, 3, 5, 8, 6, 4, 3, 7, 10, 8],
                [1, 2, 3, 6, 4, 2, 1, 4, 6, 5],
              ]}
              yLabels={["Mon", "Tue", "Wed", "Thu", "Fri"]}
            />
          </div>
          <div className="green" onClick={() => setFlameKey((k) => k + 1)} style={{ cursor: "pointer" }}>
            <AsciiFlameGraph
              key={flameKey}
              animate
              frames={[
                { key: "main", label: "main()", span: 100, depth: 0 },
                { key: "handle", label: "handleReq()", span: 72, depth: 1, tone: "success" },
                { key: "query", label: "dbQuery()", span: 45, depth: 2, tone: "warn" },
                { key: "serial", label: "serialize()", span: 18, depth: 2 },
                { key: "log", label: "logMetric()", span: 8, depth: 1 },
              ]}
              width={56}
              height={5}
              title="perf trace"
            />
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Progress Fill Animation</h2>
        <p className="section-desc">Progress bar animates with ░▒▓█ fill stages.</p>
        <div className="demo-col">
          <div className="green">
            <AsciiProgress value={progressVal} width={50} animate />
          </div>
          <div style={{ marginTop: "0.25rem" }}>
            <AsciiButton label="Reset" border="single" onClick={() => setProgressVal(0)} />
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Button Press + Interactive Feedback</h2>
        <p className="section-desc">Buttons show visual press effect. Toggles slide. Checkboxes snap.</p>
        <div className="demo-row">
          <div className="green">
            <AsciiButton label="Press Me" border="single" animate onClick={() => {}} />
          </div>
          <div className="blue">
            <AsciiButton label="Click!" border="double" animate onClick={() => {}} />
          </div>
          <div className="green">
            <AsciiToggle checked={toggleDemo} onChange={setToggleDemo} label="Animated" width={12} animate />
          </div>
          <div className="blue">
            <AsciiCheckbox label="Snap check" checked={checkDemo} animate onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckDemo(e.target.checked)} />
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Line-by-Line Reveal</h2>
        <p className="section-desc">Accordion and collapsible content reveals line by line. Click to toggle.</p>
        <div className="demo-row">
          <div className="green" key={collKey}>
            <AsciiAccordion
              width={40}
              animate
              items={[
                { key: "logs", title: "Server Logs", content: "2024-01-15 INFO Starting\n2024-01-15 INFO Ready\n2024-01-15 WARN Memory 85%" },
                { key: "config", title: "Configuration", content: "host: 0.0.0.0\nport: 8080\nworkers: 4" },
              ]}
            />
          </div>
          <div className="blue" key={`c-${collKey}`}>
            <AsciiCollapsible title="Click to expand" animate>
              {"Line one appears first\nThen line two follows\nAnd finally line three\nContent reveals smoothly"}
            </AsciiCollapsible>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Carousel Transitions</h2>
        <p className="section-desc">Characters scramble briefly during slide transitions.</p>
        <div className="green" key={carouselKey}>
          <AsciiCarousel
            width={50}
            height={4}
            animate
            items={[
              { key: "1", content: "  Server Status: ONLINE\n  Uptime: 14d 6h 32m\n  Load: 0.42 0.38 0.35" },
              { key: "2", content: "  Deploy v2.5.0-rc.3\n  Strategy: Rolling\n  Progress: 73% complete" },
              { key: "3", content: "  Alert: MEM-HIGH\n  Node: web-02\n  Usage: 87% / 4GB" },
            ]}
          />
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Spinner Presets</h2>
        <p className="section-desc">Multiple spinner styles: braille, dots, blocks, arrows, bounce.</p>
        <div className="demo-row" style={{ gap: "2rem" }}>
          <div className="green"><AsciiSpinner preset="default" label="default" /></div>
          <div className="blue"><AsciiSpinner preset="braille" label="braille" /></div>
          <div className="green"><AsciiSpinner preset="dots" label="dots" /></div>
          <div className="red"><AsciiSpinner preset="blocks" label="blocks" /></div>
          <div className="blue"><AsciiSpinner preset="arrows" label="arrows" /></div>
          <div className="green"><AsciiSpinner preset="bounce" label="bounce" /></div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Skeleton Shimmer</h2>
        <p className="section-desc">Loading skeletons with sweeping shimmer effect.</p>
        <div className="demo-row">
          <div className="dim">
            <span className="label">pulse (default)</span>
            <AsciiSkeleton width={30} lines={3} />
          </div>
          <div className="green">
            <span className="label">shimmer sweep</span>
            <AsciiSkeleton width={30} lines={3} shimmer />
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Ambient Effects</h2>
        <p className="section-desc">CSS classes for CRT flicker, scan line, border shimmer, and pulse.</p>
        <div className="demo-row">
          <div className="green ascii-animate-shimmer">
            <AsciiBox width={24} title="Shimmer" border="single">
              Border shimmers
            </AsciiBox>
          </div>
          <div className="blue ascii-animate-pulse">
            <AsciiBox width={24} title="Pulse" border="double">
              Border pulses
            </AsciiBox>
          </div>
          <div className="green ascii-animate-crt">
            <AsciiBox width={24} title="CRT" border="single">
              CRT flicker
            </AsciiBox>
          </div>
          <div className="dim ascii-animate-noise">
            <AsciiBox width={24} title="Noise" border="ascii">
              Noise flicker
            </AsciiBox>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Scan Line + Matrix Rain</h2>
        <p className="section-desc">Scan line sweeps over content. Matrix rain as background/loading.</p>
        <div className="demo-row">
          <AsciiScanLine>
            <div className="green">
              <AsciiBox width={32} title="Monitored" border="single">
                {"cpu: 23%\nmem: 1.2G\ndisk: 42G free\nnet: 847 req/s"}
              </AsciiBox>
            </div>
          </AsciiScanLine>
          <div className="green">
            <AsciiMatrixRain width={30} height={8} speed={60} />
          </div>
        </div>
      </div>

    </div>
  );
}

// ─── App ────────────────────────────────────────────────────

function Index() {
  const [search, setSearch] = useState("");

  const allComponents = [
    { name: "AsciiAccordion", category: "Layout" },
    { name: "AsciiAlert", category: "Feedback" },
    { name: "AsciiAlertDialog", category: "Overlay" },
    { name: "AsciiAsciiText", category: "Typography" },
    { name: "AsciiAspectRatio", category: "Layout" },
    { name: "AsciiAvatar", category: "Data Display" },
    { name: "AsciiBadge", category: "Data Display" },
    { name: "AsciiBarChart", category: "Visualization" },
    { name: "AsciiBox", category: "Layout" },
    { name: "AsciiBreadcrumb", category: "Navigation" },
    { name: "AsciiButton", category: "Form" },
    { name: "AsciiButtonGroup", category: "Form" },
    { name: "AsciiCalendar", category: "Form" },
    { name: "AsciiCard", category: "Layout" },
    { name: "AsciiCarousel", category: "Layout" },
    { name: "AsciiCheckbox", category: "Form" },
    { name: "AsciiCode", category: "Data Display" },
    { name: "AsciiCollapsible", category: "Layout" },
    { name: "AsciiCombobox", category: "Form" },
    { name: "AsciiCommandPalette", category: "Navigation" },
    { name: "AsciiContextMenu", category: "Overlay" },
    { name: "AsciiDataTable", category: "Data Display" },
    { name: "AsciiDatePicker", category: "Form" },
    { name: "AsciiDependencyGraph", category: "Ops" },
    { name: "AsciiDiff", category: "Ops" },
    { name: "AsciiDirection", category: "Layout" },
    { name: "AsciiDivider", category: "Layout" },
    { name: "AsciiDrawer", category: "Overlay" },
    { name: "AsciiDropdownMenu", category: "Overlay" },
    { name: "AsciiEmpty", category: "Feedback" },
    { name: "AsciiField", category: "Form" },
    { name: "AsciiForm", category: "Form" },
    { name: "AsciiFileTree", category: "Ops" },
    { name: "AsciiFlameGraph", category: "Ops" },
    { name: "AsciiGauge", category: "Visualization" },
    { name: "AsciiHeatmap", category: "Visualization" },
    { name: "AsciiHoverCard", category: "Overlay" },
    { name: "AsciiInput", category: "Form" },
    { name: "AsciiInputGroup", category: "Form" },
    { name: "AsciiInputOTP", category: "Form" },
    { name: "AsciiInspector", category: "Ops" },
    { name: "AsciiItem", category: "Data Display" },
    { name: "AsciiKbd", category: "Data Display" },
    { name: "AsciiLabel", category: "Form" },
    { name: "AsciiLogViewer", category: "Ops" },
    { name: "AsciiMatrixRain", category: "Effects" },
    { name: "AsciiMenubar", category: "Navigation" },
    { name: "AsciiModal", category: "Overlay" },
    { name: "AsciiNativeSelect", category: "Form" },
    { name: "AsciiNavigationMenu", category: "Navigation" },
    { name: "AsciiPagination", category: "Navigation" },
    { name: "AsciiPopover", category: "Overlay" },
    { name: "AsciiProcessTable", category: "Ops" },
    { name: "AsciiProgress", category: "Feedback" },
    { name: "AsciiQueryPlan", category: "Ops" },
    { name: "AsciiRackMap", category: "Ops" },
    { name: "AsciiRadio", category: "Form" },
    { name: "AsciiResizable", category: "Layout" },
    { name: "AsciiScanLine", category: "Effects" },
    { name: "AsciiScrollArea", category: "Layout" },
    { name: "AsciiSelect", category: "Form" },
    { name: "AsciiSequenceDiagram", category: "Ops" },
    { name: "AsciiSheet", category: "Overlay" },
    { name: "AsciiSidebar", category: "Navigation" },
    { name: "AsciiSkeleton", category: "Feedback" },
    { name: "AsciiSpinner", category: "Feedback" },
    { name: "AsciiSlider", category: "Form" },
    { name: "AsciiSonner", category: "Feedback" },
    { name: "AsciiSparkline", category: "Visualization" },
    { name: "AsciiSplitPane", category: "Layout" },
    { name: "AsciiStat", category: "Data Display" },
    { name: "AsciiStatusGrid", category: "Ops" },
    { name: "AsciiStepper", category: "Form" },
    { name: "AsciiSwitch", category: "Form" },
    { name: "AsciiTable", category: "Data Display" },
    { name: "AsciiTabs", category: "Layout" },
    { name: "AsciiTag", category: "Data Display" },
    { name: "AsciiTerminal", category: "Ops" },
    { name: "AsciiTextarea", category: "Form" },
    { name: "AsciiTheme", category: "Foundation" },
    { name: "AsciiTimeline", category: "Data Display" },
    { name: "AsciiToast", category: "Feedback" },
    { name: "AsciiToggle", category: "Form" },
    { name: "AsciiToggleGroup", category: "Form" },
    { name: "AsciiTooltip", category: "Overlay" },
    { name: "AsciiTraceTimeline", category: "Ops" },
    { name: "AsciiTree", category: "Data Display" },
    { name: "AsciiTypography", category: "Typography" },
    { name: "AsciiWindow", category: "Layout" },
  ];

  const q = search.toLowerCase();
  const filtered = q
    ? allComponents.filter(
        (c) => c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
      )
    : allComponents;

  const categories = [...new Set(allComponents.map((c) => c.category))].sort();

  return (
    <div className="index-view">
      <AsciiDivider width={80} border="double" label={`COMPONENT INDEX (${allComponents.length})`} className="divider-full" />

      <div className="index-search">
        <AsciiInput
          label="filter:"
          width={40}
          placeholder="search components..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />
        <span className="dim">{filtered.length} / {allComponents.length}</span>
      </div>

      <div className="index-grid">
        {categories.map((cat) => {
          const items = filtered.filter((c) => c.category === cat);
          if (items.length === 0) return null;
          return (
            <AsciiBox key={cat} title={cat} width={38} border="single">
              {items.map((c) => (
                <div key={c.name} className="index-item">
                  {"<"}{c.name}{" />"}
                </div>
              ))}
            </AsciiBox>
          );
        })}
      </div>

      <AsciiDivider width={80} border="single" label="ALPHABETICAL" className="divider-full" />

      <div className="index-alpha-list">
        <AsciiTable
          columns={[
            { key: "name", header: "COMPONENT", width: 30 },
            { key: "category", header: "CATEGORY", width: 16 },
          ]}
          data={filtered}
        />
      </div>
    </div>
  );
}

function App() {
  const [view, setView] = useState<"dashboard" | "components" | "index">("dashboard");
  const [theme, setTheme] = useState<ThemePreset>("phosphor");
  const [density, setDensity] = useState<DensityPreset>("cozy");

  return (
    <AsciiTheme preset={theme} density={density}>
      <DemoHeader />
      <DemoViewSwitcher view={view} onChange={setView} />
      <DemoControls
        theme={theme}
        density={density}
        onThemeChange={(t) => setTheme(t as ThemePreset)}
        onDensityChange={(d) => setDensity(d as DensityPreset)}
      />

      <main>
        {view === "dashboard" && <Dashboard />}
        {view === "components" && <Components />}
        {view === "index" && <Index />}
      </main>

      <DemoFooter />
    </AsciiTheme>
  );
}

export default App;
