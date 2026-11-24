"use client";

import { History, Sparkles, Zap } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { useThemeStore } from "@/store/themeStore";
import { SectionLabel } from "@/components/ui/SectionLabel";

export default function HistoryStrip({ shortcut }: { shortcut: string }) {
  const history = useThemeStore((s) => s.themeHistory);
  const activeId = useThemeStore((s) => s.activeHistoryId);
  const restore = useThemeStore((s) => s.restoreFromHistory);
  const clear = useThemeStore((s) => s.clearHistory);

  return (
    <section aria-labelledby="tf-recent" className="flex flex-col gap-2">
      <SectionLabel
        id="tf-recent"
        aside={
          history.length > 0 ? (
            <button
              type="button"
              onClick={clear}
              className="rounded-[4px] px-1 text-[11.5px] text-[var(--shell-text-subtle)] outline-none transition-colors duration-150 hover:text-[var(--shell-text)] focus-visible:ring-2 focus-visible:ring-[var(--shell-accent)]"
            >
              Clear
            </button>
          ) : undefined
        }
      >
        Recent
      </SectionLabel>

      {history.length === 0 ? (
        <div className="flex items-center gap-2.5 rounded-[var(--shell-radius)] border border-dashed border-[var(--shell-border-strong)] px-3 py-3">
          <History size={14} strokeWidth={1.75} aria-hidden className="shrink-0 text-[var(--shell-text-subtle)]" />
          <p className="text-[12px] leading-[17px] text-[var(--shell-text-subtle)]">
            Press <span className="text-[var(--shell-text-muted)]">Generate</span> or {shortcut} to keep a theme here.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-2">
          {history.map((item) => {
            const active = item.id === activeId;
            const EngineIcon = item.engine === "local" ? Zap : Sparkles;
            const { primary, accent } = item.theme.color;
            return (
              <li key={item.id} className="min-w-0">
                <button
                  type="button"
                  aria-current={active || undefined}
                  title={item.prompt ? `${item.name} · ${item.prompt}` : item.name}
                  onClick={() => restore(item.id)}
                  className={cn(
                    "group flex w-full min-w-0 flex-col gap-1.5 rounded-[var(--shell-radius)] border p-1.5 text-left",
                    "outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[var(--shell-accent)]",
                    active
                      ? "border-[var(--shell-border-strong)] bg-[var(--shell-raised)]"
                      : "border-[var(--shell-border)] hover:border-[var(--shell-border-strong)] hover:bg-[var(--shell-hover)]",
                  )}
                >
                  <span
                    aria-hidden
                    className="flex h-8 w-full overflow-hidden rounded-[6px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
                  >
                    <span className="h-full flex-[3]" style={{ backgroundColor: primary[500] }} />
                    <span className="h-full flex-[2]" style={{ backgroundColor: accent[400] }} />
                  </span>
                  <span className="flex min-w-0 items-center gap-1.5 px-0.5 pb-0.5">
                    <span
                      className={cn(
                        "min-w-0 flex-1 truncate text-[12px] font-medium tracking-[-0.005em]",
                        active ? "text-[var(--shell-text)]" : "text-[var(--shell-text-muted)] group-hover:text-[var(--shell-text)]",
                      )}
                    >
                      {item.name}
                    </span>
                    <EngineIcon
                      size={11}
                      strokeWidth={1.75}
                      aria-label={item.engine === "local" ? "Instant engine" : "Claude AI"}
                      className={cn(
                        "shrink-0",
                        active ? "text-[var(--shell-text-muted)]" : "text-[var(--shell-text-subtle)]",
                      )}
                    />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
