import type { ColorScale, ThemeTokens } from "@/types/theme";
import {
  clamp, contrastRatio, ensureContrast, hexToOklch, hueDistance, lerp, maxChroma, normalizeHue, oklchToHex, rgba,
  type Oklch,
} from "./color";

export const STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

const BRAND_L = [0.975, 0.945, 0.892, 0.822, 0.732, 0.645, 0.562, 0.488, 0.418, 0.36, 0.27];
const CHROMA_SHAPE = [0.11, 0.24, 0.44, 0.68, 0.89, 1, 1.02, 0.96, 0.86, 0.72, 0.55];
const NEUTRAL_L = [0.985, 0.967, 0.925, 0.868, 0.722, 0.58, 0.47, 0.385, 0.29, 0.215, 0.15];
const NEUTRAL_C = [0.3, 0.45, 0.65, 0.82, 1, 1, 1, 0.95, 0.9, 0.85, 0.8];
const ANCHOR_X = BRAND_L[5];
const TOP_X = BRAND_L[0];
const BOTTOM_X = BRAND_L[10];

const NATURAL_L: [number, number][] = [
  [0, 0.645], [16, 0.645], [25, 0.637], [47, 0.705], [70, 0.769], [86, 0.795], [110, 0.79], [131, 0.768],
  [150, 0.723], [162, 0.7], [183, 0.705], [215, 0.715], [237, 0.685], [260, 0.623], [277, 0.585],
  [293, 0.606], [304, 0.627], [322, 0.667], [354, 0.656], [360, 0.645],
];

const HUE_DRIFT: [number, number, number][] = [
  [0, -6, 5], [25, -6, 2], [45, 20, -9], [70, 24, -20], [95, 10, -28], [115, -5, 0], [135, -5, 2],
  [150, 4, 3], [165, 3, 7], [185, -2, 8], [215, -9, 11], [240, -2, 6], [262, -4, 7], [278, -4, 4],
  [295, 1, -2], [305, 3, -1], [322, -2, 3], [350, -8, 6], [360, -6, 5],
];

function interpolateByHue<T extends number[]>(table: [number, ...T][], hue: number): number[] {
  const h = normalizeHue(hue);
  for (let i = 0; i < table.length - 1; i++) {
    const [h0, ...a] = table[i];
    const [h1, ...b] = table[i + 1];
    if (h >= h0 && h <= h1) {
      const t = h1 === h0 ? 0 : (h - h0) / (h1 - h0);
      return a.map((v, k) => lerp(v, b[k], t));
    }
  }
  const [, ...last] = table[table.length - 1];
  return last;
}

export function naturalLightness(hue: number): number {
  return interpolateByHue(NATURAL_L, hue)[0];
}

/** Monotone cubic (Fritsch-Carlson) through sorted points; C1-smooth and never overshoots. */
function monotoneCurve(xs: number[], ys: number[]): (x: number) => number {
  const n = xs.length;
  const h: number[] = [];
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    h.push(xs[i + 1] - xs[i]);
    d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  }
  const m = new Array<number>(n);
  m[0] = d[0];
  m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) {
    m[i] = d[i - 1] * d[i] <= 0 ? 0 : (3 * (h[i - 1] + h[i])) / ((2 * h[i] + h[i - 1]) / d[i - 1] + (h[i] + 2 * h[i - 1]) / d[i]);
  }
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const s = a * a + b * b;
    if (s > 9) {
      const tau = 3 / Math.sqrt(s);
      m[i] = tau * a * d[i];
      m[i + 1] = tau * b * d[i];
    }
  }
  return (x: number) => {
    let i = 0;
    while (i < n - 2 && x > xs[i + 1]) i++;
    const t = clamp((x - xs[i]) / h[i], 0, 1);
    const t2 = t * t;
    const t3 = t2 * t;
    return (
      (2 * t3 - 3 * t2 + 1) * ys[i] +
      (t3 - 2 * t2 + t) * h[i] * m[i] +
      (-2 * t3 + 3 * t2) * ys[i + 1] +
      (t3 - t2) * h[i] * m[i + 1]
    );
  };
}

function toScale(hexes: string[]): ColorScale {
  return Object.fromEntries(STOPS.map((stop, i) => [stop, hexes[i]])) as unknown as ColorScale;
}

/**
 * Builds an 11-stop brand scale around `anchor`, which lands exactly on stop 500.
 * Lightness follows a hand-tuned curve warped smoothly through the anchor; chroma peaks mid-scale.
 */
export function buildBrandScale(anchor: Oklch, exactHex?: string): ColorScale {
  const la = anchor.l;
  const top = Math.min(1, Math.max(0.972, la + (1 - la) * 0.72));
  const bottom = Math.min(0.27, la * 0.62);
  const curve = monotoneCurve([BOTTOM_X, ANCHOR_X, TOP_X], [bottom, la, top]);
  const [lightDrift, darkDrift] = interpolateByHue(HUE_DRIFT, anchor.h);
  const yellowness = Math.max(0, 1 - Math.abs(normalizeHue(anchor.h) - 88) / 40);
  const anchorMax = maxChroma(anchor.l, anchor.h);
  const saturation = anchorMax > 0 ? Math.min(1, anchor.c / anchorMax) : 0;
  const hexes = BRAND_L.map((x, i) => {
    if (i === 5) return exactHex ?? oklchToHex(anchor);
    const lightSide = x > ANCHOR_X;
    const t = lightSide ? (x - ANCHOR_X) / (TOP_X - ANCHOR_X) : (ANCHOR_X - x) / (ANCHOR_X - BOTTOM_X);
    const drift = (lightSide ? lightDrift : darkDrift) * Math.pow(t, 1.1) * Math.min(1, anchor.c / 0.04);
    const l = curve(x);
    const h = anchor.h + drift;
    const room = maxChroma(l, h);
    const fullness = lightSide ? 1 - yellowness * (i >= 2 ? 0.5 : 0.2) : 1;
    const shape = Math.pow(CHROMA_SHAPE[i], fullness);
    const preserved = saturation * room * shape * 0.92;
    const c = Math.min(Math.max(anchor.c * shape, Math.min(preserved, anchor.c * 1.35)), room);
    return oklchToHex({ l, c, h });
  });
  return toScale(enforceMonotone(hexes, 5));
}

/** Guarantees strictly decreasing lightness away from the fixed index, nudging only when rounding collided. */
function enforceMonotone(hexes: string[], fixed: number): string[] {
  const out = [...hexes];
  const lightOf = (hex: string) => hexToOklch(hex).l;
  for (let i = fixed - 1; i >= 0; i--) {
    let o = hexToOklch(out[i]);
    const below = lightOf(out[i + 1]);
    let guard = 0;
    while (o.l <= below + 0.002 && o.l < 0.999 && guard++ < 40) {
      o = { ...o, l: Math.min(1, o.l + 0.003) };
      out[i] = oklchToHex(o);
      o = hexToOklch(out[i]);
    }
  }
  for (let i = fixed + 1; i < out.length; i++) {
    let o = hexToOklch(out[i]);
    const above = lightOf(out[i - 1]);
    let guard = 0;
    while (o.l >= above - 0.002 && o.l > 0.001 && guard++ < 40) {
      o = { ...o, l: Math.max(0, o.l - 0.003) };
      out[i] = oklchToHex(o);
      o = hexToOklch(out[i]);
    }
  }
  return out;
}

export function buildNeutralScale(hue: number, chroma: number): ColorScale {
  return toScale(NEUTRAL_L.map((l, i) => oklchToHex({ l, c: chroma * NEUTRAL_C[i], h: hue })));
}

const WHITE = "#ffffff";

function darkInk(hue: number, chroma: number, l = 0.2): string {
  return oklchToHex({ l, c: Math.min(0.035, chroma * 0.3), h: hue });
}

/** White when it reaches 4.5:1, otherwise the lightest tinted near-black that does, otherwise the best available. */
export function onColor(bg: string): string {
  if (contrastRatio(WHITE, bg) >= 4.5) return WHITE;
  const o = hexToOklch(bg);
  for (const l of [0.22, 0.18, 0.14, 0.1]) {
    const ink = darkInk(o.h, o.c, l);
    if (contrastRatio(ink, bg) >= 4.5) return ink;
  }
  const black = darkInk(o.h, o.c, 0.08);
  return contrastRatio(black, bg) >= contrastRatio(WHITE, bg) ? black : WHITE;
}

export type InkPreference = "white" | "dark" | "either";

export function inkPreference(hue: number): InkPreference {
  const h = normalizeHue(hue);
  if (h >= 225 || h < 30) return "white";
  if (h >= 62 && h < 215) return "dark";
  return "either";
}

/**
 * Picks the anchor lightness nearest `target` at which white or near-black text reaches 4.5:1,
 * preferring the ink a designer would expect for the hue.
 */
export function fitAnchor(
  hue: number,
  rel: number,
  target: number,
  chromaCap = 0.25,
  preference?: InkPreference,
  penalty = 0.12,
): Oklch {
  const at = (l: number): Oklch => ({ l, c: Math.min(chromaCap, rel * maxChroma(l, hue)), h: hue });
  const whiteOk = (l: number) => contrastRatio(WHITE, oklchToHex(at(l))) >= 4.6;
  const darkOk = (l: number) => {
    const o = at(l);
    return contrastRatio(darkInk(hue, o.c), oklchToHex(o)) >= 4.6;
  };
  const pref = preference ?? inkPreference(hue);
  let lw = target;
  while (lw > 0.3 && !whiteOk(lw)) lw -= 0.005;
  let ld = target;
  while (ld < 0.95 && !darkOk(ld)) ld += 0.005;
  const costWhite = whiteOk(lw) ? target - lw + (pref === "dark" ? penalty : 0) : Infinity;
  const costDark = darkOk(ld) ? ld - target + (pref === "white" ? penalty : 0) : Infinity;
  return at(costWhite <= costDark ? lw : ld);
}

interface SemanticSpec {
  hue: number;
  min: number;
  max: number;
  l: number;
  c: number;
}

const SEMANTICS: Record<SemanticKey, SemanticSpec> = {
  success: { hue: 150, min: 128, max: 172, l: 0.72, c: 0.17 },
  warning: { hue: 75, min: 55, max: 95, l: 0.8, c: 0.16 },
  error: { hue: 25, min: -8, max: 40, l: 0.665, c: 0.2 },
  info: { hue: 245, min: 205, max: 268, l: 0.69, c: 0.145 },
};

type SemanticKey = "success" | "warning" | "error" | "info";

interface Avoid {
  hue: number;
  distance: number;
}

function inSpecRange(spec: SemanticSpec, h: number): boolean {
  const rel = ((h - spec.min + 540) % 360) - 180 + spec.min;
  return rel >= spec.min && rel <= spec.max;
}

function semanticCandidates(spec: SemanticSpec, base: number, primary: Avoid[], accent: Avoid[]): { h: number; cost: number }[] {
  const out: { h: number; cost: number }[] = [];
  for (let off = -80; off <= 80; off += 2) {
    const h = normalizeHue(base + off);
    if (!primary.every((a) => hueDistance(h, a.hue) >= a.distance)) continue;
    const accentClash = accent.some((a) => hueDistance(h, a.hue) < a.distance);
    out.push({ h, cost: Math.abs(off) + (inSpecRange(spec, h) ? 0 : 45) + (accentClash ? 25 : 0) });
  }
  return out.sort((a, b) => a.cost - b.cost);
}

/**
 * Places the four semantic hues near their conventional values while keeping them >= 28° from the
 * primary, clear of a saturated accent, and >= 30° from each other. Error and warning sit next to
 * each other on the wheel, so they are solved jointly.
 */
function placeSemantics(bases: Record<SemanticKey, number>, primary: Avoid[], accent: Avoid[]): Record<SemanticKey, number> {
  const SEP = 30;
  const errors = semanticCandidates(SEMANTICS.error, bases.error, primary, accent);
  const warnings = semanticCandidates(SEMANTICS.warning, bases.warning, primary, accent);
  let best: [number, number] = [bases.error, bases.warning];
  let bestCost = Infinity;
  for (const e of errors) {
    if (e.cost >= bestCost) break;
    for (const w of warnings) {
      if (e.cost + w.cost >= bestCost) break;
      if (hueDistance(e.h, w.h) >= SEP) {
        best = [e.h, w.h];
        bestCost = e.cost + w.cost;
      }
    }
  }
  const placed: number[] = [...best];
  const pick = (key: SemanticKey) => {
    const hit = semanticCandidates(SEMANTICS[key], bases[key], primary, accent).find((c) => placed.every((p) => hueDistance(c.h, p) >= SEP));
    const h = hit ? hit.h : bases[key];
    placed.push(h);
    return h;
  };
  const success = pick("success");
  const info = pick("info");
  return { error: best[0], warning: best[1], success, info };
}

export interface PalettePlan {
  primary: Oklch;
  primaryExact: string | null;
  accent: Oklch;
  accentExact: string | null;
  neutralHue: number;
  neutralChroma: number;
  vibrancy: number;
  warmth: number;
  dark: number;
  contrast: number;
}

export function buildPalette(plan: PalettePlan): ThemeTokens["color"] {
  const primary = buildBrandScale(plan.primary, plan.primaryExact ?? undefined);
  const accent = buildBrandScale(plan.accent, plan.accentExact ?? undefined);
  const neutral = buildNeutralScale(plan.neutralHue, plan.neutralChroma);
  const p = hexToOklch(primary[500]);
  const a = hexToOklch(accent[500]);

  const hue = plan.neutralHue;
  const tint = clamp(plan.neutralChroma * 1.15 + Math.max(0, plan.dark) * 0.006, 0.003, 0.032);
  const bgL = clamp(0.165 - 0.03 * plan.dark, 0.13, 0.18);
  const background = oklchToHex({ l: bgL, c: tint, h: hue });
  const card = oklchToHex({ l: bgL + 0.035, c: tint * 1.05, h: hue });
  const borderSubtle = oklchToHex({ l: bgL + 0.068 + 0.012 * plan.contrast, c: tint * 1.1, h: hue });
  const border = oklchToHex({ l: bgL + 0.11 + 0.025 * plan.contrast, c: tint * 1.15, h: hue });
  const overlay = rgba(oklchToHex({ l: Math.max(0.05, bgL - 0.08), c: tint * 0.8, h: hue }), 0.72);

  const textTint = Math.min(0.014, tint * 0.6);
  const textPrimary = ensureContrast({ l: clamp(0.962 + 0.02 * plan.contrast, 0.94, 0.99), c: textTint * 0.6, h: hue }, background, 12.5);
  const secondary = ensureContrast({ l: 0.77 + 0.045 * plan.contrast, c: textTint * 1.2, h: hue }, card, 4.9);
  const tertiaryStart = Math.min(hexToOklch(secondary).l - 0.12, 0.62 + 0.035 * plan.contrast);
  const tertiary = ensureContrast({ l: tertiaryStart, c: textTint * 1.2, h: hue }, card, 3.3);
  const disabledL = Math.min(hexToOklch(tertiary).l - 0.12, 0.45);
  const disabled = oklchToHex({ l: disabledL, c: textTint, h: hue });
  const inverse = oklchToHex({ l: 0.2, c: Math.min(0.03, tint * 1.4), h: hue });

  const vibMul = clamp(0.88 + 0.16 * plan.vibrancy, 0.68, 1.06);
  const primaryAvoid: Avoid[] = p.c >= 0.04 ? [{ hue: p.h, distance: 28 }] : [];
  const accentSaturation = a.c / Math.max(1e-6, maxChroma(a.l, a.h));
  const accentAvoid: Avoid[] = a.c >= 0.09 && accentSaturation >= 0.6 ? [{ hue: a.h, distance: 18 }] : [];
  const hues = placeSemantics(
    { success: SEMANTICS.success.hue - 6 * plan.warmth, warning: SEMANTICS.warning.hue, error: SEMANTICS.error.hue, info: SEMANTICS.info.hue },
    primaryAvoid,
    accentAvoid,
  );
  const semantic = {} as Record<SemanticKey, { base: string; bg: string }>;
  for (const key of ["error", "warning", "success", "info"] as const) {
    const spec = SEMANTICS[key];
    const h = hues[key];
    const c = spec.c * vibMul;
    const bg = oklchToHex({ l: bgL + 0.075, c: Math.min(0.06, 0.05 * vibMul), h });
    let color = ensureContrast({ l: spec.l, c, h }, card, 4.6);
    if (contrastRatio(color, bg) < 4.5) color = ensureContrast(hexToOklch(color), bg, 4.5);
    semantic[key] = { base: color, bg };
  }

  return {
    primary,
    neutral,
    accent,
    semantic: {
      success: semantic.success.base,
      warning: semantic.warning.base,
      error: semantic.error.base,
      info: semantic.info.base,
      successBg: semantic.success.bg,
      warningBg: semantic.warning.bg,
      errorBg: semantic.error.bg,
      infoBg: semantic.info.bg,
    },
    surface: { background, card, border, borderSubtle, overlay },
    text: {
      primary: textPrimary,
      secondary,
      tertiary,
      disabled,
      onPrimary: onColor(primary[500]),
      inverse,
    },
  };
}
