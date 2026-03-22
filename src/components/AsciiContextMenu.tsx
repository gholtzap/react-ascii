import React, { useEffect, useRef, useState } from "react";
import { borders, repeatChar, type BorderStyle } from "../chars";
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const b = borders[border];
  const inner = width - 2;

  const actionItems = items.filter((item) => !item.separator);
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

  useDismissableLayer({
    open,
    onDismiss: () => setOpen(false),
    refs: [wrapperRef, menuRef],
  });

  const handleContext = (event: React.MouseEvent) => {
    event.preventDefault();
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
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
    }
  };

  let actionIdx = 0;

  return (
    <div
      ref={wrapperRef}
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
      )}
    </div>
  );
}
