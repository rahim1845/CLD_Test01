import type { ThemeTokens } from "@/types/theme";

export interface ModePalette {
  dark: boolean;
  background: string;
  surface: string;
  surfaceRaised: string;
  surfaceSunken: string;
  border: string;
  borderSubtle: string;
  overlay: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  textDisabled: string;
  primary: string;
  primaryHover: string;
  onPrimary: string;
  primarySoft: string;
  primaryText: string;
  accent: string;
  accentHover: string;
  onAccent: string;
  accentSoft: string;
  accentText: string;
  success: string;
  successSoft: string;
  successText: string;
  warning: string;
  warningSoft: string;
  warningText: string;
  error: string;
  errorSoft: string;
  errorText: string;
  info: string;
  infoSoft: string;
  infoText: string;
}

type RGB = [number, number, number];

export function parseHex(hex: string): RGB {
  let h = hex.trim().replace("#", "");
  if (h.length === 3 || h.length === 4) h = h.slice(0, 3).split("").map((c) => c + c).join("");
  h = h.slice(0, 6);
  const n = parseInt(h, 16);
  if (Number.isNaN(n) || h.length !== 6) return [0, 0, 0];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function toHex([r, g, b]: RGB): string {
  const c = (v: number) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

export function mix(a: string, b: string, t: number): string {
  const x = parseHex(a);
  const y = parseHex(b);
  return toHex([x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t]);
}

export function withAlpha(hex: string, alpha: number): string {
  const [r, g, b] = parseHex(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

function luminance(hex: string): number {
  const lin = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const [r, g, b] = parseHex(hex);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrast(a: string, b: string): number {
  const l1 = luminance(a);
  const l2 = luminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/** First candidate reaching `min` contrast on `bg`; otherwise the highest-contrast one. */
export function pickReadable(candidates: string[], bg: string, min: number): string {
  const hit = candidates.find((c) => contrast(c, bg) >= min);
  if (hit) return hit;
  return candidates.reduce((best, c) => (contrast(c, bg) > contrast(best, bg) ? c : best), candidates[0]);
}

export function readableOn(bg: string, light = "#ffffff", dark = "#0b0b0f"): string {
  return contrast(light, bg) >= contrast(dark, bg) ? light : dark;
}

export function getModePalette(theme: ThemeTokens, dark: boolean): ModePalette {
  const { primary: p, accent: a, neutral: n, semantic: s, surface, text } = theme.color;

  if (dark) {
    const background = surface.background;
    const card = surface.card;
    const semantic = (base: string) => ({
      base,
      soft: mix(background, base, 0.16),
      text: pickReadable([base, mix(base, "#ffffff", 0.3), mix(base, "#ffffff", 0.55)], card, 4.5),
    });
    const darkPrimary = pickReadable([p[500], p[400], p[300]], background, 2.5);
    const darkAccent = pickReadable([a[500], a[400], a[300]], background, 2.5);
    const ok = semantic(s.success);
    const warn = semantic(s.warning);
    const err = semantic(s.error);
    const inf = semantic(s.info);
    return {
      dark: true,
      background,
      surface: card,
      surfaceRaised: mix(card, text.primary, 0.05),
      surfaceSunken: mix(background, "#000000", 0.25),
      border: surface.border,
      borderSubtle: surface.borderSubtle,
      overlay: surface.overlay,
      text: pickReadable([text.primary, n[50], "#ffffff"], card, 7),
      textSecondary: pickReadable([text.secondary, n[300], n[200]], card, 4.5),
      textTertiary: pickReadable([text.tertiary, n[400], n[300]], card, 3),
      textDisabled: text.disabled,
      primary: darkPrimary,
      primaryHover: mix(darkPrimary, "#ffffff", 0.12),
      onPrimary: pickReadable(["#ffffff", p[950], "#0b0b0f", "#000000"], darkPrimary, 4.5),
      primarySoft: mix(background, p[500], 0.18),
      primaryText: pickReadable([p[400], p[300], p[200], p[100]], card, 4.5),
      accent: darkAccent,
      accentHover: mix(darkAccent, "#ffffff", 0.12),
      onAccent: pickReadable(["#ffffff", a[950], "#0b0b0f", "#000000"], darkAccent, 4.5),
      accentSoft: mix(background, a[500], 0.18),
      accentText: pickReadable([a[400], a[300], a[200], a[100]], card, 4.5),
      success: ok.base, successSoft: ok.soft, successText: ok.text,
      warning: warn.base, warningSoft: warn.soft, warningText: warn.text,
      error: err.base, errorSoft: err.soft, errorText: err.text,
      info: inf.base, infoSoft: inf.soft, infoText: inf.text,
    };
  }

  const background = n[50];
  const card = "#ffffff";
  const semantic = (base: string) => ({
    base,
    soft: mix(card, base, 0.12),
    text: pickReadable([mix(base, "#000000", 0.2), mix(base, "#000000", 0.38), mix(base, "#000000", 0.55)], card, 4.5),
  });
  const ok = semantic(s.success);
  const warn = semantic(s.warning);
  const err = semantic(s.error);
  const inf = semantic(s.info);
  const [or, og, ob] = parseHex(n[950]);
  return {
    dark: false,
    background,
    surface: card,
    surfaceRaised: card,
    surfaceSunken: n[100],
    border: n[200],
    borderSubtle: n[100],
    overlay: `rgba(${or},${og},${ob},0.45)`,
    text: pickReadable([n[900], n[950], "#000000"], background, 7),
    textSecondary: pickReadable([n[600], n[700], n[800]], background, 4.5),
    textTertiary: pickReadable([n[500], n[600], n[700]], background, 3),
    textDisabled: n[300],
    primary: p[600],
    primaryHover: p[700],
    onPrimary: pickReadable(["#ffffff", p[950], "#0b0b0f", "#000000"], p[600], 4.5),
    primarySoft: mix(card, p[500], 0.1),
    primaryText: pickReadable([p[600], p[700], p[800], p[900]], card, 4.5),
    accent: a[600],
    accentHover: a[700],
    onAccent: pickReadable(["#ffffff", a[950], "#0b0b0f", "#000000"], a[600], 4.5),
    accentSoft: mix(card, a[500], 0.1),
    accentText: pickReadable([a[600], a[700], a[800], a[900]], card, 4.5),
    success: ok.base, successSoft: ok.soft, successText: ok.text,
    warning: warn.base, warningSoft: warn.soft, warningText: warn.text,
    error: err.base, errorSoft: err.soft, errorText: err.text,
    info: inf.base, infoSoft: inf.soft, infoText: inf.text,
  };
}
