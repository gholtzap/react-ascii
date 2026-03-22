import { useState, useCallback } from "react";

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const DAY_HEADERS = "Su Mo Tu We Th Fr Sa";

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function firstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function buildWeeks(year: number, month: number): (number | null)[][] {
  const total = daysInMonth(year, month);
  const start = firstDayOfMonth(year, month);
  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = new Array(start).fill(null);
  for (let d = 1; d <= total; d++) {
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
  return weeks;
}

export function useCalendarNav(initial?: Date) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(initial?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial?.getMonth() ?? today.getMonth());

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

  const monthLabel = `${MONTH_NAMES[viewMonth]} ${viewYear}`;

  return { viewYear, viewMonth, monthLabel, prevMonth, nextMonth };
}
