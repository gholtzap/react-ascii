import React from "react";

export interface AsciiNavigationMenuItem {
  key: string;
  label: string;
  href?: string;
  disabled?: boolean;
}

export interface AsciiNavigationMenuProps {
  items: AsciiNavigationMenuItem[];
  activeKey?: string;
  onSelect?: (key: string) => void;
  separator?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiNavigationMenu({
  items,
  activeKey,
  onSelect,
  separator = " | ",
  className,
  style,
}: AsciiNavigationMenuProps) {
  return (
    <nav
      className={`ascii-lib ascii-navmenu ${className ?? ""}`.trim()}
      style={style}
    >
      {items.map((item, i) => {
        const isActive = item.key === activeKey;
        const label = isActive ? `[${item.label}]` : ` ${item.label} `;
        return (
          <React.Fragment key={item.key}>
            {i > 0 && <span className="ascii-navmenu-sep">{separator}</span>}
            {item.href ? (
              <a
                href={item.href}
                className={`ascii-navmenu-link${isActive ? " ascii-navmenu-active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
              </a>
            ) : (
              <button
                type="button"
                className={`ascii-navmenu-btn${isActive ? " ascii-navmenu-active" : ""}`}
                onClick={() => onSelect?.(item.key)}
                disabled={item.disabled}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
