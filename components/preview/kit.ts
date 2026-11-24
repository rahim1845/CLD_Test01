import type { CSSProperties } from "react";
import type { ThemeTokens } from "@/types/theme";
import { contrast, getModePalette, mix, parseHex, withAlpha } from "@/lib/modePalette";

type Typography = ThemeTokens["typography"];
export type SizeKey = keyof Typography["fontSize"];
export type WeightKey = keyof Typography["fontWeight"];
export type FontRole = keyof Typography["fontFamily"];

export interface ScreenProps {
  theme: ThemeTokens;
  dark: boolean;
}

export type Tone = "primary" | "accent" | "success" | "warning" | "error" | "info" | "neutral";

const SIZE_STEPS: SizeKey[] = ["xs", "sm", "base", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"];

/** Hover/press transition driven by the theme's own motion tokens. */
export const TX =
  "transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-[var(--pv-dur-fast)] ease-[var(--pv-ease)]";

function roundAlpha(a: number) {
  return Math.round(Math.min(1, Math.max(0, a)) * 1000) / 1000;
}

/**
 * Theme shadows are authored for the dark variant, where pure black reads well. On light
 * surfaces the same values look like smudges, so recolor them with the neutral ink and lighten them.
 */
function adaptShadow(value: string, ink: string, scale: number): string {
  const [r, g, b] = parseHex(ink);
  return value.replace(/rgba?\(([^)]*)\)/g, (match, body: string) => {
    const parts = body.split(/[\s,/]+/).filter(Boolean);
    if (parts.length < 3) return match;
    const raw = parts[3];
    const alpha = raw === undefined ? 1 : raw.endsWith("%") ? parseFloat(raw) / 100 : parseFloat(raw);
    if (Number.isNaN(alpha)) return match;
    return `rgba(${r},${g},${b},${roundAlpha(alpha * scale)})`;
  });
}

/** The first ink reaching AA on every stop wins, so a preferred light ink is kept whenever it is legible. */
function bestInk(stops: string[], candidates: string[]): string {
  const score = (c: string) => Math.min(...stops.map((s) => contrast(c, s)));
  return (
    candidates.find((c) => score(c) >= 4.5) ??
    candidates.reduce((best, c) => (score(c) > score(best) ? c : best), candidates[0])
  );
}

/** The first fill white text reads on at AA; the first candidate when none qualifies. */
function deepenForWhite(steps: string[]): string {
  return steps.find((c) => contrast("#ffffff", c) >= 4.5) ?? steps[0];
}

/**
 * Every preview screen paints exclusively from these custom properties, so a theme or
 * light/dark switch only swaps variables and never touches markup.
 */
export function previewVars(theme: ThemeTokens, dark: boolean): CSSProperties {
  const p = getModePalette(theme, dark);
  const { primary: P, accent: A, neutral: N } = theme.color;
  const t = theme.typography;

  // Brand surfaces carry white type wherever the hue allows it; light hues such as gold keep their vividness and get dark ink.
  const brandFrom = deepenForWhite([p.primary, P[600], P[700]]);
  const brandTo = mix(brandFrom, deepenForWhite([p.accent, A[600], A[700]]), 0.7);
  const danger = deepenForWhite([p.error, mix(p.error, "#000000", 0.12), mix(p.error, "#000000", 0.24)]);

  const vars: Record<string, string> = {
    "--pv-bg": p.background,
    "--pv-surface": p.surface,
    "--pv-raised": p.surfaceRaised,
    "--pv-sunken": p.surfaceSunken,
    "--pv-border": p.border,
    "--pv-border-subtle": p.borderSubtle,
    "--pv-overlay": p.overlay,
    "--pv-text": p.text,
    "--pv-text-2": p.textSecondary,
    "--pv-text-3": p.textTertiary,
    "--pv-text-disabled": p.textDisabled,
    "--pv-primary": p.primary,
    "--pv-primary-hover": p.primaryHover,
    "--pv-on-primary": p.onPrimary,
    "--pv-primary-soft": p.primarySoft,
    "--pv-primary-text": p.primaryText,
    "--pv-accent": p.accent,
    "--pv-accent-hover": p.accentHover,
    "--pv-on-accent": p.onAccent,
    "--pv-accent-soft": p.accentSoft,
    "--pv-accent-text": p.accentText,
    "--pv-success": p.success,
    "--pv-success-soft": p.successSoft,
    "--pv-success-text": p.successText,
    "--pv-warning": p.warning,
    "--pv-warning-soft": p.warningSoft,
    "--pv-warning-text": p.warningText,
    "--pv-error": p.error,
    "--pv-error-soft": p.errorSoft,
    "--pv-error-text": p.errorText,
    "--pv-info": p.info,
    "--pv-info-soft": p.infoSoft,
    "--pv-info-text": p.infoText,
    "--pv-neutral": dark ? N[500] : N[400],
    "--pv-neutral-soft": dark ? mix(p.surface, p.text, 0.08) : N[100],
    "--pv-neutral-text": p.textSecondary,
    "--pv-danger": danger,
    "--pv-on-danger": bestInk([danger], ["#ffffff", N[950]]),
    "--pv-field": dark ? mix(p.background, p.surface, 0.35) : p.surface,
    "--pv-hover": mix(p.surface, p.text, dark ? 0.06 : 0.04),
    "--pv-press": mix(p.surface, p.text, dark ? 0.1 : 0.07),
    "--pv-ring": withAlpha(p.primary, dark ? 0.45 : 0.28),
    "--pv-track": dark ? mix(p.surface, p.text, 0.14) : N[200],
    "--pv-grid": dark ? mix(p.surface, p.text, 0.09) : mix(p.surface, N[500], 0.14),
    "--pv-series-1": p.primary,
    "--pv-series-2": dark ? A[400] : A[500],
    "--pv-series-3": P[300],
    "--pv-series-4": dark ? N[600] : N[300],
    "--pv-series-faint": mix(p.surface, p.primary, dark ? 0.3 : 0.2),
    "--pv-brand-from": brandFrom,
    "--pv-brand-to": brandTo,
    "--pv-on-brand": bestInk([brandFrom, brandTo], ["#ffffff", N[950]]),
    "--pv-glow-1": withAlpha(p.primary, dark ? 0.32 : 0.2),
    "--pv-glow-2": withAlpha(p.accent, dark ? 0.24 : 0.16),
    "--pv-device": dark ? mix(mix(N[900], N[950], 0.5), "#ffffff", 0.1) : mix(N[950], "#000000", 0.55),
    "--pv-device-edge": dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.3)",
  };

  for (const role of ["display", "body", "mono"] as const) vars[`--pv-font-${role}`] = t.fontFamily[role];
  for (const [k, v] of Object.entries(t.fontSize)) vars[`--pv-fs-${k}`] = v;
  for (const [k, v] of Object.entries(t.fontWeight)) vars[`--pv-fw-${k}`] = v;
  for (const [k, v] of Object.entries(t.lineHeight)) vars[`--pv-lh-${k}`] = v;
  for (const [k, v] of Object.entries(t.letterSpacing)) vars[`--pv-ls-${k}`] = v;
  for (const [k, v] of Object.entries(theme.radius)) vars[`--pv-r-${k}`] = v;
  for (const [k, v] of Object.entries(theme.spacing)) vars[`--pv-sp-${k}`] = v;
  for (const [k, v] of Object.entries(theme.shadow)) {
    vars[`--pv-sh-${k}`] = dark ? v : adaptShadow(v, N[950], 0.42);
  }
  const { duration, easing } = theme.animation;
  vars["--pv-dur-fast"] = duration.fast;
  vars["--pv-dur"] = duration.normal;
  vars["--pv-dur-slow"] = duration.slow;
  vars["--pv-dur-slower"] = duration.slower;
  vars["--pv-ease"] = easing.easeOut;
  vars["--pv-ease-in-out"] = easing.easeInOut;
  vars["--pv-spring"] = easing.spring;

  return {
    ...vars,
    background: p.background,
    color: p.text,
    fontFamily: t.fontFamily.body,
    fontSize: t.fontSize.sm,
    lineHeight: t.lineHeight.normal,
    fontFeatureSettings: "normal",
    colorScheme: dark ? "dark" : "light",
  } as CSSProperties;
}

/** Typography from the theme scale: display sizes tighten leading and tracking the way type designers set them. */
export function type(size: SizeKey, weight: WeightKey = "regular", role: FontRole = "body"): CSSProperties {
  const step = SIZE_STEPS.indexOf(size);
  const leading = step >= 8 ? "tight" : step >= 5 ? "snug" : "normal";
  const tracking = role === "mono" ? "normal" : step >= 6 ? "tight" : "normal";
  return {
    fontFamily: `var(--pv-font-${role})`,
    fontSize: `var(--pv-fs-${size})`,
    fontWeight: `var(--pv-fw-${weight})`,
    lineHeight: `var(--pv-lh-${leading})`,
    letterSpacing: `var(--pv-ls-${tracking})`,
    ...(role === "mono" ? { fontVariantNumeric: "tabular-nums" } : null),
  };
}

export function eyebrow(tone: "muted" | "primary" = "muted"): CSSProperties {
  return {
    ...type("xs", "semibold"),
    letterSpacing: "var(--pv-ls-wider)",
    textTransform: "uppercase",
    color: tone === "primary" ? "var(--pv-primary-text)" : "var(--pv-text-3)",
  };
}

export const numeric: CSSProperties = { fontVariantNumeric: "tabular-nums" };

export const brandGradient = (angle = 135) => `linear-gradient(${angle}deg, var(--pv-brand-from), var(--pv-brand-to))`;

export const textGradient: CSSProperties = {
  backgroundImage: "linear-gradient(92deg, var(--pv-primary-text), var(--pv-accent-text))",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

export type Point = [number, number];

/** Maps a series into a 0-100 box (y grows downward) for viewBox-relative charts. */
export function toPoints(data: number[], min: number, max: number, inset = 0): Point[] {
  const span = max - min || 1;
  const last = Math.max(1, data.length - 1);
  return data.map((v, i) => [(i / last) * 100, inset + (1 - (v - min) / span) * (100 - inset * 2)]);
}

/** Monotone cubic interpolation (Fritsch-Carlson): smooth, but never overshoots the data. */
export function smoothPath(pts: Point[]): string {
  const n = pts.length;
  if (n === 0) return "";
  if (n === 1) return `M${pts[0][0]},${pts[0][1]}`;
  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx.push(pts[i + 1][0] - pts[i][0]);
    slope.push((pts[i + 1][1] - pts[i][1]) / (dx[i] || 1));
  }
  const tangent: number[] = [slope[0]];
  for (let i = 1; i < n - 1; i++) {
    const a = slope[i - 1];
    const b = slope[i];
    tangent.push(
      a * b <= 0 ? 0 : (3 * (dx[i - 1] + dx[i])) / ((2 * dx[i] + dx[i - 1]) / a + (dx[i] + 2 * dx[i - 1]) / b),
    );
  }
  tangent.push(slope[n - 2]);
  const f = (v: number) => Math.round(v * 100) / 100;
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C${f(pts[i][0] + h)},${f(pts[i][1] + tangent[i] * h)} ${f(pts[i + 1][0] - h)},${f(pts[i + 1][1] - tangent[i + 1] * h)} ${f(pts[i + 1][0])},${f(pts[i + 1][1])}`;
  }
  return d;
}

export function areaPath(pts: Point[], baseline = 100): string {
  if (pts.length === 0) return "";
  return `${smoothPath(pts)} L${pts[pts.length - 1][0]},${baseline} L${pts[0][0]},${baseline} Z`;
}

/** Keyframes shared by the screens; durations and easings come from the theme variables at use sites. */
export const PREVIEW_CSS = `
@keyframes pv-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@keyframes pv-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes pv-reveal { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
@keyframes pv-grow-y { from { transform: scaleY(0); } to { transform: scaleY(1); } }
@keyframes pv-grow-x { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes pv-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
@media (prefers-reduced-motion: reduce) {
  .theme-preview *, .theme-preview *::before, .theme-preview *::after { animation: none !important; }
}
`;
