import type { ThemeTokens } from "@/types/theme";
import { clamp } from "./color";
import type { Dim, FontPersonality, Vibe } from "./types";

type Category = "sans" | "serif" | "mono" | "display";

interface FontInfo {
  category: Category;
  weights: number[];
}

const range = (from: number, to: number) => [300, 400, 500, 600, 700, 800].filter((w) => w >= from && w <= to);

/** Google Fonts families the engine may emit or recognise, with the weights each one actually ships (within 300..800). */
export const GOOGLE_FONTS: Record<string, FontInfo> = {
  "Inter": { category: "sans", weights: range(300, 800) },
  "Inter Tight": { category: "sans", weights: range(300, 800) },
  "Plus Jakarta Sans": { category: "sans", weights: range(300, 800) },
  "Manrope": { category: "sans", weights: range(300, 800) },
  "Outfit": { category: "sans", weights: range(300, 800) },
  "Sora": { category: "sans", weights: range(300, 800) },
  "Urbanist": { category: "sans", weights: range(300, 800) },
  "Figtree": { category: "sans", weights: range(300, 800) },
  "Lexend": { category: "sans", weights: range(300, 800) },
  "DM Sans": { category: "sans", weights: range(300, 800) },
  "Space Grotesk": { category: "sans", weights: range(300, 700) },
  "Schibsted Grotesk": { category: "sans", weights: range(400, 800) },
  "Hanken Grotesk": { category: "sans", weights: range(300, 800) },
  "Bricolage Grotesque": { category: "sans", weights: range(300, 800) },
  "Instrument Sans": { category: "sans", weights: range(400, 700) },
  "Archivo": { category: "sans", weights: range(300, 800) },
  "Public Sans": { category: "sans", weights: range(300, 800) },
  "Albert Sans": { category: "sans", weights: range(300, 800) },
  "Onest": { category: "sans", weights: range(300, 800) },
  "Source Sans 3": { category: "sans", weights: range(300, 800) },
  "Nunito Sans": { category: "sans", weights: range(300, 800) },
  "Fira Sans": { category: "sans", weights: range(300, 800) },
  "Work Sans": { category: "sans", weights: range(300, 800) },
  "Open Sans": { category: "sans", weights: range(300, 800) },
  "Roboto": { category: "sans", weights: [300, 400, 500, 700] },
  "Lato": { category: "sans", weights: [300, 400, 700] },
  "Montserrat": { category: "sans", weights: range(300, 800) },
  "Poppins": { category: "sans", weights: range(300, 800) },
  "Raleway": { category: "sans", weights: range(300, 800) },
  "Mulish": { category: "sans", weights: range(300, 800) },
  "Karla": { category: "sans", weights: range(300, 800) },
  "Rubik": { category: "sans", weights: range(300, 800) },
  "Barlow": { category: "sans", weights: range(300, 800) },
  "Libre Franklin": { category: "sans", weights: range(300, 800) },
  "Jost": { category: "sans", weights: range(300, 800) },
  "IBM Plex Sans": { category: "sans", weights: range(300, 700) },
  "Red Hat Display": { category: "sans", weights: range(300, 800) },
  "Red Hat Text": { category: "sans", weights: range(300, 700) },
  "Syne": { category: "display", weights: range(400, 800) },
  "Unbounded": { category: "display", weights: range(300, 800) },
  "Chakra Petch": { category: "sans", weights: range(300, 700) },
  "Oxanium": { category: "display", weights: range(300, 800) },
  "Nunito": { category: "sans", weights: range(300, 800) },
  "Quicksand": { category: "sans", weights: range(300, 700) },
  "Fredoka": { category: "sans", weights: range(300, 700) },
  "Baloo 2": { category: "display", weights: range(400, 800) },
  "Comfortaa": { category: "display", weights: range(300, 700) },
  "Fraunces": { category: "serif", weights: range(300, 800) },
  "Playfair Display": { category: "serif", weights: range(400, 800) },
  "Instrument Serif": { category: "serif", weights: [400] },
  "Newsreader": { category: "serif", weights: range(300, 800) },
  "Lora": { category: "serif", weights: range(400, 700) },
  "Merriweather": { category: "serif", weights: [300, 400, 700] },
  "Libre Baskerville": { category: "serif", weights: [400, 700] },
  "EB Garamond": { category: "serif", weights: range(400, 800) },
  "Crimson Pro": { category: "serif", weights: range(300, 800) },
  "Literata": { category: "serif", weights: range(300, 800) },
  "Source Serif 4": { category: "serif", weights: range(300, 800) },
  "DM Serif Display": { category: "serif", weights: [400] },
  "Young Serif": { category: "serif", weights: [400] },
  "Cormorant Garamond": { category: "serif", weights: range(300, 700) },
  "Cormorant": { category: "serif", weights: range(300, 700) },
  "Bodoni Moda": { category: "serif", weights: range(400, 800) },
  "Cinzel": { category: "serif", weights: range(400, 800) },
  "IBM Plex Serif": { category: "serif", weights: range(300, 700) },
  "JetBrains Mono": { category: "mono", weights: range(300, 800) },
  "IBM Plex Mono": { category: "mono", weights: range(300, 700) },
  "Fira Code": { category: "mono", weights: range(300, 700) },
  "Source Code Pro": { category: "mono", weights: range(300, 800) },
  "Space Mono": { category: "mono", weights: [400, 700] },
  "DM Mono": { category: "mono", weights: [300, 400, 500] },
  "Roboto Mono": { category: "mono", weights: range(300, 700) },
  "Red Hat Mono": { category: "mono", weights: range(300, 700) },
  "Martian Mono": { category: "mono", weights: range(300, 800) },
  "Spline Sans Mono": { category: "mono", weights: range(300, 700) },
  "Inconsolata": { category: "mono", weights: range(300, 800) },
};

const FALLBACK: Record<Category, string> = {
  sans: "ui-sans-serif, system-ui, sans-serif",
  display: "ui-sans-serif, system-ui, sans-serif",
  serif: "ui-serif, Georgia, serif",
  mono: 'ui-monospace, "SF Mono", Menlo, monospace',
};

export function fontStack(family: string): string {
  const info = GOOGLE_FONTS[family];
  return `"${family}", ${FALLBACK[info?.category ?? "sans"]}`;
}

export function primaryFamily(stack: string): string {
  const first = stack.split(",")[0]?.trim() ?? "";
  return first.replace(/^["']|["']$/g, "");
}

export interface Pairing {
  display: string;
  body: string;
  mono: string;
  vibes?: Vibe[];
}

export const PAIRINGS: Record<FontPersonality, Pairing[]> = {
  geometric: [
    { display: "Plus Jakarta Sans", body: "Plus Jakarta Sans", mono: "JetBrains Mono" },
    { display: "Manrope", body: "Manrope", mono: "JetBrains Mono" },
    { display: "Outfit", body: "Inter", mono: "DM Mono", vibes: ["bold", "soft"] },
    { display: "Sora", body: "Inter", mono: "JetBrains Mono", vibes: ["futuristic", "tech"] },
    { display: "Urbanist", body: "DM Sans", mono: "DM Mono", vibes: ["soft"] },
    { display: "Unbounded", body: "Manrope", mono: "JetBrains Mono", vibes: ["futuristic", "bold", "retro"] },
  ],
  humanist: [
    { display: "Source Sans 3", body: "Source Sans 3", mono: "Source Code Pro" },
    { display: "Nunito Sans", body: "Nunito Sans", mono: "JetBrains Mono", vibes: ["soft"] },
    { display: "Fira Sans", body: "Fira Sans", mono: "Fira Code", vibes: ["tech"] },
    { display: "Work Sans", body: "Work Sans", mono: "IBM Plex Mono", vibes: ["organic"] },
    { display: "Figtree", body: "Figtree", mono: "JetBrains Mono", vibes: ["soft"] },
  ],
  grotesk: [
    { display: "Inter", body: "Inter", mono: "JetBrains Mono" },
    { display: "Space Grotesk", body: "Inter", mono: "JetBrains Mono", vibes: ["futuristic", "tech", "brutal"] },
    { display: "Schibsted Grotesk", body: "Schibsted Grotesk", mono: "JetBrains Mono", vibes: ["classic", "bold"] },
    { display: "Hanken Grotesk", body: "Hanken Grotesk", mono: "IBM Plex Mono" },
    { display: "Bricolage Grotesque", body: "Inter", mono: "JetBrains Mono", vibes: ["retro", "bold"] },
    { display: "Archivo", body: "Archivo", mono: "Space Mono", vibes: ["brutal", "bold"] },
  ],
  editorial: [
    { display: "Fraunces", body: "Inter", mono: "JetBrains Mono", vibes: ["retro", "organic", "soft"] },
    { display: "Playfair Display", body: "Source Sans 3", mono: "Source Code Pro", vibes: ["classic"] },
    { display: "Newsreader", body: "Inter", mono: "IBM Plex Mono", vibes: ["classic"] },
    { display: "Instrument Serif", body: "Instrument Sans", mono: "JetBrains Mono" },
    { display: "Lora", body: "Nunito Sans", mono: "Fira Code", vibes: ["soft", "organic"] },
    { display: "EB Garamond", body: "Inter", mono: "IBM Plex Mono", vibes: ["classic"] },
  ],
  technical: [
    { display: "IBM Plex Sans", body: "IBM Plex Sans", mono: "IBM Plex Mono" },
    { display: "Space Grotesk", body: "IBM Plex Sans", mono: "JetBrains Mono", vibes: ["futuristic", "brutal"] },
    { display: "JetBrains Mono", body: "Inter", mono: "JetBrains Mono", vibes: ["tech", "retro"] },
    { display: "Red Hat Display", body: "Red Hat Text", mono: "Red Hat Mono" },
    { display: "Space Mono", body: "IBM Plex Sans", mono: "Space Mono", vibes: ["brutal", "retro"] },
    { display: "Chakra Petch", body: "Inter", mono: "JetBrains Mono", vibes: ["futuristic"] },
  ],
  rounded: [
    { display: "Nunito", body: "Nunito", mono: "JetBrains Mono" },
    { display: "Fredoka", body: "Nunito", mono: "JetBrains Mono", vibes: ["bold"] },
    { display: "Quicksand", body: "Nunito Sans", mono: "DM Mono", vibes: ["soft"] },
    { display: "Baloo 2", body: "Nunito", mono: "JetBrains Mono", vibes: ["bold", "retro"] },
    { display: "Comfortaa", body: "Nunito Sans", mono: "DM Mono", vibes: ["soft", "retro"] },
  ],
  luxury: [
    { display: "Cormorant Garamond", body: "Jost", mono: "IBM Plex Mono", vibes: ["classic"] },
    { display: "Bodoni Moda", body: "Manrope", mono: "IBM Plex Mono", vibes: ["bold"] },
    { display: "Cinzel", body: "Raleway", mono: "IBM Plex Mono", vibes: ["classic"] },
    { display: "Playfair Display", body: "Jost", mono: "IBM Plex Mono", vibes: ["soft"] },
    { display: "Cormorant", body: "Montserrat", mono: "IBM Plex Mono" },
  ],
};

export function rankPairings(personality: FontPersonality, vibes: Vibe[]): Pairing[] {
  const list = PAIRINGS[personality];
  const score = (p: Pairing, index: number) =>
    (p.vibes ?? []).reduce((s, v) => s + (vibes.includes(v) ? 1 + (vibes.length - vibes.indexOf(v)) * 0.1 : 0), 0) - index * 0.01;
  return list
    .map((p, i) => ({ p, s: score(p, i) }))
    .sort((a, b) => b.s - a.s)
    .map(({ p }) => p);
}

export function choosePersonality(fonts: Record<FontPersonality, number>, dims: Record<Dim, number>, vibes: Vibe[]): FontPersonality[] {
  const pos = (v: number) => Math.max(0, v);
  const score: Record<FontPersonality, number> = {
    geometric: fonts.geometric + 0.2 + pos(dims.energy) * 0.2,
    humanist: fonts.humanist + pos(dims.warmth) * 0.15 + pos(-dims.energy) * 0.35,
    grotesk: fonts.grotesk + 0.28 + pos(dims.contrast) * 0.1,
    editorial: fonts.editorial + pos(dims.elegance) * 0.6,
    technical: fonts.technical + pos(dims.density) * 0.3 + (vibes.includes("tech") ? 0.3 : 0),
    rounded: fonts.rounded + pos(dims.playful) * 0.8 + pos(dims.roundness - 0.4) * 0.5,
    luxury: fonts.luxury + pos(dims.elegance - 0.45) * 1.2,
  };
  return (Object.keys(score) as FontPersonality[]).sort((a, b) => score[b] - score[a]);
}

export interface TypographyPlan {
  personality: FontPersonality;
  pairing: Pairing;
  dims: Record<Dim, number>;
}

const px = (n: number) => `${n}px`;

function typeScale(base: number, ratio: number): number[] {
  const exponents = [-2, -1, 0, 0.5, 1, 2, 3, 4, 5, 6, 7];
  const raw = exponents.map((e) => base * Math.pow(ratio, e));
  const knee = 24;
  const top = raw[raw.length - 1];
  const target = clamp(top, 44, 72);
  const k = top > knee && target !== top ? Math.log(target / knee) / Math.log(top / knee) : 1;
  const shaped = raw.map((s) => (s > knee ? knee * Math.pow(s / knee, k) : s));
  const out: number[] = [];
  shaped.forEach((s, i) => {
    let v = Math.round(s);
    if (i === 0) v = Math.max(11, v);
    if (i === 1) v = Math.max(12, v);
    if (i > 0) v = Math.max(v, out[i - 1] + (i <= 4 ? 1 : 2));
    out.push(v);
  });
  return out;
}

export function buildTypography(plan: TypographyPlan): ThemeTokens["typography"] {
  const { personality, pairing, dims } = plan;
  const density = dims.density;
  const base = density >= 0.35 ? 14 : density >= 0.1 ? 15 : 16;
  const display = personality === "editorial" || personality === "luxury";
  const ratio = clamp(
    1.2 + 0.05 * dims.energy + 0.06 * dims.elegance - 0.05 * density + (display ? 0.05 : 0) + (personality === "technical" ? -0.03 : 0),
    1.125,
    1.333,
  );
  const sizes = typeScale(base, ratio);
  const keys = ["xs", "sm", "base", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"] as const;
  const fontSize = Object.fromEntries(keys.map((k, i) => [k, px(sizes[i])])) as ThemeTokens["typography"]["fontSize"];

  const luxury = personality === "luxury";
  const fontWeight = {
    light: "300",
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: luxury ? "600" : "700",
    extrabold: luxury ? "700" : "800",
  };

  const tight = personality === "rounded" ? 1.18 : display ? 1.06 : personality === "technical" ? 1.15 : 1.1;
  const normal = clamp(1.5 + (-density) * 0.05 + (personality === "editorial" ? 0.05 : 0), 1.45, 1.6);
  const lineHeight = {
    tight: tight.toFixed(2).replace(/0$/, ""),
    snug: (tight + 0.15).toFixed(2).replace(/0$/, ""),
    normal: normal.toFixed(2).replace(/0$/, ""),
    relaxed: (normal + 0.15).toFixed(2).replace(/0$/, ""),
    loose: "2",
  };

  const tracking: Record<FontPersonality, [number, number]> = {
    geometric: [-0.04, -0.02],
    grotesk: [-0.035, -0.018],
    humanist: [-0.025, -0.012],
    technical: [-0.02, -0.01],
    rounded: [-0.02, -0.01],
    editorial: [-0.03, -0.015],
    luxury: [-0.015, -0.005],
  };
  const [tighter, tightSpacing] = tracking[personality];
  const widest = personality === "luxury" ? 0.2 : display ? 0.14 : 0.1;
  const em = (n: number) => `${Number(n.toFixed(3))}em`;
  const letterSpacing = {
    tighter: em(tighter),
    tight: em(tightSpacing),
    normal: "0em",
    wide: em(personality === "luxury" ? 0.04 : 0.02),
    wider: em(personality === "luxury" ? 0.08 : 0.05),
    widest: em(widest),
  };

  return {
    fontFamily: {
      display: fontStack(pairing.display),
      body: fontStack(pairing.body),
      mono: fontStack(pairing.mono),
    },
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
  };
}

/** Google Fonts css2 URL for the theme's display, body and mono families; null when none are Google fonts. */
export function googleFontsHref(theme: ThemeTokens): string | null {
  const families: string[] = [];
  for (const stack of [theme.typography.fontFamily.display, theme.typography.fontFamily.body, theme.typography.fontFamily.mono]) {
    const name = primaryFamily(stack);
    if (GOOGLE_FONTS[name] && !families.includes(name)) families.push(name);
  }
  if (!families.length) return null;
  const params = families.map((name) => {
    const weights = GOOGLE_FONTS[name].weights;
    const family = name.replace(/ /g, "+");
    return weights.length > 1 || weights[0] !== 400 ? `family=${family}:wght@${weights.join(";")}` : `family=${family}`;
  });
  return `https://fonts.googleapis.com/css2?${params.join("&")}&display=swap`;
}
