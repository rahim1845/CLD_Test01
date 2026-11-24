"use client";

import type { ReactNode } from "react";
import { Moon, Sparkles, Sun } from "lucide-react";
import { cn } from "@/components/ui/cn";
import type { EngineAnalysis } from "@/lib/engine";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface AnalysisCardProps {
  analysis: EngineAnalysis | null;
  variation: number;
  darkMode: boolean;
  composing?: boolean;
  onPreviewMode: (dark: boolean) => void;
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex h-7 items-center justify-between gap-3">
      <dt className="text-[12px] text-[var(--shell-text-subtle)]">{label}</dt>
      <dd className="flex min-w-0 items-center gap-2 truncate text-[12px] font-medium text-[var(--shell-text)]">
        {children}
      </dd>
    </div>
  );
}

export default function AnalysisCard({ analysis, variation, darkMode, composing, onPreviewMode }: AnalysisCardProps) {
  if (!analysis) {
    return (
      <section aria-labelledby="tf-why" className="flex flex-col gap-2">
        <SectionLabel id="tf-why">Why this theme</SectionLabel>
        <div className="flex items-start gap-2.5 rounded-[var(--shell-radius)] border border-[var(--shell-border)] bg-[rgba(255,255,255,0.02)] p-3">
          <Sparkles
            size={14}
            strokeWidth={1.75}
            aria-hidden
            className={cn("mt-0.5 shrink-0 text-[var(--shell-accent)]", composing && "motion-safe:animate-pulse")}
          />
          <p className="text-[12.5px] leading-[19px] text-[var(--shell-text-muted)]">
            {composing
              ? "Claude is composing this theme. The preview fills in as each token arrives."
              : "Composed by Claude from your brief. Switch to Instant for a reasoned breakdown and shuffles."}
          </p>
        </div>
      </section>
    );
  }

  const preferDark = analysis.preferredMode === "dark";
  const matches = preferDark === darkMode;
  const ModeIcon = preferDark ? Moon : Sun;

  return (
    <section aria-labelledby="tf-why" className="flex flex-col gap-2">
      <SectionLabel
        id="tf-why"
        aside={
          variation > 0 ? (
            <span className="font-mono text-[10.5px] tabular-nums text-[var(--shell-text-subtle)]">
              Take {variation + 1}
            </span>
          ) : undefined
        }
      >
        Why this theme
      </SectionLabel>
      <div className="rounded-[var(--shell-radius)] border border-[var(--shell-border)] bg-[rgba(255,255,255,0.02)]">
        <div className="p-3 pb-2.5">
          <p className="text-[12.5px] leading-[19px] text-[var(--shell-text-muted)]">{analysis.summary}</p>
          {analysis.tags.length > 0 && (
            <ul aria-label="Detected traits" className="mt-2.5 flex flex-wrap gap-1">
              {analysis.tags.map((tag) => (
                <li
                  key={tag}
                  className="inline-flex h-5 items-center rounded-[5px] border border-[var(--shell-border)] bg-[rgba(255,255,255,0.03)] px-1.5 text-[11px] font-medium text-[var(--shell-text-muted)]"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
        <dl className="border-t border-[var(--shell-border)] px-3 py-1">
          <Row label="Harmony">{analysis.harmony}</Row>
          <Row label="Type personality">{analysis.fontPersonality}</Row>
          <Row label="Designed for">
            <span className="inline-flex items-center gap-1.5">
              <ModeIcon size={12} strokeWidth={1.75} aria-hidden className="text-[var(--shell-text-muted)]" />
              {preferDark ? "Dark mode" : "Light mode"}
            </span>
            <button
              type="button"
              disabled={matches}
              onClick={() => onPreviewMode(preferDark)}
              className={cn(
                "rounded-[4px] px-1 text-[11.5px] font-medium outline-none transition-colors duration-150",
                "focus-visible:ring-2 focus-visible:ring-[var(--shell-accent)]",
                matches
                  ? "text-[var(--shell-text-subtle)]"
                  : "text-[var(--shell-accent)] hover:text-[#a99dff]",
              )}
            >
              {matches ? "Showing" : "Preview"}
            </button>
          </Row>
        </dl>
      </div>
    </section>
  );
}
