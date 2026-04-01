import { useCallback, useState } from "react";

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
  const [fallbackDate] = useState(() => new Date());
  const initialDate = initial ?? fallbackDate;
  const initialMonthKey = `${initialDate.getFullYear()}-${initialDate.getMonth()}`;
  const [navigation, setNavigation] = useState(() => ({
    baseKey: initialMonthKey,
    offset: 0,
  }));
  const monthOffset = navigation.baseKey === initialMonthKey ? navigation.offset : 0;
  const viewDate = new Date(initialDate.getFullYear(), initialDate.getMonth() + monthOffset, 1);
  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  const prevMonth = useCallback(() => {
    setNavigation((current) => ({
      baseKey: initialMonthKey,
      offset: (current.baseKey === initialMonthKey ? current.offset : 0) - 1,
    }));
  }, [initialMonthKey]);

  const nextMonth = useCallback(() => {
    setNavigation((current) => ({
      baseKey: initialMonthKey,
      offset: (current.baseKey === initialMonthKey ? current.offset : 0) + 1,
    }));
  }, [initialMonthKey]);

  const monthLabel = `${MONTH_NAMES[viewMonth]} ${viewYear}`;

  return { viewYear, viewMonth, monthLabel, prevMonth, nextMonth };
}
