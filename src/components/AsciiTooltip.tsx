import React, { useId, useRef, useState } from "react";
import type { BorderStyle } from "../chars";
import { AsciiPortal } from "../internal/AsciiPortal";
import { composeRefs } from "../internal/composeRefs";
import { AsciiSurface } from "../internal/AsciiSurface";
import { cloneElementWithMergedProps } from "../internal/mergeProps";
import { type AsciiFloatingAlign, type AsciiFloatingSide, useAsciiFloating } from "../internal/useAsciiFloating";
import { useAsciiAutoWidth } from "../internal/useAsciiAutoWidth";

export interface AsciiTooltipProps {
  content?: React.ReactNode;
  text?: string;
  children: React.ReactNode;
  width?: number;
  side?: AsciiFloatingSide;
  align?: AsciiFloatingAlign;
  offset?: number;
  border?: BorderStyle;
  asChild?: boolean;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiTooltip({
  content,
  text,
  children,
  width,
  side = "top",
  align = "center",
  offset = 4,
  border = "single",
  asChild,
  color,
  className,
  style,
}: AsciiTooltipProps) {
  const [visible, setVisible] = useState(false);
  const tooltipId = useId();
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);
  const tooltipContent = content ?? text ?? "";
  const { resolvedWidth, measureRef, charMeasureRef, shouldMeasure } = useAsciiAutoWidth({
    content: tooltipContent,
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
    "aria-describedby": visible ? tooltipId : undefined,
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
    <span className={`ascii-lib ascii-tooltip-wrapper ${className ?? ""}`.trim()} style={color ? { ...style, color } : style}>
      {visible && (
        <AsciiPortal>
          <span
            ref={contentRef}
            className={`ascii-tooltip-content ascii-tooltip-${placement.side}`}
            style={floatingStyle}
            role="tooltip"
            id={tooltipId}
          >
            <AsciiSurface width={resolvedWidth} border={border} className="ascii-tooltip-surface">
              {tooltipContent}
            </AsciiSurface>
            {shouldMeasure && (
              <span className="ascii-popup-measure-root" aria-hidden="true">
                <span ref={charMeasureRef} className="ascii-popup-char-measure">0000000000</span>
                <span ref={measureRef} className="ascii-popup-measure">{tooltipContent}</span>
              </span>
            )}
          </span>
        </AsciiPortal>
      )}
      {renderedTrigger}
    </span>
  );
}
