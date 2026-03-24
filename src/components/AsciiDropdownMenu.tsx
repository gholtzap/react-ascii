import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { borders, pad, repeatChar, type BorderStyle } from "../chars";
import { AsciiPortal } from "../internal/AsciiPortal";
import { AsciiTrigger } from "../internal/AsciiTrigger";
import { type AsciiFloatingAlign, type AsciiFloatingSide, useAsciiFloating } from "../internal/useAsciiFloating";
import { useAsciiListNavigation } from "../internal/useAsciiListNavigation";
import { useDismissableLayer } from "../internal/useDismissableLayer";

export interface AsciiDropdownMenuItem {
  key: string;
  label: string;
  disabled?: boolean;
  danger?: boolean;
  separator?: boolean;
}

export interface AsciiDropdownMenuProps {
  items: AsciiDropdownMenuItem[];
  onSelect: (key: string) => void;
  trigger?: React.ReactNode;
  width?: number;
  side?: AsciiFloatingSide;
  align?: AsciiFloatingAlign;
  offset?: number;
  border?: BorderStyle;
  asChild?: boolean;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiDropdownMenu({
  items,
  onSelect,
  trigger = "⋮",
  width = 24,
  side = "bottom",
  align = "start",
  offset = 4,
  border = "single",
  asChild,
  color,
  className,
  style,
}: AsciiDropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const b = borders[border];
  const inner = width - 2;
  const { floatingStyle, placement } = useAsciiFloating({
    open,
    anchorRef: triggerRef,
    contentRef: menuRef,
    side,
    align,
    offset,
  });

  const actionItems = useMemo(() => items.filter((item) => !item.separator), [items]);
  const {
    activeIndex,
    setActiveIndex,
    moveNext,
    movePrev,
    moveFirst,
    moveLast,
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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        moveNext();
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        movePrev();
        break;
      case "Home":
        if (open) {
          event.preventDefault();
          moveFirst();
        }
        break;
      case "End":
        if (open) {
          event.preventDefault();
          moveLast();
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        if (activeIndex >= 0 && !actionItems[activeIndex]?.disabled) {
          onSelect(actionItems[activeIndex].key);
          setOpen(false);
          triggerRef.current?.focus();
        }
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          setOpen(false);
          triggerRef.current?.focus();
        }
        break;
      case "Tab":
        if (open) {
          setOpen(false);
        }
        break;
    }
  };

  let actionIdx = 0;
  const activeId = open && activeIndex >= 0 ? `${menuId}-${activeIndex}` : undefined;

  return (
    <div
      ref={wrapperRef}
      className={`ascii-lib ascii-dropdown-wrapper ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
    >
      <AsciiTrigger
        asChild={asChild}
        className="ascii-dropdown-trigger"
        ref={triggerRef}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleKeyDown}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={open ? menuId : undefined}
        aria-label="Actions menu"
      >
        {asChild ? trigger : `[${trigger}]`}
      </AsciiTrigger>

      {open && (
        <AsciiPortal>
          <div
            id={menuId}
            ref={menuRef}
            className={`ascii-dropdown-menu ascii-dropdown-${placement.side}`}
            style={floatingStyle}
            role="menu"
            tabIndex={0}
            aria-activedescendant={activeId}
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
              const prefix = item.danger ? `${marker}! ` : `${marker} `;
              const line = b.v + pad(`${prefix}${item.label}`, inner) + b.v;

              return (
                <React.Fragment key={item.key}>
                  <div
                    id={`${menuId}-${currentActionIdx}`}
                    className={`ascii-dropdown-item${isActive ? " ascii-dropdown-item-active" : ""}${item.disabled ? " ascii-dropdown-item-disabled" : ""}${item.danger ? " ascii-dropdown-item-danger" : ""}`}
                    role="menuitem"
                    aria-disabled={item.disabled}
                    onMouseEnter={() => setActiveIndex(currentActionIdx)}
                    onClick={() => {
                      if (!item.disabled) {
                        onSelect(item.key);
                        setOpen(false);
                        triggerRef.current?.focus();
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
