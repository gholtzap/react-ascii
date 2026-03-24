import React, { useEffect, useMemo, useRef } from "react";
import { useControllableState } from "../internal/useControllableState";

export interface AsciiTreeNode {
  id?: string;
  label: string;
  children?: AsciiTreeNode[];
}

export interface AsciiTreeProps {
  data: AsciiTreeNode[];
  guides?: "unicode" | "ascii";
  selectedId?: string;
  defaultSelectedId?: string;
  onSelectedIdChange?: (id: string | undefined) => void;
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onExpandedIdsChange?: (ids: string[]) => void;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

interface LineChars {
  branch: string;
  last: string;
  pipe: string;
  space: string;
}

interface VisibleTreeNode {
  id: string;
  label: string;
  level: number;
  parentId?: string;
  hasChildren: boolean;
  expanded: boolean;
  prefix: string;
}

const unicodeChars: LineChars = {
  branch: "├── ",
  last: "└── ",
  pipe: "│   ",
  space: "    ",
};

const asciiChars: LineChars = {
  branch: "|-- ",
  last: "`-- ",
  pipe: "|   ",
  space: "    ",
};

function collectExpandableIds(
  nodes: AsciiTreeNode[],
  path: number[] = []
): string[] {
  const ids: string[] = [];

  nodes.forEach((node, index) => {
    const id = node.id ?? [...path, index].join(".");

    if (node.children && node.children.length > 0) {
      ids.push(id);
      ids.push(...collectExpandableIds(node.children, [...path, index]));
    }
  });

  return ids;
}

function flattenVisibleNodes(
  nodes: AsciiTreeNode[],
  chars: LineChars,
  expandedIds: Set<string>,
  path: number[] = [],
  level = 1,
  parentId?: string,
  ancestorLast: boolean[] = []
): VisibleTreeNode[] {
  const rows: VisibleTreeNode[] = [];

  nodes.forEach((node, index) => {
    const id = node.id ?? [...path, index].join(".");
    const hasChildren = Boolean(node.children?.length);
    const expanded = hasChildren ? expandedIds.has(id) : false;
    const isLast = index === nodes.length - 1;
    const guidePrefix = ancestorLast.map((entry) => entry ? chars.space : chars.pipe).join("");
    const connector = isLast ? chars.last : chars.branch;

    rows.push({
      id,
      label: node.label,
      level,
      parentId,
      hasChildren,
      expanded,
      prefix: `${guidePrefix}${connector}`,
    });

    if (hasChildren && expanded) {
      rows.push(
        ...flattenVisibleNodes(
          node.children ?? [],
          chars,
          expandedIds,
          [...path, index],
          level + 1,
          id,
          [...ancestorLast, isLast]
        )
      );
    }
  });

  return rows;
}

export function AsciiTree({
  data,
  guides = "unicode",
  selectedId,
  defaultSelectedId,
  onSelectedIdChange,
  expandedIds,
  defaultExpandedIds,
  onExpandedIdsChange,
  color,
  className,
  style,
}: AsciiTreeProps) {
  const chars = guides === "ascii" ? asciiChars : unicodeChars;
  const initialExpandedIds = useMemo(
    () => defaultExpandedIds ?? collectExpandableIds(data),
    [data, defaultExpandedIds]
  );
  const [resolvedExpandedIds, setResolvedExpandedIds] = useControllableState<string[]>({
    value: expandedIds,
    defaultValue: initialExpandedIds,
    onChange: onExpandedIdsChange,
  });
  const expandedSet = useMemo(() => new Set(resolvedExpandedIds), [resolvedExpandedIds]);
  const visibleNodes = useMemo(
    () => flattenVisibleNodes(data, chars, expandedSet),
    [chars, data, expandedSet]
  );
  const [resolvedSelectedId, setResolvedSelectedId] = useControllableState<string | undefined>({
    value: selectedId,
    defaultValue: defaultSelectedId,
    onChange: onSelectedIdChange,
  });
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    if (visibleNodes.length === 0) {
      setResolvedSelectedId(undefined);
      return;
    }

    if (resolvedSelectedId && visibleNodes.some((node) => node.id === resolvedSelectedId)) {
      return;
    }

    setResolvedSelectedId(visibleNodes[0].id);
  }, [resolvedSelectedId, setResolvedSelectedId, visibleNodes]);

  const activeId = resolvedSelectedId ?? visibleNodes[0]?.id;

  const focusNode = (id: string) => {
    itemRefs.current[id]?.focus();
  };

  const moveToNode = (id: string | undefined) => {
    if (!id) return;
    setResolvedSelectedId(id);
    focusNode(id);
  };

  const toggleNode = (id: string) => {
    setResolvedExpandedIds((currentIds) => currentIds.includes(id)
      ? currentIds.filter((entry) => entry !== id)
      : [...currentIds, id]
    );
  };

  return (
    <div
      className={`ascii-lib ascii-tree ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
      role="tree"
      aria-label="Tree"
    >
      <div className="ascii-tree-list" role="none">
        {visibleNodes.map((node, index) => {
          const disclosure = node.hasChildren ? (node.expanded ? "[-] " : "[+] ") : "";

          return (
            <button
              key={node.id}
              ref={(element) => {
                itemRefs.current[node.id] = element;
              }}
              type="button"
              className={`ascii-tree-item${node.id === activeId ? " ascii-tree-item-selected" : ""}`}
              role="treeitem"
              aria-level={node.level}
              aria-expanded={node.hasChildren ? node.expanded : undefined}
              aria-selected={node.id === activeId}
              tabIndex={node.id === activeId ? 0 : -1}
              onClick={() => {
                setResolvedSelectedId(node.id);
                if (node.hasChildren) {
                  toggleNode(node.id);
                }
              }}
              onKeyDown={(event) => {
                switch (event.key) {
                  case "ArrowDown":
                    event.preventDefault();
                    moveToNode(visibleNodes[index + 1]?.id);
                    break;
                  case "ArrowUp":
                    event.preventDefault();
                    moveToNode(visibleNodes[index - 1]?.id);
                    break;
                  case "ArrowRight":
                    event.preventDefault();
                    if (node.hasChildren && !node.expanded) {
                      toggleNode(node.id);
                      break;
                    }
                    if (node.hasChildren && node.expanded) {
                      moveToNode(visibleNodes[index + 1]?.id);
                    }
                    break;
                  case "ArrowLeft":
                    event.preventDefault();
                    if (node.hasChildren && node.expanded) {
                      toggleNode(node.id);
                      break;
                    }
                    moveToNode(node.parentId);
                    break;
                  case "Home":
                    event.preventDefault();
                    moveToNode(visibleNodes[0]?.id);
                    break;
                  case "End":
                    event.preventDefault();
                    moveToNode(visibleNodes[visibleNodes.length - 1]?.id);
                    break;
                  case "Enter":
                  case " ":
                    event.preventDefault();
                    setResolvedSelectedId(node.id);
                    if (node.hasChildren) {
                      toggleNode(node.id);
                    }
                    break;
                }
              }}
            >
              {`${node.prefix}${disclosure}${node.label}`}
            </button>
          );
        })}
      </div>
    </div>
  );
}
