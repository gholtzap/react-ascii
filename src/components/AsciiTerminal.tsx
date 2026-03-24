import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";
import { renderHighlightedText } from "../internal/renderHighlightedText";

export interface AsciiTerminalProps {
  title?: string;
  prompt?: string;
  width?: number;
  height?: number;
  border?: BorderStyle;
  initialLines?: string[];
  streamLines?: string[];
  onCommand?: (command: string) => string | string[] | void;
  toolbar?: React.ReactNode;
  status?: React.ReactNode;
  filterQuery?: string;
  searchQuery?: string;
  maxStoredLines?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiTerminal({
  title = "terminal",
  prompt = "$ ",
  width = 60,
  height = 12,
  border = "single",
  initialLines = [],
  streamLines,
  onCommand,
  toolbar,
  status,
  filterQuery,
  searchQuery,
  maxStoredLines = 200,
  color,
  className,
  style,
}: AsciiTerminalProps) {
  const [sessionLines, setSessionLines] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const b = borders[border];
  const inner = width - 2;
  const contentWidth = inner - 2;
  const baseLines = streamLines ?? initialLines;
  const allLines = useMemo(
    () => [...baseLines, ...sessionLines].slice(-maxStoredLines),
    [baseLines, maxStoredLines, sessionLines]
  );
  const visibleLines = useMemo(() => {
    const filtered = filterQuery
      ? allLines.filter((line) => line.toLowerCase().includes(filterQuery.toLowerCase()))
      : allLines;

    return filtered.slice(-height);
  }, [allLines, filterQuery, height]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleLines]);

  const handleSubmit = useCallback(() => {
    const cmd = input.trim();
    const newLines = [`${prompt}${input}`];

    if (cmd) {
      setHistory((h) => [...h, cmd]);
      setHistoryIdx(-1);

      if (cmd === "clear") {
        setSessionLines([]);
        setInput("");
        return;
      }

      if (onCommand) {
        const result = onCommand(cmd);
        if (result) {
          const resultLines = Array.isArray(result) ? result : result.split("\n");
          newLines.push(...resultLines);
        }
      }
    }

    setSessionLines((currentLines) => [...currentLines, ...newLines].slice(-maxStoredLines));
    setInput("");
  }, [input, maxStoredLines, onCommand, prompt]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (history.length > 0) {
          const idx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
          setHistoryIdx(idx);
          setInput(history[idx]);
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIdx >= 0) {
          const idx = historyIdx + 1;
          if (idx >= history.length) {
            setHistoryIdx(-1);
            setInput("");
          } else {
            setHistoryIdx(idx);
            setInput(history[idx]);
          }
        }
      }
    },
    [handleSubmit, history, historyIdx]
  );

  const topLine = b.tl + b.h + " " + title + " " + repeatChar(b.h, inner - title.length - 3) + b.tr;
  const bottomLine = b.bl + repeatChar(b.h, inner) + b.br;

  return (
    <div
      className={`ascii-lib ascii-terminal ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
      onClick={() => inputRef.current?.focus()}
    >
      <div style={{ whiteSpace: "pre" }}>{topLine}</div>
      {toolbar ? <div className="ascii-terminal-toolbar">{toolbar}</div> : null}
      {status ? <div className="ascii-terminal-status">{status}</div> : null}
      <div
        ref={scrollRef}
        className="ascii-terminal-body"
        style={{
          whiteSpace: "pre",
          maxHeight: `${height * 1.4}em`,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {visibleLines.map((line, i) => (
          <div key={i}>
            <span>{b.v + " "}</span>
            <span className="ascii-terminal-line">{renderHighlightedText(pad(line, contentWidth), searchQuery)}</span>
            <span>{` ${b.v}`}</span>
          </div>
        ))}
        <div>
          {b.v + " " + prompt}
          <input
            ref={inputRef}
            type="text"
            className="ascii-terminal-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ width: `${contentWidth - prompt.length}ch` }}
            aria-label="Terminal input"
            spellCheck={false}
            autoComplete="off"
          />
          {" " + b.v}
        </div>
      </div>
      <div style={{ whiteSpace: "pre" }}>{bottomLine}</div>
    </div>
  );
}
