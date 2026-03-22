import React, { useState, useCallback } from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

export interface AsciiDatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  border?: BorderStyle;
  width?: number;
  className?: string;
  style?: React.CSSProperties;
}

const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function firstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function AsciiDatePicker({
  value,
  onChange,
  border = "single",
  width = 28,
  className,
  style,
}: AsciiDatePickerProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(value?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(value?.getMonth() ?? today.getMonth());

  const b = borders[border];
  const inner = width - 2;

  const prevMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }, []);

  const nextMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }, []);

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

  const monthLabel = `${MONTH_NAMES[viewMonth]} ${viewYear}`;

  const lines: string[] = [];
  lines.push(b.tl + repeatChar(b.h, inner) + b.tr);

  const navRow = ` ◄ ${pad(monthLabel, inner - 6, "center")} ► `;
  lines.push(b.v + pad(navRow, inner) + b.v);
  lines.push(b.lm + repeatChar(b.h, inner) + b.rm);

  const headerRow = " " + DAY_NAMES.map((d) => pad(d, 3, "center")).join(" ");
  lines.push(b.v + pad(headerRow, inner) + b.v);

  let dayNum = 1;
  for (let week = 0; week < 6; week++) {
    if (dayNum > totalDays) break;
    let row = " ";
    for (let dow = 0; dow < 7; dow++) {
      if (week === 0 && dow < startDay) {
        row += "   ";
      } else if (dayNum > totalDays) {
        row += "   ";
      } else {
        const d = dayNum;
        const marker = d === selectedDay ? `[${pad(String(d), 2, "right")}]` : ` ${pad(String(d), 2, "right")} `;
        row += marker.slice(0, 3);
        dayNum++;
      }
      if (dow < 6) row += " ";
    }
    lines.push(b.v + pad(row, inner) + b.v);
  }

  lines.push(b.bl + repeatChar(b.h, inner) + b.br);

  const calendarText = lines.join("\n");

  const dayCells: React.ReactNode[] = [];
  let cellDay = 1;
  const calLines = calendarText.split("\n");

  return (
    <div
      className={`ascii-lib ascii-datepicker ${className ?? ""}`.trim()}
      style={style}
      role="group"
      aria-label={`Calendar: ${monthLabel}`}
    >
      <div style={{ whiteSpace: "pre" }}>
        {calLines.map((line, lineIdx) => {
          if (lineIdx === 1) {
            return (
              <div key={lineIdx}>
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
            );
          }

          if (lineIdx >= 4 && lineIdx < calLines.length - 1) {
            const weekCells: React.ReactNode[] = [];
            weekCells.push(b.v + " ");
            const startDayForLine = lineIdx - 4;
            for (let dow = 0; dow < 7; dow++) {
              if (startDayForLine === 0 && dow < startDay) {
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
            return <div key={lineIdx}>{weekCells}</div>;
          }

          return <div key={lineIdx}>{line}</div>;
        })}
      </div>
    </div>
  );
}
