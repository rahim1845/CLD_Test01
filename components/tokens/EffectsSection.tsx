"use client";

import { useMemo } from "react";
import { Moon, Sun } from "lucide-react";
import type { ThemeTokens } from "@/types/theme";
import { getModePalette, type ModePalette } from "@/lib/modePalette";
import { cn } from "@/components/ui/cn";
import { BLUR_KEYS, SHADOW_KEYS, Z_KEYS, asNumber, cssVar } from "@/components/exports/tokenModel";
import { CopyGlyph, HAIRLINE_GRID, MONO, SubHeading, cellButton, useCopy } from "./shared";

/* ---------- Shadows ---------- */

function ShadowCard({ k, value, palette, radius }: { k: string; value: string; palette: ModePalette; radius: string }) {
  const { copy } = useCopy();
  const name = cssVar(["shadow", k]);
  return (
    <button
      type="button"
      onClick={() => copy(value, name)}
      title={`${name}: ${value}`}
      aria-label={`Copy ${name}: ${value}`}
      className="group/card flex h-[92px] min-w-0 flex-col justify-end p-3 text-left outline-none transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[var(--shell-accent)]"
      style={{
        background: palette.surface,
        borderRadius: radius,
        boxShadow: value,
        border: k === "none" ? `1px dashed ${palette.border}` : undefined,
      }}
    >
      <span className={cn(MONO, "text-[11.5px] font-medium")} style={{ color: palette.text }}>
        {k}
      </span>
    </button>
  );
}

function ShadowStage({ theme, dark }: { theme: ThemeTokens; dark: boolean }) {
  const palette = useMemo(() => getModePalette(theme, dark), [theme, dark]);
  return (
    <div className="overflow-hidden rounded-[var(--shell-radius-lg)] border border-[var(--shell-border)]">
      <div className="flex h-9 items-center gap-2 border-b border-[var(--shell-border)] bg-[var(--shell-panel)] px-4 text-[12px] font-medium text-[var(--shell-text-muted)]">
        {dark ? <Moon size={13} strokeWidth={1.75} aria-hidden /> : <Sun size={13} strokeWidth={1.75} aria-hidden />}
        On {dark ? "dark" : "light"} surface
      </div>
      <div className="grid grid-cols-2 gap-5 p-6 @xl:grid-cols-4 @5xl:grid-cols-8 @5xl:gap-4" style={{ background: palette.background }}>
        {SHADOW_KEYS.map((k) => (
          <ShadowCard key={k} k={k} value={theme.shadow[k]} palette={palette} radius={theme.radius.lg} />
        ))}
      </div>
    </div>
  );
}

function ShadowValueRow({ k, value }: { k: string; value: string }) {
  const { copy, copiedKey } = useCopy();
  const name = cssVar(["shadow", k]);
  return (
    <button
      type="button"
      onClick={() => copy(value, name)}
      aria-label={`Copy ${name}: ${value}`}
      className={cellButton("grid grid-cols-[minmax(110px,136px)_minmax(0,1fr)_auto] items-center gap-6 px-5 py-2.5")}
    >
      <code className={cn(MONO, "text-[12px] text-[var(--shell-text)]")}>{name}</code>
      <span className={cn(MONO, "break-words text-[11.5px] leading-5 text-[var(--shell-text-muted)]")}>{value}</span>
      <CopyGlyph copied={copiedKey === name} />
    </button>
  );
}

export function ShadowSection({ theme }: { theme: ThemeTokens }) {
  return (
    <>
      <div>
        <SubHeading aside={<span className="hidden @2xl:inline">Cards use --radius-lg</span>}>Elevation</SubHeading>
        <div className="space-y-3">
          <ShadowStage theme={theme} dark={false} />
          <ShadowStage theme={theme} dark />
        </div>
      </div>
      <div>
        <SubHeading>Values</SubHeading>
        <div className={HAIRLINE_GRID}>
          {SHADOW_KEYS.map((k) => (
            <ShadowValueRow key={k} k={k} value={theme.shadow[k]} />
          ))}
        </div>
      </div>
    </>
  );
}

/* ---------- Blur ---------- */

function BlurTile({ k, value, palette }: { k: string; value: string; palette: ModePalette }) {
  const { copy, copiedKey } = useCopy();
  const name = cssVar(["blur", k]);
  const filter = /^0(px|rem|em)?$/.test(value.trim()) ? "none" : `blur(${value})`;
  return (
    <button
      type="button"
      onClick={() => copy(value, name)}
      aria-label={`Copy ${name}: ${value}`}
      className={cellButton("flex flex-col")}
    >
      <span aria-hidden className="relative block h-[128px] overflow-hidden" style={{ background: palette.background }}>
        <span className="absolute -left-3 top-3 size-16 rounded-full" style={{ background: palette.primary }} />
        <span className="absolute right-2 top-6 size-11 rotate-12 rounded-[10px]" style={{ background: palette.accent }} />
        <span
          className="absolute left-12 top-9 text-[34px] font-bold leading-none tracking-[-0.03em]"
          style={{ color: palette.text }}
        >
          Aa
        </span>
        <span className="absolute -bottom-4 left-8 size-12 rounded-full" style={{ background: palette.success }} />
        <span
          className="absolute inset-x-2.5 bottom-2.5 top-[58px] rounded-[10px] border border-white/15"
          style={{ backdropFilter: filter, WebkitBackdropFilter: filter, background: "rgba(255,255,255,0.06)" }}
        />
      </span>
      <span className="flex items-end justify-between gap-2 border-t border-[var(--shell-border)] px-3.5 pb-3 pt-2.5">
        <span className="flex min-w-0 flex-col gap-0.5">
          <code className={cn(MONO, "truncate text-[12px] text-[var(--shell-text)]")}>{k}</code>
          <span className={cn(MONO, "truncate text-[11px] tabular-nums text-[var(--shell-text-subtle)]")}>{value}</span>
        </span>
        <CopyGlyph copied={copiedKey === name} />
      </span>
    </button>
  );
}

export function BlurSection({ theme }: { theme: ThemeTokens }) {
  const palette = useMemo(() => getModePalette(theme, true), [theme]);
  return (
    <div>
      <SubHeading aside={<span className="hidden @2xl:inline">backdrop-filter over the dark palette</span>}>Backdrop blur</SubHeading>
      <div className={cn(HAIRLINE_GRID, "grid-cols-2 @xl:grid-cols-3 @4xl:grid-cols-6")}>
        {BLUR_KEYS.map((k) => (
          <BlurTile key={k} k={k} value={theme.blur[k]} palette={palette} />
        ))}
      </div>
    </div>
  );
}

/* ---------- Z-index ---------- */

const Z_USAGE: Record<(typeof Z_KEYS)[number], string> = {
  hide: "Tucked behind its stacking context",
  auto: "Browser default stacking",
  base: "Page content",
  dropdown: "Menus, selects, comboboxes",
  sticky: "Sticky headers and toolbars",
  overlay: "Scrims behind modals and drawers",
  modal: "Dialogs and drawers",
  popover: "Popovers above dialogs",
  toast: "Notifications",
  tooltip: "Tooltips, always on top",
};

function ZRow({ k, value }: { k: (typeof Z_KEYS)[number]; value: string }) {
  const { copy, copiedKey } = useCopy();
  const name = cssVar(["zIndex", k]);
  return (
    <button
      type="button"
      onClick={() => copy(value, name)}
      aria-label={`Copy ${name}: ${value}`}
      className={cellButton("grid h-10 grid-cols-[minmax(150px,180px)_72px_minmax(0,1fr)_auto] items-center gap-4 px-5")}
    >
      <code className={cn(MONO, "truncate text-[12px] text-[var(--shell-text)]")}>{name}</code>
      <span className={cn(MONO, "text-right text-[12px] tabular-nums text-[var(--shell-text-muted)]")}>{value}</span>
      <span className="truncate pl-2 text-[12.5px] text-[var(--shell-text-subtle)]">{Z_USAGE[k]}</span>
      <CopyGlyph copied={copiedKey === name} />
    </button>
  );
}

function LayerStack({ theme }: { theme: ThemeTokens }) {
  const layers = Z_KEYS.filter((k) => {
    const n = asNumber(theme.zIndex[k]);
    return n !== null && n >= 0;
  })
    .map((k) => ({ k, n: asNumber(theme.zIndex[k]) as number }))
    .sort((a, b) => a.n - b.n);
  const step = 24;
  const last = layers.length - 1;

  return (
    <div
      aria-hidden
      className="relative flex items-center justify-center overflow-hidden rounded-[var(--shell-radius-lg)] border border-[var(--shell-border)] bg-[var(--shell-panel)] p-6"
    >
      <div className="relative" style={{ width: 168 + last * step, height: 40 + last * step }}>
        {layers.map(({ k, n }, i) => {
          const top = i === last;
          return (
            <div
              key={k}
              className="absolute flex h-10 w-[168px] items-end justify-between rounded-[8px] border px-3 pb-[5px]"
              style={{
                left: i * step,
                bottom: i * step,
                zIndex: i,
                background: top ? "#201d33" : `color-mix(in srgb, #1d1d25 ${Math.round((i / Math.max(1, last)) * 100)}%, #111115)`,
                borderColor: top ? "rgba(139,124,255,0.55)" : "rgba(255,255,255,0.1)",
                boxShadow: "0 8px 18px -10px rgba(0,0,0,0.9)",
              }}
            >
              <span className={cn(MONO, "text-[11px]", top ? "text-[var(--shell-text)]" : "text-[var(--shell-text-muted)]")}>{k}</span>
              <span className={cn(MONO, "text-[10.5px] tabular-nums text-[var(--shell-text-subtle)]")}>{n}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ZIndexSection({ theme }: { theme: ThemeTokens }) {
  return (
    <div className="grid items-stretch gap-4 @4xl:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
      <LayerStack theme={theme} />
      <div className={HAIRLINE_GRID}>
        {Z_KEYS.map((k) => (
          <ZRow key={k} k={k} value={theme.zIndex[k]} />
        ))}
      </div>
    </div>
  );
}
