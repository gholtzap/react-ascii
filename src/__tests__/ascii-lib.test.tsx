import React, { useState } from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { AsciiBarChart } from "../components/AsciiBarChart";
import { AsciiBadge } from "../components/AsciiBadge";
import { AsciiButton } from "../components/AsciiButton";
import { AsciiCalendar } from "../components/AsciiCalendar";
import { AsciiCard } from "../components/AsciiCard";
import { AsciiCarousel } from "../components/AsciiCarousel";
import { AsciiCommandPalette } from "../components/AsciiCommandPalette";
import { AsciiDataTable } from "../components/AsciiDataTable";
import { AsciiDatePicker } from "../components/AsciiDatePicker";
import { AsciiDependencyGraph } from "../components/AsciiDependencyGraph";
import { AsciiDropdownMenu } from "../components/AsciiDropdownMenu";
import { AsciiForm } from "../components/AsciiForm";
import { AsciiInput } from "../components/AsciiInput";
import { AsciiLogViewer } from "../components/AsciiLogViewer";
import { AsciiModal } from "../components/AsciiModal";
import { AsciiPopover } from "../components/AsciiPopover";
import { AsciiTooltip } from "../components/AsciiTooltip";
import { AsciiTree } from "../components/AsciiTree";
import { useControllableState } from "../internal/useControllableState";

function CommandPaletteHarness() {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        open palette
      </button>
      <AsciiCommandPalette
        open={open}
        onClose={() => setOpen(false)}
        onSelect={() => setOpen(false)}
        items={[
          { key: "deploy", label: "Ship canary", group: "Deploy", shortcut: "D" },
          { key: "rollback", label: "Rollback build", group: "Deploy", shortcut: "R" },
          { key: "latency", label: "Inspect latency", group: "Observe", shortcut: "L" },
        ]}
      />
    </div>
  );
}

function ControllableStateHarness() {
  const [value, setValue] = useControllableState({
    defaultValue: 0,
  });

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setValue((currentValue) => currentValue + 1);
          setValue((currentValue) => currentValue + 1);
        }}
      >
        bump
      </button>
      <span>{value}</span>
    </div>
  );
}

function CalendarHarness() {
  const [value, setValue] = useState(new Date(2026, 0, 12));

  return (
    <div>
      <button type="button" onClick={() => setValue(new Date(2026, 2, 28))}>
        jump
      </button>
      <AsciiCalendar value={value} onChange={setValue} />
      <AsciiDatePicker value={value} onChange={setValue} />
    </div>
  );
}

function CarouselHarness() {
  const [items, setItems] = useState([
    { key: "one", content: "alpha" },
    { key: "two", content: "bravo" },
  ]);

  return (
    <div>
      <button type="button" onClick={() => setItems([{ key: "one", content: "alpha" }])}>
        shrink
      </button>
      <AsciiCarousel items={items} />
    </div>
  );
}

describe("ascii-lib", () => {
  test("applies functional controllable updates against the latest value", async () => {
    const user = userEvent.setup();

    render(<ControllableStateHarness />);

    await user.click(screen.getByRole("button", { name: "bump" }));

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  test("traps focus inside titled modal overlays and exposes an accessible name", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <div>
        <button type="button">outside</button>
        <AsciiModal open onClose={onClose} title="Deploy">
          <button type="button">confirm</button>
          <button type="button">cancel</button>
        </AsciiModal>
      </div>
    );

    expect(screen.getByRole("dialog", { name: "Deploy" })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
    });

    await user.tab();
    expect(screen.getByRole("button", { name: "confirm" })).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("keeps composed dropdown triggers focusable and styles danger items", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <AsciiDropdownMenu
        asChild
        trigger={<AsciiButton label="Actions" border="double" />}
        onSelect={onSelect}
        items={[
          { key: "deploy", label: "Deploy" },
          { key: "delete", label: "Delete", danger: true },
        ]}
      />
    );

    await user.click(screen.getByRole("button", { name: /actions/i }));

    const dangerItem = screen.getByRole("menuitem", { name: /delete/i });
    expect(dangerItem.className).toContain("ascii-dropdown-item-danger");

    await user.click(dangerItem);

    expect(onSelect).toHaveBeenCalledWith("delete");
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /actions/i })).toHaveFocus();
    });
  });

  test("renders rich content inside popovers from composed triggers", async () => {
    const user = userEvent.setup();

    render(
      <AsciiPopover
        asChild
        ariaLabel="Service details"
        content={
          <div>
            <div>service: api-gateway</div>
            <div>status: healthy</div>
          </div>
        }
      >
        <AsciiButton label="Inspect" border="single" />
      </AsciiPopover>
    );

    await user.click(screen.getByRole("button", { name: /inspect/i }));

    expect(screen.getByRole("dialog", { name: "Service details" })).toHaveTextContent("service: api-gateway");
    expect(document.body.textContent).toContain("status: healthy");
  });

  test("supports tooltip composition on badge-like triggers", async () => {
    const user = userEvent.setup();

    render(
      <AsciiTooltip asChild content="route: /api/checkout">
        <AsciiBadge>hot path</AsciiBadge>
      </AsciiTooltip>
    );

    await user.hover(screen.getByText("[ hot path ]"));

    expect(screen.getByRole("tooltip")).toHaveTextContent("route: /api/checkout");
  });

  test("syncs calendar views to controlled value changes and keeps selected markers aligned", async () => {
    const user = userEvent.setup();
    const { container } = render(<CalendarHarness />);

    expect(container.textContent).toContain("January 2026");
    expect(container.textContent).toContain(">12");

    await user.click(screen.getByRole("button", { name: "jump" }));

    expect(container.textContent).toContain("March 2026");
    expect(container.textContent).toContain(">28");
  });

  test("renders named forms with structured sections and submit actions", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    });

    render(
      <AsciiForm
        title="Deploy Request"
        description="Review rollout details"
        summary={<div>preview: api-gateway</div>}
        notices={[
          { key: "gate", tone: "warn", message: "Approval required" },
        ]}
        sections={[
          {
            key: "target",
            title: "Target",
            description: "Pick the release target.",
            columns: 2,
            children: (
              <>
                <AsciiInput label="Service" defaultValue="api-gateway" />
                <AsciiInput label="Environment" defaultValue="staging" />
              </>
            ),
            aside: <div>owner: platform</div>,
          },
        ]}
        actions={<AsciiButton label="Queue" type="submit" border="single" />}
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByRole("form", { name: "Deploy Request" })).toBeInTheDocument();
    expect(screen.getByText("Target")).toBeInTheDocument();
    expect(screen.getByText("Approval required")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /queue/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  test("disables form sections through the fieldset wrapper", () => {
    render(
      <AsciiForm
        title="Disabled Form"
        disabled
        sections={[
          {
            key: "target",
            title: "Target",
            children: <AsciiInput label="Service" defaultValue="api-gateway" />,
          },
        ]}
      />
    );

    expect(screen.getByLabelText("Service")).toBeDisabled();
  });

  test("renders grouped command sections and promotes recent commands", async () => {
    const user = userEvent.setup();
    const { container } = render(<CommandPaletteHarness />);

    await user.click(screen.getByRole("option", { name: /ship canary/i }));
    await user.click(screen.getByRole("button", { name: "open palette" }));

    expect(document.body.textContent).toContain("RECENT");
    expect(document.body.textContent).toContain("DEPLOY");
    expect(document.body.textContent).toContain("Ship canary");
  });

  test("supports keyboard row selection and loading states in data tables", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <div>
        <AsciiDataTable
          columns={[
            { key: "name", header: "NAME", width: 14, sortable: true },
            { key: "memory", header: "MEM", width: 10, sortable: true },
          ]}
          data={[
            { name: "postgres", memory: "2.1G" },
            { name: "api", memory: "256M" },
            { name: "scheduler", memory: "92M" },
          ]}
          selectable
          rowKey="name"
          resizableColumns
          pinnedColumns={["name"]}
        />
        <AsciiDataTable
          columns={[
            { key: "env", header: "ENV", width: 10 },
            { key: "state", header: "STATE", width: 16 },
          ]}
          data={[]}
          loading
        />
      </div>
    );

    const body = container.querySelector(".ascii-datatable-body") as HTMLElement | null;

    if (!body) {
      throw new Error("datatable body not rendered");
    }

    body.focus();
    fireEvent.keyDown(body, { key: " " });
    fireEvent.keyDown(body, { key: "ArrowDown" });
    fireEvent.keyDown(body, { key: " " });

    expect(container.textContent).toContain("selected: 2");
    expect(container.textContent).toContain("pins: name");
    expect(container.textContent).toContain("Loading");

    await user.click(screen.getByRole("button", { name: /mem/i }));
    expect(container.textContent).toContain("sort: MEM");
  });

  test("clamps carousel selection when items shrink", async () => {
    const user = userEvent.setup();

    const { container } = render(<CarouselHarness />);

    await user.click(screen.getByRole("button", { name: "Next slide" }));
    expect(screen.getByLabelText("Slide 2 of 2")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "shrink" }));

    expect(screen.getByLabelText("Slide 1 of 1")).toBeInTheDocument();
    expect(container.textContent).toContain("alpha");
  });

  test("supports follow toggles, bookmarks, and copy hooks in log viewers", async () => {
    const user = userEvent.setup();
    const onCopyLine = vi.fn();

    render(
      <AsciiLogViewer
        title="Live Logs"
        lines={[
          { id: "warmup", timestamp: "12:01", level: "info", source: "edge", message: "warmup complete" },
          { id: "budget", timestamp: "12:02", level: "warn", source: "queue", message: "retry budget at 68%" },
        ]}
        defaultSelectedId="budget"
        defaultBookmarkedIds={["budget"]}
        defaultFollow={false}
        onCopyLine={onCopyLine}
      />
    );

    expect(screen.getByRole("button", { name: "[follow]" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "[★]" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "[★]" }));
    expect(screen.getByRole("button", { name: "[☆]" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "[copy]" }));
    expect(onCopyLine).toHaveBeenCalledTimes(1);
  });

  test("does not restart animated bar charts when rerendered with equal bar values", () => {
    vi.useFakeTimers();
    try {
      const bars = [
        { label: "api-gw", value: 847 },
        { label: "auth", value: 320 },
        { label: "web", value: 580 },
      ];

      const { container, rerender } = render(
        <AsciiBarChart width={32} animate bars={bars} />
      );

      act(() => {
        vi.advanceTimersByTime(800);
      });

      const stableOutput = container.textContent;

      rerender(
        <AsciiBarChart
          width={32}
          animate
          bars={[
            { label: "api-gw", value: 847 },
            { label: "auth", value: 320 },
            { label: "web", value: 580 },
          ]}
        />
      );

      expect(container.textContent).toBe(stableOutput);
    } finally {
      vi.useRealTimers();
    }
  });

  test("keeps measured surfaces stable when rerendered with equal react content", async () => {
    const originalResizeObserver = globalThis.ResizeObserver;
    const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetHeight");

    class ResizeObserverMock {
      callback: ResizeObserverCallback;

      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
      }

      observe() {
        this.callback([], this as unknown as ResizeObserver);
      }

      unobserve() {}

      disconnect() {}
    }

    Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
      configurable: true,
      get() {
        const className = typeof this.className === "string" ? this.className : "";

        if (className.includes("ascii-surface-body")) return 88;
        if (className.includes("ascii-surface-footer")) return 44;

        return 22;
      },
    });

    Object.defineProperty(globalThis, "ResizeObserver", {
      configurable: true,
      value: ResizeObserverMock,
      writable: true,
    });

    try {
      const { container, rerender } = render(
        <AsciiCard
          title="Deploy Card"
          footer={
            <div>
              <div>owner: platform</div>
              <div>window: 02:00</div>
            </div>
          }
        >
          <div>
            <div>service: api-gateway</div>
            <div>batch: 03 / 10</div>
            <div>risk: low</div>
          </div>
        </AsciiCard>
      );

      await waitFor(() => {
        const shell = container.querySelector(".ascii-surface-shell");

        expect(shell?.textContent?.split("\n").length).toBeGreaterThan(9);
      });

      const shell = container.querySelector(".ascii-surface-shell");
      const stableShell = shell?.textContent;

      rerender(
        <AsciiCard
          title="Deploy Card"
          footer={
            <div>
              <div>owner: platform</div>
              <div>window: 02:00</div>
            </div>
          }
        >
          <div>
            <div>service: api-gateway</div>
            <div>batch: 03 / 10</div>
            <div>risk: low</div>
          </div>
        </AsciiCard>
      );

      expect(container.querySelector(".ascii-surface-shell")?.textContent).toBe(stableShell);
    } finally {
      if (originalOffsetHeight) {
        Object.defineProperty(HTMLElement.prototype, "offsetHeight", originalOffsetHeight);
      } else {
        Reflect.deleteProperty(HTMLElement.prototype, "offsetHeight");
      }

      if (originalResizeObserver) {
        Object.defineProperty(globalThis, "ResizeObserver", {
          configurable: true,
          value: originalResizeObserver,
          writable: true,
        });
      } else {
        Reflect.deleteProperty(globalThis, "ResizeObserver");
      }
    }
  });

  test("renders dependency graphs consistently", () => {
    const { container } = render(
      <AsciiDependencyGraph
        title="Topology"
        nodes={[
          { id: "edge", label: "edge", meta: "3 regions", status: "success" },
          { id: "api", label: "api", meta: "batch-03", status: "success" },
          { id: "db", label: "db", meta: "primary", status: "warn" },
        ]}
        edges={[
          { from: "edge", to: "api", label: "840 rps" },
          { from: "api", to: "db", label: "12ms" },
        ]}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test("renders tree items with keyboard-expandable hierarchy semantics", () => {
    render(
      <AsciiTree
        data={[
          {
            label: "src",
            children: [
              {
                label: "components",
                children: [
                  { label: "AsciiTree.tsx" },
                ],
              },
            ],
          },
        ]}
      />
    );

    const rootNode = screen.getByRole("treeitem", { name: /src/ });
    rootNode.focus();

    expect(screen.getByRole("treeitem", { name: /AsciiTree\.tsx/ })).toBeInTheDocument();

    fireEvent.keyDown(rootNode, { key: "ArrowLeft" });
    expect(screen.queryByRole("treeitem", { name: /AsciiTree\.tsx/ })).not.toBeInTheDocument();

    fireEvent.keyDown(rootNode, { key: "ArrowRight" });
    expect(screen.getByRole("treeitem", { name: /AsciiTree\.tsx/ })).toBeInTheDocument();
  });
});
