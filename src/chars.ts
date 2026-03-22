export type BorderStyle = "single" | "double" | "round" | "bold" | "ascii";

export interface BorderChars {
  tl: string; // top-left
  tr: string; // top-right
  bl: string; // bottom-left
  br: string; // bottom-right
  h: string;  // horizontal
  v: string;  // vertical
  // junction characters for tables
  tm: string; // top-middle (T-down)
  bm: string; // bottom-middle (T-up)
  lm: string; // left-middle (T-right)
  rm: string; // right-middle (T-left)
  mm: string; // middle-middle (cross)
}

export const borders: Record<BorderStyle, BorderChars> = {
  single: {
    tl: "┌", tr: "┐", bl: "└", br: "┘",
    h: "─", v: "│",
    tm: "┬", bm: "┴", lm: "├", rm: "┤", mm: "┼",
  },
  double: {
    tl: "╔", tr: "╗", bl: "╚", br: "╝",
    h: "═", v: "║",
    tm: "╦", bm: "╩", lm: "╠", rm: "╣", mm: "╬",
  },
  round: {
    tl: "╭", tr: "╮", bl: "╰", br: "╯",
    h: "─", v: "│",
    tm: "┬", bm: "┴", lm: "├", rm: "┤", mm: "┼",
  },
  bold: {
    tl: "┏", tr: "┓", bl: "┗", br: "┛",
    h: "━", v: "┃",
    tm: "┳", bm: "┻", lm: "┣", rm: "┫", mm: "╋",
  },
  ascii: {
    tl: "+", tr: "+", bl: "+", br: "+",
    h: "-", v: "|",
    tm: "+", bm: "+", lm: "+", rm: "+", mm: "+",
  },
};

export function pad(text: string, width: number, align: "left" | "center" | "right" = "left"): string {
  const len = text.length;
  if (len >= width) return text.slice(0, width);
  const diff = width - len;
  switch (align) {
    case "right":
      return " ".repeat(diff) + text;
    case "center": {
      const left = Math.floor(diff / 2);
      return " ".repeat(left) + text + " ".repeat(diff - left);
    }
    default:
      return text + " ".repeat(diff);
  }
}

export function repeatChar(ch: string, n: number): string {
  return ch.repeat(Math.max(0, n));
}
