import React, { useEffect, useRef, useState } from "react";
import { borders, pad, repeatChar, type BorderStyle } from "../chars";
import { useSafeLayoutEffect } from "./useSafeLayoutEffect";

interface AsciiSurfaceProps {
  width: number;
  border: BorderStyle;
  title?: string;
  accessibleTitle?: string;
  accessibleTitleId?: string;
  footer?: React.ReactNode;
  padding?: number;
  minBodyRows?: number;
  minFooterRows?: number;
  className?: string;
  style?: React.CSSProperties;
  bodyClassName?: string;
  footerClassName?: string;
  children?: React.ReactNode;
}

function getInitialRows(content: React.ReactNode, fallback: number) {
  if (typeof content === "string") {
    return Math.max(fallback, content.split("\n").length);
  }

  return fallback;
}

function parseLineHeight(node: HTMLElement) {
  const computedStyle = window.getComputedStyle(node);
  const parsed = Number.parseFloat(computedStyle.lineHeight);

  if (Number.isFinite(parsed)) return parsed;

  const fontSize = Number.parseFloat(computedStyle.fontSize);
  return Number.isFinite(fontSize) ? fontSize * 1.4 : 22;
}

export function AsciiSurface({
  width,
  border,
  title,
  accessibleTitle,
  accessibleTitleId,
  footer,
  padding = 1,
  minBodyRows = 1,
  minFooterRows = 1,
  className,
  style,
  bodyClassName,
  footerClassName,
  children,
}: AsciiSurfaceProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [lineHeight, setLineHeight] = useState(22);
  const [bodyRows, setBodyRows] = useState(() => getInitialRows(children, minBodyRows));
  const [footerRows, setFooterRows] = useState(() => getInitialRows(footer, minFooterRows));

  useSafeLayoutEffect(() => {
    if (!rootRef.current || typeof window === "undefined") return;

    setLineHeight(parseLineHeight(rootRef.current));
  }, []);

  useEffect(() => {
    if (typeof ResizeObserver === "undefined") return;

    const updateRows = () => {
      if (bodyRef.current) {
        setBodyRows(Math.max(minBodyRows, Math.ceil(bodyRef.current.offsetHeight / lineHeight) || minBodyRows));
      }

      if (footer && footerRef.current) {
        setFooterRows(Math.max(minFooterRows, Math.ceil(footerRef.current.offsetHeight / lineHeight) || minFooterRows));
      }
    };

    updateRows();

    const observer = new ResizeObserver(updateRows);

    if (bodyRef.current) observer.observe(bodyRef.current);
    if (footerRef.current) observer.observe(footerRef.current);

    return () => observer.disconnect();
  }, [footer, lineHeight, minBodyRows, minFooterRows]);

  useEffect(() => {
    setBodyRows(getInitialRows(children, minBodyRows));
  }, [children, minBodyRows]);

  useEffect(() => {
    setFooterRows(getInitialRows(footer, minFooterRows));
  }, [footer, minFooterRows]);

  const b = borders[border];
  const inner = width - 2;
  const bodySpacerRows = bodyRows + padding * 2;
  const footerSpacerRows = footer ? footerRows : 0;
  const headerRows = 1 + (title ? 2 : 0);
  const footerStartRow = headerRows + bodySpacerRows + (footer ? 1 : 0);

  const lines: string[] = [];
  lines.push(b.tl + repeatChar(b.h, inner) + b.tr);

  if (title) {
    lines.push(b.v + pad(` ${title}`, inner) + b.v);
    lines.push(b.lm + repeatChar(b.h, inner) + b.rm);
  }

  for (let index = 0; index < bodySpacerRows; index += 1) {
    lines.push(b.v + " ".repeat(inner) + b.v);
  }

  if (footer) {
    lines.push(b.lm + repeatChar(b.h, inner) + b.rm);

    for (let index = 0; index < footerSpacerRows; index += 1) {
      lines.push(b.v + " ".repeat(inner) + b.v);
    }
  }

  lines.push(b.bl + repeatChar(b.h, inner) + b.br);

  const bodyInlineStart = `calc(1ch + ${padding}ch)`;
  const bodyInlineSize = `calc(${inner}ch - ${padding * 2}ch)`;

  return (
    <div ref={rootRef} className={`ascii-lib ascii-surface ${className ?? ""}`.trim()} style={style}>
      {accessibleTitleId && (accessibleTitle ?? title) ? (
        <span id={accessibleTitleId} className="ascii-sr-only">
          {accessibleTitle ?? title}
        </span>
      ) : null}
      <span className="ascii-surface-shell" aria-hidden="true">
        {lines.join("\n")}
      </span>
      <div
        ref={bodyRef}
        className={`ascii-surface-body ${bodyClassName ?? ""}`.trim()}
        style={{
          top: `${(headerRows + padding) * lineHeight}px`,
          insetInlineStart: bodyInlineStart,
          inlineSize: bodyInlineSize,
        }}
      >
        {children}
      </div>
      {footer && (
        <div
          ref={footerRef}
          className={`ascii-surface-footer ${footerClassName ?? ""}`.trim()}
          style={{
            top: `${footerStartRow * lineHeight}px`,
            insetInlineStart: "1ch",
            inlineSize: `${inner}ch`,
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
