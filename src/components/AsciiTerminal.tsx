import React, { useState, useCallback, useRef, useEffect } from "react";
import { borders, repeatChar, pad, type BorderStyle } from "../chars";

export interface AsciiTerminalProps {
  title?: string;
  prompt?: string;
  width?: number;
  height?: number;
  border?: BorderStyle;
  initialLines?: string[];
  onCommand?: (command: string) => string | string[] | void;
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
  onCommand,
  className,
  style,
}: AsciiTerminalProps) {
  const [lines, setLines] = useState<string[]>(initialLines);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const b = borders[border];
  const inner = width - 2;
  const contentWidth = inner - 2;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const handleSubmit = useCallback(() => {
    const cmd = input.trim();
    const newLines = [...lines, `${prompt}${input}`];

    if (cmd) {
      setHistory((h) => [...h, cmd]);
      setHistoryIdx(-1);

      if (cmd === "clear") {
        setLines([]);
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

    setLines(newLines);
    setInput("");
  }, [input, lines, prompt, onCommand]);

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
      style={style}
      onClick={() => inputRef.current?.focus()}
    >
      <div style={{ whiteSpace: "pre" }}>{topLine}</div>
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
        {lines.map((line, i) => (
          <div key={i}>
            {b.v + " " + pad(line, contentWidth) + " " + b.v}
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
