import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export function Kbd({ className, children, ...rest }: HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        "inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-[4px] px-1",
        "border border-[var(--shell-border-strong)] bg-[var(--shell-raised)]",
        "font-mono text-[10.5px] font-medium leading-none text-[var(--shell-text-muted)]",
        "shadow-[inset_0_-1px_0_rgba(255,255,255,0.05)]",
        className,
      )}
      {...rest}
    >
      {children}
    </kbd>
  );
}
