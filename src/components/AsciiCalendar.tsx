import React, { useState } from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

export interface AsciiCalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
  width?: number;
  border?: BorderStyle;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiCalendar({
  value,
  onChange,
  width = 28,
  border = "single",
  className,
  style,
}: AsciiCalendarProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(value?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(value?.getMonth() ?? today.getMonth());

  const b = borders[border];
  const inner = width - 2;

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const monthLabel = `${monthNames[viewMonth]} ${viewYear}`;

  const prev = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };

  const next = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const headerLine = b.tl + repeatChar(b.h, inner) + b.tr;
  const footerLine = b.bl + repeatChar(b.h, inner) + b.br;
  const sepLine = b.lm + repeatChar(b.h, inner) + b.rm;

  const dayHeaders = "Su Mo Tu We Th Fr Sa";

  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = new Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  const isSelected = (d: number) =>
    value &&
    value.getFullYear() === viewYear &&
    value.getMonth() === viewMonth &&
    value.getDate() === d;

  return (
    <div
      className={`ascii-lib ascii-calendar ${className ?? ""}`.trim()}
      style={style}
    >
      <span>{headerLine}</span>
      {"\n"}
      <span>{b.v}</span>
      <button type="button" className="ascii-calendar-nav" onClick={prev} aria-label="Previous month">{"<"}</button>
      <span>{pad(monthLabel, inner - 4, "center")}</span>
      <button type="button" className="ascii-calendar-nav" onClick={next} aria-label="Next month">{">"}</button>
      <span>{b.v}</span>
      {"\n"}
      <span>{sepLine}</span>
      {"\n"}
      <span>{b.v + pad(` ${dayHeaders}`, inner) + b.v}</span>
      {"\n"}
      {weeks.map((w, wi) => (
        <React.Fragment key={wi}>
          <span>{b.v + " "}</span>
          {w.map((d, di) => {
            if (d === null) return <span key={di}>{"   "}</span>;
            const sel = isSelected(d);
            const label = sel ? `[${String(d).padStart(2)}]` : ` ${String(d).padStart(2)} `;
            return (
              <React.Fragment key={di}>
                <button
                  type="button"
                  className={`ascii-calendar-day${sel ? " ascii-calendar-day-selected" : ""}`}
                  onClick={() => onChange?.(new Date(viewYear, viewMonth, d))}
                >
                  {di === 0 ? label.replace(/^ +/, "") : label.slice(0, 3)}
                </button>
              </React.Fragment>
            );
          })}
          <span>{pad("", inner - 1 - w.length * 3).slice(0, Math.max(0, inner - 1 - w.length * 3)) + b.v}</span>
          {"\n"}
        </React.Fragment>
      ))}
      <span>{footerLine}</span>
    </div>
  );
}
