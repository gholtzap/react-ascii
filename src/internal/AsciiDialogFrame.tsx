import React, { useId, useRef } from "react";
import type { RefObject } from "react";
import type { BorderStyle } from "../chars";
import { AsciiPortal } from "./AsciiPortal";
import { AsciiSurface } from "./AsciiSurface";
import { useAsciiOverlay } from "./useAsciiOverlay";

interface AsciiDialogFrameProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  ariaLabel: string;
  children?: React.ReactNode;
  width: number;
  border: BorderStyle;
  className?: string;
  style?: React.CSSProperties;
  overlayClassName: string;
  panelClassName: string;
  bodyClassName?: string;
  footer?: React.ReactNode;
  footerClassName?: string;
  role?: "dialog" | "alertdialog";
  closeClassName?: string;
  closeLabel?: string;
  closeText?: React.ReactNode;
  showCloseButton?: boolean;
  initialFocusRef?: RefObject<HTMLElement | null>;
}

export function AsciiDialogFrame({
  open,
  onClose,
  title,
  ariaLabel,
  children,
  width,
  border,
  className,
  style,
  overlayClassName,
  panelClassName,
  bodyClassName,
  footer,
  footerClassName,
  role = "dialog",
  closeClassName,
  closeLabel = "Close",
  closeText = "[x]",
  showCloseButton = true,
  initialFocusRef,
}: AsciiDialogFrameProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useAsciiOverlay({
    open,
    onClose,
    contentRef,
    initialFocusRef: initialFocusRef ?? closeRef,
  });

  if (!open) return null;

  return (
    <AsciiPortal>
      <div
        className={`ascii-lib ${overlayClassName}`.trim()}
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div
          ref={contentRef}
          className={`${panelClassName} ${className ?? ""}`.trim()}
          style={style}
          role={role}
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-label={title ? undefined : ariaLabel}
          tabIndex={-1}
        >
          {showCloseButton ? (
            <button
              ref={closeRef}
              type="button"
              className={closeClassName}
              onClick={onClose}
              aria-label={closeLabel}
            >
              {closeText}
            </button>
          ) : null}
          <AsciiSurface
            width={width}
            border={border}
            title={title}
            accessibleTitleId={title ? titleId : undefined}
            bodyClassName={bodyClassName}
            footer={footer}
            footerClassName={footerClassName}
          >
            {children}
          </AsciiSurface>
        </div>
      </div>
    </AsciiPortal>
  );
}
