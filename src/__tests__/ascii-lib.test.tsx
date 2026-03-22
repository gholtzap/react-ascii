import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { AsciiDataTable } from "../components/AsciiDataTable";
import { AsciiDependencyGraph } from "../components/AsciiDependencyGraph";
import { AsciiDropdownMenu } from "../components/AsciiDropdownMenu";
import { AsciiModal } from "../components/AsciiModal";
import { AsciiPopover } from "../components/AsciiPopover";

describe("ascii-lib", () => {
  test("traps focus inside modal overlays and closes on escape", async () => {
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

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
    });

    await user.tab();
    expect(screen.getByRole("button", { name: "confirm" })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: "cancel" })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("focuses dropdown menus and selects the active item from keyboard navigation", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <AsciiDropdownMenu
        onSelect={onSelect}
        items={[
          { key: "deploy", label: "Deploy" },
          { key: "rollback", label: "Rollback" },
          { key: "history", label: "History" },
        ]}
      />
    );

    await user.click(screen.getByRole("button", { name: "Actions menu" }));

    const menu = screen.getByRole("menu");

    expect(menu).toHaveFocus();

    const initialActiveId = menu.getAttribute("aria-activedescendant");

    expect(initialActiveId).toBeTruthy();

    fireEvent.keyDown(menu, { key: "ArrowDown" });

    await waitFor(() => {
      const nextActiveId = menu.getAttribute("aria-activedescendant");
      expect(nextActiveId).toBeTruthy();
      expect(nextActiveId).not.toBe(initialActiveId);
    });

    fireEvent.keyDown(menu, { key: "Enter" });

    expect(onSelect).toHaveBeenCalledWith("rollback");
  });

  test("sorts tables using parsed unit values", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <AsciiDataTable
        columns={[
          { key: "name", header: "NAME" },
          { key: "memory", header: "MEM", sortable: true },
        ]}
        data={[
          { name: "postgres", memory: "2.1G" },
          { name: "api", memory: "256M" },
          { name: "scheduler", memory: "92M" },
        ]}
      />
    );

    await user.click(screen.getByRole("button", { name: /mem/i }));

    const ascendingText = container.textContent ?? "";

    expect(ascendingText.indexOf("scheduler")).toBeLessThan(ascendingText.indexOf("api"));
    expect(ascendingText.indexOf("api")).toBeLessThan(ascendingText.indexOf("postgres"));

    await user.click(screen.getByRole("button", { name: /mem/i }));

    const descendingText = container.textContent ?? "";

    expect(descendingText.indexOf("postgres")).toBeLessThan(descendingText.indexOf("api"));
    expect(descendingText.indexOf("api")).toBeLessThan(descendingText.indexOf("scheduler"));
  });

  test("renders rich React content inside popovers", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <AsciiPopover
        content={
          <div>
            <div>service: api-gateway</div>
            <div>status: healthy</div>
          </div>
        }
      >
        inspect
      </AsciiPopover>
    );

    await user.click(screen.getByRole("button", { name: "inspect" }));

    expect(container.textContent).toContain("service: api-gateway");
    expect(container.textContent).toContain("status: healthy");
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
});
