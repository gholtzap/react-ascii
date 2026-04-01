import { lazy, Suspense, useEffect, useState } from "react";
import { AsciiAlert } from "../../src/components/AsciiAlert";
import { AsciiAvatar } from "../../src/components/AsciiAvatar";
import { AsciiBadge } from "../../src/components/AsciiBadge";
import { AsciiBarChart } from "../../src/components/AsciiBarChart";
import { AsciiBreadcrumb } from "../../src/components/AsciiBreadcrumb";
import { AsciiButton } from "../../src/components/AsciiButton";
import { AsciiButtonGroup } from "../../src/components/AsciiButtonGroup";
import { AsciiCode } from "../../src/components/AsciiCode";
import { AsciiCommandPalette } from "../../src/components/AsciiCommandPalette";
import { AsciiDivider } from "../../src/components/AsciiDivider";
import { AsciiDropdownMenu } from "../../src/components/AsciiDropdownMenu";
import { AsciiGauge } from "../../src/components/AsciiGauge";
import { AsciiHeatmap } from "../../src/components/AsciiHeatmap";
import { AsciiHoverCard } from "../../src/components/AsciiHoverCard";
import { AsciiInput } from "../../src/components/AsciiInput";
import { AsciiKbd } from "../../src/components/AsciiKbd";
import { AsciiMenubar } from "../../src/components/AsciiMenubar";
import { AsciiModal } from "../../src/components/AsciiModal";
import { AsciiNavigationMenu } from "../../src/components/AsciiNavigationMenu";
import { AsciiPagination } from "../../src/components/AsciiPagination";
import { AsciiPopover } from "../../src/components/AsciiPopover";
import { AsciiProgress } from "../../src/components/AsciiProgress";
import { AsciiScrollArea } from "../../src/components/AsciiScrollArea";
import { AsciiSelect } from "../../src/components/AsciiSelect";
import { AsciiSkeleton } from "../../src/components/AsciiSkeleton";
import { AsciiSonner, useAsciiSonner } from "../../src/components/AsciiSonner";
import { AsciiSpinner } from "../../src/components/AsciiSpinner";
import { AsciiStat } from "../../src/components/AsciiStat";
import { AsciiSwitch } from "../../src/components/AsciiSwitch";
import { AsciiTable } from "../../src/components/AsciiTable";
import { AsciiTabs } from "../../src/components/AsciiTabs";
import { AsciiTag } from "../../src/components/AsciiTag";
import { AsciiTheme } from "../../src/components/AsciiTheme";
import { AsciiTimeline } from "../../src/components/AsciiTimeline";
import { AsciiToggle } from "../../src/components/AsciiToggle";
import { AsciiTree } from "../../src/components/AsciiTree";
import type { DensityPreset, ThemePreset } from "../../src/themes";
import "./App.css";
import { DemoControls, DemoFooter, DemoHeader, DemoViewSwitcher } from "./demoShell";

type DashboardEnvironment = "production" | "staging" | "development";
type DashboardServiceRow = {
  name: string;
  status: string;
  cpu: string;
  mem: string;
  pods: string;
};
type DashboardStats = {
  requests: string;
  latency: string;
  errorRate: string;
  users: string;
  reqTrend: number;
  latTrend: number;
  errTrend: number;
  userTrend: number;
};

const DASHBOARD_MENUS = [
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
] as const;

const DASHBOARD_ACCOUNT_ITEMS = [
  { key: "profile", label: "Profile" },
  { key: "settings", label: "Settings" },
  { key: "sep", label: "", separator: true },
  { key: "logout", label: "Logout", danger: true },
];

const DASHBOARD_NAV_ITEMS = [
  { key: "overview", label: "Overview" },
  { key: "services", label: "Services" },
  { key: "deploys", label: "Deployments" },
  { key: "monitoring", label: "Monitoring" },
];

const DASHBOARD_ENV_OPTIONS = [
  { value: "production", label: "production" },
  { value: "staging", label: "staging" },
  { value: "development", label: "development" },
];

const DASHBOARD_SERVICE_COLUMNS = [
  { key: "name", header: "SERVICE", width: 16 },
  { key: "status", header: "STATUS", width: 10 },
  { key: "cpu", header: "CPU", width: 7, align: "right" as const },
  { key: "mem", header: "MEM", width: 7, align: "right" as const },
  { key: "pods", header: "PODS", width: 6, align: "right" as const },
];

const DASHBOARD_ENDPOINT_COLUMNS = [
  { key: "route", header: "ROUTE", width: 20 },
  { key: "p99", header: "P99", width: 8, align: "right" as const },
  { key: "rps", header: "RPS", width: 8, align: "right" as const },
];

const DASHBOARD_TRAFFIC_BARS = [
  { label: "api-gw", value: 847 },
  { label: "auth", value: 320 },
  { label: "web", value: 580 },
  { label: "worker", value: 1200 },
  { label: "cache", value: 95 },
];

const DASHBOARD_WEEKLY_ACTIVITY = [
  [0, 1, 3, 5, 2, 0, 1, 4, 8, 6, 3, 1],
  [1, 2, 4, 7, 3, 1, 2, 5, 9, 7, 4, 2],
  [0, 1, 2, 4, 5, 3, 4, 6, 7, 5, 3, 1],
  [2, 3, 5, 8, 6, 4, 3, 7, 10, 8, 5, 2],
  [1, 2, 3, 6, 4, 2, 1, 4, 6, 5, 3, 1],
  [0, 0, 1, 3, 2, 1, 0, 2, 4, 3, 2, 0],
  [1, 1, 2, 4, 3, 2, 1, 3, 5, 4, 2, 1],
];

const DASHBOARD_ENV_SERVICES: Record<DashboardEnvironment, DashboardServiceRow[]> = {
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

const DASHBOARD_ENV_STATS: Record<DashboardEnvironment, DashboardStats> = {
  production: { requests: "12,847", latency: "34ms", errorRate: "0.02%", users: "3,291", reqTrend: 4.2, latTrend: -12, errTrend: 0, userTrend: 18 },
  staging: { requests: "1,204", latency: "52ms", errorRate: "0.15%", users: "84", reqTrend: 1.5, latTrend: 8, errTrend: 0.1, userTrend: -5 },
  development: { requests: "47", latency: "120ms", errorRate: "2.4%", users: "3", reqTrend: 0, latTrend: 15, errTrend: 1.2, userTrend: 0 },
};

const DASHBOARD_ENDPOINTS = [
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

const DASHBOARD_COMMANDS = [
  { key: "deploy", label: "New Deployment", group: "Deploy", shortcut: "D" },
  { key: "rollback", label: "Rollback", group: "Deploy", shortcut: "R" },
  { key: "logs", label: "View Logs", group: "Monitor" },
  { key: "metrics", label: "View Metrics", group: "Monitor" },
  { key: "scale", label: "Scale Service", group: "Services" },
  { key: "restart", label: "Restart Service", group: "Services" },
  { key: "config", label: "Edit Config", group: "Settings" },
  { key: "alerts", label: "Alert Rules", group: "Settings" },
];

const DASHBOARD_DEPLOY_CONFIG = "Strategy: rolling\nMax surge: 1\nMax unavail: 0\nTimeout: 600s";
const DASHBOARD_ENDPOINTS_PER_PAGE = 3;

function DashboardDeploymentSection({
  resetToken,
  onOpenDeploy,
  onRollback,
}: {
  resetToken: number;
  onOpenDeploy: () => void;
  onRollback: () => void;
}) {
  const [deployProgress, setDeployProgress] = useState(73);

  useEffect(() => {
    if (resetToken === 0) return;
    setDeployProgress(0);
  }, [resetToken]);

  useEffect(() => {
    if (deployProgress >= 100) return;
    const timer = setTimeout(() => setDeployProgress((current) => Math.min(100, current + 1)), 600);
    return () => clearTimeout(timer);
  }, [deployProgress]);

  return (
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
          <AsciiButton label="Deploy New" border="single" animate onClick={onOpenDeploy} />
        </div>
        <div className="red">
          <AsciiButton label="Rollback" border="bold" animate onClick={onRollback} />
        </div>
        <div className="dim">
          <AsciiPopover content={DASHBOARD_DEPLOY_CONFIG} width={26}>
            [deploy config]
          </AsciiPopover>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [deployOpen, setDeployOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("logs");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [darkAlerts, setDarkAlerts] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [envSelect, setEnvSelect] = useState<DashboardEnvironment>("production");
  const [deployResetToken, setDeployResetToken] = useState(0);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [dashNav, setDashNav] = useState("overview");
  const [viewMode, setViewMode] = useState("expanded");
  const [endpointPage, setEndpointPage] = useState(1);
  const sonner = useAsciiSonner();

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

  const currentServices = DASHBOARD_ENV_SERVICES[envSelect].filter((service) => !searchVal || service.name.includes(searchVal));
  const stats = DASHBOARD_ENV_STATS[envSelect];
  const totalEndpointPages = Math.ceil(DASHBOARD_ENDPOINTS.length / DASHBOARD_ENDPOINTS_PER_PAGE);
  const pagedEndpoints = DASHBOARD_ENDPOINTS.slice((endpointPage - 1) * DASHBOARD_ENDPOINTS_PER_PAGE, endpointPage * DASHBOARD_ENDPOINTS_PER_PAGE);

  const openDeployModal = () => setDeployOpen(true);
  const queueRollback = (message: string, variant: "success" | "info" = "info") => {
    setDeployResetToken((current) => current + 1);
    sonner.toast(message, variant);
  };

  return (
    <div className="dashboard">
      <div className="dash-menubar green">
        <AsciiMenubar
          menus={DASHBOARD_MENUS}
          onSelect={(_: string, itemKey: string) => {
            if (itemKey === "new") {
              openDeployModal();
              sonner.toast(`Action: ${itemKey}`, "info");
              return;
            }
            if (itemKey === "rollback") {
              queueRollback(`Action: ${itemKey}`);
              return;
            }
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
            items={DASHBOARD_ACCOUNT_ITEMS}
            onSelect={(key: string) => sonner.toast(`${key}`, "info")}
          />
          <AsciiSpinner frames={["◠", "◡"]} interval={800} label="" />
          <span className="dim">live</span>
        </div>
      </div>

      <div className="dash-nav">
        <AsciiNavigationMenu
          items={DASHBOARD_NAV_ITEMS}
          activeKey={dashNav}
          onSelect={setDashNav}
        />
      </div>

      <div className="dash-controls">
        <AsciiSelect
          width={24}
          options={DASHBOARD_ENV_OPTIONS}
          value={envSelect}
          onChange={(value) => setEnvSelect(value as DashboardEnvironment)}
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

      <DashboardDeploymentSection
        resetToken={deployResetToken}
        onOpenDeploy={openDeployModal}
        onRollback={() => queueRollback("Rolling back...")}
      />

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
              columns={DASHBOARD_SERVICE_COLUMNS}
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
              bars={DASHBOARD_TRAFFIC_BARS}
            />
          </div>
          <h3 className="dash-section-title" style={{ marginTop: "1rem" }}>Weekly Activity</h3>
          <div className="blue">
            <AsciiHeatmap
              animate
              data={DASHBOARD_WEEKLY_ACTIVITY}
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
              columns={DASHBOARD_ENDPOINT_COLUMNS}
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

      <Suspense fallback={null}><LazyDashboardFeatureShowcases /></Suspense>

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
          if (key === "deploy") {
            openDeployModal();
            sonner.toast(`Executed: ${key}`, "success");
            return;
          }
          if (key === "rollback") {
            queueRollback(`Executed: ${key}`, "success");
            return;
          }
          sonner.toast(`Executed: ${key}`, "success");
        }}
        items={DASHBOARD_COMMANDS}
        placeholder="Search commands..."
      />

      <AsciiSonner toasts={sonner.toasts} dismiss={sonner.dismiss} width={40} animate />
    </div>
  );
}

const LazyDashboardFeatureShowcases = lazy(() => import("./featureShowcases").then((module) => ({ default: module.DashboardFeatureShowcases })));
const LazyComponentsView = lazy(() => import("./nonDashboardViews").then((module) => ({ default: module.ComponentsView })));
const LazyIndexView = lazy(() => import("./nonDashboardViews").then((module) => ({ default: module.IndexView })));

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
        {view === "components" && (
          <Suspense fallback={<div className="dim">loading components...</div>}>
            <LazyComponentsView />
          </Suspense>
        )}
        {view === "index" && (
          <Suspense fallback={<div className="dim">loading index...</div>}>
            <LazyIndexView />
          </Suspense>
        )}
      </main>

      <DemoFooter />
    </AsciiTheme>
  );
}

export default App;
