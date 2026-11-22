export type Dim =
  | "vibrancy"
  | "warmth"
  | "dark"
  | "contrast"
  | "roundness"
  | "density"
  | "energy"
  | "depth"
  | "playful"
  | "elegance"
  | "tone"
  | "glass";

export const DIMS: Dim[] = [
  "vibrancy", "warmth", "dark", "contrast", "roundness", "density",
  "energy", "depth", "playful", "elegance", "tone", "glass",
];

export type FontPersonality =
  | "geometric"
  | "humanist"
  | "grotesk"
  | "editorial"
  | "technical"
  | "rounded"
  | "luxury";

export const FONT_PERSONALITIES: FontPersonality[] = [
  "geometric", "humanist", "grotesk", "editorial", "technical", "rounded", "luxury",
];

export const FONT_PERSONALITY_LABEL: Record<FontPersonality, string> = {
  geometric: "Geometric",
  humanist: "Humanist",
  grotesk: "Grotesk",
  editorial: "Editorial Serif",
  technical: "Technical Mono",
  rounded: "Rounded",
  luxury: "Luxury Display",
};

export type Harmony = "monochrome" | "analogous" | "complementary" | "split" | "triadic";

export const HARMONIES: Harmony[] = ["monochrome", "analogous", "complementary", "split", "triadic"];

export const HARMONY_LABEL: Record<Harmony, string> = {
  monochrome: "Monochrome",
  analogous: "Analogous",
  complementary: "Complementary",
  split: "Split-Complementary",
  triadic: "Triadic",
};

export type Vibe = "futuristic" | "retro" | "bold" | "soft" | "brutal" | "classic" | "tech" | "glass" | "organic";

export type LexKind = "industry" | "trait" | "imagery" | "style" | "color";

export interface LexEntry {
  kind: LexKind;
  tag?: string;
  w?: number;
  hue?: number;
  hw?: number;
  accentHue?: number;
  dims?: Partial<Record<Dim, number>>;
  font?: Partial<Record<FontPersonality, number>>;
  harmony?: Partial<Record<Harmony, number>>;
  vibes?: Vibe[];
  nouns?: string[];
  adjectives?: string[];
}

export interface ColorHint {
  hue: number;
  l: number;
  c: number;
  rel: number;
}

export interface Intent {
  dims: Record<Dim, number>;
  hue: number | null;
  hueConfidence: number;
  hueClusters: { h: number; w: number }[];
  primaryHint: ColorHint | null;
  primaryHex: string | null;
  accentHue: number | null;
  accentHint: ColorHint | null;
  accentHex: string | null;
  avoidHues: number[];
  fonts: Record<FontPersonality, number>;
  harmonies: Record<Harmony, number>;
  vibes: Vibe[];
  tags: string[];
  nouns: string[];
  adjectives: string[];
  matches: number;
}
