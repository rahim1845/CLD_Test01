import type { ThemeTokens } from "@/types/theme";
import { clamp, hexToRgb255, lerp, oklchToHex } from "./color";
import type { Dim, Vibe } from "./types";

const ROUNDNESS_TO_MD: [number, number][] = [
  [-1, 0], [-0.72, 0], [-0.5, 2], [-0.25, 4], [0, 6], [0.25, 8], [0.5, 10], [0.75, 14], [1, 18],
];

export function radiusMd(roundness: number): number {
  const r = clamp(roundness, -1, 1);
  for (let i = 0; i < ROUNDNESS_TO_MD.length - 1; i++) {
    const [r0, v0] = ROUNDNESS_TO_MD[i];
    const [r1, v1] = ROUNDNESS_TO_MD[i + 1];
    if (r >= r0 && r <= r1) return Math.round(lerp(v0, v1, (r - r0) / (r1 - r0)));
  }
  return 6;
}

export function buildRadius(md: number): ThemeTokens["radius"] {
  const steps = [0.34, 0.67, 1, 1.34, 2, 2.67, 4];
  const values: number[] = [];
  steps.forEach((m, i) => {
    let v = Math.round(md * m);
    if (md > 0 && i > 0) v = Math.max(v, values[i - 1] + (i >= 3 ? 2 : 1));
    if (md > 0 && i === 0) v = Math.max(1, v);
    values.push(v);
  });
  const [xs, sm, mdV, lg, xl, x2, x3] = values.map((v) => `${v}px`);
  return { none: "0px", xs, sm, md: mdV, lg, xl, "2xl": x2, "3xl": x3, full: "9999px" };
}

export function buildSpacing(): ThemeTokens["spacing"] {
  const keys = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32] as const;
  return Object.fromEntries(keys.map((k) => [k, `${k * 4}px`])) as unknown as ThemeTokens["spacing"];
}

export interface EffectsPlan {
  dims: Record<Dim, number>;
  vibes: Vibe[];
  shadowHue: number;
  shadowChroma: number;
}

function rgbaFrom(rgb: [number, number, number], alpha: number): string {
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${Number(clamp(alpha, 0, 1).toFixed(2))})`;
}

export function buildShadows(plan: EffectsPlan): ThemeTokens["shadow"] {
  const { dims, vibes } = plan;
  const tint = hexToRgb255(oklchToHex({ l: 0.13, c: Math.min(0.045, plan.shadowChroma * 0.3), h: plan.shadowHue }));
  if (vibes.includes("brutal") && dims.roundness < -0.4) {
    const ink = hexToRgb255(oklchToHex({ l: 0.08, c: Math.min(0.03, plan.shadowChroma * 0.2), h: plan.shadowHue }));
    const hard = (n: number) => `${n}px ${n}px 0 0 ${rgbaFrom(ink, 0.95)}`;
    return {
      none: "none",
      xs: hard(1),
      sm: hard(2),
      md: hard(4),
      lg: hard(6),
      xl: hard(8),
      "2xl": hard(12),
      inner: `inset 2px 2px 0 0 ${rgbaFrom(ink, 0.6)}`,
    };
  }
  const depth = clamp(0.5 + 0.35 * dims.depth + 0.1 * dims.dark, 0, 1);
  const alpha = 0.22 + 0.26 * depth;
  const spread = 0.85 + 0.4 * depth;
  const s = (n: number) => Math.round(n * spread);
  const c = (k: number) => rgbaFrom(tint, alpha * k);
  return {
    none: "none",
    xs: `0 1px 2px 0 ${c(0.75)}`,
    sm: `0 1px 3px 0 ${c(0.9)}, 0 1px 2px -1px ${c(0.7)}`,
    md: `0 ${s(4)}px ${s(8)}px -2px ${c(0.9)}, 0 2px 4px -2px ${c(0.7)}`,
    lg: `0 ${s(12)}px ${s(20)}px -4px ${c(1)}, 0 ${s(4)}px ${s(8)}px -4px ${c(0.7)}`,
    xl: `0 ${s(20)}px ${s(32)}px -8px ${c(1.1)}, 0 ${s(8)}px ${s(12)}px -6px ${c(0.75)}`,
    "2xl": `0 ${s(32)}px ${s(64)}px -16px ${c(1.35)}`,
    inner: `inset 0 2px 4px 0 ${c(0.8)}`,
  };
}

export function buildAnimation(dims: Record<Dim, number>): ThemeTokens["animation"] {
  const energy = clamp((dims.energy + 1) / 2, 0, 1);
  const playful = clamp(dims.playful, 0, 1);
  const elegance = clamp(dims.elegance, 0, 1);
  const ms = (calm: number, lively: number) => `${Math.round(lerp(calm, lively, energy) / 10) * 10}ms`;
  const overshoot = (1.2 + playful * 0.5 + energy * 0.1).toFixed(2);
  const easeOut =
    elegance > 0.4 ? "cubic-bezier(0.16, 1, 0.3, 1)" : energy > 0.65 ? "cubic-bezier(0.22, 1, 0.36, 1)" : "cubic-bezier(0.25, 1, 0.5, 1)";
  const easeInOut = energy > 0.65 ? "cubic-bezier(0.65, 0, 0.35, 1)" : energy < 0.35 ? "cubic-bezier(0.45, 0, 0.55, 1)" : "cubic-bezier(0.4, 0, 0.2, 1)";
  return {
    duration: {
      fast: ms(150, 90),
      normal: ms(260, 170),
      slow: ms(400, 260),
      slower: ms(650, 420),
    },
    easing: {
      linear: "linear",
      ease: "ease",
      easeIn: energy > 0.65 ? "cubic-bezier(0.5, 0, 0.75, 0)" : "cubic-bezier(0.4, 0, 1, 1)",
      easeOut,
      easeInOut,
      spring: `cubic-bezier(0.34, ${overshoot}, 0.64, 1)`,
    },
  };
}

export function buildZIndex(): ThemeTokens["zIndex"] {
  return {
    hide: "-1",
    auto: "auto",
    base: "0",
    dropdown: "1000",
    sticky: "1100",
    overlay: "1200",
    modal: "1300",
    popover: "1400",
    toast: "1500",
    tooltip: "1600",
  };
}

export function buildBlur(dims: Record<Dim, number>): ThemeTokens["blur"] {
  const scale = 1 + clamp(dims.glass, 0, 1) * 0.5 + clamp(-dims.density, 0, 1) * 0.15;
  const v = (n: number) => `${Math.round((n * scale) / 2) * 2}px`;
  return { none: "0px", sm: v(4), md: v(8), lg: v(16), xl: v(24), "2xl": v(40) };
}
