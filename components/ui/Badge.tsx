import type { ComponentType, HTMLAttributes, Ref } from "react";
import { cn } from "./cn";

export type BadgeTone = "neutral" | "accent" | "success" | "danger";

const DOT: Record<BadgeTone, string> = {
  neutral: "bg-[var(--shell-text-subtle)]",
  accent: "bg-[var(--shell-accent)]",
  success: "bg-[var(--shell-success)]",
  danger: "bg-[var(--shell-danger)]",
};

const RING: Record<BadgeTone, string> = {
  neutral: "shadow-[0_0_0_3px_rgba(255,255,255,0.06)]",
  accent: "shadow-[0_0_0_3px_var(--shell-accent-soft)]",
  success: "shadow-[0_0_0_3px_rgba(62,207,142,0.14)]",
  danger: "shadow-[0_0_0_3px_rgba(248,113,113,0.14)]",
};

const ICON: Record<BadgeTone, string> = {
  neutral: "text-[var(--shell-text-subtle)]",
  accent: "text-[var(--shell-accent)]",
  success: "text-[var(--shell-success)]",
  danger: "text-[var(--shell-danger)]",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  dot?: boolean;
  pulse?: boolean;
  icon?: ComponentType<{ size?: number; strokeWidth?: number; className?: string; "aria-hidden"?: boolean }>;
  ref?: Ref<HTMLSpanElement>;
}

export function Badge({ tone = "neutral", dot = false, pulse = false, icon: Icon, className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5",
        "border border-[var(--shell-border)] bg-[rgba(255,255,255,0.02)]",
        "text-[11.5px] font-medium leading-none tracking-[-0.005em] text-[var(--shell-text-muted)]",
        className,
      )}
      {...rest}
    >
      {dot && (
        <span aria-hidden className="relative inline-flex size-1.5">
          {pulse && (
            <span className={cn("absolute inset-0 rounded-full opacity-70 motion-safe:animate-ping", DOT[tone])} />
          )}
          <span className={cn("relative size-1.5 rounded-full", DOT[tone], RING[tone])} />
        </span>
      )}
      {Icon && <Icon size={12} strokeWidth={1.75} aria-hidden className={ICON[tone]} />}
      {children}
    </span>
  );
}
