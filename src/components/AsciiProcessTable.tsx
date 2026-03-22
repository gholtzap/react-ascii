import React from "react";
import type { BorderStyle } from "../chars";
import { pad } from "../chars";
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
  className?: string;
  style?: React.CSSProperties;
}

function renderCpuBar(cpu: number) {
  const filled = Math.max(0, Math.min(5, Math.round(cpu / 20)));
  return `${"█".repeat(filled)}${"░".repeat(5 - filled)}`;
}

export function AsciiProcessTable({
  processes,
  title = "processes",
  width = 66,
  height = 8,
  border = "single",
  footer,
  className,
  style,
}: AsciiProcessTableProps) {
  const visibleProcesses = processes.slice(0, height);

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
      <div className="ascii-processtable-header">
        <span>{pad("PID", 5)}</span>
        <span>{pad("NAME", 18)}</span>
        <span>{pad("CPU", 6, "right")}</span>
        <span>{pad("LOAD", 8)}</span>
        <span>{pad("MEM", 8, "right")}</span>
        <span>{pad("STATE", 8)}</span>
      </div>
      <div className="ascii-processtable-list" role="table" aria-label={title}>
        {visibleProcesses.map((process) => (
          <div key={`${process.pid}-${process.name}`} className="ascii-processtable-row" role="row">
            <span>{pad(String(process.pid), 5, "right")}</span>
            <span>{pad(process.name, 18)}</span>
            <span>{pad(`${process.cpu}%`, 6, "right")}</span>
            <span>{pad(renderCpuBar(process.cpu), 8)}</span>
            <span>{pad(process.memory, 8, "right")}</span>
            <span>{pad(process.state, 8)}</span>
          </div>
        ))}
      </div>
    </AsciiWindow>
  );
}
