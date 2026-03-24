import React from "react";

export interface AsciiBreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface AsciiBreadcrumbProps {
  items: AsciiBreadcrumbItem[];
  separator?: string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiBreadcrumb({
  items,
  separator = " > ",
  color,
  className,
  style,
}: AsciiBreadcrumbProps) {
  return (
    <nav
      className={`ascii-lib ascii-breadcrumb ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
      aria-label="Breadcrumb"
    >
      <ol className="ascii-breadcrumb-list">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="ascii-breadcrumb-item">
              {item.href && !isLast ? (
                <a href={item.href} className="ascii-breadcrumb-link">
                  {item.label}
                </a>
              ) : item.onClick && !isLast ? (
                <button
                  type="button"
                  className="ascii-breadcrumb-link ascii-breadcrumb-btn"
                  onClick={item.onClick}
                >
                  {item.label}
                </button>
              ) : (
                <span aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className="ascii-breadcrumb-sep" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
