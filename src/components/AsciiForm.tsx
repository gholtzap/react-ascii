import React, { useId } from "react";
import type { BorderStyle } from "../chars";
import { AsciiSurface } from "../internal/AsciiSurface";

export type AsciiFormTone = "neutral" | "info" | "success" | "warn" | "error";

export interface AsciiFormNotice {
  key: string;
  label?: React.ReactNode;
  message: React.ReactNode;
  tone?: AsciiFormTone;
}

export interface AsciiFormSection {
  key: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  aside?: React.ReactNode;
  columns?: number;
}

export interface AsciiFormProps extends Omit<React.ComponentPropsWithoutRef<"form">, "children" | "color" | "style" | "title"> {
  title?: string;
  description?: React.ReactNode;
  status?: React.ReactNode;
  summary?: React.ReactNode;
  notices?: AsciiFormNotice[];
  sections?: AsciiFormSection[];
  actions?: React.ReactNode;
  children?: React.ReactNode;
  width?: number;
  border?: BorderStyle;
  footer?: React.ReactNode;
  disabled?: boolean;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const noticeLabels: Record<AsciiFormTone, string> = {
  neutral: "note",
  info: "info",
  success: "ok",
  warn: "warn",
  error: "error",
};

export function AsciiForm({
  title = "form",
  description,
  status,
  summary,
  notices,
  sections,
  actions,
  children,
  width = 64,
  border = "single",
  footer,
  disabled = false,
  color,
  className,
  style,
  ...formProps
}: AsciiFormProps) {
  const titleId = useId();
  const descriptionId = useId();
  const labelledBy = [formProps["aria-labelledby"], title ? titleId : undefined].filter(Boolean).join(" ") || undefined;
  const describedBy = [formProps["aria-describedby"], description ? descriptionId : undefined].filter(Boolean).join(" ") || undefined;

  return (
    <AsciiSurface
      width={width}
      border={border}
      title={title}
      accessibleTitle={title}
      accessibleTitleId={title ? titleId : undefined}
      footer={footer}
      className={`ascii-form ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
      bodyClassName="ascii-form-body"
      footerClassName="ascii-form-footer"
    >
      <form
        {...formProps}
        className="ascii-form-native"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
      >
        {(description || status) ? (
          <div className="ascii-form-header">
            <div className="ascii-form-copy">
              {description ? (
                <div id={descriptionId} className="ascii-form-description">
                  {description}
                </div>
              ) : null}
            </div>
            {status ? <div className="ascii-form-status">{status}</div> : null}
          </div>
        ) : null}
        {summary ? <div className="ascii-form-summary">{summary}</div> : null}
        {notices && notices.length > 0 ? (
          <div className="ascii-form-notices">
            {notices.map((notice) => (
              <div key={notice.key} className={`ascii-form-notice ascii-form-${notice.tone ?? "neutral"}`}>
                <span className="ascii-form-notice-label">{notice.label ?? noticeLabels[notice.tone ?? "neutral"]}</span>
                <span className="ascii-form-notice-message">{notice.message}</span>
              </div>
            ))}
          </div>
        ) : null}
        <fieldset className="ascii-form-fieldset" disabled={disabled}>
          {sections && sections.length > 0 ? (
            <div className="ascii-form-sections">
              {sections.map((section) => (
                <section
                  key={section.key}
                  className={`ascii-form-section${section.aside ? " ascii-form-section-split" : ""}`}
                >
                  <div className="ascii-form-section-main">
                    <div className="ascii-form-section-head">
                      <h3 className="ascii-form-section-title">{section.title}</h3>
                      {section.description ? (
                        <div className="ascii-form-section-description">{section.description}</div>
                      ) : null}
                    </div>
                    <div
                      className="ascii-form-section-fields"
                      style={{
                        gridTemplateColumns: `repeat(${Math.max(1, section.columns ?? 1)}, minmax(0, 1fr))`,
                      }}
                    >
                      {section.children}
                    </div>
                  </div>
                  {section.aside ? <div className="ascii-form-section-aside">{section.aside}</div> : null}
                </section>
              ))}
            </div>
          ) : null}
          {children ? <div className="ascii-form-content">{children}</div> : null}
        </fieldset>
        {actions ? <div className="ascii-form-actions">{actions}</div> : null}
      </form>
    </AsciiSurface>
  );
}
