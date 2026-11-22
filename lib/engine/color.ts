export interface Oklch {
  l: number;
  c: number;
  h: number;
}

type Vec3 = [number, number, number];

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function normalizeHue(h: number): number {
  const r = h % 360;
  return r < 0 ? r + 360 : r;
}

export function hueDistance(a: number, b: number): number {
  const d = Math.abs(normalizeHue(a) - normalizeHue(b));
  return d > 180 ? 360 - d : d;
}

/** Signed shortest rotation from a to b, in (-180, 180]. */
export function hueDelta(a: number, b: number): number {
  let d = normalizeHue(b) - normalizeHue(a);
  if (d > 180) d -= 360;
  if (d <= -180) d += 360;
  return d;
}

export function mixHue(a: number, b: number, t: number): number {
  return normalizeHue(a + hueDelta(a, b) * t);
}

export function circularMean(votes: { h: number; w: number }[]): { h: number; strength: number } | null {
  let x = 0;
  let y = 0;
  let total = 0;
  for (const { h, w } of votes) {
    if (w <= 0) continue;
    const r = (h * Math.PI) / 180;
    x += Math.cos(r) * w;
    y += Math.sin(r) * w;
    total += w;
  }
  if (total === 0) return null;
  const strength = Math.hypot(x, y) / total;
  return { h: normalizeHue((Math.atan2(y, x) * 180) / Math.PI), strength };
}

const srgbToLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const linearToSrgb = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

function linearRgbToOklab([r, g, b]: Vec3): Vec3 {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function oklabToLinearRgb([L, a, b]: Vec3): Vec3 {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

function oklchToLinearRgb({ l, c, h }: Oklch): Vec3 {
  const r = (h * Math.PI) / 180;
  return oklabToLinearRgb([l, c * Math.cos(r), c * Math.sin(r)]);
}

/** Parses #rgb, #rgba, #rrggbb or #rrggbbaa (hash optional, any case) to sRGB channels in 0..1. */
export function parseHex(input: string): Vec3 | null {
  const m = /^#?([0-9a-f]{3,8})$/i.exec(input.trim());
  if (!m) return null;
  let h = m[1];
  if (h.length === 3 || h.length === 4) h = h.slice(0, 3).split("").map((ch) => ch + ch).join("");
  else if (h.length === 6 || h.length === 8) h = h.slice(0, 6);
  else return null;
  const n = parseInt(h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function rgbToHex([r, g, b]: Vec3): string {
  const ch = (v: number) => Math.round(clamp(v, 0, 1) * 255).toString(16).padStart(2, "0");
  return `#${ch(r)}${ch(g)}${ch(b)}`;
}

/** Canonical lowercase #rrggbb, or null when the input is not a hex color. */
export function normalizeHex(input: string): string | null {
  const rgb = parseHex(input);
  return rgb ? rgbToHex(rgb) : null;
}

export function hexToRgb255(hex: string): Vec3 {
  const rgb = parseHex(hex) ?? [0, 0, 0];
  return [Math.round(rgb[0] * 255), Math.round(rgb[1] * 255), Math.round(rgb[2] * 255)];
}

export function hexToOklch(hex: string): Oklch {
  const rgb = parseHex(hex) ?? [0, 0, 0];
  const [L, a, b] = linearRgbToOklab(rgb.map(srgbToLinear) as Vec3);
  const c = Math.hypot(a, b);
  const h = c < 1e-4 ? 0 : normalizeHue((Math.atan2(b, a) * 180) / Math.PI);
  return { l: clamp(L, 0, 1), c, h };
}

const GAMUT_EPS = 1e-5;

function linearInGamut(rgb: Vec3): boolean {
  return rgb.every((v) => v >= -GAMUT_EPS && v <= 1 + GAMUT_EPS);
}

export function inGamut(color: Oklch): boolean {
  return linearInGamut(oklchToLinearRgb(color));
}

/** Largest chroma that keeps (l, h) inside sRGB. */
export function maxChroma(l: number, h: number): number {
  if (l <= 0 || l >= 1) return 0;
  let lo = 0;
  let hi = 0.4;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut({ l, c: mid, h })) lo = mid;
    else hi = mid;
  }
  return lo;
}

/** Gamut-maps by reducing chroma at constant lightness and hue. */
export function toGamut(color: Oklch): Oklch {
  const l = clamp(color.l, 0, 1);
  const c = Math.max(0, color.c);
  const target = { l, c, h: normalizeHue(color.h) };
  if (inGamut(target)) return target;
  return { ...target, c: maxChroma(l, target.h) };
}

export function oklchToHex(color: Oklch): string {
  const mapped = toGamut(color);
  return rgbToHex(oklchToLinearRgb(mapped).map((v) => linearToSrgb(clamp(v, 0, 1))) as Vec3);
}

export const oklch = (l: number, c: number, h: number): string => oklchToHex({ l, c, h });

export function relativeLuminance(hex: string): number {
  const [r, g, b] = (parseHex(hex) ?? [0, 0, 0]).map(srgbToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

export function rgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb255(hex);
  return `rgba(${r},${g},${b},${Number(alpha.toFixed(3))})`;
}

/**
 * Moves lightness (keeping hue and relative chroma) until `color` reaches `target` contrast
 * against `bg`. Direction is away from the background's luminance.
 */
export function ensureContrast(color: Oklch, bg: string, target: number): string {
  const bgLum = relativeLuminance(bg);
  const lighter = bgLum < 0.18;
  let current = { ...color };
  let hex = oklchToHex(current);
  for (let i = 0; i < 200 && contrastRatio(hex, bg) < target; i++) {
    const l = clamp(current.l + (lighter ? 0.005 : -0.005), 0, 1);
    if (l === current.l) break;
    current = { ...current, l };
    hex = oklchToHex(current);
  }
  return hex;
}

const NAMED: [string, string][] = [
  ["red", "#e5383b"], ["crimson", "#c1121f"], ["scarlet", "#e8341c"], ["ruby", "#9b111e"],
  ["cherry", "#c8102e"], ["burgundy", "#800020"], ["maroon", "#7b1e2b"], ["wine", "#722f37"],
  ["garnet", "#8b1e3f"], ["oxblood", "#6a1a21"], ["cardinal", "#c41e3a"], ["tomato", "#f05d3f"],
  ["rose", "#e11d48"], ["blush", "#f4b6c2"], ["pink", "#ec4899"], ["hot pink", "#ff4fa3"],
  ["magenta", "#d6248f"], ["fuchsia", "#d946ef"], ["raspberry", "#d3265e"], ["bubblegum", "#ff8fc7"],
  ["coral", "#ff6f61"], ["salmon", "#fa8072"], ["peach", "#ffb38a"], ["apricot", "#fbb17a"],
  ["orange", "#f97316"], ["tangerine", "#ff8c1a"], ["persimmon", "#ec5f2e"], ["amber", "#f59e0b"],
  ["saffron", "#f4b400"], ["marigold", "#eaa221"], ["gold", "#d4a72c"], ["golden", "#d9a521"],
  ["champagne", "#d6bd85"], ["mustard", "#d8a31a"], ["honey", "#e0a43a"], ["yellow", "#facc15"], ["lemon", "#fde047"],
  ["sunflower", "#ffc512"], ["butter", "#f6e4a0"], ["cream", "#f5ecd7"], ["ivory", "#f8f4e8"],
  ["beige", "#e8dcc4"], ["sand", "#d8c3a0"], ["khaki", "#b9a87a"], ["tan", "#c9a27e"],
  ["camel", "#c19a6b"], ["caramel", "#c68e4f"], ["bronze", "#a8722f"], ["copper", "#b8733e"],
  ["brass", "#b5a642"], ["rust", "#b7410e"], ["terracotta", "#c8643c"], ["clay", "#b66a50"],
  ["brick", "#a5432f"], ["brown", "#7a4a2a"], ["chocolate", "#5c3317"], ["coffee", "#6f4e37"],
  ["espresso", "#3c2a21"], ["mocha", "#7b5a46"], ["olive", "#708238"], ["moss", "#6b7f3a"],
  ["chartreuse", "#a3d921"], ["lime", "#84cc16"], ["sage", "#9caf88"], ["pistachio", "#a8c686"],
  ["mint", "#7fdcb4"], ["green", "#22c55e"], ["emerald", "#10b981"], ["jade", "#00a86b"],
  ["forest", "#2d6a4f"], ["forest green", "#2d6a4f"], ["pine", "#1e5b47"], ["hunter green", "#355e3b"],
  ["seafoam", "#7fd8be"], ["teal", "#0d9488"], ["turquoise", "#2ec4b6"], ["aqua", "#22d3ee"],
  ["cyan", "#06b6d4"], ["ocean", "#0e6ba8"], ["sky", "#38bdf8"], ["sky blue", "#38bdf8"],
  ["baby blue", "#9ccbf0"], ["powder blue", "#b0d0e8"], ["azure", "#2f8fff"], ["cerulean", "#2a7fba"],
  ["blue", "#3b82f6"], ["cobalt", "#0047ab"], ["royal blue", "#4169e1"], ["sapphire", "#0f52ba"],
  ["denim", "#1560bd"], ["steel blue", "#4682b4"], ["electric blue", "#2563ff"], ["navy", "#1f2f6b"],
  ["navy blue", "#1f2f6b"], ["midnight blue", "#191970"], ["periwinkle", "#8f9cf5"],
  ["cornflower", "#6487e8"], ["indigo", "#4f46e5"], ["ultramarine", "#3a2fd1"], ["violet", "#8b5cf6"], ["purple", "#9333ea"], ["amethyst", "#9966cc"],
  ["lavender", "#b9a6ee"], ["lilac", "#c8a2c8"], ["plum", "#8e4585"], ["mauve", "#b784a7"],
  ["orchid", "#da70d6"], ["grape", "#6f2da8"], ["eggplant", "#4b2840"], ["aubergine", "#472d3c"],
  ["white", "#ffffff"], ["snow", "#fafafa"], ["pearl", "#eae6dc"], ["bone", "#e3dac9"],
  ["platinum", "#e5e4e2"], ["silver", "#c0c0c8"], ["gray", "#71717a"], ["grey", "#71717a"],
  ["stone", "#a8a29e"], ["ash", "#b2b5b0"], ["slate", "#64748b"], ["steel", "#5f6b7a"],
  ["pewter", "#8a8d8f"], ["graphite", "#3f4148"], ["charcoal", "#36454f"], ["onyx", "#353839"],
  ["obsidian", "#1b1b1f"], ["ink", "#1c2331"], ["black", "#000000"], ["jet", "#111111"],
];

export const NAMED_COLORS: Record<string, string> = Object.fromEntries(NAMED);

const NAMED_OKLCH = NAMED.filter(([name]) => !name.includes(" ") && name !== "grey" && name !== "golden").map(
  ([name, hex]) => ({ name, hex, ...hexToOklch(hex) })
);

function oklabDistance(a: Oklch, b: Oklch): number {
  const ar = (a.h * Math.PI) / 180;
  const br = (b.h * Math.PI) / 180;
  const da = a.c * Math.cos(ar) - b.c * Math.cos(br);
  const db = a.c * Math.sin(ar) - b.c * Math.sin(br);
  return Math.hypot((a.l - b.l) * 0.7, da, db);
}

/** Closest designer color name. Chromatic colors are matched only against chromatic names. */
export function nearestColorName(hex: string): string {
  const target = hexToOklch(hex);
  const chromatic = target.c >= 0.035;
  let best = NAMED_OKLCH[0];
  let bestD = Infinity;
  for (const entry of NAMED_OKLCH) {
    if (chromatic !== entry.c >= 0.035) continue;
    const d = oklabDistance(target, entry) + (chromatic ? (hueDistance(target.h, entry.h) / 180) * 0.08 : 0);
    if (d < bestD) {
      bestD = d;
      best = entry;
    }
  }
  return best.name;
}

export type HueFamily =
  | "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "teal" | "cyan"
  | "blue" | "indigo" | "violet" | "magenta" | "pink" | "neutral";

const HUE_FAMILIES: [number, HueFamily][] = [
  [12, "pink"], [40, "red"], [62, "orange"], [82, "amber"], [114, "yellow"], [135, "lime"],
  [168, "green"], [196, "teal"], [228, "cyan"], [268, "blue"], [288, "indigo"], [318, "violet"],
  [345, "magenta"], [360, "pink"],
];

export function hueFamily(h: number, c = 1): HueFamily {
  if (c < 0.03) return "neutral";
  const hue = normalizeHue(h);
  for (const [limit, family] of HUE_FAMILIES) if (hue < limit) return family;
  return "pink";
}

export function isWarmHue(h: number): boolean {
  const hue = normalizeHue(h);
  return hue < 105 || hue >= 330;
}
