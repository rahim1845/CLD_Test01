import {
  contrastRatio as wcagContrast, hexToOklch, normalizeHex as toCanonicalHex, oklchToHex, parseHex, rgbToHex,
} from "./engine/color";
import { STOPS, buildBrandScale, onColor } from "./engine/palette";

export { hexToOklch, oklchToHex };

/** True for CSS hex colors: #rgb, #rgba, #rrggbb or #rrggbbaa (any case). */
export function isValidHex(hex: string): boolean {
  return /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(hex.trim());
}

/** Canonical lowercase #rrggbb (alpha dropped), or null if the input is not a hex color. Accepts a missing "#". */
export function normalizeHex(hex: string): string | null {
  return toCanonicalHex(hex);
}

export function hexToHsl(hex: string): [number, number, number] {
  const [r, g, b] = parseHex(hex) ?? [0, 0, 0];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export function hslToHex(h: number, s: number, l: number): string {
  const sat = s / 100;
  const light = l / 100;
  const a = sat * Math.min(light, 1 - light);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return light - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  return rgbToHex([f(0), f(8), f(4)]);
}

/**
 * Perceptually even 50..950 scale built in OKLCH with the seed landing exactly on 500.
 * Unknown stops are ignored.
 */
export function generateScaleFromSeed(
  seedHex: string,
  stops: number[] = [...STOPS],
): Record<number, string> {
  const seed = toCanonicalHex(seedHex) ?? "#6366f1";
  const scale = buildBrandScale(hexToOklch(seed), seed) as unknown as Record<number, string>;
  return Object.fromEntries(stops.filter((s) => s in scale).map((s) => [s, scale[s]]));
}

/** WCAG 2.x contrast ratio between two hex colors (1..21). */
export function contrastRatio(hex1: string, hex2: string): number {
  return wcagContrast(hex1, hex2);
}

/** White, or a tinted near-black, whichever reads at >= 4.5:1 on `bg`. */
export function readableTextColor(bg: string): string {
  return onColor(toCanonicalHex(bg) ?? "#000000");
}
