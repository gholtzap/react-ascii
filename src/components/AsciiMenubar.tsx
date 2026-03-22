import React, { useState, useRef, useEffect, useCallback } from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

export interface AsciiMenubarMenuItem {
  key: string;
  label: string;
  disabled?: boolean;
  separator?: boolean;
}

export interface AsciiMenubarMenu {
  key: string;
  label: string;
  items: AsciiMenubarMenuItem[];
}

export interface AsciiMenubarProps {
  menus: AsciiMenubarMenu[];
  onSelect: (menuKey: string, itemKey: string) => void;
  border?: BorderStyle;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiMenubar({
  menus,
  onSelect,
  border = "single",
  className,
  style,
}: AsciiMenubarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const b = borders[border];

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpenMenu(null);
    }
  }, []);

  useEffect(() => {
    if (openMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openMenu, handleClickOutside]);

  useEffect(() => {
    if (openMenu) setActiveItem(0);
  }, [openMenu]);

  const currentMenu = menus.find((m) => m.key === openMenu);
  const actionItems = currentMenu?.items.filter((i) => !i.separator) ?? [];
  const dropdownWidth = currentMenu
    ? Math.max(...currentMenu.items.map((i) => (i.separator ? 0 : i.label.length))) + 6
    : 0;
  const inner = dropdownWidth - 2;

  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    if (!openMenu || !currentMenu) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveItem((i) => Math.min(i + 1, actionItems.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveItem((i) => Math.max(i - 1, 0));
        break;
      case "ArrowRight": {
        e.preventDefault();
        const idx = menus.findIndex((m) => m.key === openMenu);
        if (idx < menus.length - 1) setOpenMenu(menus[idx + 1].key);
        break;
      }
      case "ArrowLeft": {
        e.preventDefault();
        const idx = menus.findIndex((m) => m.key === openMenu);
        if (idx > 0) setOpenMenu(menus[idx - 1].key);
        break;
      }
      case "Enter":
      case " ":
        e.preventDefault();
        if (activeItem >= 0 && !actionItems[activeItem]?.disabled) {
          onSelect(openMenu, actionItems[activeItem].key);
          setOpenMenu(null);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpenMenu(null);
        break;
    }
  };

  let actionIdx = 0;

  return (
    <div
      ref={ref}
      className={`ascii-lib ascii-menubar ${className ?? ""}`.trim()}
      style={style}
      role="menubar"
      onKeyDown={handleMenuKeyDown}
    >
      <div className="ascii-menubar-items">
        {menus.map((menu) => (
          <span key={menu.key} className="ascii-menubar-menu-wrapper">
            <button
              type="button"
              className={`ascii-menubar-trigger${openMenu === menu.key ? " ascii-menubar-trigger-active" : ""}`}
              onClick={() => setOpenMenu(openMenu === menu.key ? null : menu.key)}
              onMouseEnter={() => { if (openMenu) setOpenMenu(menu.key); }}
              aria-expanded={openMenu === menu.key}
              aria-haspopup="menu"
            >
              {` ${menu.label} `}
            </button>
            {openMenu === menu.key && currentMenu && (() => {
              actionIdx = 0;
              return (
                <div className="ascii-menubar-dropdown" role="menu">
                  {b.tl + repeatChar(b.h, inner) + b.tr}
                  {"\n"}
                  {currentMenu.items.map((item, i) => {
                    if (item.separator) {
                      return (
                        <React.Fragment key={`sep-${i}`}>
                          {b.lm + repeatChar(b.h, inner) + b.rm}
                          {"\n"}
                        </React.Fragment>
                      );
                    }
                    const curIdx = actionIdx++;
                    const isActive = curIdx === activeItem;
                    const marker = isActive ? ">" : " ";
                    const line = b.v + pad(`${marker} ${item.label}`, inner) + b.v;
                    return (
                      <React.Fragment key={item.key}>
                        <div
                          className={`ascii-menubar-item${isActive ? " ascii-menubar-item-active" : ""}${item.disabled ? " ascii-menubar-item-disabled" : ""}`}
                          role="menuitem"
                          aria-disabled={item.disabled}
                          onClick={() => {
                            if (!item.disabled) {
                              onSelect(menu.key, item.key);
                              setOpenMenu(null);
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
              );
            })()}
          </span>
        ))}
      </div>
    </div>
  );
}
