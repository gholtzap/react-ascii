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
  as?: React.ElementType;
  children: React.ReactNode;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

function decorateContent(
  children: React.ReactNode,
  decoration: { prefix: string; suffix: string; transform?: (value: string) => string }
) {
  if (typeof children === "string" || typeof children === "number") {
    const content = decoration.transform ? decoration.transform(String(children)) : String(children);
    return `${decoration.prefix}${content}${decoration.suffix}`;
  }

  if (!decoration.prefix && !decoration.suffix) {
    return children;
  }

  return (
    <>
      {decoration.prefix}
      {children}
      {decoration.suffix}
    </>
  );
}

export function AsciiTypography({
  variant = "body",
  as,
  children,
  color,
  className,
  style,
}: AsciiTypographyProps) {
  const dec = variantDecorations[variant];
  const Tag = as ?? variantTags[variant];

  return (
    <Tag
      className={`ascii-lib ascii-typography ascii-typography-${variant} ${className ?? ""}`.trim()}
      style={color ? { ...style, color } : style}
    >
      {decorateContent(children, dec)}
    </Tag>
  );
}
