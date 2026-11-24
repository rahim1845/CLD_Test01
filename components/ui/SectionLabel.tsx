import type { ReactNode } from "react";
import { cn } from "./cn";

/** The 11px uppercase eyebrow used for every section heading in the shell. */
export const SECTION_LABEL_CLASS =
  "text-[11px] font-medium uppercase leading-none tracking-[0.08em] text-[var(--shell-text-subtle)]";

interface SectionLabelProps {
  children: ReactNode;
  id?: string;
  htmlFor?: string;
  aside?: ReactNode;
  className?: string;
}

export function SectionLabel({ children, id, htmlFor, aside, className }: SectionLabelProps) {
  return (
    <div className={cn("flex h-5 items-center justify-between gap-3", className)}>
      {htmlFor ? (
        <label id={id} htmlFor={htmlFor} className={SECTION_LABEL_CLASS}>
          {children}
        </label>
      ) : (
        <span id={id} className={SECTION_LABEL_CLASS}>
          {children}
        </span>
      )}
      {aside}
    </div>
  );
}
