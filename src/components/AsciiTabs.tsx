import React, { useId } from "react";
import { borders, repeatChar, type BorderStyle } from "../chars";

export interface AsciiTab {
  key: string;
  label: string;
  content: React.ReactNode;
}

export interface AsciiTabsProps {
  tabs: AsciiTab[];
  activeKey: string;
  onTabChange: (key: string) => void;
  border?: BorderStyle;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiTabs({
  tabs,
  activeKey,
  onTabChange,
  border = "single",
  color,
  className,
  style,
}: AsciiTabsProps) {
  const idPrefix = useId();
  const b = borders[border];

  const tabHeaders = tabs.map((tab) => {
    const isActive = tab.key === activeKey;
    const inner = tab.label.length + 2;

    if (isActive) {
      return {
        top: b.tl + repeatChar(b.h, inner) + b.tr,
        mid: b.v + ` ${tab.label} ` + b.v,
        bot: b.bl + repeatChar(b.h, inner) + b.br,
        key: tab.key,
      };
    }

    return {
      top: " ".repeat(inner + 2),
      mid: ` ${tab.label}  `,
      bot: repeatChar(b.h, inner + 2),
      key: tab.key,
    };
  });

  const activeTab = tabs.find((t) => t.key === activeKey);
  const activeIndex = tabs.findIndex((t) => t.key === activeKey);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    let newIndex = activeIndex;

    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        newIndex = (activeIndex + 1) % tabs.length;
        break;
      case "ArrowLeft":
        e.preventDefault();
        newIndex = (activeIndex - 1 + tabs.length) % tabs.length;
        break;
      case "Home":
        e.preventDefault();
        newIndex = 0;
        break;
      case "End":
        e.preventDefault();
        newIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    onTabChange(tabs[newIndex].key);
  };

  return (
    <div className={`ascii-lib ascii-tabs ${className ?? ""}`.trim()} style={color ? { ...style, color } : style}>
      <div className="ascii-tab-bar" role="tablist" onKeyDown={handleKeyDown}>
        {tabHeaders.map((th) => {
          const isActive = th.key === activeKey;
          return (
            <button
              key={th.key}
              id={`${idPrefix}-tab-${th.key}`}
              className="ascii-tab-btn"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${idPrefix}-panel-${th.key}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onTabChange(th.key)}
            >
              {th.top}
              {"\n"}
              {th.mid}
              {"\n"}
              {th.bot}
            </button>
          );
        })}
      </div>
      {activeTab && (
        <div
          id={`${idPrefix}-panel-${activeTab.key}`}
          className="ascii-tab-panel"
          role="tabpanel"
          aria-labelledby={`${idPrefix}-tab-${activeTab.key}`}
        >
          {activeTab.content}
        </div>
      )}
    </div>
  );
}
