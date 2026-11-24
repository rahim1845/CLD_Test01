"use client";

import { useMemo, type CSSProperties } from "react";
import { Check, Copy, Moon, Sun } from "lucide-react";
import type { ThemeTokens } from "@/types/theme";
import { contrast, getModePalette, readableOn, type ModePalette } from "@/lib/modePalette";
import { cn } from "@/components/ui/cn";
import {
  ROLE_GROUPS,
  SCALES,
  SEMANTIC_KEYS,
  STOPS,
  SURFACE_KEYS,
  TEXT_KEYS,
  cssVar,
  roleAliasResolver,
  roleVar,
  type RoleKey,
  type RoleSpec,
  type ScaleName,
} from "@/components/exports/tokenModel";
import { ContrastBadge, CopyGlyph, MONO, SubHeading, TokenName, cellButton, useCopy } from "./shared";

const SCALE_LABEL: Record<ScaleName, string> = { primary: "Primary", accent: "Accent", neutral: "Neutral" };

function Swatch({ stop, hex, name }: { stop: number; hex: string; name: string }) {
  const { copy, copiedKey } = useCopy();
  const ink = readableOn(hex, "#ffffff", "#000000");
  const copied = copiedKey === name;
  return (
    <button
      type="button"
      onClick={() => copy(hex, name)}
      aria-label={`Copy ${name}, ${hex}`}
      className="group/sw flex min-w-0 flex-col text-left outline-none"
    >
      <span
        className={cn(
          "relative block h-[76px] w-full rounded-[8px] ring-1 ring-inset ring-white/[0.07]",
          "transition-[transform,box-shadow] duration-150 ease-out group-hover/sw:-translate-y-0.5",
          "group-hover/sw:shadow-[0_10px_24px_-12px_rgba(0,0,0,0.8)]",
          "group-focus-visible/sw:outline group-focus-visible/sw:outline-2 group-focus-visible/sw:outline-offset-2 group-focus-visible/sw:outline-[var(--shell-accent)]",
        )}
        style={{ background: hex }}
      >
        <span className="absolute left-2 top-1.5 text-[11px] font-semibold tabular-nums" style={{ color: ink, opacity: 0.88 }}>
          {stop}
        </span>
        <span
          aria-hidden
          className={cn(
            "absolute right-1.5 top-1.5 transition-opacity duration-150",
            copied ? "opacity-100" : "opacity-0 group-hover/sw:opacity-70",
          )}
          style={{ color: ink }}
        >
          {copied ? <Check size={13} strokeWidth={2.25} /> : <Copy size={12} strokeWidth={1.75} />}
        </span>
      </span>
      <span
        className={cn(
          MONO,
          "mt-2 truncate text-[11px] leading-4 transition-colors duration-150",
          copied ? "text-[var(--shell-success)]" : "text-[var(--shell-text-muted)] group-hover/sw:text-[var(--shell-text)]",
        )}
      >
        {hex.toLowerCase()}
      </span>
      <span className="mt-1.5 flex flex-wrap gap-[3px]">
        <ContrastBadge compact fg="#ffffff" bg={hex} dot="#ffffff" subject="White text" />
        <ContrastBadge compact fg="#000000" bg={hex} dot="#000000" subject="Black text" />
      </span>
    </button>
  );
}

function ScaleRow({ scale, theme }: { scale: ScaleName; theme: ThemeTokens }) {
  const { copy, copiedKey } = useCopy();
  const values = theme.color[scale];
  const block = STOPS.map((s) => `${cssVar(["color", scale, String(s)])}: ${values[s]};`).join("\n");
  const blockName = `--color-${scale}-50 … 950`;
  const copied = copiedKey === blockName;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-baseline gap-3">
          <h4 className="text-[13px] font-medium tracking-[-0.005em] text-[var(--shell-text)]">{SCALE_LABEL[scale]}</h4>
          <TokenName className="truncate text-[var(--shell-text-subtle)]">--color-{scale}-*</TokenName>
        </div>
        <button
          type="button"
          onClick={() => copy(block, blockName)}
          className={cn(
            "inline-flex h-7 shrink-0 items-center gap-1.5 rounded-[var(--shell-radius-sm)] px-2 text-[12px] font-medium",
            "text-[var(--shell-text-subtle)] outline-none transition-colors duration-150",
            "hover:bg-[var(--shell-hover)] hover:text-[var(--shell-text)] focus-visible:ring-2 focus-visible:ring-[var(--shell-accent)]",
          )}
        >
          {copied ? (
            <Check size={14} strokeWidth={2} aria-hidden className="text-[var(--shell-success)]" />
          ) : (
            <Copy size={14} strokeWidth={1.75} aria-hidden />
          )}
          Copy as CSS
        </button>
      </div>
      <div className="-mx-1 -my-1 overflow-x-auto px-1 py-1">
        <div className="grid min-w-[760px] grid-cols-11 gap-2">
          {STOPS.map((stop) => (
            <Swatch key={stop} stop={stop} hex={values[stop]} name={cssVar(["color", scale, String(stop)])} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Light / dark specimens ---------- */

const PAIR_ROLES = ROLE_GROUPS.flatMap((g) => g.roles).filter((r): r is RoleSpec & { on: RoleKey } => !!r.on && r.key !== "textDisabled");

function passCount(p: ModePalette) {
  const passing = PAIR_ROLES.filter((r) => contrast(p[r.key], p[r.on]) >= (r.key === "textTertiary" ? 3 : 4.5)).length;
  return { passing, total: PAIR_ROLES.length };
}

function ModeSpecimen({ theme, palette, dark }: { theme: ThemeTokens; palette: ModePalette; dark: boolean }) {
  const t = theme.typography;
  const r = theme.radius;
  const { passing, total } = passCount(palette);
  const all = passing === total;
  const chip = (bg: string, fg: string): CSSProperties => ({
    background: bg,
    color: fg,
    borderRadius: r.full,
    fontSize: t.fontSize.xs,
    fontWeight: Number(t.fontWeight.medium) || 500,
  });
  const statuses = [
    { label: "Success", base: palette.success, soft: palette.successSoft, text: palette.successText },
    { label: "Warning", base: palette.warning, soft: palette.warningSoft, text: palette.warningText },
    { label: "Error", base: palette.error, soft: palette.errorSoft, text: palette.errorText },
    { label: "Info", base: palette.info, soft: palette.infoSoft, text: palette.infoText },
  ];

  return (
    <figure className="flex min-w-0 flex-col overflow-hidden rounded-[var(--shell-radius-lg)] border border-[var(--shell-border)] bg-[var(--shell-panel)]">
      <figcaption className="flex h-11 items-center justify-between gap-3 border-b border-[var(--shell-border)] px-4">
        <span className="flex items-center gap-2 text-[12.5px] font-medium text-[var(--shell-text)]">
          {dark ? <Moon size={14} strokeWidth={1.75} aria-hidden /> : <Sun size={14} strokeWidth={1.75} aria-hidden />}
          {dark ? "Dark" : "Light"}
        </span>
        <span
          title="Text, on-color and status text roles checked against their surfaces"
          className={cn(
            "inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-[11.5px] font-medium",
            all ? "bg-[rgba(62,207,142,0.1)] text-[#7ee0b5]" : "bg-[rgba(255,255,255,0.05)] text-[var(--shell-text-muted)]",
          )}
        >
          {all && <Check size={12} strokeWidth={2.25} aria-hidden />}
          {passing}/{total} pairs pass AA
        </span>
      </figcaption>

      <div className="flex-1 p-5" style={{ background: palette.background, fontFamily: t.fontFamily.body }}>
        <div className="p-4" style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: r.xl }}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p
                className="truncate leading-tight"
                style={{
                  color: palette.text,
                  fontFamily: t.fontFamily.display,
                  fontSize: t.fontSize.lg,
                  fontWeight: Number(t.fontWeight.semibold) || 600,
                  letterSpacing: t.letterSpacing.tight,
                }}
              >
                Quarterly report
              </p>
              <p className="mt-1 truncate" style={{ color: palette.textSecondary, fontSize: t.fontSize.sm }}>
                Revenue grew 24% across every region.
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 px-2 py-0.5" style={chip(palette.successSoft, palette.successText)}>
              <span className="size-1.5 rounded-full" style={{ background: palette.success }} />
              On track
            </span>
          </div>
          <div className="my-3.5 h-px" style={{ background: palette.borderSubtle }} />
          <div className="flex flex-wrap items-center gap-2" style={{ fontSize: t.fontSize.sm }}>
            <span
              className="inline-flex h-8 items-center px-3"
              style={{ background: palette.primary, color: palette.onPrimary, borderRadius: r.md, fontWeight: Number(t.fontWeight.medium) || 500 }}
            >
              Publish
            </span>
            <span
              className="inline-flex h-8 items-center px-3"
              style={{
                background: palette.surfaceRaised,
                color: palette.text,
                border: `1px solid ${palette.border}`,
                borderRadius: r.md,
                fontWeight: Number(t.fontWeight.medium) || 500,
              }}
            >
              Preview
            </span>
            <span className="inline-flex items-center px-2 py-0.5" style={chip(palette.accentSoft, palette.accentText)}>
              Beta
            </span>
            <span className="ml-auto whitespace-nowrap" style={{ color: palette.textTertiary, fontSize: t.fontSize.xs }}>
              Edited 2m ago
            </span>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {statuses.map((s) => (
            <span key={s.label} className="inline-flex items-center gap-1.5 px-2 py-0.5" style={chip(s.soft, s.text)}>
              <span className="size-1.5 rounded-full" style={{ background: s.base }} />
              {s.label}
            </span>
          ))}
          <span className="inline-flex items-center px-2 py-0.5" style={chip(palette.primarySoft, palette.primaryText)}>
            Primary
          </span>
        </div>
      </div>
    </figure>
  );
}

/* ---------- Role table ---------- */

function RoleCell({
  role,
  palette,
  alias,
  mode,
}: {
  role: RoleSpec;
  palette: ModePalette;
  alias: string[] | null;
  mode: "light" | "dark";
}) {
  const { copy, copiedKey } = useCopy();
  const value = palette[role.key];
  const name = `${roleVar(role.key)} (${mode})`;
  const copied = copiedKey === name;
  return (
    <button
      type="button"
      onClick={() => copy(value, name)}
      aria-label={`Copy ${mode} ${roleVar(role.key)}, ${value}`}
      className={cn(
        "group/cell flex h-full min-w-0 items-center gap-2.5 px-3 text-left outline-none transition-colors duration-150",
        "hover:bg-[rgba(255,255,255,0.025)] focus-visible:bg-[rgba(255,255,255,0.03)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--shell-accent)]",
      )}
    >
      <span
        aria-hidden
        className="size-[18px] shrink-0 rounded-[5px] ring-1 ring-inset ring-white/10"
        style={{ background: value }}
      />
      <span
        className={cn(
          MONO,
          "min-w-0 shrink truncate text-[11.5px]",
          copied ? "text-[var(--shell-success)]" : "text-[var(--shell-text-muted)] group-hover/cell:text-[var(--shell-text)]",
        )}
      >
        {value.startsWith("#") ? value.toLowerCase() : value.replace(/\s+/g, "")}
      </span>
      {alias && (
        <span title={`var(${cssVar(alias)})`} className={cn(MONO, "hidden min-w-0 truncate text-[11px] text-[var(--shell-text-subtle)] @4xl:inline")}>
          {cssVar(alias)}
        </span>
      )}
      <span className="ml-auto flex shrink-0 items-center">
        {role.on && (
          <ContrastBadge fg={value} bg={palette[role.on]} exempt={role.key === "textDisabled"} subject={`On ${roleVar(role.on)}`} />
        )}
      </span>
    </button>
  );
}

function RoleTable({ theme, light, dark }: { theme: ThemeTokens; light: ModePalette; dark: ModePalette }) {
  const alias = useMemo(() => roleAliasResolver(theme), [theme]);
  const grid = "grid grid-cols-[minmax(200px,1fr)_minmax(0,1fr)_minmax(0,1fr)]";

  return (
    <div className="overflow-x-auto rounded-[var(--shell-radius-lg)] border border-[var(--shell-border)] bg-[var(--shell-panel)]">
      <div className="min-w-[760px]" role="table" aria-label="Color roles in light and dark mode">
        <div role="row" className={cn(grid, "h-10 items-center border-b border-[var(--shell-border)] text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--shell-text-subtle)]")}>
          <span role="columnheader" className="px-4">Role</span>
          <span role="columnheader" className="flex items-center gap-1.5 border-l border-[var(--shell-border)] px-3">
            <Sun size={12} strokeWidth={1.75} aria-hidden /> Light
          </span>
          <span role="columnheader" className="flex items-center gap-1.5 border-l border-[var(--shell-border)] px-3">
            <Moon size={12} strokeWidth={1.75} aria-hidden /> Dark
          </span>
        </div>
        {ROLE_GROUPS.map((group) => (
          <div key={group.label} role="rowgroup">
            <div role="row" className="flex h-9 items-end border-b border-[var(--shell-border)] bg-[rgba(255,255,255,0.012)] px-4 pb-2">
              <span role="cell" className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--shell-text-subtle)]">
                {group.label}
              </span>
            </div>
            {group.roles.map((role) => (
              <div key={role.key} role="row" className={cn(grid, "h-9 border-b border-[var(--shell-border)] last:border-b-0")}>
                <div role="cell" className="flex min-w-0 items-center gap-3 px-4">
                  <code className={cn(MONO, "shrink-0 text-[12px] text-[var(--shell-text)]")}>{roleVar(role.key)}</code>
                  <span className="truncate text-[12px] text-[var(--shell-text-subtle)]">{role.description}</span>
                </div>
                <div role="cell" className="min-w-0 border-l border-[var(--shell-border)]">
                  <RoleCell role={role} palette={light} mode="light" alias={alias(role.key, light[role.key])} />
                </div>
                <div role="cell" className="min-w-0 border-l border-[var(--shell-border)]">
                  <RoleCell role={role} palette={dark} mode="dark" alias={alias(role.key, dark[role.key])} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Source tokens ---------- */

function SourceRow({ name, value }: { name: string; value: string }) {
  const { copy, copiedKey } = useCopy();
  const copied = copiedKey === name;
  return (
    <button
      type="button"
      onClick={() => copy(value, name)}
      aria-label={`Copy ${name}, ${value}`}
      className={cellButton("flex min-w-0 items-center gap-3 px-3.5 py-2.5")}
    >
      <span aria-hidden className="size-7 shrink-0 rounded-[6px] ring-1 ring-inset ring-white/10" style={{ background: value }} />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className={cn(MONO, "truncate text-[11.5px] text-[var(--shell-text)]")}>{name}</span>
        <span className={cn(MONO, "truncate text-[11px]", copied ? "text-[var(--shell-success)]" : "text-[var(--shell-text-subtle)]")}>
          {value.replace(/\s+/g, "")}
        </span>
      </span>
      <CopyGlyph copied={copied} />
    </button>
  );
}

function SourceColumn({ title, rows }: { title: string; rows: { name: string; value: string }[] }) {
  return (
    <div className="flex min-w-0 flex-col">
      <div className="flex h-9 items-center justify-between border-b border-[var(--shell-border)] bg-[var(--shell-panel)] px-3.5">
        <span className="text-[12px] font-medium text-[var(--shell-text-muted)]">{title}</span>
        <span className={cn(MONO, "text-[11px] tabular-nums text-[var(--shell-text-subtle)]")}>{rows.length}</span>
      </div>
      <div className="flex flex-1 flex-col gap-px bg-[var(--shell-border)]">
        {rows.map((r) => (
          <SourceRow key={r.name} name={r.name} value={r.value} />
        ))}
        <div className="flex-1 bg-[var(--shell-panel)]" />
      </div>
    </div>
  );
}

export default function ColorSection({ theme }: { theme: ThemeTokens }) {
  const light = useMemo(() => getModePalette(theme, false), [theme]);
  const dark = useMemo(() => getModePalette(theme, true), [theme]);
  const c = theme.color;
  const sources = [
    { title: "Semantic", rows: SEMANTIC_KEYS.map((k) => ({ name: cssVar(["color", "semantic", k]), value: c.semantic[k] })) },
    { title: "Surface", rows: SURFACE_KEYS.map((k) => ({ name: cssVar(["color", "surface", k]), value: c.surface[k] })) },
    { title: "Text", rows: TEXT_KEYS.map((k) => ({ name: cssVar(["color", "text", k]), value: c.text[k] })) },
  ];

  return (
    <>
      <div>
        <SubHeading
          aside={
            <span className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="size-[7px] rounded-full bg-white ring-1 ring-white/30" /> White text
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-[7px] rounded-full bg-black ring-1 ring-white/30" /> Black text
              </span>
              <span className="hidden items-center gap-1.5 @2xl:flex">
                <span className="h-2.5 w-3.5 rounded-[3px] bg-[rgba(62,207,142,0.25)]" /> AA 4.5:1
              </span>
            </span>
          }
        >
          Scales
        </SubHeading>
        <div className="space-y-8">
          {SCALES.map((scale) => (
            <ScaleRow key={scale} scale={scale} theme={theme} />
          ))}
        </div>
      </div>

      <div>
        <SubHeading aside={<span className="hidden @2xl:inline">Derived with contrast checks for each mode</span>}>Light and dark</SubHeading>
        <div className="grid gap-4 @3xl:grid-cols-2">
          <ModeSpecimen theme={theme} palette={light} dark={false} />
          <ModeSpecimen theme={theme} palette={dark} dark />
        </div>
      </div>

      <div>
        <SubHeading aside={<span className="hidden @2xl:inline">Click any value to copy</span>}>Roles</SubHeading>
        <RoleTable theme={theme} light={light} dark={dark} />
      </div>

      <div>
        <SubHeading aside={<span className="hidden @2xl:inline">Surface and text values describe the dark variant</span>}>Source tokens</SubHeading>
        <div className="grid gap-px overflow-hidden rounded-[var(--shell-radius-lg)] border border-[var(--shell-border)] bg-[var(--shell-border)] @3xl:grid-cols-3">
          {sources.map((col) => (
            <SourceColumn key={col.title} title={col.title} rows={col.rows} />
          ))}
        </div>
      </div>
    </>
  );
}
