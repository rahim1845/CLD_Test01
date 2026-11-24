"use client";

import type { CSSProperties } from "react";
import type { ThemeTokens } from "@/types/theme";
import { cn } from "@/components/ui/cn";
import {
  FAMILY_KEYS,
  LINE_HEIGHT_KEYS,
  SIZE_KEYS,
  TRACKING_KEYS,
  WEIGHT_KEYS,
  cssVar,
  isGenericFamily,
  primaryFamily,
  toPx,
} from "@/components/exports/tokenModel";
import { CopyGlyph, HAIRLINE_GRID, MONO, SubHeading, TokenName, cellButton, useCopy } from "./shared";

type Typography = ThemeTokens["typography"];
type Family = (typeof FAMILY_KEYS)[number];

const FAMILY_META: Record<Family, { label: string; sample: string; glyphs: string }> = {
  display: { label: "Display", sample: "Headlines with presence", glyphs: "Ag" },
  body: { label: "Body", sample: "The quick brown fox jumps over the lazy dog", glyphs: "Ag" },
  mono: { label: "Mono", sample: "const theme = forge(seed);", glyphs: "{0}" },
};

const weight = (t: Typography, key: keyof Typography["fontWeight"], fallback: number) => Number(t.fontWeight[key]) || fallback;

function FamilyCard({ role, t }: { role: Family; t: Typography }) {
  const { copy, copiedKey } = useCopy();
  const stack = t.fontFamily[role];
  const name = cssVar(["font", "family", role]);
  const family = primaryFamily(stack);
  const meta = FAMILY_META[role];
  const copied = copiedKey === name;
  const face: CSSProperties = { fontFamily: stack };

  return (
    <button
      type="button"
      onClick={() => copy(stack, name)}
      aria-label={`Copy ${name}: ${stack}`}
      className={cn(
        "group/row flex min-w-0 flex-col overflow-hidden rounded-[var(--shell-radius-lg)] border border-[var(--shell-border)] bg-[var(--shell-panel)] text-left",
        "outline-none transition-colors duration-150 hover:border-[var(--shell-border-strong)]",
        "focus-visible:ring-2 focus-visible:ring-[var(--shell-accent)]",
      )}
    >
      <span className="flex items-center justify-between gap-3 px-4 pt-3.5">
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--shell-text-subtle)]">{meta.label}</span>
        <span className="flex min-w-0 items-center gap-2">
          <TokenName className="truncate text-[var(--shell-text-subtle)]">{name}</TokenName>
          <CopyGlyph copied={copied} />
        </span>
      </span>
      <span className="flex items-end justify-between gap-4 px-4 pb-4 pt-5">
        <span
          aria-hidden
          className="text-[64px] leading-[0.9] tracking-[-0.02em] text-[var(--shell-text)]"
          style={{ ...face, fontWeight: role === "display" ? weight(t, "bold", 700) : weight(t, "regular", 400) }}
        >
          {meta.glyphs}
        </span>
      </span>
      <span className="px-4">
        <span className="block truncate text-[15px] font-medium tracking-[-0.01em] text-[var(--shell-text)]">
          {family}
          {isGenericFamily(family) && <span className="ml-2 text-[12px] font-normal text-[var(--shell-text-subtle)]">system</span>}
        </span>
        <span title={stack} className={cn(MONO, "mt-1 block truncate text-[11px] text-[var(--shell-text-subtle)]")}>
          {stack}
        </span>
      </span>
      <span
        className="mt-4 block truncate border-t border-[var(--shell-border)] px-4 py-3 text-[14px] text-[var(--shell-text-muted)]"
        style={{ ...face, fontWeight: role === "display" ? weight(t, "semibold", 600) : undefined }}
      >
        {meta.sample}
      </span>
    </button>
  );
}

function ScaleRow({ sizeKey, t }: { sizeKey: (typeof SIZE_KEYS)[number]; t: Typography }) {
  const { copy, copiedKey } = useCopy();
  const value = t.fontSize[sizeKey];
  const name = cssVar(["font", "size", sizeKey]);
  const px = toPx(value);
  const big = px !== null ? px >= 20 : SIZE_KEYS.indexOf(sizeKey) >= 6;
  const leadingKey = big ? (px !== null && px >= 30 ? "tight" : "snug") : "normal";
  const copied = copiedKey === name;

  return (
    <button type="button" onClick={() => copy(value, name)} aria-label={`Copy ${name}: ${value}`} className={cellButton("grid grid-cols-[136px_minmax(0,1fr)_auto] items-center gap-6 px-5 py-3.5")}>
      <span className="flex flex-col gap-1">
        <span className="flex items-baseline gap-2">
          <code className={cn(MONO, "text-[12px] text-[var(--shell-text)]")}>{sizeKey}</code>
          <span className={cn(MONO, "text-[11px] tabular-nums text-[var(--shell-text-muted)]")}>{value}</span>
        </span>
        <span className={cn(MONO, "text-[10.5px] tabular-nums text-[var(--shell-text-subtle)]")}>
          {px !== null && `${Number((px / 16).toFixed(3))}rem · `}lh {t.lineHeight[leadingKey]}
        </span>
      </span>
      <span
        className="min-w-0 truncate text-[var(--shell-text)]"
        style={{
          fontFamily: big ? t.fontFamily.display : t.fontFamily.body,
          fontSize: value,
          lineHeight: t.lineHeight[leadingKey],
          fontWeight: big ? weight(t, "semibold", 600) : weight(t, "regular", 400),
          letterSpacing: big ? t.letterSpacing.tight : t.letterSpacing.normal,
        }}
      >
        {px !== null && px >= 44 ? "Systems that scale" : big ? "Forge a system that scales" : "The quick brown fox jumps over the lazy dog"}
      </span>
      <CopyGlyph copied={copied} />
    </button>
  );
}

function stepRatio(t: Typography): number | null {
  const first = toPx(t.fontSize.base);
  const last = toPx(t.fontSize["6xl"]);
  if (!first || !last) return null;
  const steps = SIZE_KEYS.length - 1 - SIZE_KEYS.indexOf("base");
  return Math.pow(last / first, 1 / steps);
}

function WeightCell({ k, t }: { k: (typeof WEIGHT_KEYS)[number]; t: Typography }) {
  const { copy, copiedKey } = useCopy();
  const name = cssVar(["font", "weight", k]);
  const copied = copiedKey === name;
  return (
    <button
      type="button"
      onClick={() => copy(t.fontWeight[k], name)}
      aria-label={`Copy ${name}: ${t.fontWeight[k]}`}
      className={cellButton("flex flex-col gap-4 px-4 pb-3.5 pt-4")}
    >
      <span
        aria-hidden
        className="text-[40px] leading-none tracking-[-0.01em] text-[var(--shell-text)]"
        style={{ fontFamily: t.fontFamily.display, fontWeight: Number(t.fontWeight[k]) || t.fontWeight[k] }}
      >
        Aa
      </span>
      <span className="flex items-end justify-between gap-2">
        <span className="flex flex-col gap-0.5">
          <span className="text-[12.5px] font-medium capitalize text-[var(--shell-text)]">{k}</span>
          <span className={cn(MONO, "text-[11px] tabular-nums text-[var(--shell-text-subtle)]")}>{t.fontWeight[k]}</span>
        </span>
        <CopyGlyph copied={copied} />
      </span>
    </button>
  );
}

function LineHeightCard({ k, t }: { k: (typeof LINE_HEIGHT_KEYS)[number]; t: Typography }) {
  const { copy, copiedKey } = useCopy();
  const name = cssVar(["lineHeight", k]);
  const value = t.lineHeight[k];
  const size = toPx(t.fontSize.sm) ?? 13;
  const ratio = Number(value);
  const linePx = Number.isFinite(ratio) && ratio > 0 ? size * ratio : null;
  const copied = copiedKey === name;
  return (
    <button
      type="button"
      onClick={() => copy(value, name)}
      aria-label={`Copy ${name}: ${value}`}
      className={cellButton("flex min-w-0 flex-col gap-3 px-4 pb-4 pt-3.5")}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="flex items-baseline gap-2">
          <span className="text-[12.5px] font-medium capitalize text-[var(--shell-text)]">{k}</span>
          <span className={cn(MONO, "text-[11px] tabular-nums text-[var(--shell-text-subtle)]")}>{value}</span>
        </span>
        <CopyGlyph copied={copied} />
      </span>
      <span
        className="line-clamp-4 text-[var(--shell-text-muted)]"
        style={{
          fontFamily: t.fontFamily.body,
          fontSize: `${size}px`,
          lineHeight: value,
          backgroundImage: linePx
            ? `repeating-linear-gradient(to bottom, transparent 0 ${linePx - 1}px, rgba(139,124,255,0.16) ${linePx - 1}px ${linePx}px)`
            : undefined,
        }}
      >
        Good type sets a rhythm the eye can follow, so long passages read without effort.
      </span>
    </button>
  );
}

function TrackingRow({ k, t }: { k: (typeof TRACKING_KEYS)[number]; t: Typography }) {
  const { copy, copiedKey } = useCopy();
  const name = cssVar(["letterSpacing", k]);
  const value = t.letterSpacing[k];
  const wide = k === "wide" || k === "wider" || k === "widest";
  const copied = copiedKey === name;
  return (
    <button type="button" onClick={() => copy(value, name)} aria-label={`Copy ${name}: ${value}`} className={cellButton("grid grid-cols-[136px_minmax(0,1fr)_auto] items-center gap-6 px-5 py-3")}>
      <span className="flex items-baseline gap-2">
        <code className={cn(MONO, "text-[12px] text-[var(--shell-text)]")}>{k}</code>
        <span className={cn(MONO, "text-[11px] tabular-nums text-[var(--shell-text-muted)]")}>{value}</span>
      </span>
      <span
        className="truncate text-[var(--shell-text)]"
        style={
          wide
            ? { fontFamily: t.fontFamily.body, fontSize: "12px", fontWeight: weight(t, "semibold", 600), textTransform: "uppercase", letterSpacing: value }
            : { fontFamily: t.fontFamily.display, fontSize: "22px", fontWeight: weight(t, "semibold", 600), letterSpacing: value, lineHeight: 1.2 }
        }
      >
        {wide ? "Overline and label text" : "Headline tracking"}
      </span>
      <CopyGlyph copied={copied} />
    </button>
  );
}

export default function TypographySection({ theme }: { theme: ThemeTokens }) {
  const t = theme.typography;
  const ratio = stepRatio(t);
  const sizes = [...SIZE_KEYS].reverse();

  return (
    <>
      <div>
        <SubHeading>Families</SubHeading>
        <div className="grid gap-3 @3xl:grid-cols-3">
          {FAMILY_KEYS.map((role) => (
            <FamilyCard key={role} role={role} t={t} />
          ))}
        </div>
      </div>

      <div>
        <SubHeading
          aside={
            <span className={cn(MONO, "hidden tabular-nums @xl:inline")}>
              {SIZE_KEYS.length} steps{ratio ? ` · ×${ratio.toFixed(2)} per step above base` : ""}
            </span>
          }
        >
          Type scale
        </SubHeading>
        <div className={HAIRLINE_GRID}>
          {sizes.map((k) => (
            <ScaleRow key={k} sizeKey={k} t={t} />
          ))}
        </div>
      </div>

      <div>
        <SubHeading aside={<TokenName className="text-[var(--shell-text-subtle)]">--font-weight-*</TokenName>}>Weights</SubHeading>
        <div className={cn(HAIRLINE_GRID, "grid-cols-2 @xl:grid-cols-3 @4xl:grid-cols-6")}>
          {WEIGHT_KEYS.map((k) => (
            <WeightCell key={k} k={k} t={t} />
          ))}
        </div>
      </div>

      <div>
        <SubHeading aside={<TokenName className="text-[var(--shell-text-subtle)]">--line-height-*</TokenName>}>Line height</SubHeading>
        <div className={cn(HAIRLINE_GRID, "grid-cols-1 @4xl:grid-cols-5")}>
          {LINE_HEIGHT_KEYS.map((k) => (
            <LineHeightCard key={k} k={k} t={t} />
          ))}
        </div>
      </div>

      <div>
        <SubHeading aside={<TokenName className="text-[var(--shell-text-subtle)]">--letter-spacing-*</TokenName>}>Letter spacing</SubHeading>
        <div className={HAIRLINE_GRID}>
          {TRACKING_KEYS.map((k) => (
            <TrackingRow key={k} k={k} t={t} />
          ))}
        </div>
      </div>
    </>
  );
}
