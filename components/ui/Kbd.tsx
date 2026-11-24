import type { HTMLAttributes } from "react";
import { cn } from "./cn";

interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** "inverted" sits on the near-white primary button. */
  tone?: "default" | "inverted";
}

const TONES = {
  default:
    "border-[var(--shell-border-strong)] bg-[var(--shell-raised)] text-[var(--shell-text-muted)] shadow-[inset_0_-1px_0_rgba(255,255,255,0.05)]",
  inverted: "border-black/10 bg-black/[0.05] text-black/55",
} as const;

export function Kbd({ tone = "default", className, children, ...rest }: KbdProps) {
  return (
    <kbd
      className={cn(
        "inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-[4px] border px-1",
        "font-mono text-[10.5px] font-medium leading-none",
        TONES[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </kbd>
  );
}
