import React from "react";
import { cloneElementWithMergedProps } from "./mergeProps";
import { composeRefs } from "./composeRefs";

export interface AsciiTriggerProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  asChild?: boolean;
  children: React.ReactNode;
}

export const AsciiTrigger = React.forwardRef<HTMLElement, AsciiTriggerProps>(function AsciiTrigger({
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
    const child = children as React.ReactElement<Record<string, unknown> & { ref?: React.Ref<HTMLElement> }>;
    const childRef = child.props.ref;

    return cloneElementWithMergedProps(child, {
      ...rest,
      ref: composeRefs(childRef, ref),
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
    <button ref={ref as React.Ref<HTMLButtonElement>} type="button" className={className} onClick={onClick} onFocus={onFocus} onBlur={onBlur} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onKeyDown={onKeyDown} {...rest}>
      {children}
    </button>
  );
});
