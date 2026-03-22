import React from "react";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function renderHighlightedText(text: string, query?: string, className = "ascii-match") {
  if (!query) return text;

  const normalized = query.trim();

  if (!normalized) return text;

  const matcher = new RegExp(`(${escapeRegExp(normalized)})`, "ig");
  const parts = text.split(matcher);

  if (parts.length <= 1) return text;

  return parts.map((part, index) =>
    part.toLowerCase() === normalized.toLowerCase()
      ? <span key={`${part}-${index}`} className={className}>{part}</span>
      : <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
  );
}
