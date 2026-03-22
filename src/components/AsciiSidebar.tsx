import React from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

export interface AsciiSidebarItem {
  key: string;
  label: string;
  icon?: string;
  items?: AsciiSidebarItem[];
}

export interface AsciiSidebarProps {
  items: AsciiSidebarItem[];
  activeKey?: string;
  onSelect?: (key: string) => void;
  title?: string;
  width?: number;
  border?: BorderStyle;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiSidebar({
  items,
  activeKey,
  onSelect,
  title,
  width = 28,
  border = "single",
  className,
  style,
}: AsciiSidebarProps) {
  const b = borders[border];
  const inner = width - 2;

  const renderItems = (
    navItems: AsciiSidebarItem[],
    depth: number = 0
  ): React.ReactNode[] => {
    const nodes: React.ReactNode[] = [];

    for (const item of navItems) {
      const indent = "  ".repeat(depth);
      const isActive = item.key === activeKey;
      const marker = isActive ? ">" : " ";
      const icon = item.icon ? `${item.icon} ` : "";
      const text = `${marker} ${indent}${icon}${item.label}`;
      const line = b.v + pad(` ${text}`, inner) + b.v;

      nodes.push(
        <React.Fragment key={item.key}>
          <button
            type="button"
            className={`ascii-sidebar-item${isActive ? " ascii-sidebar-item-active" : ""}`}
            onClick={() => onSelect?.(item.key)}
            aria-current={isActive ? "page" : undefined}
          >
            {line}
          </button>
          {"\n"}
        </React.Fragment>
      );

      if (item.items) {
        nodes.push(...renderItems(item.items, depth + 1));
      }
    }

    return nodes;
  };

  return (
    <nav
      className={`ascii-lib ascii-sidebar ${className ?? ""}`.trim()}
      style={style}
      aria-label={title ?? "Sidebar navigation"}
    >
      {b.tl + repeatChar(b.h, inner) + b.tr}
      {"\n"}
      {title && (
        <>
          {b.v + pad(` ${title}`, inner) + b.v}
          {"\n"}
          {b.lm + repeatChar(b.h, inner) + b.rm}
          {"\n"}
        </>
      )}
      {renderItems(items)}
      {b.bl + repeatChar(b.h, inner) + b.br}
    </nav>
  );
}
