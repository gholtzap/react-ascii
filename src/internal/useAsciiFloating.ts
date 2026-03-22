import { CSSProperties, RefObject, useCallback, useEffect, useState } from "react";
import { useSafeLayoutEffect } from "./useSafeLayoutEffect";

export type AsciiFloatingSide = "top" | "bottom" | "left" | "right";
export type AsciiFloatingAlign = "start" | "center" | "end";

interface UseAsciiFloatingOptions {
  open: boolean;
  anchorRef?: RefObject<HTMLElement | null>;
  anchorRect?: DOMRect | null;
  contentRef: RefObject<HTMLElement | null>;
  side?: AsciiFloatingSide;
  align?: AsciiFloatingAlign;
  offset?: number;
  collisionPadding?: number;
  matchAnchorWidth?: boolean;
}

function getOppositeSide(side: AsciiFloatingSide): AsciiFloatingSide {
  switch (side) {
    case "top":
      return "bottom";
    case "bottom":
      return "top";
    case "left":
      return "right";
    case "right":
      return "left";
  }
}

function getAnchorRect(
  anchorRef?: RefObject<HTMLElement | null>,
  anchorRect?: DOMRect | null
) {
  if (anchorRect) return anchorRect;
  return anchorRef?.current?.getBoundingClientRect() ?? null;
}

function resolveSide(
  preferredSide: AsciiFloatingSide,
  anchor: DOMRect,
  contentWidth: number,
  contentHeight: number,
  offset: number,
  collisionPadding: number
) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const oppositeSide = getOppositeSide(preferredSide);
  const vertical = preferredSide === "top" || preferredSide === "bottom";

  if (vertical) {
    const preferredFits = preferredSide === "bottom"
      ? anchor.bottom + offset + contentHeight + collisionPadding <= viewportHeight
      : anchor.top - offset - contentHeight >= collisionPadding;
    const oppositeFits = oppositeSide === "bottom"
      ? anchor.bottom + offset + contentHeight + collisionPadding <= viewportHeight
      : anchor.top - offset - contentHeight >= collisionPadding;

    if (preferredFits || !oppositeFits) {
      const spacePreferred = preferredSide === "bottom"
        ? viewportHeight - anchor.bottom
        : anchor.top;
      const spaceOpposite = oppositeSide === "bottom"
        ? viewportHeight - anchor.bottom
        : anchor.top;

      return spacePreferred >= spaceOpposite ? preferredSide : oppositeSide;
    }

    return oppositeSide;
  }

  const preferredFits = preferredSide === "right"
    ? anchor.right + offset + contentWidth + collisionPadding <= viewportWidth
    : anchor.left - offset - contentWidth >= collisionPadding;
  const oppositeFits = oppositeSide === "right"
    ? anchor.right + offset + contentWidth + collisionPadding <= viewportWidth
    : anchor.left - offset - contentWidth >= collisionPadding;

  if (preferredFits || !oppositeFits) {
    const spacePreferred = preferredSide === "right"
      ? viewportWidth - anchor.right
      : anchor.left;
    const spaceOpposite = oppositeSide === "right"
      ? viewportWidth - anchor.right
      : anchor.left;

    return spacePreferred >= spaceOpposite ? preferredSide : oppositeSide;
  }

  return oppositeSide;
}

function clamp(value: number, min: number, max: number) {
  if (max < min) return min;
  return Math.max(min, Math.min(max, value));
}

function getCoordinates(
  side: AsciiFloatingSide,
  align: AsciiFloatingAlign,
  anchor: DOMRect,
  contentWidth: number,
  contentHeight: number,
  offset: number,
  collisionPadding: number
) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  let top = 0;
  let left = 0;

  if (side === "top" || side === "bottom") {
    if (align === "start") {
      left = anchor.left;
    } else if (align === "end") {
      left = anchor.right - contentWidth;
    } else {
      left = anchor.left + (anchor.width - contentWidth) / 2;
    }

    top = side === "bottom"
      ? anchor.bottom + offset
      : anchor.top - contentHeight - offset;
  } else {
    if (align === "start") {
      top = anchor.top;
    } else if (align === "end") {
      top = anchor.bottom - contentHeight;
    } else {
      top = anchor.top + (anchor.height - contentHeight) / 2;
    }

    left = side === "right"
      ? anchor.right + offset
      : anchor.left - contentWidth - offset;
  }

  return {
    top: clamp(top, collisionPadding, viewportHeight - contentHeight - collisionPadding),
    left: clamp(left, collisionPadding, viewportWidth - contentWidth - collisionPadding),
  };
}

export function useAsciiFloating({
  open,
  anchorRef,
  anchorRect,
  contentRef,
  side = "bottom",
  align = "start",
  offset = 4,
  collisionPadding = 8,
  matchAnchorWidth = false,
}: UseAsciiFloatingOptions) {
  const [floatingStyle, setFloatingStyle] = useState<CSSProperties>({
    position: "fixed",
    top: 0,
    left: 0,
    visibility: "hidden",
  });
  const [placement, setPlacement] = useState<{ side: AsciiFloatingSide; align: AsciiFloatingAlign }>({
    side,
    align,
  });

  const updatePosition = useCallback(() => {
    if (!open || typeof window === "undefined" || typeof document === "undefined") return;

    const anchor = getAnchorRect(anchorRef, anchorRect);
    const content = contentRef.current;

    if (!anchor || !content) return;

    const contentWidth = content.offsetWidth;
    const contentHeight = content.offsetHeight;
    const resolvedSide = resolveSide(side, anchor, contentWidth, contentHeight, offset, collisionPadding);
    const coords = getCoordinates(
      resolvedSide,
      align,
      anchor,
      contentWidth,
      contentHeight,
      offset,
      collisionPadding
    );

    setPlacement({ side: resolvedSide, align });
    setFloatingStyle({
      position: "fixed",
      top: Math.round(coords.top),
      left: Math.round(coords.left),
      minWidth: matchAnchorWidth ? `${Math.round(anchor.width)}px` : undefined,
      visibility: "visible",
      zIndex: 10000,
    });
  }, [
    align,
    anchorRect,
    anchorRef,
    collisionPadding,
    contentRef,
    matchAnchorWidth,
    offset,
    open,
    side,
  ]);

  useSafeLayoutEffect(() => {
    if (!open) {
      setFloatingStyle({
        position: "fixed",
        top: 0,
        left: 0,
        visibility: "hidden",
      });
      return;
    }

    updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open || typeof window === "undefined") return;

    const handleChange = () => updatePosition();

    window.addEventListener("resize", handleChange);
    window.addEventListener("scroll", handleChange, true);

    let observer: ResizeObserver | null = null;

    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(handleChange);

      if (contentRef.current) observer.observe(contentRef.current);
      if (anchorRef?.current) observer.observe(anchorRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleChange);
      window.removeEventListener("scroll", handleChange, true);
      observer?.disconnect();
    };
  }, [anchorRef, contentRef, open, updatePosition]);

  return {
    floatingStyle,
    placement,
    updatePosition,
  };
}
