import React, { useId, useState } from "react";
import type { BorderStyle } from "../chars";
import { AsciiSurface } from "../internal/AsciiSurface";
import { cloneElementWithMergedProps } from "../internal/mergeProps";
import { useAsciiAutoWidth } from "../internal/useAsciiAutoWidth";

export interface AsciiTooltipProps {
  content?: React.ReactNode;
  text?: string;
  children: React.ReactNode;
  width?: number;
  border?: BorderStyle;
  asChild?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiTooltip({
  content,
  text,
  children,
  width,
  border = "single",
  asChild,
  className,
  style,
}: AsciiTooltipProps) {
  const [visible, setVisible] = useState(false);
  const tooltipId = useId();
  const tooltipContent = content ?? text ?? "";
  const { resolvedWidth, measureRef, charMeasureRef, shouldMeasure } = useAsciiAutoWidth({
    content: tooltipContent,
    width,
  });

  const triggerProps = {
    onMouseEnter: () => setVisible(true),
    onMouseLeave: () => setVisible(false),
    onFocus: () => setVisible(true),
    onBlur: () => setVisible(false),
    "aria-describedby": visible ? tooltipId : undefined,
  };

  return (
    <span className={`ascii-lib ascii-tooltip-wrapper ${className ?? ""}`.trim()} style={style}>
      {visible && (
        <span className="ascii-tooltip-content" role="tooltip" id={tooltipId}>
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
      )}
      {asChild && React.isValidElement(children)
        ? cloneElementWithMergedProps(children as React.ReactElement<Record<string, unknown>>, triggerProps)
        : (
          <span tabIndex={0} {...triggerProps}>
            {children}
          </span>
        )}
    </span>
  );
}
