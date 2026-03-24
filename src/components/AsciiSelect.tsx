import React, { useEffect, useId, useRef, useState } from "react";
import { borders, pad, repeatChar, type BorderStyle } from "../chars";
import { AsciiPortal } from "../internal/AsciiPortal";
import { type AsciiFloatingAlign, type AsciiFloatingSide, useAsciiFloating } from "../internal/useAsciiFloating";
import { useAsciiListNavigation } from "../internal/useAsciiListNavigation";
import { useDismissableLayer } from "../internal/useDismissableLayer";

export interface AsciiSelectOption {
  value: string;
  label: string;
}

export interface AsciiSelectProps {
  options: AsciiSelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  width?: number;
  border?: BorderStyle;
  disabled?: boolean;
  side?: AsciiFloatingSide;
  align?: AsciiFloatingAlign;
  offset?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  width = 30,
  border = "single",
  disabled,
  side = "bottom",
  align = "start",
  offset = 4,
  color,
  className,
  style,
}: AsciiSelectProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const triggerId = useId();
  const b = borders[border];
  const inner = width - 2;
  const { floatingStyle, placement } = useAsciiFloating({
    open,
    anchorRef: triggerRef,
    contentRef: listboxRef,
    side,
    align,
    offset,
    matchAnchorWidth: true,
  });

  const selected = options.find((option) => option.value === value);
  const displayText = selected ? selected.label : placeholder;
  const selectedIndex = options.findIndex((option) => option.value === value);
  const {
    activeIndex,
    setActiveIndex,
    activeItem,
    moveNext,
    movePrev,
    moveFirst,
    moveLast,
    reset,
  } = useAsciiListNavigation({
    items: options,
    loop: true,
    initialIndex: selectedIndex >= 0 ? selectedIndex : 0,
  });

  useEffect(() => {
    if (open) {
      reset(selectedIndex >= 0 ? selectedIndex : 0);
    }
  }, [open, selectedIndex]);

  useEffect(() => {
    if (!open) return;
    listboxRef.current?.focus();
  }, [open]);

  useDismissableLayer({
    open,
    onDismiss: () => setOpen(false),
    refs: [wrapperRef, listboxRef],
  });

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

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
        if (activeItem) {
          onChange?.(activeItem.value);
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

  const arrow = open ? "^" : "v";
  const triggerLine = b.v + pad(` ${displayText}`, inner - 2) + ` ${arrow} ` + b.v;
  const activeId = open && activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined;

  return (
    <div
      ref={wrapperRef}
      className={`ascii-lib ascii-select-wrapper ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
    >
      <button
        id={triggerId}
        ref={triggerRef}
        type="button"
        className="ascii-select-trigger"
        onClick={() => !disabled && setOpen((current) => !current)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? listboxId : undefined}
      >
        {b.tl + repeatChar(b.h, inner) + b.tr}
        {"\n"}
        {triggerLine}
        {"\n"}
        {b.bl + repeatChar(b.h, inner) + b.br}
      </button>

      {open && (
        <AsciiPortal>
          <div
            id={listboxId}
            ref={listboxRef}
            className={`ascii-select-dropdown ascii-select-${placement.side}`}
            style={floatingStyle}
            role="listbox"
            tabIndex={0}
            aria-labelledby={triggerId}
            aria-activedescendant={activeId}
            onKeyDown={handleKeyDown}
          >
            {b.tl + repeatChar(b.h, inner) + b.tr}
            {"\n"}
            {options.map((option, index) => {
              const marker = option.value === value ? ">" : " ";
              const line = b.v + pad(`${marker} ${option.label}`, inner) + b.v;
              const isActive = index === activeIndex;

              return (
                <React.Fragment key={option.value}>
                  <div
                    id={`${listboxId}-${index}`}
                    className={`ascii-select-option${isActive ? " ascii-select-option-active" : ""}`}
                    role="option"
                    aria-selected={option.value === value}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => {
                      onChange?.(option.value);
                      setOpen(false);
                      triggerRef.current?.focus();
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
