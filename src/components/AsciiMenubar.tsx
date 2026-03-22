import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { borders, pad, repeatChar, type BorderStyle } from "../chars";
import { AsciiPortal } from "../internal/AsciiPortal";
import { useAsciiFloating } from "../internal/useAsciiFloating";
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
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const menubarId = useId();
  const b = borders[border];
  const activeTriggerRef = useMemo(
    () => ({ current: openMenu ? triggerRefs.current[openMenu] ?? null : null }),
    [openMenu]
  );

  useDismissableLayer({
    open: Boolean(openMenu),
    onDismiss: () => setOpenMenu(null),
    refs: [ref, menuRef],
  });

  const currentMenuIndex = menus.findIndex((menu) => menu.key === openMenu);
  const currentMenu = currentMenuIndex >= 0 ? menus[currentMenuIndex] : undefined;
  const actionItems = useMemo(
    () => currentMenu?.items.filter((item) => !item.separator) ?? [],
    [currentMenu]
  );
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
  }, [openMenu]);

  useEffect(() => {
    if (!openMenu) return;
    menuRef.current?.focus();
  }, [openMenu]);

  const dropdownWidth = currentMenu
    ? Math.max(...currentMenu.items.map((item) => (item.separator ? 0 : item.label.length)), 0) + 6
    : 0;
  const inner = dropdownWidth - 2;
  const { floatingStyle, placement } = useAsciiFloating({
    open: Boolean(openMenu),
    anchorRef: activeTriggerRef,
    contentRef: menuRef,
    side: "bottom",
    align: "start",
    offset: 4,
  });

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
          triggerRefs.current[openMenu]?.focus();
        }
        break;
      case "Escape":
        event.preventDefault();
        setOpenMenu(null);
        triggerRefs.current[openMenu]?.focus();
        break;
      case "Tab":
        setOpenMenu(null);
        break;
    }
  };

  let actionIdx = 0;
  const activeId = openMenu && activeIndex >= 0 ? `${menubarId}-${openMenu}-${activeIndex}` : undefined;

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
              id={`${menubarId}-${menu.key}-trigger`}
              ref={(node) => {
                triggerRefs.current[menu.key] = node;
              }}
              type="button"
              className={`ascii-menubar-trigger${openMenu === menu.key ? " ascii-menubar-trigger-active" : ""}`}
              onClick={() => setOpenMenu(openMenu === menu.key ? null : menu.key)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setOpenMenu(menu.key);
                }
              }}
              onMouseEnter={() => {
                if (openMenu) setOpenMenu(menu.key);
              }}
              aria-expanded={openMenu === menu.key}
              aria-haspopup="menu"
              aria-controls={openMenu === menu.key ? `${menubarId}-${menu.key}-menu` : undefined}
            >
              {` ${menu.label} `}
            </button>
          </span>
        ))}
      </div>
      {openMenu && currentMenu ? (
        <AsciiPortal>
          <div
            id={`${menubarId}-${openMenu}-menu`}
            ref={menuRef}
            className={`ascii-menubar-dropdown ascii-menubar-${placement.side}`}
            style={floatingStyle}
            role="menu"
            tabIndex={0}
            aria-activedescendant={activeId}
            aria-labelledby={`${menubarId}-${openMenu}-trigger`}
          >
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
                    id={`${menubarId}-${openMenu}-${currentActionIdx}`}
                    className={`ascii-menubar-item${isActive ? " ascii-menubar-item-active" : ""}${item.disabled ? " ascii-menubar-item-disabled" : ""}`}
                    role="menuitem"
                    aria-disabled={item.disabled}
                    onMouseEnter={() => setActiveIndex(currentActionIdx)}
                    onClick={() => {
                      if (!item.disabled) {
                        onSelect(openMenu, item.key);
                        setOpenMenu(null);
                        triggerRefs.current[openMenu]?.focus();
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
        </AsciiPortal>
      ) : null}
    </div>
  );
}
