import type { ThemeTokens } from "@/types/theme";
import type { ModePalette } from "@/lib/modePalette";

/**
 * One naming scheme for every export and for the All Tokens reference.
 * A token lives at a camelCase path (color.semantic.successBg). JS and JSON use that path as-is;
 * CSS, SCSS and Tailwind join it with dashes in kebab-case (--color-semantic-success-bg).
 */

export const STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export const SCALES = ["primary", "accent", "neutral"] as const;
export type Stop = (typeof STOPS)[number];
export type ScaleName = (typeof SCALES)[number];

type Color = ThemeTokens["color"];
type Typography = ThemeTokens["typography"];

export const SEMANTIC_KEYS = [
  "success", "warning", "error", "info", "successBg", "warningBg", "errorBg", "infoBg",
] as const satisfies readonly (keyof Color["semantic"])[];
export const SURFACE_KEYS = ["background", "card", "border", "borderSubtle", "overlay"] as const satisfies readonly (keyof Color["surface"])[];
export const TEXT_KEYS = ["primary", "secondary", "tertiary", "disabled", "onPrimary", "inverse"] as const satisfies readonly (keyof Color["text"])[];
export const FAMILY_KEYS = ["display", "body", "mono"] as const satisfies readonly (keyof Typography["fontFamily"])[];
export const SIZE_KEYS = ["xs", "sm", "base", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"] as const satisfies readonly (keyof Typography["fontSize"])[];
export const WEIGHT_KEYS = ["light", "regular", "medium", "semibold", "bold", "extrabold"] as const satisfies readonly (keyof Typography["fontWeight"])[];
export const LINE_HEIGHT_KEYS = ["tight", "snug", "normal", "relaxed", "loose"] as const satisfies readonly (keyof Typography["lineHeight"])[];
export const TRACKING_KEYS = ["tighter", "tight", "normal", "wide", "wider", "widest"] as const satisfies readonly (keyof Typography["letterSpacing"])[];
export const SPACING_KEYS = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32] as const satisfies readonly (keyof ThemeTokens["spacing"])[];
export const RADIUS_KEYS = ["none", "xs", "sm", "md", "lg", "xl", "2xl", "3xl", "full"] as const satisfies readonly (keyof ThemeTokens["radius"])[];
export const SHADOW_KEYS = ["none", "xs", "sm", "md", "lg", "xl", "2xl", "inner"] as const satisfies readonly (keyof ThemeTokens["shadow"])[];
export const DURATION_KEYS = ["fast", "normal", "slow", "slower"] as const satisfies readonly (keyof ThemeTokens["animation"]["duration"])[];
export const EASING_KEYS = ["linear", "ease", "easeIn", "easeOut", "easeInOut", "spring"] as const satisfies readonly (keyof ThemeTokens["animation"]["easing"])[];
export const Z_KEYS = [
  "hide", "auto", "base", "dropdown", "sticky", "overlay", "modal", "popover", "toast", "tooltip",
] as const satisfies readonly (keyof ThemeTokens["zIndex"])[];
export const BLUR_KEYS = ["none", "sm", "md", "lg", "xl", "2xl"] as const satisfies readonly (keyof ThemeTokens["blur"])[];

export type TokenType = "color" | "dimension" | "fontFamily" | "fontWeight" | "number" | "shadow" | "duration" | "cubicBezier";

export interface Token {
  key: string;
  value: string;
}

export interface TokenGroup {
  path: string[];
  label: string;
  type: TokenType;
  tokens: Token[];
}

function pick<T, K extends keyof T>(obj: T, keys: readonly K[]): Token[] {
  return keys.map((key) => ({ key: String(key), value: String(obj[key]).trim() }));
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Every primitive token of the theme, grouped and ordered the same way in every format. */
export function tokenGroups(theme: ThemeTokens): TokenGroup[] {
  const c = theme.color;
  const t = theme.typography;
  const group = (path: string[], label: string, type: TokenType, tokens: Token[]): TokenGroup => ({ path, label, type, tokens });

  return [
    ...SCALES.map((scale) => group(["color", scale], `${capitalize(scale)} scale`, "color", pick(c[scale], STOPS))),
    group(["color", "semantic"], "Semantic", "color", pick(c.semantic, SEMANTIC_KEYS)),
    group(["color", "surface"], "Surface", "color", pick(c.surface, SURFACE_KEYS)),
    group(["color", "text"], "Text", "color", pick(c.text, TEXT_KEYS)),
    group(["font", "family"], "Font family", "fontFamily", pick(t.fontFamily, FAMILY_KEYS)),
    group(["font", "size"], "Font size", "dimension", pick(t.fontSize, SIZE_KEYS)),
    group(["font", "weight"], "Font weight", "fontWeight", pick(t.fontWeight, WEIGHT_KEYS)),
    group(["lineHeight"], "Line height", "number", pick(t.lineHeight, LINE_HEIGHT_KEYS)),
    group(["letterSpacing"], "Letter spacing", "dimension", pick(t.letterSpacing, TRACKING_KEYS)),
    group(["spacing"], "Spacing", "dimension", pick(theme.spacing, SPACING_KEYS)),
    group(["radius"], "Radius", "dimension", pick(theme.radius, RADIUS_KEYS)),
    group(["shadow"], "Shadow", "shadow", pick(theme.shadow, SHADOW_KEYS)),
    group(["duration"], "Duration", "duration", pick(theme.animation.duration, DURATION_KEYS)),
    group(["easing"], "Easing", "cubicBezier", pick(theme.animation.easing, EASING_KEYS)),
    group(["zIndex"], "Z-index", "number", pick(theme.zIndex, Z_KEYS)),
    group(["blur"], "Blur", "dimension", pick(theme.blur, BLUR_KEYS)),
  ];
}

/* ---------- Mode-aware roles (from getModePalette) ---------- */

export type RoleKey = Exclude<keyof ModePalette, "dark">;

export interface RoleSpec {
  key: RoleKey;
  description: string;
  /** Background this role is read against, for contrast checks. */
  on?: RoleKey;
}

export const ROLE_GROUPS: { label: string; roles: RoleSpec[] }[] = [
  {
    label: "Surface",
    roles: [
      { key: "background", description: "App canvas" },
      { key: "surface", description: "Cards, panels, inputs" },
      { key: "surfaceRaised", description: "Popovers, menus, dialogs" },
      { key: "surfaceSunken", description: "Wells, code, table stripes" },
      { key: "border", description: "Default dividers and outlines" },
      { key: "borderSubtle", description: "Quiet separators" },
      { key: "overlay", description: "Modal backdrop" },
    ],
  },
  {
    label: "Text",
    roles: [
      { key: "text", description: "Body copy and headings", on: "surface" },
      { key: "textSecondary", description: "Supporting copy", on: "surface" },
      { key: "textTertiary", description: "Hints, placeholders", on: "surface" },
      { key: "textDisabled", description: "Disabled labels", on: "surface" },
    ],
  },
  {
    label: "Primary",
    roles: [
      { key: "primary", description: "Primary actions, focus" },
      { key: "primaryHover", description: "Hover and pressed state" },
      { key: "onPrimary", description: "Text on primary", on: "primary" },
      { key: "primarySoft", description: "Tinted backgrounds" },
      { key: "primaryText", description: "Links, primary text", on: "surface" },
    ],
  },
  {
    label: "Accent",
    roles: [
      { key: "accent", description: "Highlights, secondary actions" },
      { key: "accentHover", description: "Hover and pressed state" },
      { key: "onAccent", description: "Text on accent", on: "accent" },
      { key: "accentSoft", description: "Tinted backgrounds" },
      { key: "accentText", description: "Accent text", on: "surface" },
    ],
  },
  {
    label: "Status",
    roles: [
      { key: "success", description: "Success indicator" },
      { key: "successSoft", description: "Success background" },
      { key: "successText", description: "Success text", on: "surface" },
      { key: "warning", description: "Warning indicator" },
      { key: "warningSoft", description: "Warning background" },
      { key: "warningText", description: "Warning text", on: "surface" },
      { key: "error", description: "Error indicator" },
      { key: "errorSoft", description: "Error background" },
      { key: "errorText", description: "Error text", on: "surface" },
      { key: "info", description: "Info indicator" },
      { key: "infoSoft", description: "Info background" },
      { key: "infoText", description: "Info text", on: "surface" },
    ],
  },
];

export const ROLE_KEYS: RoleKey[] = ROLE_GROUPS.flatMap((g) => g.roles.map((r) => r.key));

/* ---------- Naming ---------- */

export function kebab(segment: string): string {
  return segment.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

export function cssVar(path: string[]): string {
  return `--${path.map(kebab).join("-")}`;
}

export function scssVar(path: string[]): string {
  return `$${path.map(kebab).join("-")}`;
}

export function roleVar(key: RoleKey): string {
  return `--${kebab(key)}`;
}

export function jsPath(path: string[], root = "theme"): string {
  return path.reduce((acc, seg) => (/^[A-Za-z_$][\w$]*$/.test(seg) ? `${acc}.${seg}` : `${acc}[${/^\d+$/.test(seg) ? seg : JSON.stringify(seg)}]`), root);
}

export function countTokens(theme: ThemeTokens): { primitives: number; roles: number; total: number } {
  const primitives = tokenGroups(theme).reduce((n, g) => n + g.tokens.length, 0);
  const roles = ROLE_KEYS.length * 2;
  return { primitives, roles, total: primitives + roles };
}

/* ---------- Value parsing ---------- */

export function normalizeColor(value: string): string {
  const v = value.trim().toLowerCase().replace(/\s+/g, "");
  const short = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/.exec(v);
  if (short) return `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`;
  if (/^#[0-9a-f]{6}ff$/.test(v)) return v.slice(0, 7);
  return v;
}

/** Raw theme color each role is derived from, so a role can alias it when the values agree. */
const ROLE_SOURCE: Partial<Record<RoleKey, [string, string]>> = {
  background: ["surface", "background"],
  surface: ["surface", "card"],
  border: ["surface", "border"],
  borderSubtle: ["surface", "borderSubtle"],
  overlay: ["surface", "overlay"],
  text: ["text", "primary"],
  textSecondary: ["text", "secondary"],
  textTertiary: ["text", "tertiary"],
  textDisabled: ["text", "disabled"],
  onPrimary: ["text", "onPrimary"],
  success: ["semantic", "success"],
  successText: ["semantic", "success"],
  warning: ["semantic", "warning"],
  warningText: ["semantic", "warning"],
  error: ["semantic", "error"],
  errorText: ["semantic", "error"],
  info: ["semantic", "info"],
  infoText: ["semantic", "info"],
};

/**
 * Returns the primitive path a role value can reference (its own source token, else a scale stop
 * with the same value), or null when the value was computed and has no primitive.
 */
export function roleAliasResolver(theme: ThemeTokens): (key: RoleKey, value: string) => string[] | null {
  const stops = new Map<string, string[]>();
  for (const scale of SCALES) {
    for (const stop of STOPS) {
      const k = normalizeColor(theme.color[scale][stop]);
      if (!stops.has(k)) stops.set(k, ["color", scale, String(stop)]);
    }
  }
  const color = theme.color as unknown as Record<string, Record<string, string>>;
  return (key, value) => {
    const norm = normalizeColor(value);
    const source = ROLE_SOURCE[key];
    if (source && normalizeColor(color[source[0]]?.[source[1]] ?? "") === norm) return ["color", ...source];
    return stops.get(norm) ?? null;
  };
}

/** Splits on `sep` outside quotes and parentheses. */
export function splitTopLevel(input: string, sep = ","): string[] {
  const parts: string[] = [];
  let depth = 0;
  let quote: string | null = null;
  let current = "";
  for (const ch of input) {
    if (quote) {
      if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === "(") {
      depth++;
    } else if (ch === ")") {
      depth = Math.max(0, depth - 1);
    } else if (depth === 0 && (sep === " " ? /\s/.test(ch) : ch === sep)) {
      if (current.trim()) parts.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

export function unquote(s: string): string {
  return s.trim().replace(/^(["'])(.*)\1$/, "$2");
}

export function fontList(stack: string): string[] {
  return splitTopLevel(stack).map(unquote).filter(Boolean);
}

export function primaryFamily(stack: string): string {
  return fontList(stack)[0] ?? stack;
}

const GENERIC_FAMILIES = new Set([
  "serif", "sans-serif", "monospace", "cursive", "fantasy", "system-ui", "ui-serif", "ui-sans-serif",
  "ui-monospace", "ui-rounded", "math", "emoji", "fangsong", "-apple-system", "blinkmacsystemfont",
]);

export function isGenericFamily(name: string): boolean {
  return GENERIC_FAMILIES.has(name.toLowerCase());
}

/** CSS color (hex, rgb, rgba) as #rrggbb or #rrggbbaa; null when it cannot be parsed. */
export function toHexColor(value: string): string | null {
  const v = value.trim().toLowerCase();
  if (/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/.test(v)) {
    if (v.length === 4 || v.length === 5) return `#${v.slice(1).split("").map((c) => c + c).join("")}`.replace(/^(#[0-9a-f]{6})ff$/, "$1");
    return v.replace(/^(#[0-9a-f]{6})ff$/, "$1");
  }
  const m = /^rgba?\(([^)]*)\)$/.exec(v);
  if (!m) return v === "transparent" ? "#00000000" : null;
  const parts = m[1].split(/[\s,/]+/).filter(Boolean);
  if (parts.length < 3) return null;
  const channel = (p: string) => (p.endsWith("%") ? (parseFloat(p) / 100) * 255 : parseFloat(p));
  const rgb = parts.slice(0, 3).map(channel);
  const alphaRaw = parts[3];
  const alpha = alphaRaw === undefined ? 1 : alphaRaw.endsWith("%") ? parseFloat(alphaRaw) / 100 : parseFloat(alphaRaw);
  if ([...rgb, alpha].some((n) => Number.isNaN(n))) return null;
  const hex = (n: number) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, "0");
  const base = `#${rgb.map(hex).join("")}`;
  return alpha >= 1 ? base : `${base}${hex(alpha * 255)}`;
}

export interface ShadowLayer {
  inset: boolean;
  x: string;
  y: string;
  blur: string;
  spread: string;
  color: string;
}

/** Parses a CSS box-shadow into layers; `none` is an empty list, unparseable input is null. */
export function parseShadow(value: string): ShadowLayer[] | null {
  const v = value.trim();
  if (!v || v === "none") return [];
  const layers: ShadowLayer[] = [];
  for (const layer of splitTopLevel(v)) {
    const parts = splitTopLevel(layer, " ");
    let inset = false;
    let color = "";
    const lengths: string[] = [];
    for (const part of parts) {
      if (part === "inset") inset = true;
      else if (/^-?(\d+\.?\d*|\.\d+)(px|rem|em)?$/.test(part)) lengths.push(/^-?0+(\.0+)?$/.test(part) ? "0px" : /[a-z]$/.test(part) ? part : `${part}px`);
      else color = part;
    }
    if (lengths.length < 2 || lengths.length > 4) return null;
    const [x, y, blur = "0px", spread = "0px"] = lengths;
    layers.push({ inset, x, y, blur, spread, color: color || "currentColor" });
  }
  return layers;
}

const EASING_KEYWORDS: Record<string, [number, number, number, number]> = {
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  "ease-in": [0.42, 0, 1, 1],
  "ease-out": [0, 0, 0.58, 1],
  "ease-in-out": [0.42, 0, 0.58, 1],
};

export function parseEasing(value: string): [number, number, number, number] | null {
  const v = value.trim().toLowerCase();
  if (EASING_KEYWORDS[v]) return EASING_KEYWORDS[v];
  const m = /^cubic-bezier\(([^)]*)\)$/.exec(v);
  if (!m) return null;
  const nums = m[1].split(",").map((n) => parseFloat(n));
  if (nums.length !== 4 || nums.some((n) => Number.isNaN(n))) return null;
  return nums as [number, number, number, number];
}

export function asNumber(value: string): number | null {
  return /^-?\d+(\.\d+)?$/.test(value.trim()) ? Number(value) : null;
}

/** Milliseconds for a CSS time value (200ms, 0.2s); null when unparseable. */
export function toMs(value: string): number | null {
  const m = /^(-?\d*\.?\d+)(ms|s)$/.exec(value.trim());
  if (!m) return null;
  return m[2] === "s" ? parseFloat(m[1]) * 1000 : parseFloat(m[1]);
}

/** Pixels for px/rem/em dimensions (rem and em at 16px); null otherwise. */
export function toPx(value: string): number | null {
  const m = /^(-?\d*\.?\d+)(px|rem|em)?$/.exec(value.trim());
  if (!m) return null;
  const n = parseFloat(m[1]);
  return m[2] === "rem" || m[2] === "em" ? n * 16 : n;
}
