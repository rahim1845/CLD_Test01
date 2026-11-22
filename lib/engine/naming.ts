import type { HueFamily } from "./color";
import type { Rng } from "./random";
import type { Dim, Vibe } from "./types";

const HUE_ADJECTIVES: Record<HueFamily, string[]> = {
  red: ["Crimson", "Scarlet", "Ruby", "Cardinal", "Garnet", "Cinnabar", "Vermilion"],
  orange: ["Copper", "Tangerine", "Apricot", "Saffron", "Persimmon", "Terracotta", "Rust"],
  amber: ["Amber", "Golden", "Honeyed", "Marigold", "Ochre", "Brass", "Topaz"],
  yellow: ["Citrine", "Golden", "Lemon", "Sunlit", "Mustard", "Canary", "Butter"],
  lime: ["Chartreuse", "Citron", "Kiwi", "Lime", "Pistachio", "Matcha", "Olive"],
  green: ["Emerald", "Jade", "Sage", "Fern", "Juniper", "Verdant", "Malachite"],
  teal: ["Teal", "Seafoam", "Turquoise", "Tidal", "Aqua", "Viridian", "Lagoon"],
  cyan: ["Cyan", "Glacial", "Aqua", "Arctic", "Crystal", "Cerulean", "Ice"],
  blue: ["Cobalt", "Azure", "Sapphire", "Cerulean", "Navy", "Denim", "Ultramarine"],
  indigo: ["Indigo", "Ultramarine", "Midnight", "Iris", "Twilight", "Ink", "Lapis"],
  violet: ["Violet", "Amethyst", "Lavender", "Orchid", "Wisteria", "Plum", "Lilac"],
  magenta: ["Fuchsia", "Magenta", "Orchid", "Berry", "Ultraviolet", "Mulberry", "Neon"],
  pink: ["Rose", "Blush", "Coral", "Peony", "Petal", "Flamingo", "Rosewood"],
  neutral: ["Graphite", "Slate", "Ash", "Pewter", "Stone", "Carbon", "Smoke"],
};

const HUE_NOUNS: Record<HueFamily, string[]> = {
  red: ["Ember", "Flame", "Poppy", "Lantern", "Cinder", "Canyon", "Beacon"],
  orange: ["Canyon", "Hearth", "Kiln", "Dune", "Sunset", "Ember", "Mesa"],
  amber: ["Harvest", "Honeycomb", "Dune", "Lantern", "Prairie", "Hearth", "Sunfield"],
  yellow: ["Meadow", "Sun", "Field", "Daybreak", "Sunbeam", "Lemonade", "Glow"],
  lime: ["Grove", "Sprout", "Orchard", "Meadow", "Zest", "Canopy", "Spring"],
  green: ["Grove", "Fern", "Canopy", "Thicket", "Glade", "Pine", "Hollow"],
  teal: ["Lagoon", "Reef", "Tide", "Cove", "Current", "Atoll", "Shoal"],
  cyan: ["Glacier", "Current", "Stream", "Frost", "Spring", "Horizon", "Cascade"],
  blue: ["Harbor", "Tide", "Horizon", "Atlas", "Bay", "Depth", "Meridian"],
  indigo: ["Dusk", "Nebula", "Orbit", "Vault", "Eclipse", "Nocturne", "Zenith"],
  violet: ["Orchid", "Iris", "Nebula", "Aurora", "Veil", "Prism", "Reverie"],
  magenta: ["Bloom", "Prism", "Pulse", "Spark", "Orchid", "Fever", "Signal"],
  pink: ["Blossom", "Petal", "Peony", "Bloom", "Sorbet", "Dawn", "Garden"],
  neutral: ["Studio", "Monolith", "Concrete", "Paper", "Ink", "Atelier", "Slate"],
};

const MUTED_ADJECTIVES: Record<HueFamily, string[]> = {
  red: ["Rosewood", "Brick", "Clay", "Mulberry", "Cinnamon"],
  orange: ["Terracotta", "Clay", "Sienna", "Rust", "Adobe"],
  amber: ["Ochre", "Sand", "Camel", "Wheat", "Tawny"],
  yellow: ["Straw", "Wheat", "Butter", "Flax", "Parchment"],
  lime: ["Sage", "Olive", "Moss", "Lichen", "Fennel"],
  green: ["Sage", "Eucalyptus", "Moss", "Fern", "Thyme"],
  teal: ["Seaglass", "Eucalyptus", "Celadon", "Verdigris", "Jade"],
  cyan: ["Mist", "Seaglass", "Glacier", "Celadon", "Rain"],
  blue: ["Slate", "Denim", "Steel", "Chambray", "Harbor"],
  indigo: ["Dusk", "Ink", "Twilight", "Storm", "Iris"],
  violet: ["Lavender", "Heather", "Lilac", "Mauve", "Thistle"],
  magenta: ["Mauve", "Plum", "Heather", "Orchid", "Fig"],
  pink: ["Blush", "Rosewood", "Petal", "Mauve", "Quartz"],
  neutral: ["Graphite", "Slate", "Ash", "Pewter", "Stone"],
};

const DEEP_ADJECTIVES: Record<HueFamily, string[]> = {
  red: ["Oxblood", "Garnet", "Burgundy", "Merlot", "Cardinal"],
  orange: ["Rust", "Umber", "Mahogany", "Cinnabar", "Copper"],
  amber: ["Bronze", "Umber", "Tobacco", "Cognac", "Brass"],
  yellow: ["Olive", "Brass", "Ochre", "Bronze", "Antique"],
  lime: ["Olive", "Moss", "Juniper", "Loden", "Thicket"],
  green: ["Forest", "Pine", "Juniper", "Hunter", "Evergreen"],
  teal: ["Spruce", "Abyssal", "Petrol", "Lagoon", "Deepwater"],
  cyan: ["Petrol", "Abyssal", "Marine", "Fathom", "Tidal"],
  blue: ["Navy", "Midnight", "Sapphire", "Marine", "Admiral"],
  indigo: ["Midnight", "Ink", "Indigo", "Nightfall", "Lapis"],
  violet: ["Aubergine", "Plum", "Amethyst", "Royal", "Nightshade"],
  magenta: ["Mulberry", "Plum", "Berry", "Damson", "Velvet"],
  pink: ["Raspberry", "Merlot", "Garnet", "Rosewood", "Cerise"],
  neutral: ["Obsidian", "Onyx", "Carbon", "Ink", "Graphite"],
};

type Mood = "dark" | "calm" | "energetic" | "elegant" | "playful" | "natural" | "technical" | "airy" | "warm" | "cool";

const MOOD_ADJECTIVES: Record<Mood, string[]> = {
  dark: ["Midnight", "Obsidian", "Velvet", "Shadow", "Onyx", "Eclipse", "Nocturnal"],
  calm: ["Quiet", "Still", "Gentle", "Hushed", "Serene", "Mellow", "Tranquil"],
  energetic: ["Electric", "Vivid", "Kinetic", "Radiant", "Blazing", "Bright", "Daring"],
  elegant: ["Gilded", "Velvet", "Satin", "Opal", "Regal", "Silken", "Noble"],
  playful: ["Bubbly", "Merry", "Jolly", "Zesty", "Peppy", "Sunny", "Giddy"],
  natural: ["Wild", "Mossy", "Earthen", "Rustic", "Woodland", "Verdant", "Feral"],
  technical: ["Binary", "Vector", "Signal", "Modular", "Atomic", "Linear", "Quantum"],
  airy: ["Airy", "Pale", "Morning", "Cloud", "Feather", "Pearl", "Open"],
  warm: ["Ember", "Golden", "Sunlit", "Honeyed", "Toasted", "Burnished", "Amber"],
  cool: ["Frosted", "Glacial", "Polar", "Silver", "Crisp", "Arctic", "Misted"],
};

const MOOD_NOUNS: Record<Mood, string[]> = {
  dark: ["Midnight", "Eclipse", "Nocturne", "Abyss", "Void", "Umbra"],
  calm: ["Haven", "Harbor", "Sanctuary", "Stillness", "Refuge", "Drift"],
  energetic: ["Pulse", "Spark", "Voltage", "Rush", "Surge", "Flare"],
  elegant: ["Atelier", "Salon", "Maison", "Regalia", "Gala", "Opus"],
  playful: ["Playground", "Confetti", "Kite", "Sherbet", "Parade", "Jellybean"],
  natural: ["Grove", "Terra", "Meadow", "Thicket", "Hollow", "Wilds"],
  technical: ["Kernel", "Lattice", "Circuit", "Grid", "Vector", "Matrix"],
  airy: ["Cloud", "Breeze", "Daylight", "Feather", "Sky", "Linen"],
  warm: ["Hearth", "Ember", "Glow", "Kiln", "Sunfield", "Toast"],
  cool: ["Glacier", "Fjord", "Frost", "Tundra", "Mist", "Floe"],
};

function moods(dims: Record<Dim, number>, vibes: Vibe[]): [Mood, number][] {
  const list: [Mood, number][] = [
    ["dark", dims.dark],
    ["airy", -dims.dark * 0.8],
    ["calm", -dims.energy],
    ["energetic", dims.energy * 0.9 + dims.vibrancy * 0.2],
    ["elegant", dims.elegance],
    ["playful", dims.playful],
    ["natural", vibes.includes("organic") ? 0.6 : 0],
    ["technical", (vibes.includes("tech") ? 0.5 : 0) + dims.density * 0.4],
    ["warm", dims.warmth * 0.8],
    ["cool", -dims.warmth * 0.8],
  ];
  return list.filter(([, s]) => s > 0.2).sort((a, b) => b[1] - a[1]).slice(0, 3);
}

export interface NameContext {
  family: HueFamily;
  tone: "deep" | "muted" | "clear";
  dims: Record<Dim, number>;
  vibes: Vibe[];
  adjectives: string[];
  nouns: string[];
  rng: Rng;
}

const stem = (w: string) => w.toLowerCase().replace(/(ed|ing|en|y|s)$/, "");

/** Evocative, deterministic two-word Title Case names, e.g. "Cobalt Harbor" or "Velvet Midnight". */
export function makeName(ctx: NameContext): string {
  const { rng } = ctx;
  const topMoods = moods(ctx.dims, ctx.vibes);
  const adjectives = new Map<string, number>();
  const nouns = new Map<string, number>();
  const spread = (map: Map<string, number>, words: string[], total: number) => {
    if (!words.length) return;
    const ranks = words.map((_, i) => 1 / (1 + i * 0.25));
    const sum = ranks.reduce((s, r) => s + r, 0);
    words.forEach((w, i) => map.set(w, (map.get(w) ?? 0) + (total * ranks[i]) / sum));
  };
  const hueWords = ctx.tone === "deep" ? DEEP_ADJECTIVES : ctx.tone === "muted" ? MUTED_ADJECTIVES : HUE_ADJECTIVES;
  spread(adjectives, hueWords[ctx.family], 3.2);
  spread(nouns, HUE_NOUNS[ctx.family], 2.4);
  spread(adjectives, ctx.adjectives.slice(0, 6), 3.6);
  spread(nouns, ctx.nouns.slice(0, 6), 6.5);
  for (const [mood, strength] of topMoods) {
    spread(adjectives, MOOD_ADJECTIVES[mood], 1 + strength * 1.8);
    spread(nouns, MOOD_NOUNS[mood], 0.5 + strength);
  }
  const first = rng.weighted([...adjectives.entries()]);
  const candidates = [...nouns.entries()].filter(([w]) => stem(w) !== stem(first) && w !== first);
  const second = rng.weighted(candidates);
  return `${first} ${second}`;
}
