"use client";

import type { ButtonHTMLAttributes, ComponentType, Ref } from "react";
import { cn } from "./cn";
import { Tooltip } from "./Tooltip";

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  icon: ComponentType<{ size?: number; strokeWidth?: number; "aria-hidden"?: boolean }>;
  /** Accessible name; also used as the tooltip text unless `tooltip` is false. */
  label: string;
  size?: "sm" | "md";
  variant?: "ghost" | "outline";
  active?: boolean;
  tooltip?: boolean;
  shortcut?: string;
  tooltipSide?: "top" | "bottom";
  ref?: Ref<HTMLButtonElement>;
}

export function IconButton({
  icon: Icon,
  label,
  size = "md",
  variant = "ghost",
  active = false,
  tooltip = true,
  shortcut,
  tooltipSide = "bottom",
  className,
  type = "button",
  ref,
  ...rest
}: IconButtonProps) {
  const button = (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      aria-pressed={active || undefined}
      aria-keyshortcuts={shortcut}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-[var(--shell-radius-sm)]",
        "text-[var(--shell-text-muted)] outline-none transition-colors duration-150",
        "hover:bg-[var(--shell-hover)] hover:text-[var(--shell-text)]",
        "focus-visible:ring-2 focus-visible:ring-[var(--shell-accent)]",
        "disabled:pointer-events-none disabled:opacity-40",
        size === "sm" ? "size-7" : "size-8",
        variant === "outline" && "border border-[var(--shell-border)] hover:border-[var(--shell-border-strong)]",
        active && "bg-[var(--shell-raised)] text-[var(--shell-text)]",
        className,
      )}
      {...rest}
    >
      <Icon size={size === "sm" ? 14 : 16} strokeWidth={1.75} aria-hidden />
    </button>
  );

  if (!tooltip) return button;
  return (
    <Tooltip content={label} shortcut={shortcut} side={tooltipSide}>
      {button}
    </Tooltip>
  );
}
