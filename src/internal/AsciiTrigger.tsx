import React from "react";

type AnyEventHandler = ((event: React.SyntheticEvent<HTMLElement>) => void) | undefined;

function mergeHandler(
  theirHandler: AnyEventHandler,
  ourHandler: AnyEventHandler
) {
  if (!theirHandler && !ourHandler) return undefined;

  return (event: React.SyntheticEvent<HTMLElement>) => {
    theirHandler?.(event);

    if (!event.defaultPrevented) {
      ourHandler?.(event);
    }
  };
}

export interface AsciiTriggerProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  asChild?: boolean;
  children: React.ReactNode;
}

export function AsciiTrigger({
  asChild,
  children,
  className,
  onClick,
  onFocus,
  onBlur,
  onMouseEnter,
  onMouseLeave,
  onKeyDown,
  ...rest
}: AsciiTriggerProps) {
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    const childProps = child.props;
    const mergedClassName = [childProps.className, className].filter(Boolean).join(" ");

    return React.cloneElement(child, {
      ...childProps,
      ...rest,
      className: mergedClassName || undefined,
      onClick: mergeHandler(childProps.onClick as AnyEventHandler, onClick as AnyEventHandler),
      onFocus: mergeHandler(childProps.onFocus as AnyEventHandler, onFocus as AnyEventHandler),
      onBlur: mergeHandler(childProps.onBlur as AnyEventHandler, onBlur as AnyEventHandler),
      onMouseEnter: mergeHandler(childProps.onMouseEnter as AnyEventHandler, onMouseEnter as AnyEventHandler),
      onMouseLeave: mergeHandler(childProps.onMouseLeave as AnyEventHandler, onMouseLeave as AnyEventHandler),
      onKeyDown: mergeHandler(childProps.onKeyDown as AnyEventHandler, onKeyDown as AnyEventHandler),
    });
  }

  return (
    <button type="button" className={className} onClick={onClick} onFocus={onFocus} onBlur={onBlur} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onKeyDown={onKeyDown} {...rest}>
      {children}
    </button>
  );
}
