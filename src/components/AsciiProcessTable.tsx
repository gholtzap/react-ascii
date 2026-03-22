import React, { useMemo } from "react";
import type { BorderStyle } from "../chars";
import { pad } from "../chars";
import { renderHighlightedText } from "../internal/renderHighlightedText";
import { AsciiWindow } from "./AsciiWindow";

export interface AsciiProcessRow {
  pid: number;
  name: string;
  cpu: number;
  memory: string;
  state: string;
}

export interface AsciiProcessTableProps {
  processes: AsciiProcessRow[];
  title?: string;
  width?: number;
  height?: number;
  border?: BorderStyle;
  footer?: React.ReactNode;
  toolbar?: React.ReactNode;
  query?: string;
  sortBy?: "pid" | "name" | "cpu" | "memory" | "state";
  sortDirection?: "asc" | "desc";
  showSummary?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

function renderCpuBar(cpu: number) {
  const filled = Math.max(0, Math.min(5, Math.round(cpu / 20)));
  return `${"█".repeat(filled)}${"░".repeat(5 - filled)}`;
}

function parseMemory(memory: string) {
  const match = memory.trim().toLowerCase().match(/^(\d+(?:\.\d+)?)(m|g|t)$/);

  if (!match) return Number.parseFloat(memory) || 0;

  const amount = Number.parseFloat(match[1]);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    m: 1,
    g: 1024,
    t: 1024 * 1024,
  };

  return amount * multipliers[unit];
}

function matchesProcessQuery(process: AsciiProcessRow, query?: string) {
  const normalized = query?.trim().toLowerCase();

  if (!normalized) return true;

  return [process.pid, process.name, process.memory, process.state]
    .some((value) => String(value).toLowerCase().includes(normalized));
}

export function AsciiProcessTable({
  processes,
  title = "processes",
  width = 66,
  height = 8,
  border = "single",
  footer,
  toolbar,
  query,
  sortBy = "cpu",
  sortDirection = "desc",
  showSummary = true,
  className,
  style,
}: AsciiProcessTableProps) {
  const visibleProcesses = useMemo(() => {
    const filtered = processes.filter((process) => matchesProcessQuery(process, query));

    const sorted = [...filtered].sort((left, right) => {
      const leftValue = sortBy === "memory" ? parseMemory(left.memory) : left[sortBy];
      const rightValue = sortBy === "memory" ? parseMemory(right.memory) : right[sortBy];

      if (typeof leftValue === "number" && typeof rightValue === "number") {
        return sortDirection === "asc" ? leftValue - rightValue : rightValue - leftValue;
      }

      return sortDirection === "asc"
        ? String(leftValue).localeCompare(String(rightValue))
        : String(rightValue).localeCompare(String(leftValue));
    });

    return sorted.slice(0, height);
  }, [height, processes, query, sortBy, sortDirection]);

  const summary = useMemo(() => {
    if (visibleProcesses.length === 0) return "visible: 0";

    const totalCpu = visibleProcesses.reduce((sum, process) => sum + process.cpu, 0);
    const hottest = visibleProcesses.reduce((current, process) => process.cpu > current.cpu ? process : current, visibleProcesses[0]);

    return `visible: ${visibleProcesses.length}  cpu: ${totalCpu.toFixed(0)}%  hottest: ${hottest.name}`;
  }, [visibleProcesses]);

  return (
    <AsciiWindow
      title={title}
      width={width}
      height={height + 1}
      border={border}
      footer={footer}
      className={`ascii-processtable ${className ?? ""}`.trim()}
      style={style}
    >
      {toolbar ? <div className="ascii-processtable-toolbar">{toolbar}</div> : null}
      {showSummary ? <div className="ascii-processtable-summary">{summary}</div> : null}
      <div className="ascii-processtable-header">
        <span>{pad("PID", 5)}</span>
        <span>{pad("NAME", 18)}</span>
        <span>{pad("CPU", 6, "right")}</span>
        <span>{pad("LOAD", 8)}</span>
        <span>{pad("MEM", 8, "right")}</span>
        <span>{pad("STATE", 8)}</span>
      </div>
      <div className="ascii-processtable-list" role="table" aria-label={title}>
        {visibleProcesses.length === 0 ? (
          <div className="ascii-processtable-empty">No matching processes</div>
        ) : (
          visibleProcesses.map((process) => (
            <div key={`${process.pid}-${process.name}`} className="ascii-processtable-row" role="row">
              <span>{pad(String(process.pid), 5, "right")}</span>
              <span>{renderHighlightedText(pad(process.name, 18), query)}</span>
              <span>{pad(`${process.cpu}%`, 6, "right")}</span>
              <span>{pad(renderCpuBar(process.cpu), 8)}</span>
              <span>{pad(process.memory, 8, "right")}</span>
              <span>{renderHighlightedText(pad(process.state, 8), query)}</span>
            </div>
          ))
        )}
      </div>
    </AsciiWindow>
  );
}
