import React from "react";
import { cloneElementWithMergedProps } from "./mergeProps";

export interface AsciiTriggerProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  asChild?: boolean;
  children: React.ReactNode;
}

export const AsciiTrigger = React.forwardRef<HTMLButtonElement, AsciiTriggerProps>(function AsciiTrigger({
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
}, ref) {
  if (asChild && React.isValidElement(children)) {
    return cloneElementWithMergedProps(children as React.ReactElement<Record<string, unknown>>, {
      ...rest,
      className,
      onClick,
      onFocus,
      onBlur,
      onMouseEnter,
      onMouseLeave,
      onKeyDown,
    });
  }

  return (
    <button ref={ref} type="button" className={className} onClick={onClick} onFocus={onFocus} onBlur={onBlur} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onKeyDown={onKeyDown} {...rest}>
      {children}
    </button>
  );
});
