import { EXAMPLE_PROMPTS, generateTheme, googleFontsHref, type EngineInput, type EngineResult } from "../lib/engine";
import { contrastRatio, hexToOklch, hueDistance, maxChroma, normalizeHex } from "../lib/engine/color";
import { GOOGLE_FONTS, primaryFamily } from "../lib/engine/typography";
import { getModePalette } from "../lib/modePalette";
import { themeTokensSchema, type ThemeTokens } from "../types/theme";

const LONG_BRIEF = Array.from({ length: 40 }, () =>
  "We are a community-driven platform helping independent coffee roasters, bakers and small food makers sell online, " +
  "with a warm, trustworthy, slightly playful personality, earthy colors, and an accessible, readable interface. ",
).join("");

const BRIEFS = [
  "", "asdkjh qwe zzxq vbnm", "!!! ??? ...", LONG_BRIEF, "Ünïcödé café — naïve résumé ☕",
  "Calm meditation app with soft sage tones", "Trustworthy fintech for Gen Z, bold but friendly",
  "Luxury watch boutique, black and gold, editorial", "Playful kids learning app, bright and rounded",
  "Developer tools: dark, technical, precise", "Cozy coffee roastery with warm earthy vibes",
  "Neon cyberpunk esports league", "Minimal Scandinavian architecture studio",
  "ocean", "forest", "sunset", "desert", "midnight", "aurora", "luxury", "kids playful", "brutalist",
  "deep navy with gold accents for a law firm", "minimal black and white with a pop of coral",
  "brand color #ff5a1f with #0f172a", "BOLD FINTECH, PRIMARY #3B82F6",
  "healthcare portal for seniors, accessible and clear", "telehealth clinic, calming and clinical",
  "wellness spa, organic, earthy, serene", "crypto exchange, futuristic, neon purple",
  "AI research lab, intelligent and modern", "analytics dashboard for power users, dense",
  "cybersecurity platform, serious and dark", "indie music festival, loud and rebellious",
  "independent magazine, editorial, typographic", "children's book publisher, whimsical pastel",
  "esports team, aggressive red and black", "law firm, traditional, trustworthy",
  "insurance company for families", "real estate agency, premium, navy and gold",
  "fashion label, monochrome, high-end", "organic skincare brand, blush and sage",
  "vegan restaurant, fresh and vibrant", "Italian bistro, warm, rustic, classic",
  "travel booking app, adventurous, tropical", "outdoor gear for hikers, rugged, forest green",
  "climate nonprofit, hopeful, sustainable", "solar energy startup, optimistic",
  "government services portal, accessible, civic", "electric vehicle brand, sleek, futuristic",
  "retro 80s synthwave arcade", "vintage bookstore, cozy, sepia", "productivity app for teams, clean and fast",
  "dating app, playful, warm and friendly", "pet adoption platform, cheerful", "wedding planner, elegant blush",
  "SaaS for hospitals, not playful, no neon", "a bold brand, no red, without gradients",
  "not dark, not corporate, friendly bank", "ice cream shop, candy colors, bubbly",
  "Japanese tea house, zen, minimal, muted green", "art deco hotel, gilded and dramatic",
  "space exploration startup, cosmic, deep", "lemonade stand, sunny yellow",
  "glassmorphism music player with gradients", "matrix hacker terminal", "swiss design agency, grid, red accents",
  "farm to table grocery delivery", "purple and teal", "terracotta, sand and olive", "lavender fields at dawn",
  "not playful or childish, serious banking", "less corporate, more human", "sunset surf shop",
  "ocean conservation nonprofit, hopeful", ...EXAMPLE_PROMPTS,
];

const SEEDS = [
  "#fff", "#000", "#808080", "#ff0000", "#fde68a", "#1e1b4b", "#0ea5e9", "#84cc16", "#FF6B35", "#abc", "#F0F",
  "#6366f1", "#10b981", "#f43f5e", "#a855f7", "#14b8a6", "#f59e0b", "#0f172a", "#fafafa", "#111111", "#7c2d12",
  "#365314", "#ecfeff", "#be185d", "#2563eb", "#facc15", "#22c55e", "#ffedd5", "#4b5563", "#00ff00", "#0000ff",
  "1e40af", "#E11D48",
];

const BOTH: [string, string][] = [
  ["#ff0000", "ocean"], ["#0ea5e9", "luxury watch boutique"], ["#84cc16", "kids playful"], ["#1e1b4b", "brutalist"],
  ["#fde68a", "dev tools, dark"], ["#808080", ""], ["#fff", "neon cyberpunk"], ["#000", "calm wellness"],
  ["#ABC", "coffee roastery"], ["#f43f5e", "editorial fashion magazine"], ["#10b981", "fintech, trustworthy, gold accent"],
  ["#6366f1", "asdkjh qwe"],
];

const VARIATIONS = [0, 1, 2, 3, 4];
const STOPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] as const;
const HEX = /^#[0-9a-f]{6}$/;

let failures = 0;
const failureLines: string[] = [];
const warnings = new Map<string, number>();

function label(input: EngineInput): string {
  const brief = (input.prompt ?? "").replace(/\s+/g, " ");
  const short = brief.length > 34 ? `${brief.slice(0, 33)}…` : brief || "(empty)";
  if (input.mode === "prompt") return short;
  if (input.mode === "color") return `color ${input.seedColor}`;
  return `${input.seedColor} + ${short}`;
}

function fail(input: EngineInput, message: string) {
  failures++;
  if (failureLines.length < 60) failureLines.push(`  ✗ [${label(input)} v${input.variation ?? 0}] ${message}`);
}

function warn(key: string) {
  warnings.set(key, (warnings.get(key) ?? 0) + 1);
}

function check(cond: boolean, input: EngineInput, message: () => string) {
  if (!cond) fail(input, message());
}

function colorEntries(theme: ThemeTokens): [string, string][] {
  const c = theme.color;
  const out: [string, string][] = [];
  for (const scale of ["primary", "neutral", "accent"] as const) for (const s of STOPS) out.push([`${scale}.${s}`, c[scale][s]]);
  for (const [k, v] of Object.entries(c.semantic)) out.push([`semantic.${k}`, v]);
  for (const [k, v] of Object.entries(c.surface)) if (k !== "overlay") out.push([`surface.${k}`, v]);
  for (const [k, v] of Object.entries(c.text)) out.push([`text.${k}`, v]);
  return out;
}

function validate(input: EngineInput, result: EngineResult) {
  const { theme, name, analysis } = result;
  const c = theme.color;
  const parsed = themeTokensSchema.safeParse(theme);
  check(parsed.success, input, () => `schema: ${parsed.error?.issues[0]?.path.join(".")} ${parsed.error?.issues[0]?.message}`);

  for (const [key, value] of colorEntries(theme)) check(HEX.test(value), input, () => `${key} is not 6-digit lowercase hex: ${value}`);
  check(/^rgba\(\d{1,3},\d{1,3},\d{1,3},(0|1|0?\.\d+)\)$/.test(c.surface.overlay), input, () => `overlay format ${c.surface.overlay}`);

  const ratio = (a: string, b: string) => contrastRatio(a, b);
  const targets: [string, number, number][] = [
    ["text.primary on background", ratio(c.text.primary, c.surface.background), 12],
    ["text.secondary on card", ratio(c.text.secondary, c.surface.card), 4.5],
    ["text.tertiary on card", ratio(c.text.tertiary, c.surface.card), 3],
    ["text.onPrimary on primary-500", ratio(c.text.onPrimary, c.primary[500]), 4.5],
    ["text.inverse vs text.primary", ratio(c.text.inverse, c.text.primary), 7],
  ];
  for (const key of ["success", "warning", "error", "info"] as const) {
    targets.push([`semantic.${key} on card`, ratio(c.semantic[key], c.surface.card), 4.5]);
    targets.push([`semantic.${key} on ${key}Bg`, ratio(c.semantic[key], c.semantic[`${key}Bg`]), 4.5]);
  }
  for (const [what, value, min] of targets) check(value >= min, input, () => `${what} = ${value.toFixed(2)} < ${min}`);
  check(
    ratio(c.text.disabled, c.surface.card) < ratio(c.text.tertiary, c.surface.card) &&
      ratio(c.text.tertiary, c.surface.card) < ratio(c.text.secondary, c.surface.card),
    input,
    () => "text hierarchy secondary > tertiary > disabled is not preserved",
  );
  const bgL = hexToOklch(c.surface.background).l;
  check(bgL >= 0.12 && bgL <= 0.19, input, () => `background lightness ${bgL.toFixed(3)} outside 0.13-0.18`);
  check(hexToOklch(c.surface.card).l > bgL, input, () => "card is not lighter than background");

  const light = getModePalette(theme, false);
  const dark = getModePalette(theme, true);
  const modeTargets: [string, number, number][] = [
    ["light text", ratio(light.text, light.background), 7],
    ["light textSecondary", ratio(light.textSecondary, light.background), 4.5],
    ["light textTertiary", ratio(light.textTertiary, light.background), 3],
    ["light neutral-900 on neutral-50", ratio(c.neutral[900], c.neutral[50]), 7],
    ["light neutral-600 on neutral-50", ratio(c.neutral[600], c.neutral[50]), 4.5],
    ["light neutral-500 on neutral-50", ratio(c.neutral[500], c.neutral[50]), 3],
    ["dark text", ratio(dark.text, dark.surface), 7],
    ["dark textSecondary", ratio(dark.textSecondary, dark.surface), 4.5],
    ["dark textTertiary", ratio(dark.textTertiary, dark.surface), 3],
  ];
  for (const [what, value, min] of modeTargets) check(value >= min, input, () => `${what} = ${value.toFixed(2)} < ${min}`);
  if (ratio(light.onPrimary, light.primary) < 4.5) warn("light-mode onPrimary on primary-600 below 4.5 (modePalette readableOn)");
  if (ratio(dark.primary, dark.background) < 1.6) warn("dark-mode primary-500 barely visible on background (very dark seed)");

  const seed = input.mode !== "prompt" && input.seedColor ? normalizeHex(input.seedColor) : null;
  if (seed) check(c.primary[500] === seed, input, () => `primary-500 ${c.primary[500]} !== seed ${seed}`);

  for (const scale of ["primary", "neutral", "accent"] as const) {
    const ls = STOPS.map((s) => hexToOklch(c[scale][s]).l);
    for (let i = 0; i < ls.length - 1; i++) {
      const a = c[scale][STOPS[i]];
      const b = c[scale][STOPS[i + 1]];
      const clipped = a === b && (a === "#ffffff" || a === "#000000");
      check(ls[i] > ls[i + 1] || clipped, input, () => `${scale} not monotonic at ${STOPS[i]}→${STOPS[i + 1]} (${a} ${b})`);
    }
  }

  const p = hexToOklch(c.primary[500]);
  if (p.c >= 0.04) {
    for (const key of ["success", "warning", "error", "info"] as const) {
      const h = hexToOklch(c.semantic[key]).h;
      check(hueDistance(h, p.h) >= 25, input, () => `${key} hue ${h.toFixed(0)} within 25° of primary ${p.h.toFixed(0)}`);
    }
  }
  const sem = (["success", "warning", "error", "info"] as const).map((k) => hexToOklch(c.semantic[k]).h);
  for (let i = 0; i < sem.length; i++)
    for (let j = i + 1; j < sem.length; j++) check(hueDistance(sem[i], sem[j]) >= 25, input, () => "semantic hues collide with each other");

  const href = googleFontsHref(theme);
  check(!!href && href.startsWith("https://fonts.googleapis.com/css2?family=") && href.endsWith("&display=swap"), input, () => `fonts href ${href}`);
  for (const stack of Object.values(theme.typography.fontFamily)) {
    const family = primaryFamily(stack);
    check(!!GOOGLE_FONTS[family], input, () => `font ${family} not in Google Fonts catalog`);
    check(/^"[^"]+", /.test(stack), input, () => `font stack not a full CSS stack: ${stack}`);
  }
  const sizes = Object.values(theme.typography.fontSize).map((s) => parseInt(s, 10));
  check(sizes.every((s, i) => i === 0 || s > sizes[i - 1]), input, () => `type scale not increasing ${sizes.join(",")}`);
  check(sizes[2] >= 14 && sizes[2] <= 16, input, () => `base size ${sizes[2]}px outside 14-16`);
  const radii = Object.entries(theme.radius).filter(([k]) => k !== "full").map(([, v]) => parseInt(v, 10));
  check(radii.every((r, i) => i === 0 || r >= radii[i - 1]), input, () => `radius scale not increasing ${radii.join(",")}`);
  check(theme.spacing[4] === "16px" && theme.spacing[32] === "128px", input, () => "spacing is off the 4px grid");

  check(/^[A-Z][a-z]+ [A-Z][a-z]+$/.test(name), input, () => `name "${name}" is not two Title Case words`);
  check(analysis.tags.length >= 1 && analysis.tags.length <= 6, input, () => `tag count ${analysis.tags.length}`);
  check(analysis.tags.every((t) => /^[A-Z0-9][^ ]*( [A-Z0-9][^ ]*)*$/.test(t)), input, () => `tags not Title Case: ${analysis.tags.join(", ")}`);
  check(analysis.summary.endsWith(".") && analysis.summary.length < 170, input, () => `summary "${analysis.summary}"`);
  check(Math.abs(hueDistance(analysis.primaryHue, p.h)) <= 1, input, () => "analysis.primaryHue does not match primary-500");
}

const hue = (r: EngineResult) => hexToOklch(r.theme.color.primary[500]).h;
const accentHue = (r: EngineResult) => hexToOklch(r.theme.color.accent[500]).h;
const md = (r: EngineResult) => parseInt(r.theme.radius.md, 10);
const inRange = (h: number, lo: number, hi: number) => (lo <= hi ? h >= lo && h <= hi : h >= lo || h <= hi);
const rel = (r: EngineResult) => {
  const o = hexToOklch(r.theme.color.primary[500]);
  return o.c / Math.max(1e-6, maxChroma(o.l, o.h));
};

interface Sanity {
  input: EngineInput;
  test: (r: EngineResult) => boolean;
  expect: string;
}

const prompt = (p: string): EngineInput => ({ mode: "prompt", prompt: p });
const SANITY: Sanity[] = [
  { input: prompt("ocean"), test: (r) => inRange(hue(r), 190, 275), expect: "bluish primary" },
  { input: prompt("forest"), test: (r) => inRange(hue(r), 115, 180), expect: "greenish primary" },
  { input: prompt("sunset"), test: (r) => inRange(hue(r), 330, 80), expect: "warm primary" },
  { input: prompt("desert"), test: (r) => inRange(hue(r), 20, 90), expect: "sandy/terracotta primary" },
  { input: prompt("midnight"), test: (r) => inRange(hue(r), 240, 300) && r.analysis.preferredMode === "dark", expect: "deep blue-violet, dark mode" },
  { input: prompt("luxury"), test: (r) => ["Editorial Serif", "Luxury Display"].includes(r.analysis.fontPersonality), expect: "editorial or luxury fonts" },
  { input: prompt("kids playful"), test: (r) => r.analysis.fontPersonality === "Rounded" && md(r) >= 10, expect: "rounded fonts, radius md >= 10" },
  { input: prompt("brutalist"), test: (r) => md(r) <= 4, expect: "radius md <= 4" },
  { input: prompt("Developer tools: dark, technical, precise"), test: (r) => r.analysis.fontPersonality === "Technical Mono" && r.analysis.preferredMode === "dark", expect: "technical type, dark" },
  { input: prompt("Calm meditation app with soft sage tones"), test: (r) => r.analysis.preferredMode === "light" && rel(r) < 0.7, expect: "light, restrained chroma" },
  { input: prompt("black and gold luxury"), test: (r) => inRange(hue(r), 60, 105), expect: "gold primary" },
  { input: prompt("deep navy with gold accents"), test: (r) => inRange(hue(r), 235, 290) && inRange(accentHue(r), 55, 105), expect: "navy primary, gold accent" },
  { input: prompt("minimal black and white with a pop of coral"), test: (r) => rel(r) < 0.25 && inRange(accentHue(r), 10, 50), expect: "neutral primary, coral accent" },
  { input: prompt("a bold brand, no red"), test: (r) => hueDistance(hue(r), 25) > 30, expect: "primary avoids red" },
  { input: prompt("not playful, serious banking"), test: (r) => r.analysis.fontPersonality !== "Rounded" && md(r) <= 8, expect: "not rounded" },
  { input: prompt("brand color #ff5a1f"), test: (r) => r.theme.color.primary[500] === "#ff5a1f", expect: "brief hex is primary-500" },
  { input: prompt("pastel dreamy nursery"), test: (r) => hexToOklch(r.theme.color.primary[500]).l > 0.7, expect: "light pastel primary" },
  { input: prompt("muted dusty earthy"), test: (r) => rel(r) < rel(generateTheme(prompt("vibrant electric bold"))), expect: "muted < vibrant chroma" },
  { input: prompt("warm cozy"), test: (r) => inRange(hexToOklch(r.theme.color.neutral[500]).h, 20, 110), expect: "warm neutrals" },
  { input: prompt("sunset surf shop"), test: (r) => inRange(hue(r), 0, 80) && inRange(accentHue(r), 180, 270), expect: "sunset primary, surf-blue accent" },
  { input: prompt(""), test: (r) => inRange(hue(r), 250, 300), expect: "tasteful indigo default" },
  { input: prompt("zxqv blorp"), test: (r) => inRange(hue(r), 250, 300), expect: "gibberish falls back to default" },
  { input: { mode: "color", seedColor: "#0ea5e9" }, test: (r) => r.theme.color.primary[500] === "#0ea5e9", expect: "seed is primary-500" },
  { input: { mode: "both", seedColor: "#ff0000", prompt: "ocean" }, test: (r) => inRange(accentHue(r), 180, 270), expect: "brief concept becomes accent" },
];

const started = Date.now();
const inputs: EngineInput[] = [
  ...BRIEFS.map(prompt),
  ...SEEDS.map((seedColor): EngineInput => ({ mode: "color", seedColor })),
  ...BOTH.map(([seedColor, p]): EngineInput => ({ mode: "both", seedColor, prompt: p })),
];

let generated = 0;
const table: string[] = [];
for (const base of inputs) {
  const results: EngineResult[] = [];
  for (const variation of VARIATIONS) {
    const input = { ...base, variation };
    const result = generateTheme(input);
    const again = generateTheme(input);
    generated += 2;
    check(JSON.stringify(result) === JSON.stringify(again), input, () => "non-deterministic output");
    validate(input, result);
    results.push(result);
  }
  const names = new Set(results.map((r) => r.name));
  const looks = new Set(results.map((r) => `${r.theme.color.primary[500]}|${r.theme.color.accent[500]}|${r.theme.typography.fontFamily.display}`));
  check(names.size >= 4, base, () => `variations repeat names: ${[...names].join(", ")}`);
  check(looks.size >= 4, base, () => `variations are not distinct enough (${looks.size}/5)`);
  const r = results[0];
  table.push(
    [
      label(base).padEnd(36),
      r.name.padEnd(22),
      String(r.analysis.primaryHue).padStart(3),
      `${r.theme.color.primary[500]}/${r.theme.color.accent[500]}`,
      r.analysis.harmony.padEnd(19),
      `${primaryFamily(r.theme.typography.fontFamily.display)} / ${primaryFamily(r.theme.typography.fontFamily.body)}`.padEnd(38),
      r.theme.radius.md.padStart(4),
      r.analysis.preferredMode,
    ].join("  "),
  );
}

const sanityLines: string[] = [];
for (const s of SANITY) {
  for (const variation of VARIATIONS) {
    const input = { ...s.input, variation };
    const r = generateTheme(input);
    generated++;
    const ok = s.test(r);
    if (!ok) fail(input, `sanity: expected ${s.expect}; got hue ${r.analysis.primaryHue}, accent ${accentHue(r).toFixed(0)}, ${r.analysis.fontPersonality}, md ${r.theme.radius.md}, ${r.analysis.preferredMode}`);
    if (variation === 0) sanityLines.push(`  ${ok ? "✓" : "✗"} ${label(s.input).padEnd(36)} ${s.expect}`);
  }
}

check(EXAMPLE_PROMPTS.length === 8 && EXAMPLE_PROMPTS.every((p) => p.length < 60), prompt("EXAMPLE_PROMPTS"), () => "EXAMPLE_PROMPTS must be 8 briefs under 60 chars");

console.log("brief / seed".padEnd(36), " name".padEnd(23), "hue", " primary/accent".padEnd(16), " harmony".padEnd(20), " display / body".padEnd(39), "  md  mode");
console.log(table.join("\n"));
console.log("\nSanity mappings");
console.log(sanityLines.join("\n"));
if (warnings.size) {
  console.log("\nNotes (not failures)");
  for (const [k, n] of warnings) console.log(`  · ${k}: ${n}`);
}
const ms = Date.now() - started;
console.log(`\n${inputs.length} inputs × ${VARIATIONS.length} variations, ${generated} generations in ${ms}ms (${(ms / generated).toFixed(2)}ms each)`);
if (failures) {
  console.log(`\n${failures} check(s) failed:`);
  console.log(failureLines.join("\n"));
  process.exitCode = 1;
} else {
  console.log("All engine checks passed.");
}
