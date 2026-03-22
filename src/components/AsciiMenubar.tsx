import React, { useEffect, useRef, useState } from "react";
import { borders, pad, repeatChar, type BorderStyle } from "../chars";
import { useAsciiListNavigation } from "../internal/useAsciiListNavigation";
import { useDismissableLayer } from "../internal/useDismissableLayer";

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
  const ref = useRef<HTMLDivElement>(null);
  const b = borders[border];

  useDismissableLayer({
    open: Boolean(openMenu),
    onDismiss: () => setOpenMenu(null),
    refs: [ref],
  });

  const currentMenuIndex = menus.findIndex((menu) => menu.key === openMenu);
  const currentMenu = currentMenuIndex >= 0 ? menus[currentMenuIndex] : undefined;
  const actionItems = currentMenu?.items.filter((item) => !item.separator) ?? [];
  const {
    activeIndex,
    setActiveIndex,
    moveNext,
    movePrev,
    reset,
  } = useAsciiListNavigation({
    items: actionItems,
    isDisabled: (item) => Boolean(item.disabled),
    loop: true,
  });

  useEffect(() => {
    if (openMenu) reset(0);
  }, [openMenu, reset]);

  const dropdownWidth = currentMenu
    ? Math.max(...currentMenu.items.map((item) => (item.separator ? 0 : item.label.length)), 0) + 6
    : 0;
  const inner = dropdownWidth - 2;

  const handleMenuKeyDown = (event: React.KeyboardEvent) => {
    if (!openMenu || !currentMenu) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveNext();
        break;
      case "ArrowUp":
        event.preventDefault();
        movePrev();
        break;
      case "ArrowRight":
        event.preventDefault();
        setOpenMenu(menus[(currentMenuIndex + 1) % menus.length]?.key ?? null);
        break;
      case "ArrowLeft":
        event.preventDefault();
        setOpenMenu(menus[(currentMenuIndex - 1 + menus.length) % menus.length]?.key ?? null);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (activeIndex >= 0 && !actionItems[activeIndex]?.disabled) {
          onSelect(openMenu, actionItems[activeIndex].key);
          setOpenMenu(null);
        }
        break;
      case "Escape":
        event.preventDefault();
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
              onMouseEnter={() => {
                if (openMenu) setOpenMenu(menu.key);
              }}
              aria-expanded={openMenu === menu.key}
              aria-haspopup="menu"
            >
              {` ${menu.label} `}
            </button>
            {openMenu === menu.key && currentMenu && (
              <div className="ascii-menubar-dropdown" role="menu">
                {b.tl + repeatChar(b.h, inner) + b.tr}
                {"\n"}
                {currentMenu.items.map((item, index) => {
                  if (item.separator) {
                    return (
                      <React.Fragment key={`sep-${index}`}>
                        {b.lm + repeatChar(b.h, inner) + b.rm}
                        {"\n"}
                      </React.Fragment>
                    );
                  }

                  const currentActionIdx = actionIdx++;
                  const isActive = currentActionIdx === activeIndex;
                  const marker = isActive ? ">" : " ";
                  const line = b.v + pad(`${marker} ${item.label}`, inner) + b.v;

                  return (
                    <React.Fragment key={item.key}>
                      <div
                        className={`ascii-menubar-item${isActive ? " ascii-menubar-item-active" : ""}${item.disabled ? " ascii-menubar-item-disabled" : ""}`}
                        role="menuitem"
                        aria-disabled={item.disabled}
                        onMouseEnter={() => setActiveIndex(currentActionIdx)}
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
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
