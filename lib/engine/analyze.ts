import {
  NAMED_COLORS, circularMean, clamp, hexToOklch, hueDistance, hueFamily, isWarmHue, maxChroma, normalizeHex,
  type HueFamily,
} from "./color";
import { ACCENT_LEADS, ACCENT_MARKERS, LEXICON, isFiller, isNegator, negationPhraseLength } from "./lexicon";
import {
  DIMS, FONT_PERSONALITIES, HARMONIES,
  type ColorHint, type Dim, type FontPersonality, type Harmony, type Intent, type LexEntry, type Vibe,
} from "./types";

const MAX_TOKENS = 600;
const MAX_PHRASE = 4;

interface ColorMention extends ColorHint {
  hex: string;
  index: number;
  accent: boolean;
  negated: boolean;
}

interface Match {
  key: string;
  entry: LexEntry;
  index: number;
  negated: boolean;
}

export function tokenize(text: string): { tokens: string[]; hexes: string[] } {
  const lower = text.toLowerCase().slice(0, 6000);
  const hexes: string[] = [];
  const stripped = lower.replace(/#([0-9a-f]{6}|[0-9a-f]{3})(?![0-9a-z])/g, (m) => {
    const hex = normalizeHex(m);
    if (hex) hexes.push(hex);
    return " ";
  });
  const tokens = stripped
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .slice(0, MAX_TOKENS);
  return { tokens, hexes };
}

function undouble(s: string): string | null {
  return /([b-df-hj-np-tv-z])\1$/.test(s) ? s.slice(0, -1) : null;
}

export function stems(token: string): string[] {
  const out = [token];
  const add = (s: string | null) => {
    if (s && s.length >= 2 && !out.includes(s)) out.push(s);
  };
  const strip = (suffix: string) => token.slice(0, -suffix.length);
  if (token.length <= 3) return out;
  if (token.endsWith("ies")) add(strip("ies") + "y");
  if (token.endsWith("es")) add(strip("es"));
  if (token.endsWith("s") && !token.endsWith("ss")) add(strip("s"));
  if (token.endsWith("ily")) add(strip("ily") + "y");
  if (token.endsWith("ly")) add(strip("ly"));
  if (token.endsWith("ness")) {
    const b = strip("ness");
    add(b);
    if (b.endsWith("i")) add(b.slice(0, -1) + "y");
  }
  for (const suffix of ["ing", "ed", "ish", "er", "est"]) {
    if (!token.endsWith(suffix) || token.length - suffix.length < 3) continue;
    const b = strip(suffix);
    add(b);
    add(b + "e");
    add(undouble(b));
    if (b.endsWith("i")) add(b.slice(0, -1) + "y");
  }
  if (token.endsWith("y") && token.length > 4) {
    const b = strip("y");
    add(b);
    add(undouble(b));
  }
  return out;
}

type Found = { key: string; entry: LexEntry } | { key: string; colorHex: string };

function lookupPhrase(words: string[]): Found | null {
  const last = words[words.length - 1];
  const head = words.slice(0, -1);
  for (const variant of stems(last)) {
    const key = [...head, variant].join(" ");
    const entry = LEXICON[key];
    if (entry) return { key, entry };
    const colorHex = NAMED_COLORS[key];
    if (colorHex) return { key, colorHex };
  }
  return null;
}

function colorHint(hex: string): ColorHint {
  const o = hexToOklch(hex);
  const max = maxChroma(o.l, o.h);
  return { hue: o.h, l: o.l, c: o.c, rel: max > 0 ? clamp(o.c / max, 0, 1) : 0 };
}

/**
 * Groups hue votes into concepts instead of averaging them: blue "ocean" and orange "sunset"
 * stay two distinct hues rather than collapsing into a muddy green.
 */
export function clusterHues(votes: { h: number; w: number }[]): { h: number; w: number }[] {
  let remaining = votes.filter((v) => v.w > 0);
  const clusters: { h: number; w: number }[] = [];
  while (remaining.length) {
    let best = remaining[0];
    let bestSupport = -1;
    for (const v of remaining) {
      const support = remaining.reduce((s, o) => s + o.w * Math.max(0, 1 - hueDistance(v.h, o.h) / 50), 0);
      if (support > bestSupport) {
        bestSupport = support;
        best = v;
      }
    }
    const members = remaining.filter((v) => hueDistance(v.h, best.h) <= 45);
    const mean = circularMean(members);
    clusters.push({ h: mean ? mean.h : best.h, w: members.reduce((s, v) => s + v.w, 0) });
    remaining = remaining.filter((v) => !members.includes(v));
  }
  return clusters.sort((a, b) => b.w - a.w);
}

function emptyRecord<K extends string>(keys: readonly K[]): Record<K, number> {
  return Object.fromEntries(keys.map((k) => [k, 0])) as Record<K, number>;
}

class IntentBuilder {
  private dimSum = emptyRecord(DIMS);
  private dimWeight = emptyRecord(DIMS);
  private hueVotes: { h: number; w: number }[] = [];
  private accentVotes: { h: number; w: number }[] = [];
  private fonts = emptyRecord(FONT_PERSONALITIES);
  private harmonies = emptyRecord(HARMONIES);
  private vibes = new Map<Vibe, number>();
  private tags = new Map<string, number>();
  private nouns = new Map<string, number>();
  private adjectives = new Map<string, number>();
  primaryHint: ColorHint | null = null;
  primaryHex: string | null = null;
  accentHint: ColorHint | null = null;
  accentHex: string | null = null;
  avoidHues: number[] = [];
  matches = 0;

  dims(values: Partial<Record<Dim, number>>, weight: number) {
    for (const [dim, value] of Object.entries(values) as [Dim, number][]) {
      this.dimSum[dim] += value * weight;
      this.dimWeight[dim] += Math.abs(weight) * (0.35 + 0.65 * Math.min(1, Math.abs(value)));
    }
  }

  hue(h: number, w: number) {
    this.hueVotes.push({ h, w });
  }

  accentHue(h: number, w: number) {
    this.accentVotes.push({ h, w });
  }

  harmonyBoost(h: Harmony, w: number) {
    this.harmonies[h] += w;
  }

  tag(tag: string, w: number) {
    this.tags.set(tag, (this.tags.get(tag) ?? 0) + w);
  }

  entry(entry: LexEntry, weight: number, negated: boolean) {
    this.matches++;
    if (entry.dims && !negated) this.dims(entry.dims, weight);
    if (negated) {
      if (entry.dims) {
        const values = Object.values(entry.dims).map(Math.abs);
        const peak = Math.max(0, ...values);
        const dominant = Object.fromEntries(Object.entries(entry.dims).filter(([, v]) => Math.abs(v) >= peak * 0.85));
        this.dims(dominant, weight * -0.7);
      }
      if (entry.font) for (const [k, v] of Object.entries(entry.font) as [FontPersonality, number][]) this.fonts[k] -= v * weight * 0.5;
      if (entry.harmony) for (const [k, v] of Object.entries(entry.harmony) as [Harmony, number][]) this.harmonies[k] -= v * weight * 0.5;
      if (entry.hue !== undefined && entry.kind !== "industry") this.avoidHues.push(entry.hue);
      return;
    }
    if (entry.hue !== undefined) this.hue(entry.hue, (entry.hw ?? 1) * weight);
    if (entry.accentHue !== undefined) this.accentHue(entry.accentHue, weight);
    if (entry.font) for (const [k, v] of Object.entries(entry.font) as [FontPersonality, number][]) this.fonts[k] += v * weight;
    if (entry.harmony) for (const [k, v] of Object.entries(entry.harmony) as [Harmony, number][]) this.harmonies[k] += v * weight;
    for (const vibe of entry.vibes ?? []) this.vibes.set(vibe, (this.vibes.get(vibe) ?? 0) + weight);
    if (entry.tag) this.tag(entry.tag, weight * (entry.kind === "industry" ? 1.25 : 1));
    for (const n of entry.nouns ?? []) this.nouns.set(n, (this.nouns.get(n) ?? 0) + weight);
    for (const a of entry.adjectives ?? []) this.adjectives.set(a, (this.adjectives.get(a) ?? 0) + weight);
  }

  build(): Intent {
    const dims = emptyRecord(DIMS);
    for (const dim of DIMS) {
      const w = this.dimWeight[dim];
      dims[dim] = w > 0 ? clamp(this.dimSum[dim] / (w + 0.35), -1, 1) : 0;
    }
    const clusters = clusterHues(this.hueVotes);
    const lead = clusters[0];
    const accent = circularMean(this.accentVotes);
    const ranked = (m: Map<string, number>) => [...m.entries()].sort((a, b) => b[1] - a[1]).map(([k]) => k);
    const vibes = [...this.vibes.entries()].filter(([, w]) => w >= 0.6).sort((a, b) => b[1] - a[1]).map(([v]) => v);
    return {
      dims,
      hue: lead ? lead.h : null,
      hueConfidence: lead ? Math.min(1, lead.w / 2.5) : 0,
      hueClusters: clusters,
      primaryHint: this.primaryHint,
      primaryHex: this.primaryHex,
      accentHue: accent && accent.strength > 0.5 ? accent.h : null,
      accentHint: this.accentHint,
      accentHex: this.accentHex,
      avoidHues: this.avoidHues,
      fonts: this.fonts,
      harmonies: this.harmonies,
      vibes,
      tags: ranked(this.tags),
      nouns: ranked(this.nouns),
      adjectives: ranked(this.adjectives),
      matches: this.matches,
    };
  }
}

function isAccentContext(tokens: string[], start: number, end: number): boolean {
  for (let k = end; k < Math.min(tokens.length, end + 2); k++) if (ACCENT_MARKERS.has(tokens[k])) return true;
  const before = tokens.slice(Math.max(0, start - 3), start).join(" ");
  return ACCENT_LEADS.some((lead) => before.endsWith(lead)) || tokens[start - 1] === "accent" || tokens[start - 2] === "accent";
}

function scan(tokens: string[]): { matches: Match[]; colors: ColorMention[] } {
  const matches: Match[] = [];
  const colors: ColorMention[] = [];
  let negateWindow = 0;
  let negateChain = false;
  let i = 0;
  while (i < tokens.length) {
    let found: Found | null = null;
    let len = 0;
    for (let n = Math.min(MAX_PHRASE, tokens.length - i); n >= 1; n--) {
      found = lookupPhrase(tokens.slice(i, i + n));
      if (found) {
        len = n;
        break;
      }
    }
    if (found) {
      const free = tokens[i + len] === "free" || (tokens[i + len] === "is" && tokens[i + len + 1] === "banned");
      const negated: boolean = negateWindow > 0 || negateChain || free;
      if ("entry" in found) {
        matches.push({ key: found.key, entry: found.entry, index: i, negated });
      } else {
        colors.push({
          hex: found.colorHex,
          index: i,
          accent: isAccentContext(tokens, i, i + len),
          negated,
          ...colorHint(found.colorHex),
        });
      }
      negateChain = negated && (tokens[i + len] === "or" || tokens[i + len] === "nor");
      negateWindow = 0;
      i += len + (negateChain ? 1 : 0);
      continue;
    }
    const token = tokens[i];
    const phraseNeg = negationPhraseLength(tokens, i);
    if (phraseNeg) {
      negateWindow = 3;
      i += phraseNeg;
      continue;
    }
    if (isNegator(token)) {
      negateWindow = 3;
    } else if (negateWindow > 0 && !isFiller(token)) {
      negateWindow--;
    }
    negateChain = false;
    i++;
  }
  return { matches, colors };
}

function applyColors(builder: IntentBuilder, colors: ColorMention[], primaryLocked: number | null) {
  const positive = colors.filter((c) => !c.negated);
  for (const c of colors.filter((m) => m.negated)) if (c.c >= 0.035) builder.avoidHues.push(c.hue);

  const chromatic = positive.filter((c) => c.c >= 0.035);
  let primary: ColorMention | undefined;
  if (primaryLocked === null) {
    primary = chromatic.find((c) => !c.accent) ?? (chromatic.length > 1 ? chromatic[0] : undefined);
    if (!primary && chromatic.length === 1 && !chromatic[0].accent) primary = chromatic[0];
  }
  const primaryHue = primaryLocked ?? primary?.hue ?? null;
  if (primary) {
    builder.primaryHint = { hue: primary.hue, l: primary.l, c: primary.c, rel: primary.rel };
    builder.hue(primary.hue, 4 * (0.5 + 0.5 * Math.min(1, primary.c / 0.08)));
  }
  const accent =
    chromatic.find((c) => c !== primary && c.accent) ??
    chromatic.find((c) => c !== primary && (primaryHue === null || hueDistance(c.hue, primaryHue) >= 30));
  if (accent) {
    builder.accentHint = { hue: accent.hue, l: accent.l, c: accent.c, rel: accent.rel };
    builder.accentHue(accent.hue, 6);
  }
  for (const c of chromatic) {
    if (c === primary || c === accent) continue;
    if (primaryHue !== null && hueDistance(c.hue, primaryHue) < 30) builder.hue(c.hue, 1.5);
  }
  for (const c of chromatic) {
    builder.matches++;
    builder.dims({ vibrancy: clamp((c.rel - 0.55) * 1.6, -1, 1) }, 0.8);
  }
  for (const c of positive.filter((m) => m.c < 0.035)) {
    builder.matches++;
    builder.harmonyBoost("monochrome", 0.35);
    if (c.l > 0.85) builder.dims({ dark: -0.5, vibrancy: -0.25, warmth: c.c > 0.008 && isWarmHue(c.hue) ? 0.45 : 0 }, 0.9);
    else if (c.l < 0.3) builder.dims({ dark: 0.6, contrast: 0.35, vibrancy: -0.2 }, 0.9);
    else builder.dims({ vibrancy: -0.5 }, 0.9);
  }
  if (chromatic.length >= 3) builder.harmonyBoost("triadic", 0.6);
}

/** Reads a free-text brief into a design intent. `lockedPrimary` is the seed hue in "both" mode. */
export function analyzeBrief(prompt: string, lockedPrimary: number | null = null): Intent {
  const builder = new IntentBuilder();
  const { tokens, hexes } = tokenize(prompt);
  const { matches, colors } = scan(tokens);
  const seen = new Map<LexEntry, number>();
  for (const m of matches) {
    const repeat = seen.get(m.entry) ?? 0;
    seen.set(m.entry, repeat + 1);
    const position = 1 - Math.min(0.3, m.index * 0.015);
    const weight = (m.entry.w ?? 1) * position * Math.pow(0.5, repeat);
    builder.entry(m.entry, weight, m.negated);
  }
  applyColors(builder, colors, lockedPrimary);
  if (hexes.length) {
    const [first, second] = hexes;
    if (lockedPrimary === null) {
      builder.primaryHex = first;
      builder.primaryHint = colorHint(first);
      builder.hue(builder.primaryHint.hue, 8);
      if (second) builder.accentHex = second;
    } else {
      builder.accentHex = first;
    }
    if (builder.accentHex) {
      builder.accentHint = colorHint(builder.accentHex);
      builder.accentHue(builder.accentHint.hue, 10);
    }
    builder.matches++;
  }
  return builder.build();
}

interface Persona {
  tags: string[];
  dims: Partial<Record<Dim, number>>;
  font: Partial<Record<FontPersonality, number>>;
  harmony: Partial<Record<Harmony, number>>;
  adjectives: string[];
}

const HUE_PERSONAS: Record<HueFamily, Persona> = {
  red: { tags: ["Bold", "Energetic"], dims: { energy: 0.6, contrast: 0.45, warmth: 0.6 }, font: { grotesk: 0.9, geometric: 0.5 }, harmony: { complementary: 0.4, analogous: 0.3 }, adjectives: ["Bold", "Fierce"] },
  orange: { tags: ["Friendly", "Energetic"], dims: { warmth: 0.8, playful: 0.4, energy: 0.5, roundness: 0.3 }, font: { geometric: 1, rounded: 0.4 }, harmony: { complementary: 0.5 }, adjectives: ["Sunny", "Zesty"] },
  amber: { tags: ["Warm", "Optimistic"], dims: { warmth: 0.85, energy: 0.3, roundness: 0.2 }, font: { geometric: 0.8, humanist: 0.5 }, harmony: { analogous: 0.4, complementary: 0.4 }, adjectives: ["Golden", "Honeyed"] },
  yellow: { tags: ["Optimistic", "Cheerful"], dims: { warmth: 0.6, playful: 0.5, energy: 0.5, roundness: 0.4 }, font: { geometric: 0.8, rounded: 0.6 }, harmony: { complementary: 0.5 }, adjectives: ["Sunny", "Radiant"] },
  lime: { tags: ["Fresh", "Energetic"], dims: { energy: 0.6, vibrancy: 0.3, warmth: 0.2 }, font: { geometric: 1 }, harmony: { complementary: 0.5, split: 0.3 }, adjectives: ["Zesty", "Fresh"] },
  green: { tags: ["Natural", "Fresh"], dims: { warmth: 0.1, energy: -0.1, roundness: 0.3 }, font: { humanist: 1, geometric: 0.5 }, harmony: { analogous: 0.5 }, adjectives: ["Verdant", "Fresh"] },
  teal: { tags: ["Calm", "Balanced"], dims: { energy: -0.3, warmth: -0.3, roundness: 0.3 }, font: { humanist: 0.8, geometric: 0.6 }, harmony: { analogous: 0.4, complementary: 0.4 }, adjectives: ["Tidal", "Serene"] },
  cyan: { tags: ["Fresh", "Technical"], dims: { warmth: -0.6, energy: 0.2 }, font: { geometric: 0.8, grotesk: 0.6 }, harmony: { analogous: 0.4, complementary: 0.4 }, adjectives: ["Glacial", "Crisp"] },
  blue: { tags: ["Trustworthy", "Professional"], dims: { warmth: -0.5, playful: -0.3, contrast: 0.2 }, font: { grotesk: 1, humanist: 0.5 }, harmony: { complementary: 0.4, analogous: 0.4 }, adjectives: ["Steady", "Cobalt"] },
  indigo: { tags: ["Modern", "Focused"], dims: { warmth: -0.3, density: 0.2 }, font: { grotesk: 1, geometric: 0.8 }, harmony: { analogous: 0.4, split: 0.4 }, adjectives: ["Modern", "Linear"] },
  violet: { tags: ["Creative", "Imaginative"], dims: { energy: 0.2, elegance: 0.2 }, font: { geometric: 1 }, harmony: { analogous: 0.4, split: 0.4 }, adjectives: ["Dreamy", "Prism"] },
  magenta: { tags: ["Expressive", "Bold"], dims: { energy: 0.6, playful: 0.4, vibrancy: 0.3 }, font: { geometric: 0.8, grotesk: 0.6 }, harmony: { complementary: 0.4, analogous: 0.4 }, adjectives: ["Electric", "Vivid"] },
  pink: { tags: ["Playful", "Warm"], dims: { playful: 0.5, warmth: 0.5, roundness: 0.5 }, font: { geometric: 0.6, rounded: 0.6, editorial: 0.3 }, harmony: { analogous: 0.5 }, adjectives: ["Rosy", "Blush"] },
  neutral: { tags: ["Minimal", "Monochrome"], dims: { vibrancy: -1, depth: -0.3, contrast: 0.3 }, font: { grotesk: 1.2 }, harmony: { monochrome: 0.6, analogous: 0.2 }, adjectives: ["Graphite", "Slate"] },
};

const FAMILY_LABEL: Record<HueFamily, string> = {
  red: "Red", orange: "Orange", amber: "Amber", yellow: "Yellow", lime: "Lime", green: "Green", teal: "Teal",
  cyan: "Cyan", blue: "Blue", indigo: "Indigo", violet: "Violet", magenta: "Magenta", pink: "Pink", neutral: "Neutral",
};

/** Derives an intent purely from a seed color: hue psychology plus lightness and chroma character. */
export function analyzeSeed(hex: string): Intent {
  const builder = new IntentBuilder();
  const o = hexToOklch(hex);
  const max = maxChroma(o.l, o.h);
  const rel = max > 0 ? clamp(o.c / max, 0, 1) : 0;
  const family = hueFamily(o.h, o.c);
  const persona = HUE_PERSONAS[family];
  builder.entry(
    { kind: "color", tag: FAMILY_LABEL[family], dims: persona.dims, font: persona.font, harmony: persona.harmony, adjectives: persona.adjectives },
    1, false,
  );
  persona.tags.forEach((tag, i) => builder.tag(tag, 0.9 - i * 0.1));
  const earthy = o.c >= 0.03 && o.c < 0.13 && o.l < 0.6 && o.h >= 25 && o.h <= 95;
  if (earthy) builder.entry({ kind: "trait", tag: "Earthy", dims: { warmth: 0.8, vibrancy: -0.4 }, font: { humanist: 0.8, editorial: 0.6 }, harmony: { analogous: 0.8 } }, 1.2, false);
  if (o.l < 0.42) builder.entry({ kind: "trait", tag: "Deep", dims: { dark: 0.5, elegance: 0.35, tone: -0.5 }, font: { editorial: 0.3 } }, 1, false);
  else if (o.l > 0.82) builder.entry({ kind: "trait", tag: o.c > 0.06 ? "Pastel" : "Airy", dims: { dark: -0.6, contrast: -0.3, roundness: 0.35, tone: 0.5 }, font: { rounded: 0.3 } }, 1, false);
  if (o.c >= 0.03) {
    if (rel > 0.8 && o.l <= 0.82) builder.entry({ kind: "trait", tag: "Vivid", dims: { vibrancy: 0.8, energy: 0.4 }, harmony: { complementary: 0.6 } }, 1, false);
    else if (rel < 0.4) builder.entry({ kind: "trait", tag: "Muted", dims: { vibrancy: -0.6, energy: -0.3, elegance: 0.2 }, harmony: { analogous: 0.6 } }, 1, false);
  }
  return builder.build();
}

export function brandHueOf(hex: string): number {
  return hexToOklch(hex).h;
}
