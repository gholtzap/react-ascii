import React, { useRef } from "react";
import { borders, type BorderStyle } from "../chars";

export interface AsciiInputOTPProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  border?: BorderStyle;
  separator?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiInputOTP({
  length = 6,
  value = "",
  onChange,
  border = "single",
  separator = " ",
  className,
  style,
}: AsciiInputOTPProps) {
  const b = borders[border];
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const digits = value.padEnd(length, "").slice(0, length).split("");

  const handleChange = (index: number, char: string) => {
    if (!/^[0-9a-zA-Z]?$/.test(char)) return;
    const next = [...digits];
    next[index] = char;
    const newVal = next.join("");
    onChange?.(newVal);
    if (char && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/[^0-9a-zA-Z]/g, "").slice(0, length);
    onChange?.(paste);
    const focusIdx = Math.min(paste.length, length - 1);
    inputsRef.current[focusIdx]?.focus();
  };

  return (
    <div
      className={`ascii-lib ascii-input-otp ${className ?? ""}`.trim()}
      style={style}
      role="group"
      aria-label="One-time password"
    >
      {Array.from({ length }).map((_, i) => {
        const top = b.tl + b.h + b.h + b.h + b.tr;
        const bot = b.bl + b.h + b.h + b.h + b.br;
        return (
          <React.Fragment key={i}>
            <span className="ascii-otp-cell">
              <span>{top}</span>
              {"\n"}
              <span>{b.v} </span>
              <input
                ref={(el) => { inputsRef.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digits[i] || ""}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                className="ascii-otp-input"
                aria-label={`Digit ${i + 1}`}
              />
              <span> {b.v}</span>
              {"\n"}
              <span>{bot}</span>
            </span>
            {i < length - 1 && <span className="ascii-otp-sep">{separator}</span>}
          </React.Fragment>
        );
      })}
    </div>
  );
}
