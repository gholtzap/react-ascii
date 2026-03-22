import React from "react";
import type { BorderStyle } from "../chars";
import { pad } from "../chars";
import { AsciiWindow } from "./AsciiWindow";

export type AsciiSequenceTone = "neutral" | "success" | "warn" | "error";

export interface AsciiSequenceMessage {
  key: string;
  from: string;
  to: string;
  label: string;
  note?: string;
  tone?: AsciiSequenceTone;
}

export interface AsciiSequenceDiagramProps {
  participants: string[];
  messages: AsciiSequenceMessage[];
  title?: string;
  width?: number;
  height?: number;
  border?: BorderStyle;
  footer?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function buildMessageRow(
  participants: string[],
  laneWidth: number,
  message: AsciiSequenceMessage
) {
  const totalWidth = participants.length * laneWidth;
  const centers = participants.map((_, index) => index * laneWidth + Math.floor(laneWidth / 2));
  const chars = Array.from({ length: totalWidth }, () => " ");

  centers.forEach((center) => {
    chars[center] = "│";
  });

  const fromIndex = participants.indexOf(message.from);
  const toIndex = participants.indexOf(message.to);

  if (fromIndex === -1 || toIndex === -1) {
    return {
      grid: chars.join(""),
      label: message.label,
    };
  }

  const startIndex = centers[Math.min(fromIndex, toIndex)];
  const endIndex = centers[Math.max(fromIndex, toIndex)];

  for (let index = startIndex + 1; index < endIndex; index += 1) {
    chars[index] = "─";
  }

  if (fromIndex < toIndex) {
    chars[startIndex] = "├";
    chars[endIndex] = "▶";
  } else if (fromIndex > toIndex) {
    chars[startIndex] = "◀";
    chars[endIndex] = "┤";
  } else {
    chars[startIndex] = "●";
  }

  return {
    grid: chars.join(""),
    label: message.note ? `${message.label}  ${message.note}` : message.label,
  };
}

export function AsciiSequenceDiagram({
  participants,
  messages,
  title = "sequence",
  width = 66,
  height = 6,
  border = "single",
  footer,
  className,
  style,
}: AsciiSequenceDiagramProps) {
  const visibleParticipants = participants.slice(0, Math.max(1, participants.length));
  const laneWidth = Math.max(8, Math.floor(Math.max(12, width - 8) / Math.max(1, visibleParticipants.length)));
  const gridWidth = visibleParticipants.length * laneWidth;
  const header = visibleParticipants.map((participant) => pad(participant, laneWidth, "center")).join("");
  const visibleMessages = messages.slice(0, height);

  return (
    <AsciiWindow
      title={title}
      width={width}
      height={height + 1}
      border={border}
      footer={footer}
      className={`ascii-sequence ${className ?? ""}`.trim()}
      style={style}
    >
      <div className="ascii-sequence-header">
        <span className="ascii-sequence-grid" style={{ inlineSize: `${gridWidth}ch` }}>{header}</span>
        <span className="ascii-sequence-meta">FLOW</span>
      </div>
      <div className="ascii-sequence-list" role="list" aria-label={title}>
        {visibleMessages.map((message) => {
          const row = buildMessageRow(visibleParticipants, laneWidth, message);

          return (
            <div key={message.key} className={`ascii-sequence-row ascii-tone-${message.tone ?? "neutral"}`} role="listitem">
              <span className="ascii-sequence-grid" style={{ inlineSize: `${gridWidth}ch` }}>{row.grid}</span>
              <span className="ascii-sequence-meta">{row.label}</span>
            </div>
          );
        })}
      </div>
    </AsciiWindow>
  );
}
