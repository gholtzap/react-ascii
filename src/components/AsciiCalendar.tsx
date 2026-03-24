import React from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";
import { buildWeeks, useCalendarNav, DAY_HEADERS } from "../calendar";

export interface AsciiCalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
  width?: number;
  border?: BorderStyle;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiCalendar({
  value,
  onChange,
  width = 28,
  border = "single",
  color,
  className,
  style,
}: AsciiCalendarProps) {
  const { viewYear, viewMonth, monthLabel, prevMonth, nextMonth } = useCalendarNav(value);

  const b = borders[border];
  const inner = width - 2;

  const weeks = buildWeeks(viewYear, viewMonth);

  const isSelected = (d: number) =>
    value &&
    value.getFullYear() === viewYear &&
    value.getMonth() === viewMonth &&
    value.getDate() === d;

  return (
    <div
      className={`ascii-lib ascii-calendar ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
    >
      <span>{b.tl + repeatChar(b.h, inner) + b.tr}</span>
      {"\n"}
      <span>{b.v}</span>
      <button type="button" className="ascii-calendar-nav" onClick={prevMonth} aria-label="Previous month">{"<"}</button>
      <span>{pad(monthLabel, inner - 4, "center")}</span>
      <button type="button" className="ascii-calendar-nav" onClick={nextMonth} aria-label="Next month">{">"}</button>
      <span>{b.v}</span>
      {"\n"}
      <span>{b.lm + repeatChar(b.h, inner) + b.rm}</span>
      {"\n"}
      <span>{b.v + pad(` ${DAY_HEADERS}`, inner) + b.v}</span>
      {"\n"}
      {weeks.map((w, wi) => (
        <React.Fragment key={wi}>
          <span>{b.v + " "}</span>
          {w.map((d, di) => {
            if (d === null) return <span key={di}>{"   "}</span>;
            const sel = isSelected(d);
            const label = sel ? `>${String(d).padStart(2)}` : ` ${String(d).padStart(2)}`;
            return (
              <React.Fragment key={di}>
                <button
                  type="button"
                  className={`ascii-calendar-day${sel ? " ascii-calendar-day-selected" : ""}`}
                  onClick={() => onChange?.(new Date(viewYear, viewMonth, d))}
                  aria-label={`${monthLabel} ${d}`}
                  aria-pressed={Boolean(sel)}
                >
                  {label}
                </button>
              </React.Fragment>
            );
          })}
          <span>{pad("", inner - 1 - w.length * 3).slice(0, Math.max(0, inner - 1 - w.length * 3)) + b.v}</span>
          {"\n"}
        </React.Fragment>
      ))}
      <span>{b.bl + repeatChar(b.h, inner) + b.br}</span>
    </div>
  );
}
