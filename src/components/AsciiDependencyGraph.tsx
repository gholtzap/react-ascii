import React from "react";
import type { BorderStyle } from "../chars";
import { pad } from "../chars";
import { AsciiWindow } from "./AsciiWindow";

export type AsciiDependencyStatus = "neutral" | "success" | "warn" | "error";

export interface AsciiDependencyNode {
  id: string;
  label: string;
  meta?: string;
  status?: AsciiDependencyStatus;
}

export interface AsciiDependencyEdge {
  from: string;
  to: string;
  label?: string;
}

export interface AsciiDependencyGraphProps {
  nodes: AsciiDependencyNode[];
  edges: AsciiDependencyEdge[];
  title?: string;
  width?: number;
  height?: number;
  border?: BorderStyle;
  footer?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const nodeMarkers: Record<AsciiDependencyStatus, string> = {
  neutral: "○",
  success: "●",
  warn: "◐",
  error: "◌",
};

export function AsciiDependencyGraph({
  nodes,
  edges,
  title = "topology",
  width = 64,
  height = 8,
  border = "single",
  footer,
  className,
  style,
}: AsciiDependencyGraphProps) {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const grouped = nodes
    .map((node) => ({
      node,
      outgoing: edges.filter((edge) => edge.from === node.id),
    }))
    .filter((entry) => entry.outgoing.length > 0)
    .slice(0, height);

  return (
    <AsciiWindow
      title={title}
      width={width}
      height={height}
      border={border}
      footer={footer}
      className={`ascii-dependencygraph ${className ?? ""}`.trim()}
      style={style}
    >
      <div className="ascii-dependencygraph-list" role="list" aria-label={title}>
        {grouped.map(({ node, outgoing }) => (
          <div key={node.id} className="ascii-dependencygraph-group" role="listitem">
            <div className={`ascii-dependencygraph-node ascii-dependencygraph-${node.status ?? "neutral"}`}>
              <span>{`${nodeMarkers[node.status ?? "neutral"]} ${node.label}`}</span>
              <span className="ascii-dependencygraph-meta">{node.meta ?? ""}</span>
            </div>
            {outgoing.map((edge, index) => {
              const target = nodeMap.get(edge.to);
              const connector = index === outgoing.length - 1 ? "└" : "├";
              const status = target?.status ?? "neutral";

              return (
                <div key={`${edge.from}-${edge.to}-${index}`} className={`ascii-dependencygraph-edge ascii-dependencygraph-${status}`}>
                  <span>{`${connector}─> ${pad(target?.label ?? edge.to, 20)}`}</span>
                  <span className="ascii-dependencygraph-meta">{edge.label ?? target?.meta ?? ""}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </AsciiWindow>
  );
}
