import React, { useState, useRef, useEffect, useCallback } from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

export interface AsciiContextMenuItem {
  key: string;
  label: string;
  shortcut?: string;
  disabled?: boolean;
  separator?: boolean;
}

export interface AsciiContextMenuProps {
  items: AsciiContextMenuItem[];
  onSelect: (key: string) => void;
  children: React.ReactNode;
  width?: number;
  border?: BorderStyle;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiContextMenu({
  items,
  onSelect,
  children,
  width = 24,
  border = "single",
  className,
  style,
}: AsciiContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const b = borders[border];
  const inner = width - 2;

  const actionItems = items.filter((item) => !item.separator);

  const handleContext = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setOpen(true);
    setActiveIndex(0);
  };

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open, handleClickOutside]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => {
          let next = i + 1;
          while (next < actionItems.length && actionItems[next].disabled) next++;
          return next < actionItems.length ? next : i;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => {
          let next = i - 1;
          while (next >= 0 && actionItems[next].disabled) next--;
          return next >= 0 ? next : i;
        });
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (activeIndex >= 0 && !actionItems[activeIndex].disabled) {
          onSelect(actionItems[activeIndex].key);
          setOpen(false);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
    }
  };

  let actionIdx = 0;

  return (
    <div
      className={`ascii-lib ascii-contextmenu-wrapper ${className ?? ""}`.trim()}
      style={style}
      onContextMenu={handleContext}
      onKeyDown={handleKeyDown}
    >
      {children}
      {open && (
        <div
          ref={menuRef}
          className="ascii-contextmenu"
          role="menu"
          tabIndex={-1}
          style={{ position: "absolute", left: pos.x, top: pos.y }}
        >
          {b.tl + repeatChar(b.h, inner) + b.tr}
          {"\n"}
          {items.map((item, i) => {
            if (item.separator) {
              return (
                <React.Fragment key={`sep-${i}`}>
                  {b.lm + repeatChar(b.h, inner) + b.rm}
                  {"\n"}
                </React.Fragment>
              );
            }
            const currentActionIdx = actionIdx++;
            const isActive = currentActionIdx === activeIndex;
            const marker = isActive ? ">" : " ";
            const shortcutStr = item.shortcut ? `  ${item.shortcut}` : "";
            const labelStr = `${marker} ${item.label}`;
            const combined = labelStr + " ".repeat(Math.max(1, inner - labelStr.length - shortcutStr.length)) + shortcutStr;
            const line = b.v + combined.slice(0, inner) + " ".repeat(Math.max(0, inner - combined.length)) + b.v;

            return (
              <React.Fragment key={item.key}>
                <div
                  className={`ascii-contextmenu-item${isActive ? " ascii-contextmenu-item-active" : ""}${item.disabled ? " ascii-contextmenu-item-disabled" : ""}`}
                  role="menuitem"
                  aria-disabled={item.disabled}
                  onClick={() => {
                    if (!item.disabled) {
                      onSelect(item.key);
                      setOpen(false);
                    }
                  }}
                >
                  {line}
                </div>
                {"\n"}
              </React.Fragment>
            );
          })}
          {b.bl + repeatChar(b.h, inner) + b.br}
        </div>
      )}
    </div>
  );
}
