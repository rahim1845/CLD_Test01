"use client";

import type { ReactNode } from "react";
import { Check, KeyRound, LoaderCircle, Shuffle, Sparkles, Square, TriangleAlert, X, Zap } from "lucide-react";
import { Button, buttonClass } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { IconButton } from "@/components/ui/IconButton";
import { Kbd } from "@/components/ui/Kbd";
import { Tooltip } from "@/components/ui/Tooltip";
import { contrastRatio, nearestColorName } from "@/lib/engine/color";
import { primaryFamily } from "@/lib/engine/typography";
import { useThemeStore, type Engine } from "@/store/themeStore";
import type { GenerateMode } from "@/types/theme";
import { LOCAL_STAGES, type GeneratorFailure, type GeneratorStatus } from "./useGenerator";
import { useIsMac } from "@/components/ui/useIsMac";

function ShortcutHint({ isMac }: { isMac: boolean }) {
  return (
    <span aria-hidden className="flex items-center gap-0.5 [@media(pointer:coarse)]:hidden">
      <Kbd tone="inverted">{isMac ? "⌘" : "Ctrl"}</Kbd>
      <Kbd tone="inverted">↵</Kbd>
    </span>
  );
}

/** What the engine decided at each step, read back from the theme on screen. */
function useStageDetail(stage: number | null): string | null {
  return useThemeStore((s) => {
    if (stage === null) return null;
    const { currentTheme: theme, analysis } = s;
    const { color, typography } = theme;
    switch (stage) {
      case 0:
        if (s.generateMode === "color") return `Seed ${s.seedColor} reads as ${nearestColorName(s.seedColor)}`;
        return analysis?.tags.length ? `Found ${analysis.tags.slice(0, 3).join(", ").toLowerCase()}` : "No strong cues, so balanced defaults";
      case 1:
        return `${analysis?.harmony ?? "Harmony"} · ${color.primary[500]} with ${color.accent[500]}`;
      case 2: {
        const display = primaryFamily(typography.fontFamily.display);
        const body = primaryFamily(typography.fontFamily.body);
        return display === body ? `${display} for display and body` : `${display} with ${body}`;
      }
      default: {
        const ratio = contrastRatio(color.text.primary, color.surface.card);
        return `Text at ${ratio.toFixed(1)}:1 on surfaces, passes AA`;
      }
    }
  });
}

function StatusLine({ engine, mode, status }: { engine: Engine; mode: GenerateMode; status: GeneratorStatus }) {
  const detail = useStageDetail(status.kind === "composing" ? status.stage : null);
  let icon: ReactNode;
  let text: ReactNode;

  if (status.kind === "composing") {
    icon = <LoaderCircle size={12} strokeWidth={2} className="animate-spin text-[var(--shell-text-muted)]" />;
    text = (
      <>
        <span className="font-mono text-[10.5px] tabular-nums text-[var(--shell-text-muted)]">
          {status.stage + 1}/{LOCAL_STAGES.length}
        </span>
        <span className="text-[var(--shell-text-subtle)]"> · {detail}</span>
      </>
    );
  } else if (status.kind === "streaming") {
    icon = <LoaderCircle size={12} strokeWidth={2} className="animate-spin text-[var(--shell-accent)]" />;
    text = (
      <>
        <span className="text-[var(--shell-text-muted)]">
          {status.tokens > 0 ? "Streaming tokens" : "Waiting for Claude"}
        </span>
        <span className="text-[var(--shell-text-subtle)]"> · Esc to stop</span>
      </>
    );
  } else if (status.kind === "saved") {
    icon = <Check size={12} strokeWidth={2.25} className="text-[var(--shell-success)]" />;
    text = <span className="text-[var(--shell-text-muted)]">Saved to recent themes</span>;
  } else if (engine === "local") {
    icon = (
      <span className="relative inline-flex size-1.5">
        <span className="absolute inset-0 rounded-full bg-[var(--shell-success)] opacity-60 motion-safe:animate-ping [animation-duration:2.4s]" />
        <span className="relative size-1.5 rounded-full bg-[var(--shell-success)]" />
      </span>
    );
    text = (
      <>
        <span className="text-[var(--shell-text-muted)]">Live</span>
        <span className="text-[var(--shell-text-subtle)]">
          {" "}
          · updates as you {mode === "color" ? "pick" : "type"}
        </span>
      </>
    );
  } else {
    icon = <Sparkles size={12} strokeWidth={1.75} className="text-[var(--shell-text-subtle)]" />;
    text = <span className="text-[var(--shell-text-subtle)]">Claude Sonnet · about 10–20 seconds</span>;
  }

  return (
    <p
      role="status"
      aria-live="polite"
      className="flex h-[18px] items-center gap-2 overflow-hidden whitespace-nowrap text-[11.5px] leading-[18px]"
    >
      <span aria-hidden className="flex size-3 shrink-0 items-center justify-center">
        {icon}
      </span>
      <span className="truncate">{text}</span>
    </p>
  );
}

function FailureCard({
  failure,
  onRetry,
  onUseInstant,
  onDismiss,
}: {
  failure: GeneratorFailure;
  onRetry: () => void;
  onUseInstant: () => void;
  onDismiss: () => void;
}) {
  const missingKey = failure.code === "missing_api_key";
  const Icon = missingKey ? KeyRound : TriangleAlert;

  return (
    <div
      role="alert"
      className="shell-panel-in rounded-[var(--shell-radius)] border border-[rgba(248,113,113,0.22)] bg-[rgba(248,113,113,0.05)] p-3"
    >
      <div className="flex items-start gap-2.5">
        <span className="mt-px flex size-6 shrink-0 items-center justify-center rounded-[6px] bg-[rgba(248,113,113,0.12)] text-[var(--shell-danger)]">
          <Icon size={13} strokeWidth={1.75} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[12.5px] font-medium leading-[18px] tracking-[-0.005em] text-[var(--shell-text)]">
            {missingKey ? "Claude AI isn't set up on this server" : "Claude couldn't finish this theme"}
          </p>
          <p className="mt-1 text-[12px] leading-[18px] text-[var(--shell-text-muted)]">
            {missingKey ? (
              <>
                Add <code className="rounded-[4px] bg-white/[0.06] px-1 py-px font-mono text-[11px] text-[var(--shell-text)]">ANTHROPIC_API_KEY</code>{" "}
                to <code className="font-mono text-[11px]">.env.local</code> and restart. The Instant engine needs no key.
              </>
            ) : (
              failure.message
            )}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="primary" size="sm" icon={Zap} onClick={onUseInstant}>
              Use Instant engine
            </Button>
            {!missingKey && (
              <Button size="sm" onClick={onRetry}>
                Try again
              </Button>
            )}
          </div>
        </div>
        <IconButton icon={X} label="Dismiss" size="sm" tooltip={false} onClick={onDismiss} className="-mr-1 -mt-1" />
      </div>
    </div>
  );
}

interface GenerateBarProps {
  engine: Engine;
  mode: GenerateMode;
  status: GeneratorStatus;
  failure: GeneratorFailure | null;
  onGenerate: () => void;
  onCancel: () => void;
  onShuffle: () => void;
  onUseInstant: () => void;
  onDismissFailure: () => void;
}

export default function GenerateBar({
  engine,
  mode,
  status,
  failure,
  onGenerate,
  onCancel,
  onShuffle,
  onUseInstant,
  onDismissFailure,
}: GenerateBarProps) {
  const isMac = useIsMac();
  const composing = status.kind === "composing";
  const streaming = status.kind === "streaming";
  const progress = composing ? (status.stage + 1) / LOCAL_STAGES.length : 0;

  let label: ReactNode;
  if (composing) {
    label = (
      <>
        <LoaderCircle size={14} strokeWidth={2} aria-hidden className="animate-spin" />
        <span>{LOCAL_STAGES[status.stage]}…</span>
      </>
    );
  } else if (streaming) {
    label = (
      <>
        <LoaderCircle size={14} strokeWidth={2} aria-hidden className="animate-spin" />
        <span>Designing…</span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-black/55">
          <Square size={10} strokeWidth={0} fill="currentColor" aria-hidden />
          Stop
        </span>
      </>
    );
  } else {
    label = (
      <>
        {engine === "local" ? (
          <Zap size={14} strokeWidth={1.75} aria-hidden />
        ) : (
          <Sparkles size={14} strokeWidth={1.75} aria-hidden />
        )}
        <span>{engine === "local" ? "Generate" : "Generate with Claude"}</span>
        <span className="ml-auto">
          <ShortcutHint isMac={isMac} />
        </span>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={streaming ? onCancel : onGenerate}
          aria-busy={composing || streaming}
          aria-keyshortcuts={streaming ? "Escape" : isMac ? "Meta+Enter" : "Control+Enter"}
          className={buttonClass(
            "primary",
            "lg",
            cn("relative flex min-w-0 flex-1 justify-start overflow-hidden tracking-[-0.01em]", composing && "cursor-progress"),
          )}
        >
          {label}
          <span
            aria-hidden
            className={cn(
              "absolute inset-x-0 bottom-0 h-[2px] origin-left bg-[#08080b]/70 transition-[transform,opacity] duration-200 ease-out",
              composing ? "opacity-100" : "opacity-0",
            )}
            style={{ transform: `scaleX(${progress})` }}
          />
        </button>
        {engine === "local" && (
          <Tooltip content="Shuffle for a fresh take" shortcut="S" side="top" align="end">
            <IconButton
              icon={Shuffle}
              label="Shuffle for a fresh take"
              shortcut="S"
              variant="outline"
              tooltip={false}
              onClick={onShuffle}
              className="size-9 rounded-[var(--shell-radius)]"
            />
          </Tooltip>
        )}
      </div>
      <StatusLine engine={engine} mode={mode} status={status} />
      {failure && (
        <FailureCard failure={failure} onRetry={onGenerate} onUseInstant={onUseInstant} onDismiss={onDismissFailure} />
      )}
    </div>
  );
}
