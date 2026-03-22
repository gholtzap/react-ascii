import React, { useCallback } from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";
import { MONTH_NAMES, DAY_HEADERS, daysInMonth, firstDayOfMonth, useCalendarNav } from "../calendar";

export interface AsciiDatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  border?: BorderStyle;
  width?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiDatePicker({
  value,
  onChange,
  border = "single",
  width = 28,
  className,
  style,
}: AsciiDatePickerProps) {
  const { viewYear, viewMonth, monthLabel, prevMonth, nextMonth } = useCalendarNav(value);

  const b = borders[border];
  const inner = width - 2;

  const handleDayClick = useCallback(
    (day: number) => {
      onChange?.(new Date(viewYear, viewMonth, day));
    },
    [viewYear, viewMonth, onChange]
  );

  const selectedDay =
    value && value.getFullYear() === viewYear && value.getMonth() === viewMonth
      ? value.getDate()
      : null;

  const totalDays = daysInMonth(viewYear, viewMonth);
  const startDay = firstDayOfMonth(viewYear, viewMonth);

  const dayHeaderRow = " " + DAY_HEADERS.split(" ").map((d) => pad(d, 3, "center")).join(" ");

  const weekCount = Math.ceil((totalDays + startDay) / 7);

  const headerLine = b.tl + repeatChar(b.h, inner) + b.tr;
  const sepLine = b.lm + repeatChar(b.h, inner) + b.rm;
  const footerLine = b.bl + repeatChar(b.h, inner) + b.br;

  let cellDay = 1;

  return (
    <div
      className={`ascii-lib ascii-datepicker ${className ?? ""}`.trim()}
      style={style}
      role="group"
      aria-label={`Calendar: ${monthLabel}`}
    >
      <div style={{ whiteSpace: "pre" }}>
        <div>{headerLine}</div>
        <div>
          {b.v + " "}
          <button
            type="button"
            className="ascii-datepicker-nav"
            onClick={prevMonth}
            aria-label="Previous month"
          >
            ◄
          </button>
          {" " + pad(monthLabel, inner - 6, "center") + " "}
          <button
            type="button"
            className="ascii-datepicker-nav"
            onClick={nextMonth}
            aria-label="Next month"
          >
            ►
          </button>
          {" " + b.v}
        </div>
        <div>{sepLine}</div>
        <div>{b.v + pad(dayHeaderRow, inner) + b.v}</div>
        {Array.from({ length: weekCount }, (_, weekIdx) => {
          const weekCells: React.ReactNode[] = [];
          weekCells.push(b.v + " ");
          for (let dow = 0; dow < 7; dow++) {
            if (weekIdx === 0 && dow < startDay) {
              weekCells.push("   ");
            } else if (cellDay > totalDays) {
              weekCells.push("   ");
            } else {
              const d = cellDay;
              const isSel = d === selectedDay;
              weekCells.push(
                <button
                  key={d}
                  type="button"
                  className={`ascii-datepicker-day ${isSel ? "ascii-datepicker-day-selected" : ""}`}
                  onClick={() => handleDayClick(d)}
                  aria-label={`${MONTH_NAMES[viewMonth]} ${d}`}
                  aria-pressed={isSel}
                >
                  {isSel ? `[${pad(String(d), 2, "right")}]`.slice(0, 3) : ` ${pad(String(d), 2, "right")}`}
                </button>
              );
              cellDay++;
            }
            if (dow < 6) weekCells.push(" ");
          }
          weekCells.push(pad("", Math.max(0, inner - 1 - (7 * 3 + 6))));
          weekCells.push(b.v);
          return <div key={weekIdx}>{weekCells}</div>;
        })}
        <div>{footerLine}</div>
      </div>
    </div>
  );
}
