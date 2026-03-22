import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { borders, pad, repeatChar, type BorderStyle } from "../chars";
import { AsciiTrigger } from "../internal/AsciiTrigger";
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
  border?: BorderStyle;
  asChild?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiDropdownMenu({
  items,
  onSelect,
  trigger = "⋮",
  width = 24,
  border = "single",
  asChild,
  className,
  style,
}: AsciiDropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const b = borders[border];
  const inner = width - 2;

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
  }, [open]);

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
      style={style}
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
        <div
          id={menuId}
          ref={menuRef}
          className="ascii-dropdown-menu"
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
            const line = b.v + pad(`${marker} ${item.label}`, inner) + b.v;

            return (
              <React.Fragment key={item.key}>
                <div
                  id={`${menuId}-${currentActionIdx}`}
                  className={`ascii-dropdown-item${isActive ? " ascii-dropdown-item-active" : ""}${item.disabled ? " ascii-dropdown-item-disabled" : ""}`}
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
      )}
    </div>
  );
}
