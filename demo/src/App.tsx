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
} from "ascii-lib";
import "./App.css";

const BANNER = `
   ___   _____ __________   __    ________
  / _ | / ___// ___/  _/ / / /   /  _/ _ )
 / __ |_\\ \\/ /__ _/ / / /_/ /__ _/ // _  |
/_/ |_/___/\\___/___//_____/____/___/____/
`;

// ─── Dashboard Tab ──────────────────────────────────────────

function Dashboard() {
  const [deployOpen, setDeployOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("logs");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [darkAlerts, setDarkAlerts] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [envSelect, setEnvSelect] = useState("production");
  const [deployProgress, setDeployProgress] = useState(73);

  // Simulate live progress
  useEffect(() => {
    if (deployProgress >= 100) return;
    const t = setTimeout(() => setDeployProgress((p) => Math.min(100, p + 1)), 600);
    return () => clearTimeout(t);
  }, [deployProgress]);

  return (
    <div className="dashboard">
      {/* ── Top bar ─────────────────────────── */}
      <div className="dash-topbar">
        <div className="dash-topbar-left">
          <span className="dash-logo">{"▲ NEXUS"}</span>
          <span className="dim">{"│"}</span>
          <span className="dim">infrastructure</span>
        </div>
        <div className="dash-topbar-right">
          <AsciiSpinner frames={["◠", "◡"]} interval={800} label="" />
          <span className="dim">live</span>
          <span className="dim">│</span>
          <AsciiTooltip text="Signed in as admin@nexus.io">
            <span>admin</span>
          </AsciiTooltip>
        </div>
      </div>

      {/* ── Environment selector + controls ── */}
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
        <AsciiInput
          width={32}
          placeholder="search services..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
        />
        <div className="dash-toggles">
          <AsciiToggle checked={autoRefresh} onChange={setAutoRefresh} label="auto-refresh" width={10} />
          <AsciiToggle checked={darkAlerts} onChange={setDarkAlerts} label="mute alerts" width={10} />
        </div>
      </div>

      {/* ── Status alert ─────────────────────── */}
      {!darkAlerts && (
        <div className="dash-alert-strip">
          <div className="warning">
            <AsciiAlert variant="warning" width={72}>
              Memory usage on web-02 at 87% — autoscaler triggered
            </AsciiAlert>
          </div>
        </div>
      )}

      {/* ── Metric cards ──────────────────────── */}
      <div className="dash-metrics">
        <div className="green">
          <AsciiCard title="Requests / min" width={26} border="single">
            {"  ██ 12,847\n  ▲ +4.2% from last hour"}
          </AsciiCard>
        </div>
        <div className="blue">
          <AsciiCard title="Avg Latency" width={26} border="single">
            {"  ██ 34ms\n  ▼ -12% from last hour"}
          </AsciiCard>
        </div>
        <div className="green">
          <AsciiCard title="Error Rate" width={26} border="single">
            {"  ██ 0.02%\n  ─ stable"}
          </AsciiCard>
        </div>
        <div className="accent2">
          <AsciiCard title="Active Users" width={26} border="single">
            {"  ██ 3,291\n  ▲ +18% from yesterday"}
          </AsciiCard>
        </div>
      </div>

      {/* ── Deployment progress ───────────────── */}
      <div className="dash-deploy-section">
        <AsciiDivider width={72} border="single" label="DEPLOYMENT v2.5.0-rc.3" />
        <div className="dash-deploy-row">
          <div className="green">
            <AsciiProgress value={deployProgress} width={50} aria-label="Deploy progress" />
          </div>
          <div className="dash-deploy-badges">
            <span className="green"><AsciiBadge>ROLLING</AsciiBadge></span>
            <span className="dim"><AsciiBadge variant="outline">{`${deployProgress}%`}</AsciiBadge></span>
          </div>
        </div>
        <div className="dash-deploy-actions">
          <div className="green">
            <AsciiButton label="Deploy New" border="single" onClick={() => setDeployOpen(true)} />
          </div>
          <div className="red">
            <AsciiButton label="Rollback" border="bold" onClick={() => setDeployProgress(0)} />
          </div>
        </div>
      </div>

      {/* ── Services table ───────────────────── */}
      <div className="dash-section">
        <h3 className="dash-section-title">Services</h3>
        <div className="green">
          <AsciiTable
            columns={[
              { key: "name", header: "SERVICE", width: 18 },
              { key: "status", header: "STATUS", width: 10 },
              { key: "cpu", header: "CPU", width: 8, align: "right" },
              { key: "mem", header: "MEM", width: 8, align: "right" },
              { key: "replicas", header: "PODS", width: 8, align: "right" },
              { key: "version", header: "VERSION", width: 12 },
            ]}
            data={[
              { name: "api-gateway", status: "● healthy", cpu: "12%", mem: "256M", replicas: "3/3", version: "v2.4.1" },
              { name: "auth-service", status: "● healthy", cpu: "8%", mem: "128M", replicas: "2/2", version: "v1.9.0" },
              { name: "web-frontend", status: "● healthy", cpu: "3%", mem: "64M", replicas: "4/4", version: "v2.5.0" },
              { name: "worker-queue", status: "◐ scaling", cpu: "78%", mem: "512M", replicas: "2/5", version: "v2.4.1" },
              { name: "postgres-main", status: "● healthy", cpu: "22%", mem: "2.1G", replicas: "1/1", version: "15.4" },
              { name: "redis-cache", status: "● healthy", cpu: "1%", mem: "48M", replicas: "3/3", version: "7.2" },
            ].filter(r => !searchVal || r.name.includes(searchVal))}
          />
        </div>
      </div>

      {/* ── Activity / Logs / Incidents tabs ──── */}
      <div className="dash-section">
        <div className="green">
          <AsciiTabs
            activeKey={activeSection}
            onTabChange={setActiveSection}
            tabs={[
              {
                key: "logs",
                label: "Request Log",
                content: (
                  <div style={{ padding: "0.75rem 0", whiteSpace: "pre" }} className="dim">
                    {"  [14:32:01] GET  /api/health       200   2ms\n"}
                    {"  [14:32:03] POST /api/auth/token   201  48ms\n"}
                    {"  [14:32:05] GET  /api/users?p=1    200  14ms\n"}
                    {"  [14:32:06] PUT  /api/users/291    200  31ms\n"}
                    {"  [14:32:08] POST /api/deploy       202 1.2s\n"}
                    {"  [14:32:11] GET  /api/metrics      200   8ms\n"}
                    {"  [14:32:14] DEL  /api/sessions/old 204  22ms"}
                  </div>
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

      {/* ── Infrastructure tree + Endpoints side by side ── */}
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
              data={[
                { route: "/api/health", p99: "2ms", rps: "840" },
                { route: "/api/auth/*", p99: "48ms", rps: "320" },
                { route: "/api/users/*", p99: "31ms", rps: "580" },
                { route: "/api/deploy", p99: "1.2s", rps: "12" },
                { route: "/api/metrics", p99: "8ms", rps: "200" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* ── Config snippet ────────────────────── */}
      <div className="dash-section">
        <AsciiAccordion
          width={72}
          border="single"
          items={[
            {
              key: "k8s",
              title: "Kubernetes Config",
              content: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: api
        image: nexus/api:v2.5.0-rc.3
        resources:
          limits:
            memory: "512Mi"
            cpu: "500m"`,
            },
            {
              key: "env",
              title: "Environment Variables",
              content: `NODE_ENV=production
DATABASE_URL=postgres://...
REDIS_URL=redis://cache:6379
LOG_LEVEL=info
RATE_LIMIT=1000`,
            },
            {
              key: "alerts",
              title: "Alert Rules",
              content: `- name: high-memory
  condition: mem_usage > 80%
  action: autoscale + notify
- name: error-rate
  condition: error_rate > 1%
  action: page oncall`,
            },
          ]}
        />
      </div>

      {/* ── Deploy modal ──────────────────────── */}
      <AsciiModal
        open={deployOpen}
        onClose={() => setDeployOpen(false)}
        title="New Deployment"
        width={50}
        border="double"
      >
        {"Target:   production (us-east-1, eu-west-1)\nImage:    nexus/api:v2.5.1\nStrategy: rolling (max-surge 1)\n\n  [Enter] confirm   [Esc] cancel"}
      </AsciiModal>
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
              onClick={() => setButtonClicks((c) => c + 1)}
            />
          </div>
          <div className="red">
            <AsciiButton label="Cancel" border="bold" onClick={() => setButtonClicks(0)} />
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
              onChange={(e) => setInputVal(e.target.value)}
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
            onChange={(e) => setCheck1(e.target.checked)}
          />
          <AsciiCheckbox
            label="Verbose mode"
            checked={check2}
            onChange={(e) => setCheck2(e.target.checked)}
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
            <AsciiToggle checked={toggle1} onChange={setToggle1} label="Dark mode" width={12} />
          </div>
          <div className="blue">
            <AsciiToggle checked={toggle2} onChange={setToggle2} label="Notifications" width={12} />
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
              onChange={(e) => setTextareaVal(e.target.value)}
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

      <AsciiDivider width={80} border="double" className="divider-full" />
    </div>
  );
}

// ─── App ────────────────────────────────────────────────────

function App() {
  const [view, setView] = useState<"dashboard" | "components">("dashboard");

  return (
    <>
      {/* ── Header ──────────────────────────────── */}
      <header className="demo-header">
        <span aria-hidden="true">{BANNER}</span>
        <h1 className="sr-only">ascii-lib</h1>
        <div className="subtitle">
          Every component is ASCII. A React component library
          {"\n"}
          rendered entirely with box-drawing characters.
        </div>
      </header>

      {/* ── View switcher ───────────────────────── */}
      <nav className="view-switcher">
        <button
          className={`view-tab ${view === "dashboard" ? "view-tab-active" : ""}`}
          onClick={() => setView("dashboard")}
        >
          {"[ Dashboard ]"}
        </button>
        <button
          className={`view-tab ${view === "components" ? "view-tab-active" : ""}`}
          onClick={() => setView("components")}
        >
          {"[ Components ]"}
        </button>
      </nav>

      <main>
        {view === "dashboard" ? <Dashboard /> : <Components />}
      </main>

      {/* ── Footer ──────────────────────────────── */}
      <footer>
        <pre>
{`  ┌─────────────────────────────────────────┐
  │  ascii-lib ~ every pixel is a character │
  │                                         │
  │  5 border styles / 33 components        │
  │  typescript / accessible / zero deps    │
  └─────────────────────────────────────────┘`}
        </pre>
      </footer>
    </>
  );
}

export default App;
