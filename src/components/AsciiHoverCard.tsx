import React, { useId, useRef, useState } from "react";
import type { BorderStyle } from "../chars";
import { AsciiPortal } from "../internal/AsciiPortal";
import { composeRefs } from "../internal/composeRefs";
import { AsciiSurface } from "../internal/AsciiSurface";
import { cloneElementWithMergedProps } from "../internal/mergeProps";
import { type AsciiFloatingAlign, type AsciiFloatingSide, useAsciiFloating } from "../internal/useAsciiFloating";
import { useAsciiAutoWidth } from "../internal/useAsciiAutoWidth";

export interface AsciiHoverCardProps {
  content: React.ReactNode;
  width?: number;
  side?: AsciiFloatingSide;
  align?: AsciiFloatingAlign;
  offset?: number;
  border?: BorderStyle;
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiHoverCard({
  content,
  width,
  side = "top",
  align = "center",
  offset = 6,
  border = "single",
  asChild,
  children,
  className,
  style,
}: AsciiHoverCardProps) {
  const [visible, setVisible] = useState(false);
  const cardId = useId();
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);
  const { resolvedWidth, measureRef, charMeasureRef, shouldMeasure } = useAsciiAutoWidth({
    content,
    width,
  });
  const { floatingStyle, placement } = useAsciiFloating({
    open: visible,
    anchorRef: triggerRef,
    contentRef,
    side,
    align,
    offset,
  });

  const triggerProps = {
    onMouseEnter: () => setVisible(true),
    onMouseLeave: () => setVisible(false),
    onFocus: () => setVisible(true),
    onBlur: () => setVisible(false),
    "aria-describedby": visible ? cardId : undefined,
    tabIndex: 0,
  };

  const renderedTrigger = asChild && React.isValidElement(children)
    ? (() => {
        const child = children as React.ReactElement<Record<string, unknown> & { ref?: React.Ref<HTMLElement> }>;

        return cloneElementWithMergedProps(child, {
          ...triggerProps,
          ref: composeRefs(child.props.ref, triggerRef),
        });
      })()
    : (
      <span ref={triggerRef} {...triggerProps}>
        {children}
      </span>
    );

  return (
    <span
      className={`ascii-lib ascii-hovercard-wrapper ${className ?? ""}`.trim()}
      style={style}
    >
      {visible && (
        <AsciiPortal>
          <span
            ref={contentRef}
            className={`ascii-hovercard-content ascii-hovercard-${placement.side}`}
            style={floatingStyle}
            id={cardId}
            role="tooltip"
          >
            <AsciiSurface width={resolvedWidth} border={border} className="ascii-hovercard-surface">
              {content}
            </AsciiSurface>
            {shouldMeasure && (
              <span className="ascii-popup-measure-root" aria-hidden="true">
                <span ref={charMeasureRef} className="ascii-popup-char-measure">0000000000</span>
                <span ref={measureRef} className="ascii-popup-measure">{content}</span>
              </span>
            )}
          </span>
        </AsciiPortal>
      )}
      {renderedTrigger}
    </span>
  );
}
