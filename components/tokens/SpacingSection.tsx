"use client";

import type { ThemeTokens } from "@/types/theme";
import { withAlpha } from "@/lib/modePalette";
import { cn } from "@/components/ui/cn";
import { RADIUS_KEYS, SPACING_KEYS, cssVar, toPx } from "@/components/exports/tokenModel";
import { CopyGlyph, HAIRLINE_GRID, MONO, SubHeading, TokenName, cellButton, useCopy } from "./shared";

/** Measurements are annotations, not theme content, so they are drawn in the shell accent (--shell-accent). */
const INK = "#8b7cff";

function SpacingRow({ k, value, max, ink }: { k: string; value: string; max: number; ink: string }) {
  const { copy, copiedKey } = useCopy();
  const name = cssVar(["spacing", k]);
  const px = toPx(value);
  const pct = px !== null && max > 0 ? (px / max) * 100 : 0;
  const copied = copiedKey === name;

  return (
    <button
      type="button"
      onClick={() => copy(value, name)}
      aria-label={`Copy ${name}: ${value}`}
      className={cellButton("grid h-11 grid-cols-[minmax(108px,136px)_96px_minmax(0,1fr)_auto] items-center gap-4 px-5 @xl:gap-6")}
    >
      <code className={cn(MONO, "truncate text-[12px] text-[var(--shell-text)]")}>{name}</code>
      <span className={cn(MONO, "text-[11px] tabular-nums text-[var(--shell-text-muted)]")}>
        {value}
        {px !== null && px > 0 && <span className="text-[var(--shell-text-subtle)]"> · {Number((px / 16).toFixed(3))}rem</span>}
      </span>
      <span className="relative flex h-4 items-center">
        {pct > 0 ? (
          <span
            className="h-3 rounded-[2px]"
            style={{
              width: `${Math.max(pct, 0.6)}%`,
              backgroundImage: `repeating-linear-gradient(-45deg, ${withAlpha(ink, 0.42)} 0 1.5px, ${withAlpha(ink, 0.1)} 1.5px 5px)`,
              boxShadow: `inset 0 0 0 1px ${withAlpha(ink, 0.7)}`,
            }}
          />
        ) : (
          <span className="h-3 w-px" style={{ background: withAlpha(ink, 0.7) }} />
        )}
      </span>
      <CopyGlyph copied={copied} />
    </button>
  );
}

export function SpacingSection({ theme }: { theme: ThemeTokens }) {
  const entries = SPACING_KEYS.map((k) => ({ k: String(k), value: theme.spacing[k] }));
  const max = Math.max(...entries.map((e) => toPx(e.value) ?? 0));
  const base = toPx(theme.spacing[1]);

  return (
    <div>
      <SubHeading
        aside={
          <span className={cn(MONO, "hidden tabular-nums @xl:inline")}>
            {base ? `${base}px base unit · ` : ""}bars scaled to {max}px
          </span>
        }
      >
        Scale
      </SubHeading>
      <div className={HAIRLINE_GRID}>
        {entries.map((e) => (
          <SpacingRow key={e.k} k={e.k} value={e.value} max={max} ink={INK} />
        ))}
      </div>
    </div>
  );
}

function RadiusTile({ k, value, ink }: { k: string; value: string; ink: string }) {
  const { copy, copiedKey } = useCopy();
  const name = cssVar(["radius", k]);
  const copied = copiedKey === name;
  return (
    <button
      type="button"
      onClick={() => copy(value, name)}
      aria-label={`Copy ${name}: ${value}`}
      className={cellButton("flex flex-col items-start gap-4 px-4 pb-3.5 pt-4")}
    >
      <span
        aria-hidden
        className="size-16 transition-transform duration-200 ease-out group-hover/row:scale-[1.04]"
        style={{
          borderRadius: value,
          background: `linear-gradient(160deg, ${withAlpha(ink, 0.26)}, ${withAlpha(ink, 0.08)})`,
          boxShadow: `inset 0 0 0 1.5px ${withAlpha(ink, 0.85)}`,
        }}
      />
      <span className="flex w-full items-end justify-between gap-1">
        <span className="flex min-w-0 flex-col gap-0.5">
          <code className={cn(MONO, "truncate text-[12px] text-[var(--shell-text)]")}>{k}</code>
          <span className={cn(MONO, "truncate text-[11px] tabular-nums text-[var(--shell-text-subtle)]")}>{value}</span>
        </span>
        <CopyGlyph copied={copied} />
      </span>
    </button>
  );
}

export function RadiusSection({ theme }: { theme: ThemeTokens }) {
  return (
    <div>
      <SubHeading aside={<TokenName className="text-[var(--shell-text-subtle)]">--radius-*</TokenName>}>Corners</SubHeading>
      <div className={cn(HAIRLINE_GRID, "grid-cols-3 @3xl:grid-cols-9")}>
        {RADIUS_KEYS.map((k) => (
          <RadiusTile key={k} k={k} value={theme.radius[k]} ink={INK} />
        ))}
      </div>
    </div>
  );
}
