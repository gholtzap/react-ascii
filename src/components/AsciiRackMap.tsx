import React from "react";
import type { BorderStyle } from "../chars";
import { pad } from "../chars";
import { AsciiWindow } from "./AsciiWindow";

export type AsciiRackTone = "neutral" | "success" | "warn" | "error";

export interface AsciiRackSlot {
  key: string;
  label: string;
  status?: AsciiRackTone;
}

export interface AsciiRack {
  key: string;
  label: string;
  slots: AsciiRackSlot[];
}

export interface AsciiRackMapProps {
  racks: AsciiRack[];
  title?: string;
  width?: number;
  height?: number;
  border?: BorderStyle;
  footer?: React.ReactNode;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const rackMarkers: Record<AsciiRackTone, string> = {
  neutral: "·",
  success: "●",
  warn: "◐",
  error: "○",
};

export function AsciiRackMap({
  racks,
  title = "rack map",
  width = 68,
  height = 4,
  border = "single",
  footer,
  color,
  className,
  style,
}: AsciiRackMapProps) {
  const visibleRacks = racks.slice(0, height);

  return (
    <AsciiWindow
      title={title}
      width={width}
      height={height}
      border={border}
      footer={footer}
      className={`ascii-rackmap ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
    >
      <div className="ascii-rackmap-list" role="list" aria-label={title}>
        {visibleRacks.map((rack) => (
          <div key={rack.key} className="ascii-rackmap-rack" role="listitem">
            <span className="ascii-rackmap-label">{pad(rack.label, 10)}</span>
            <span className="ascii-rackmap-slots">
              {rack.slots.map((slot) => (
                <span key={slot.key} className={`ascii-rackmap-slot ascii-tone-${slot.status ?? "neutral"}`}>
                  {`[${pad(`${slot.label.slice(0, 2)}${rackMarkers[slot.status ?? "neutral"]}`, 3, "center")}]`}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </AsciiWindow>
  );
}
