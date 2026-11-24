import type { ButtonHTMLAttributes, ComponentType, Ref } from "react";
import { cn } from "./cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

type IconType = ComponentType<{ size?: number; strokeWidth?: number; className?: string; "aria-hidden"?: boolean }>;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconType;
  ref?: Ref<HTMLButtonElement>;
}

/** The near-white primary is reserved for the one main action in a region; everything else is secondary or ghost. */
const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-[#ededf0] text-[#08080b] shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_-1px_0_rgba(0,0,0,0.08)] hover:bg-white",
  secondary:
    "border border-[var(--shell-border-strong)] text-[var(--shell-text)] hover:bg-[var(--shell-hover)]",
  ghost: "text-[var(--shell-text-muted)] hover:bg-[var(--shell-hover)] hover:text-[var(--shell-text)]",
};

const SIZES: Record<ButtonSize, { root: string; icon: number }> = {
  sm: { root: "h-7 gap-1.5 rounded-[var(--shell-radius-sm)] px-2.5 text-[12px]", icon: 13 },
  md: { root: "h-8 gap-1.5 rounded-[var(--shell-radius-sm)] px-3 text-[12.5px]", icon: 14 },
  lg: { root: "h-9 gap-2 rounded-[var(--shell-radius)] px-3 text-[13px]", icon: 14 },
};

export function buttonClass(variant: ButtonVariant = "secondary", size: ButtonSize = "md", className?: string) {
  return cn(
    "inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap font-medium tracking-[-0.005em]",
    "outline-none transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.985]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shell-accent)]",
    "disabled:pointer-events-none disabled:opacity-40",
    SIZES[size].root,
    VARIANTS[variant],
    className,
  );
}

export function Button({
  variant = "secondary",
  size = "md",
  icon: Icon,
  type = "button",
  className,
  children,
  ref,
  ...rest
}: ButtonProps) {
  return (
    <button ref={ref} type={type} className={buttonClass(variant, size, className)} {...rest}>
      {Icon && <Icon size={SIZES[size].icon} strokeWidth={1.75} aria-hidden className="shrink-0" />}
      {children}
    </button>
  );
}
