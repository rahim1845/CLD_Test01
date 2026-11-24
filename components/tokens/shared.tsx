"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Copy, X } from "lucide-react";
import { contrast } from "@/lib/modePalette";
import { copyText } from "@/components/ui/clipboard";
import { cn } from "@/components/ui/cn";
import { SECTION_LABEL_CLASS } from "@/components/ui/SectionLabel";

export const MONO = "font-[family-name:var(--font-mono)]";

/* ---------- Copy feedback ---------- */

interface CopyState {
  /** Copies `value`; `name` (a token name) labels the toast and identifies the source. */
  copy: (value: string, name?: string) => void;
  /** `name ?? value` of the latest successful copy while its toast is showing. */
  copiedKey: string | null;
}

const CopyContext = createContext<CopyState>({ copy: () => {}, copiedKey: null });

export function useCopy() {
  return useContext(CopyContext);
}

interface Toast {
  id: number;
  key: string;
  value: string;
  name?: string;
  ok: boolean;
}

export function CopyProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const [visible, setVisible] = useState(false);
  const timer = useRef<number | null>(null);
  const counter = useRef(0);

  const copy = useCallback((value: string, name?: string) => {
    void copyText(value).then((ok) => {
      counter.current += 1;
      setToast({ id: counter.current, key: name ?? value, value, name, ok });
      setVisible(true);
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setVisible(false), 1600);
    });
  }, []);

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  return (
    <CopyContext.Provider value={{ copy, copiedKey: visible && toast?.ok ? toast.key : null }}>
      {children}
      <div aria-live="polite" className="pointer-events-none absolute inset-x-0 bottom-5 z-20 flex justify-center px-4">
        {toast && (
          <div
            key={toast.id}
            data-visible={visible}
            className={cn(
              "flex h-9 max-w-full items-center gap-2 rounded-[10px] border border-[var(--shell-border-strong)] bg-[#1c1c23] pl-2.5 pr-3",
              "text-[12.5px] font-medium text-[var(--shell-text)] shadow-[0_12px_32px_-8px_rgba(0,0,0,0.7),0_2px_6px_rgba(0,0,0,0.35)]",
              "transition-[opacity,translate] duration-150 ease-out data-[visible=false]:translate-y-1 data-[visible=false]:opacity-0",
            )}
          >
            <span
              className={cn(
                "grid size-[18px] shrink-0 place-items-center rounded-full",
                toast.ok
                  ? "bg-[rgba(62,207,142,0.16)] text-[var(--shell-success)]"
                  : "bg-[rgba(248,113,113,0.16)] text-[var(--shell-danger)]",
              )}
            >
              {toast.ok ? <Check size={12} strokeWidth={2.25} aria-hidden /> : <X size={12} strokeWidth={2.25} aria-hidden />}
            </span>
            <span className="shrink-0">{toast.ok ? "Copied" : "Copy failed"}</span>
            <span className={cn(MONO, "max-w-[280px] truncate text-[12px] font-normal text-[var(--shell-text)]")}>
              {toast.value.includes("\n") ? `${toast.value.split("\n").length} lines` : toast.value}
            </span>
            {toast.name && (
              <span className={cn(MONO, "hidden max-w-[220px] truncate text-[11.5px] font-normal text-[var(--shell-text-subtle)] sm:inline")}>
                {toast.name}
              </span>
            )}
          </div>
        )}
      </div>
    </CopyContext.Provider>
  );
}

/* ---------- Layout atoms ---------- */

export function Section({
  id,
  title,
  description,
  meta,
  children,
}: {
  id: string;
  title: string;
  description: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={`tk-${id}`}
      data-section={id}
      aria-labelledby={`tk-${id}-title`}
      className="border-t border-[var(--shell-border)] py-12"
    >
      <header className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="min-w-0 max-w-[640px]">
          <h2 id={`tk-${id}-title`} className="text-[17px] font-semibold leading-6 tracking-[-0.015em] text-[var(--shell-text)]">
            {title}
          </h2>
          <p className="mt-1.5 text-[13px] leading-5 text-[var(--shell-text-muted)]">{description}</p>
        </div>
        {meta && <div className="flex shrink-0 items-center gap-2">{meta}</div>}
      </header>
      <div className="space-y-10">{children}</div>
    </section>
  );
}

export function SubHeading({ children, aside, className }: { children: ReactNode; aside?: ReactNode; className?: string }) {
  return (
    <div className={cn("mb-4 flex min-h-5 items-center justify-between gap-4", className)}>
      <h3 className={SECTION_LABEL_CLASS}>{children}</h3>
      {aside && <div className="flex min-w-0 items-center gap-3 text-[11.5px] text-[var(--shell-text-subtle)]">{aside}</div>}
    </div>
  );
}

export function CountBadge({ children }: { children: ReactNode }) {
  return (
    <span className={cn(MONO, "inline-flex h-6 items-center rounded-full border border-[var(--shell-border)] px-2.5 text-[11px] tabular-nums text-[var(--shell-text-subtle)]")}>
      {children}
    </span>
  );
}

export function TokenName({ children, className }: { children: ReactNode; className?: string }) {
  return <code className={cn(MONO, "text-[11.5px] leading-4 text-[var(--shell-text-muted)]", className)}>{children}</code>;
}

/* ---------- Contrast ---------- */

export type WcagLevel = "AAA" | "AA" | "AA18" | "Fail";

export function wcagLevel(ratio: number): WcagLevel {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA18";
  return "Fail";
}

export const LEVEL_LABEL: Record<WcagLevel, string> = {
  AAA: "AAA",
  AA: "AA",
  AA18: "AA Large",
  Fail: "Fail",
};

const LEVEL_TONE: Record<WcagLevel, string> = {
  AAA: "bg-[rgba(62,207,142,0.12)] text-[#7ee0b5]",
  AA: "bg-[rgba(62,207,142,0.12)] text-[#7ee0b5]",
  AA18: "bg-[rgba(255,255,255,0.05)] text-[var(--shell-text-muted)]",
  Fail: "bg-transparent text-[var(--shell-text-subtle)] ring-1 ring-inset ring-[var(--shell-border)]",
};

/** Ratio rounded down, so a badge never claims a level the pair misses (4.47 shows as 4.4, not 4.5). */
export function formatRatio(ratio: number, digits = 2): string {
  const f = 10 ** digits;
  return (Math.floor(ratio * f) / f).toFixed(digits);
}

/** Ratio pill for a foreground on a background. `exempt` greys it out (e.g. disabled text). */
export function ContrastBadge({
  fg,
  bg,
  exempt = false,
  compact = false,
  dot,
  subject,
  className,
}: {
  fg: string;
  bg: string;
  exempt?: boolean;
  /** One decimal and no level label, for tight spots like scale swatches. */
  compact?: boolean;
  dot?: string;
  subject?: string;
  className?: string;
}) {
  const ratio = contrast(fg, bg);
  const level = wcagLevel(ratio);
  const label = exempt ? "Exempt" : LEVEL_LABEL[level];
  const what = subject ? `${subject}: ` : "";
  return (
    <span
      title={`${what}${ratio.toFixed(2)}:1 · ${exempt ? "disabled text is exempt from WCAG contrast" : `WCAG ${label}`}`}
      className={cn(
        MONO,
        "inline-flex h-[18px] shrink-0 items-center whitespace-nowrap rounded-[4px] text-[10.5px] font-medium tabular-nums leading-none",
        compact ? "gap-[3px] px-1" : "gap-1 px-1.5",
        exempt ? LEVEL_TONE.AA18 : LEVEL_TONE[level],
        className,
      )}
    >
      {dot && <span aria-hidden className="size-[7px] shrink-0 rounded-full ring-1 ring-inset ring-white/30" style={{ background: dot }} />}
      {formatRatio(ratio, compact || ratio >= 10 ? 1 : 2)}
      {!compact && <span className="opacity-75">{label}</span>}
    </span>
  );
}

/* ---------- Hairline grids ---------- */

/** Cells sit on a hairline grid (gap-px over a border-colored track), so cell backgrounds must stay opaque. */
export const HAIRLINE_GRID =
  "grid gap-px overflow-hidden rounded-[var(--shell-radius-lg)] border border-[var(--shell-border)] bg-[var(--shell-border)]";

export function cellButton(extra?: string) {
  return cn(
    "group/row w-full bg-[var(--shell-panel)] text-left outline-none transition-colors duration-150",
    "hover:bg-[#111116] focus-visible:bg-[#111116]",
    "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--shell-accent)]",
    extra,
  );
}

/** Copy affordance revealed on row hover; turns into a check after copying. */
export function CopyGlyph({ copied }: { copied: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "shrink-0 transition-opacity duration-150",
        copied ? "text-[var(--shell-success)] opacity-100" : "text-[var(--shell-text-subtle)] opacity-0 group-hover/row:opacity-100",
      )}
    >
      {copied ? <Check size={14} strokeWidth={2} /> : <Copy size={13} strokeWidth={1.75} />}
    </span>
  );
}
