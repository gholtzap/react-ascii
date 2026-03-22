import React, { useEffect, useId, useRef, useState } from "react";
import { borders, pad, repeatChar, type BorderStyle } from "../chars";
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
  className,
  style,
}: AsciiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const b = borders[border];
  const inner = width - 2;

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
  }, [open, reset, selectedIndex]);

  useDismissableLayer({
    open,
    onDismiss: () => setOpen(false),
    refs: [ref],
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
        }
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
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
      ref={ref}
      className={`ascii-lib ascii-select-wrapper ${className ?? ""}`.trim()}
      style={style}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className="ascii-select-trigger"
        onClick={() => !disabled && setOpen((current) => !current)}
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
        <div
          id={listboxId}
          className="ascii-select-dropdown"
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={activeId}
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
