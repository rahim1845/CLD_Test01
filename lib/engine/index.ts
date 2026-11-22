import type { GenerateMode, ThemeTokens } from "@/types/theme";
import { analyzeBrief, analyzeSeed } from "./analyze";
import {
  clamp, hexToOklch, hueDistance, hueFamily, isWarmHue, lerp, maxChroma, mixHue, nearestColorName, normalizeHex,
  normalizeHue, type Oklch,
} from "./color";
import { makeName } from "./naming";
import { buildPalette, fitAnchor, inkPreference, naturalLightness, type InkPreference } from "./palette";
import { createRng, type Rng } from "./random";
import { buildAnimation, buildBlur, buildRadius, buildShadows, buildSpacing, buildZIndex, radiusMd } from "./tokens";
import { buildTypography, choosePersonality, rankPairings, type Pairing } from "./typography";
import {
  FONT_PERSONALITY_LABEL, HARMONIES, HARMONY_LABEL,
  type FontPersonality, type Harmony, type Intent,
} from "./types";

export { googleFontsHref } from "./typography";

export interface EngineInput {
  mode: GenerateMode;
  prompt?: string;
  seedColor?: string;
  variation?: number;
}

export interface EngineAnalysis {
  tags: string[];
  summary: string;
  primaryHue: number;
  harmony: string;
  fontPersonality: string;
  preferredMode: "light" | "dark";
}

export interface EngineResult {
  theme: ThemeTokens;
  name: string;
  analysis: EngineAnalysis;
}

export const EXAMPLE_PROMPTS: string[] = [
  "Calm meditation app with soft sage tones",
  "Trustworthy fintech for Gen Z, bold but friendly",
  "Luxury watch boutique, black and gold, editorial",
  "Playful kids learning app, bright and rounded",
  "Developer tools: dark, technical, precise",
  "Cozy coffee roastery with warm earthy vibes",
  "Neon cyberpunk esports league",
  "Minimal Scandinavian architecture studio",
];

const DEFAULT_HUE = 274;

const HARMONY_PRIOR: Record<Harmony, number> = {
  monochrome: 0.1,
  analogous: 0.32,
  complementary: 0.36,
  split: 0.3,
  triadic: 0.12,
};

const HARMONY_OFFSETS: Record<Harmony, number[]> = {
  monochrome: [16, -16],
  analogous: [36, -36],
  complementary: [180],
  split: [150, -150],
  triadic: [120, -120],
};

function rankHarmonies(intent: Intent): Harmony[] {
  const { dims } = intent;
  const score = (h: Harmony) => {
    let s = HARMONY_PRIOR[h] + intent.harmonies[h] * 0.5;
    if (h === "complementary") s += Math.max(0, dims.energy) * 0.35 + Math.max(0, dims.vibrancy) * 0.15;
    if (h === "triadic") s += Math.max(0, dims.playful) * 0.45;
    if (h === "analogous") s += Math.max(0, -dims.energy) * 0.4 + Math.max(0, -dims.vibrancy) * 0.2;
    if (h === "monochrome") s += Math.max(0, dims.elegance) * 0.25 + Math.max(0, -dims.vibrancy - 0.3) * 0.4;
    return s;
  };
  return [...HARMONIES].sort((a, b) => score(b) - score(a));
}

function harmonyFromAngle(primary: number, accent: number): Harmony {
  const d = hueDistance(primary, accent);
  if (d < 18) return "monochrome";
  if (d < 65) return "analogous";
  if (d < 140) return "triadic";
  if (d < 168) return "split";
  return "complementary";
}

function accentAppeal(hue: number, primaryHue: number, rel: number): number {
  const l = naturalLightness(hue);
  let s = maxChroma(l, hue) / 0.2;
  if (isWarmHue(hue) !== isWarmHue(primaryHue)) s += 0.15;
  const h = normalizeHue(hue);
  if (h > 88 && h < 128 && rel < 0.82) s -= 0.45;
  if (hueDistance(h, 25) < 10) s -= 0.12;
  return s;
}

function pickAccentHue(primaryHue: number, harmony: Harmony, rel: number, flip: boolean): number {
  const exact = normalizeHue(primaryHue + 180);
  const options =
    harmony === "complementary"
      ? [exact, exact + 12, exact - 12, exact + 24, exact - 24]
      : HARMONY_OFFSETS[harmony].map((offset) => primaryHue + offset);
  const ranked = options
    .map((h) => normalizeHue(h))
    .map((h) => ({ h, s: accentAppeal(h, primaryHue, rel) - hueDistance(h, options[0]) * 0.004 }))
    .sort((a, b) => b.s - a.s);
  return (flip && ranked.length > 1 ? ranked[1] : ranked[0]).h;
}

function avoidHues(hue: number, avoid: number[]): number {
  const clear = (h: number) => !avoid.some((a) => hueDistance(h, a) < 45);
  if (clear(hue)) return hue;
  for (let off = 8; off <= 180; off += 8) {
    for (const h of [hue + off, hue - off]) if (clear(h)) return normalizeHue(h);
  }
  return hue;
}

function defaultHue(intent: Intent): number {
  const { warmth, energy, playful } = intent.dims;
  if (warmth > 0.3) return 42;
  if (warmth < -0.3) return 232;
  if (playful > 0.5) return 330;
  if (energy > 0.55) return 20;
  return DEFAULT_HUE;
}

function primaryRel(intent: Intent): number {
  const v = intent.dims.vibrancy;
  let rel = v >= 0 ? 0.74 + 0.24 * v : 0.74 + 0.62 * v;
  if (intent.primaryHint) rel = lerp(rel, intent.primaryHint.rel, 0.6);
  const harm = intent.harmonies;
  const total = HARMONIES.reduce((s, h) => s + Math.max(0, harm[h]), 0);
  const mono = total > 0 ? Math.max(0, harm.monochrome) / total : 0;
  if (!intent.primaryHint && mono > 0.55 && v < -0.2) rel = Math.min(rel, 0.12);
  return clamp(rel, 0.04, 0.98);
}

/** A second strong hue concept in the brief (e.g. "surf" in "sunset surf shop") becomes the accent. */
function conceptAccent(intent: Intent, primary: Oklch, neutralPrimary: boolean): number | null {
  const lead = intent.hueClusters[0];
  for (const cluster of intent.hueClusters) {
    if (cluster.w < 0.9 || (lead && cluster !== lead && cluster.w < lead.w * 0.4)) continue;
    if (neutralPrimary || hueDistance(cluster.h, primary.h) >= 40) return cluster.h;
  }
  return null;
}

function isMuddyZone(hue: number): boolean {
  const h = normalizeHue(hue);
  return h > 88 && h < 128;
}

function inkFor(hue: number, intent: Intent, hinted: boolean, isPrimary: boolean): { preference: InkPreference; penalty: number } {
  if (hinted) return { preference: "either", penalty: 0 };
  if (isPrimary && intent.dims.tone <= -0.3) return { preference: "white", penalty: 0.12 + Math.min(0.2, -intent.dims.tone * 0.25) };
  const pref = inkPreference(hue);
  const bright = intent.dims.playful > 0.45 || intent.dims.tone > 0.35;
  return { preference: bright && pref !== "dark" && isWarmHue(hue) ? "dark" : pref, penalty: 0.12 };
}

function chromaCap(intent: Intent): number {
  return 0.2 + 0.06 * Math.max(0, intent.dims.vibrancy);
}

interface ColorPlan {
  primary: Oklch;
  primaryExact: string | null;
  accent: Oklch;
  accentExact: string | null;
  harmony: Harmony;
}

function planColors(intent: Intent, exactPrimary: string | null, variation: number, rng: Rng): ColorPlan {
  const tone = intent.dims.tone;
  let primary: Oklch;
  if (exactPrimary) {
    primary = hexToOklch(exactPrimary);
  } else {
    const base = intent.primaryHint?.hue ?? intent.hue;
    let hue = base ?? defaultHue(intent);
    if (base !== null && !intent.primaryHint && intent.hueConfidence < 0.3) {
      hue = mixHue(defaultHue(intent), base, 0.35 + intent.hueConfidence * 2);
    }
    if (variation > 0) hue = normalizeHue(hue + (rng.next() < 0.5 ? -1 : 1) * (5 + rng.next() * 9));
    hue = avoidHues(hue, intent.avoidHues);
    let rel = primaryRel(intent);
    if (variation > 0) rel = clamp(rel * (1 + rng.jitter(0.1)), 0.04, 0.98);
    let targetL = naturalLightness(hue) + tone * 0.14;
    if (intent.primaryHint) targetL = lerp(targetL, intent.primaryHint.l, 0.6);
    const ink = inkFor(hue, intent, !!intent.primaryHint, true);
    primary = fitAnchor(hue, rel, clamp(targetL, 0.38, 0.9), chromaCap(intent), ink.preference, ink.penalty);
  }

  const pRel = primary.c / Math.max(1e-6, maxChroma(primary.l, primary.h));
  const neutralPrimary = primary.c < 0.03;
  const ranked = rankHarmonies(intent);
  const schedule = [0, 1, 2, 0, 1];
  let harmony = ranked[schedule[variation % schedule.length]];
  if (neutralPrimary && harmony === "monochrome") harmony = ranked.find((h) => h !== "monochrome") ?? "complementary";
  const flip = variation % 2 === 1 || variation === 4;

  const accentExact: string | null = intent.accentHex;
  const concept = conceptAccent(intent, primary, neutralPrimary);
  let accentHue: number;
  let hinted = false;
  if (accentExact) {
    accentHue = hexToOklch(accentExact).h;
    hinted = true;
  } else if (intent.accentHint && (neutralPrimary || hueDistance(intent.accentHint.hue, primary.h) >= 25)) {
    accentHue = intent.accentHint.hue;
    hinted = true;
  } else if (concept !== null) {
    accentHue = concept;
    hinted = true;
  } else if (intent.accentHue !== null && (neutralPrimary || hueDistance(intent.accentHue, primary.h) >= 30) && variation % 3 !== 2) {
    accentHue = intent.accentHue;
    hinted = true;
  } else if (neutralPrimary) {
    accentHue = intent.hue ?? (intent.vibes.includes("classic") ? 27 : intent.dims.warmth > 0.2 ? 35 : DEFAULT_HUE);
    hinted = intent.hue !== null;
  } else {
    accentHue = pickAccentHue(primary.h, harmony, pRel * (harmony === "monochrome" ? 0.6 : 0.9), flip);
  }
  if (hinted && variation > 0 && !accentExact) accentHue = normalizeHue(accentHue + rng.jitter(8));
  if (hinted && !neutralPrimary) harmony = harmonyFromAngle(primary.h, accentHue);
  if (!accentExact) accentHue = avoidHues(accentHue, intent.avoidHues);

  let accent: Oklch;
  if (accentExact) {
    accent = hexToOklch(accentExact);
  } else {
    const balance: Record<Harmony, number> = { monochrome: 0.6, analogous: 1, complementary: 0.9, split: 0.92, triadic: 0.9 };
    let rel = neutralPrimary
      ? clamp(0.76 + 0.15 * intent.dims.vibrancy, 0.55, 0.92)
      : Math.min(pRel * balance[harmony] + (harmony === "analogous" ? 0.08 : 0), 0.92);
    if (intent.accentHint) rel = lerp(rel, intent.accentHint.rel, 0.6);
    else if (isMuddyZone(accentHue) && intent.dims.vibrancy > -0.3) rel = Math.max(rel, 0.86);
    if (variation > 0) rel = clamp(rel * (1 + rng.jitter(0.08)), 0.05, 0.95);
    let targetL = naturalLightness(accentHue) + tone * 0.08;
    if (intent.accentHint) targetL = lerp(targetL, intent.accentHint.l, 0.6);
    if (harmony === "monochrome") targetL = primary.l > 0.62 ? primary.l - 0.12 : primary.l + 0.12;
    else if (!intent.accentHint && Math.abs(targetL - primary.l) < 0.08) targetL = primary.l > 0.6 ? primary.l - 0.1 : primary.l + 0.1;
    const ink = inkFor(accentHue, intent, !!intent.accentHint, false);
    accent = fitAnchor(accentHue, rel, clamp(targetL, 0.42, 0.88), chromaCap(intent), ink.preference, ink.penalty);
  }
  return { primary, primaryExact: exactPrimary, accent, accentExact, harmony };
}

function planNeutral(intent: Intent, primary: Oklch): { hue: number; chroma: number } {
  const { warmth, vibrancy } = intent.dims;
  const gray = primary.c < 0.03;
  let hue = gray ? (warmth > 0.15 ? 70 : 262) : primary.h;
  if (warmth > 0.2) hue = mixHue(hue, 65, Math.min(0.75, (warmth - 0.2) * 0.9));
  else if (warmth < -0.2) hue = mixHue(hue, 250, Math.min(0.6, (-warmth - 0.2) * 0.7));
  const base = gray ? Math.min(0.012, primary.c * 0.4 + 0.004) : 0.011 + 0.007 * vibrancy + Math.min(0.006, primary.c * 0.03);
  const chroma = clamp(base + Math.max(0, warmth) * 0.004, 0.003, 0.03);
  return { hue: normalizeHue(hue), chroma };
}

function deriveTags(intent: Intent): string[] {
  const tags = [...intent.tags];
  const { dims } = intent;
  const derived: [boolean, string][] = [
    [dims.energy > 0.45, "Energetic"],
    [dims.energy < -0.45, "Calm"],
    [dims.elegance > 0.45, "Elegant"],
    [dims.playful > 0.45, "Playful"],
    [dims.vibrancy > 0.5, "Vibrant"],
    [dims.vibrancy < -0.5, "Muted"],
    [dims.dark > 0.45, "Dark"],
    [dims.dark < -0.45, "Airy"],
    [dims.contrast > 0.55, "High Contrast"],
    [dims.roundness > 0.55, "Rounded"],
    [dims.roundness < -0.55, "Sharp"],
  ];
  for (const [cond, tag] of derived) if (cond && tags.length < 6 && !tags.includes(tag)) tags.push(tag);
  for (const tag of ["Balanced", "Modern", "Versatile"]) if (tags.length < 3 && !tags.includes(tag)) tags.push(tag);
  return tags.slice(0, 6);
}

const FONT_PHRASE: Record<FontPersonality, string> = {
  geometric: "geometric sans",
  humanist: "humanist sans",
  grotesk: "grotesk sans",
  editorial: "editorial serif",
  technical: "technical type",
  rounded: "rounded sans",
  luxury: "high-contrast serif",
};

function describeTone(o: Oklch): string {
  const rel = o.c / Math.max(1e-6, maxChroma(o.l, o.h));
  if (o.c < 0.03) return o.l < 0.35 ? "Inky" : o.l > 0.85 ? "Pale" : "Cool";
  if (o.l < 0.48) return "Deep";
  if (o.l > 0.82) return "Soft";
  if (rel > 0.82) return "Vivid";
  if (rel < 0.4) return "Muted";
  return "Rich";
}

function summarize(theme: ThemeTokens, harmony: Harmony, personality: FontPersonality, pairing: Pairing, md: number): string {
  const p = hexToOklch(theme.color.primary[500]);
  const a = hexToOklch(theme.color.accent[500]);
  const primaryName = nearestColorName(theme.color.primary[500]);
  const accentName = nearestColorName(theme.color.accent[500]);
  const lead = p.c < 0.03 ? `${describeTone(p)} ${primaryName} neutrals` : `${describeTone(p)} ${primaryName}`;
  const temperature = harmony === "monochrome" ? "tonal" : a.c < 0.03 ? "quiet" : isWarmHue(a.h) ? "warm" : "cool";
  const accent = accentName === primaryName ? `a ${temperature} ${accentName} counterpoint` : `a ${temperature} ${accentName} accent`;
  const corners =
    md === 0 ? "square corners" :
    md <= 3 ? `sharp ${md}px corners` :
    md <= 6 ? `crisp ${md}px corners` :
    md <= 10 ? `soft ${md}px corners` :
    md <= 14 ? `rounded ${md}px corners` : `pillowy ${md}px corners`;
  return `${lead} with ${accent}, ${pairing.display} ${FONT_PHRASE[personality]}, ${corners}.`;
}

function preferredMode(intent: Intent): "light" | "dark" {
  return intent.dims.dark < -0.08 ? "light" : "dark";
}

/** Computes a complete, accessible theme from a brief and/or seed color. Pure and deterministic. */
export function generateTheme(input: EngineInput): EngineResult {
  const variation = Number.isFinite(input.variation) ? Math.max(0, Math.floor(input.variation as number)) : 0;
  const seed = input.mode !== "prompt" && input.seedColor ? normalizeHex(input.seedColor) : null;
  const prompt = input.mode === "color" ? "" : (input.prompt ?? "").trim();
  const normalizedPrompt = prompt.toLowerCase().replace(/\s+/g, " ");

  let intent: Intent;
  if (input.mode === "color" && seed) {
    intent = analyzeSeed(seed);
  } else {
    const locked = input.mode === "both" && seed ? hexToOklch(seed).h : null;
    intent = analyzeBrief(prompt, locked);
    if (locked !== null && intent.matches === 0) intent = analyzeSeed(seed as string);
  }
  const exactPrimary = input.mode === "prompt" ? intent.primaryHex : seed ?? intent.primaryHex;
  const rng = createRng(`${input.mode}|${seed ?? ""}|${normalizedPrompt}|${variation}`);

  const colors = planColors(intent, exactPrimary, variation, rng);
  const neutral = planNeutral(intent, colors.primary);
  const color = buildPalette({
    primary: colors.primary,
    primaryExact: colors.primaryExact,
    accent: colors.accent,
    accentExact: colors.accentExact,
    neutralHue: neutral.hue,
    neutralChroma: neutral.chroma,
    vibrancy: intent.dims.vibrancy,
    warmth: intent.dims.warmth,
    dark: intent.dims.dark,
    contrast: intent.dims.contrast,
  });

  const personalities = choosePersonality(intent.fonts, intent.dims, intent.vibes);
  const personality = personalities[0];
  const pairings = rankPairings(personality, intent.vibes);
  const pairing = pairings[variation % pairings.length];
  const typography = buildTypography({ personality, pairing, dims: intent.dims });

  let md = radiusMd(intent.dims.roundness);
  if (variation > 0 && md >= 4) md = Math.max(2, md + rng.int(-2, 2));

  const p500 = hexToOklch(color.primary[500]);
  const theme: ThemeTokens = {
    color,
    typography,
    spacing: buildSpacing(),
    radius: buildRadius(md),
    shadow: buildShadows({ dims: intent.dims, vibes: intent.vibes, shadowHue: p500.h, shadowChroma: p500.c }),
    animation: buildAnimation(intent.dims),
    zIndex: buildZIndex(),
    blur: buildBlur(intent.dims),
  };

  const p500Rel = p500.c / Math.max(1e-6, maxChroma(p500.l, p500.h));
  const name = makeName({
    family: hueFamily(p500.h, p500.c),
    tone: p500.l < 0.48 ? "deep" : p500Rel < 0.45 ? "muted" : "clear",
    dims: intent.dims,
    vibes: intent.vibes,
    adjectives: intent.adjectives,
    nouns: intent.nouns,
    rng,
  });

  return {
    theme,
    name,
    analysis: {
      tags: deriveTags(intent),
      summary: summarize(theme, colors.harmony, personality, pairing, md),
      primaryHue: Math.round(p500.h),
      harmony: HARMONY_LABEL[colors.harmony],
      fontPersonality: FONT_PERSONALITY_LABEL[personality],
      preferredMode: preferredMode(intent),
    },
  };
}
