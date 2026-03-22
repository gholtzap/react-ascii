import React from "react";

export type TypographyVariant = "h1" | "h2" | "h3" | "h4" | "body" | "caption" | "code" | "overline";

const variantDecorations: Record<TypographyVariant, { prefix: string; suffix: string; transform?: (s: string) => string }> = {
  h1: { prefix: "# ", suffix: "", transform: (s) => s.toUpperCase() },
  h2: { prefix: "## ", suffix: "" },
  h3: { prefix: "### ", suffix: "" },
  h4: { prefix: "#### ", suffix: "" },
  body: { prefix: "", suffix: "" },
  caption: { prefix: "~ ", suffix: "" },
  code: { prefix: "`", suffix: "`" },
  overline: { prefix: "", suffix: "", transform: (s) => s.toUpperCase() },
};

const variantTags: Record<TypographyVariant, React.ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  body: "p",
  caption: "span",
  code: "code",
  overline: "span",
};

export interface AsciiTypographyProps {
  variant?: TypographyVariant;
  children: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AsciiTypography({
  variant = "body",
  children,
  className,
  style,
}: AsciiTypographyProps) {
  const dec = variantDecorations[variant];
  const Tag = variantTags[variant];
  const text = dec.transform ? dec.transform(children) : children;

  return (
    <Tag
      className={`ascii-lib ascii-typography ascii-typography-${variant} ${className ?? ""}`.trim()}
      style={style}
    >
      {`${dec.prefix}${text}${dec.suffix}`}
    </Tag>
  );
}
