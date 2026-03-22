import React from "react";
import { AsciiResizable, type AsciiResizableProps } from "./AsciiResizable";

interface AsciiSplitPanePanel {
  title?: string;
  footer?: React.ReactNode;
  content: React.ReactNode;
}

export interface AsciiSplitPaneProps extends Omit<AsciiResizableProps, "left" | "right"> {
  leftPanel: AsciiSplitPanePanel;
  rightPanel: AsciiSplitPanePanel;
}

function SplitPanePanel({
  title,
  footer,
  content,
}: AsciiSplitPanePanel) {
  return (
    <div className="ascii-lib ascii-splitpane-panel" role="group" aria-label={title}>
      {title ? <div className="ascii-splitpane-header">{`[ ${title} ]`}</div> : null}
      <div className="ascii-splitpane-body">{content}</div>
      {footer ? <div className="ascii-splitpane-footer">{footer}</div> : null}
    </div>
  );
}

export function AsciiSplitPane({
  leftPanel,
  rightPanel,
  className,
  ...props
}: AsciiSplitPaneProps) {
  return (
    <AsciiResizable
      {...props}
      className={`ascii-splitpane ${className ?? ""}`.trim()}
      left={<SplitPanePanel {...leftPanel} />}
      right={<SplitPanePanel {...rightPanel} />}
    />
  );
}
