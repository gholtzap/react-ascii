import React from "react";

type PropsRecord = Record<string, unknown>;

function isEventHandler(key: string, value: unknown) {
  return /^on[A-Z]/.test(key) && typeof value === "function";
}

function mergeClassNames(a: unknown, b: unknown) {
  return [a, b].filter((value) => typeof value === "string" && value.length > 0).join(" ") || undefined;
}

function mergeStyles(a: unknown, b: unknown) {
  if (!a && !b) return undefined;
  return {
    ...((a as React.CSSProperties | undefined) ?? {}),
    ...((b as React.CSSProperties | undefined) ?? {}),
  };
}

function mergeTokenLists(a: unknown, b: unknown) {
  const values: string[] = [];

  for (const value of [a, b]) {
    if (typeof value === "string") {
      for (const token of value.split(/\s+/)) {
        if (token) values.push(token);
      }
    }
  }

  if (values.length === 0) return undefined;

  return Array.from(new Set(values)).join(" ");
}

function mergeHandlers(
  theirs: ((event: React.SyntheticEvent<HTMLElement>) => void) | undefined,
  ours: ((event: React.SyntheticEvent<HTMLElement>) => void) | undefined
) {
  if (!theirs && !ours) return undefined;

  return (event: React.SyntheticEvent<HTMLElement>) => {
    theirs?.(event);

    if (!event.defaultPrevented) {
      ours?.(event);
    }
  };
}

export function mergeProps(baseProps: PropsRecord, extraProps: PropsRecord) {
  const merged: PropsRecord = { ...baseProps };

  for (const [key, value] of Object.entries(extraProps)) {
    const current = merged[key];

    if (value === undefined) continue;

    if (key === "className") {
      merged[key] = mergeClassNames(current, value);
      continue;
    }

    if (key === "style") {
      merged[key] = mergeStyles(current, value);
      continue;
    }

    if (key === "aria-describedby") {
      merged[key] = mergeTokenLists(current, value);
      continue;
    }

    if (isEventHandler(key, current) || isEventHandler(key, value)) {
      merged[key] = mergeHandlers(
        current as ((event: React.SyntheticEvent<HTMLElement>) => void) | undefined,
        value as ((event: React.SyntheticEvent<HTMLElement>) => void) | undefined
      );
      continue;
    }

    merged[key] = value;
  }

  return merged;
}

export function cloneElementWithMergedProps(
  element: React.ReactElement<PropsRecord>,
  extraProps: PropsRecord
) {
  return React.cloneElement(element, mergeProps(element.props, extraProps));
}
