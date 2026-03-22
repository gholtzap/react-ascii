import React, { useId, useState } from "react";
import type { BorderStyle } from "../chars";
import { AsciiSurface } from "../internal/AsciiSurface";
import { cloneElementWithMergedProps } from "../internal/mergeProps";
import { useAsciiAutoWidth } from "../internal/useAsciiAutoWidth";

export interface AsciiHoverCardProps {
  content: React.ReactNode;
  width?: number;
  border?: BorderStyle;
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiHoverCard({
  content,
  width,
  border = "single",
  asChild,
  children,
  className,
  style,
}: AsciiHoverCardProps) {
  const [visible, setVisible] = useState(false);
  const cardId = useId();
  const { resolvedWidth, measureRef, charMeasureRef, shouldMeasure } = useAsciiAutoWidth({
    content,
    width,
  });

  const triggerProps = {
    onMouseEnter: () => setVisible(true),
    onMouseLeave: () => setVisible(false),
    onFocus: () => setVisible(true),
    onBlur: () => setVisible(false),
    "aria-describedby": visible ? cardId : undefined,
  };

  return (
    <span
      className={`ascii-lib ascii-hovercard-wrapper ${className ?? ""}`.trim()}
      style={style}
    >
      {visible && (
        <span className="ascii-hovercard-content" id={cardId} role="tooltip">
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
