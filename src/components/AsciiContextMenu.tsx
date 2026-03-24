import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { borders, repeatChar, type BorderStyle } from "../chars";
import { AsciiPortal } from "../internal/AsciiPortal";
import { useAsciiFloating } from "../internal/useAsciiFloating";
import { useAsciiListNavigation } from "../internal/useAsciiListNavigation";
import { useDismissableLayer } from "../internal/useDismissableLayer";

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
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiContextMenu({
  items,
  onSelect,
  children,
  width = 24,
  border = "single",
  color,
  className,
  style,
}: AsciiContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const b = borders[border];
  const inner = width - 2;
  const { floatingStyle } = useAsciiFloating({
    open,
    anchorRect,
    contentRef: menuRef,
    side: "bottom",
    align: "start",
    offset: 0,
  });

  const actionItems = useMemo(() => items.filter((item) => !item.separator), [items]);
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
    if (open) reset(0);
  }, [open, reset]);

  useEffect(() => {
    if (!open) return;
    menuRef.current?.focus();
  }, [open]);

  useDismissableLayer({
    open,
    onDismiss: () => setOpen(false),
    refs: [wrapperRef, menuRef],
  });

  const handleContext = (event: React.MouseEvent) => {
    event.preventDefault();
    setAnchorRect(new DOMRect(event.clientX, event.clientY, 0, 0));
    setOpen(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!open) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveNext();
        break;
      case "ArrowUp":
        event.preventDefault();
        movePrev();
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (activeIndex >= 0 && !actionItems[activeIndex]?.disabled) {
          onSelect(actionItems[activeIndex].key);
          setOpen(false);
        }
        break;
      case "Escape":
        event.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  let actionIdx = 0;
  const activeId = open && activeIndex >= 0 ? `${menuId}-${activeIndex}` : undefined;

  return (
    <div
      ref={wrapperRef}
      className={`ascii-lib ascii-contextmenu-wrapper ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
      onContextMenu={handleContext}
    >
      {children}
      {open && (
        <AsciiPortal>
          <div
            id={menuId}
            ref={menuRef}
            className="ascii-contextmenu"
            role="menu"
            tabIndex={0}
            aria-activedescendant={activeId}
            style={floatingStyle}
            onKeyDown={handleKeyDown}
          >
            {b.tl + repeatChar(b.h, inner) + b.tr}
            {"\n"}
            {items.map((item, index) => {
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
              const shortcut = item.shortcut ? `  ${item.shortcut}` : "";
              const label = `${marker} ${item.label}`;
              const combined = label + " ".repeat(Math.max(1, inner - label.length - shortcut.length)) + shortcut;
              const line = b.v + combined.slice(0, inner) + " ".repeat(Math.max(0, inner - combined.length)) + b.v;

              return (
                <React.Fragment key={item.key}>
                  <div
                    id={`${menuId}-${currentActionIdx}`}
                    className={`ascii-contextmenu-item${isActive ? " ascii-contextmenu-item-active" : ""}${item.disabled ? " ascii-contextmenu-item-disabled" : ""}`}
                    role="menuitem"
                    aria-disabled={item.disabled}
                    onMouseEnter={() => setActiveIndex(currentActionIdx)}
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
        </AsciiPortal>
      )}
    </div>
  );
}
