import type { ThemeTokens } from "@/types/theme";

export function generateCSSVars(theme: ThemeTokens): string {
  const lines: string[] = [":root {"];
  const stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

  for (const stop of stops) {
    lines.push(`  --color-primary-${stop}: ${theme.color.primary[stop]};`);
  }
  for (const stop of stops) {
    lines.push(`  --color-neutral-${stop}: ${theme.color.neutral[stop]};`);
  }
  for (const stop of stops) {
    lines.push(`  --color-accent-${stop}: ${theme.color.accent[stop]};`);
  }

  lines.push("");
  for (const [k, v] of Object.entries(theme.color.semantic)) {
    lines.push(`  --color-semantic-${k}: ${v};`);
  }
  lines.push("");
  for (const [k, v] of Object.entries(theme.color.surface)) {
    lines.push(`  --color-surface-${k}: ${v};`);
  }
  lines.push("");
  for (const [k, v] of Object.entries(theme.color.text)) {
    lines.push(`  --color-text-${k}: ${v};`);
  }
  lines.push("");
  for (const [k, v] of Object.entries(theme.typography.fontFamily)) {
    lines.push(`  --font-family-${k}: ${v};`);
  }
  for (const [k, v] of Object.entries(theme.typography.fontSize)) {
    lines.push(`  --font-size-${k}: ${v};`);
  }
  for (const [k, v] of Object.entries(theme.typography.fontWeight)) {
    lines.push(`  --font-weight-${k}: ${v};`);
  }
  lines.push("");
  for (const [k, v] of Object.entries(theme.spacing)) {
    lines.push(`  --spacing-${k}: ${v};`);
  }
  for (const [k, v] of Object.entries(theme.radius)) {
    lines.push(`  --radius-${k}: ${v};`);
  }
  lines.push("");
  for (const [k, v] of Object.entries(theme.shadow)) {
    lines.push(`  --shadow-${k}: ${v};`);
  }
  lines.push("}");
  return lines.join("\n");
}

export function generateSCSSTokens(theme: ThemeTokens): string {
  const lines: string[] = [];
  const stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

  lines.push("// === Color Scales ===");
  for (const scale of ["primary", "neutral", "accent"] as const) {
    for (const stop of stops) {
      lines.push(`$color-${scale}-${stop}: ${theme.color[scale][stop]};`);
    }
  }
  lines.push("\n// === Semantic Colors ===");
  for (const [k, v] of Object.entries(theme.color.semantic)) {
    lines.push(`$color-semantic-${k}: ${v};`);
  }
  lines.push("\n// === Surface ===");
  for (const [k, v] of Object.entries(theme.color.surface)) {
    lines.push(`$color-surface-${k}: ${v};`);
  }
  lines.push("\n// === Typography ===");
  for (const [k, v] of Object.entries(theme.typography.fontFamily)) {
    lines.push(`$font-family-${k}: '${v}';`);
  }
  for (const [k, v] of Object.entries(theme.typography.fontSize)) {
    lines.push(`$font-size-${k}: ${v};`);
  }
  lines.push("\n// === Spacing ===");
  for (const [k, v] of Object.entries(theme.spacing)) {
    lines.push(`$spacing-${k}: ${v};`);
  }
  lines.push("\n// === Radius & Shadows ===");
  for (const [k, v] of Object.entries(theme.radius)) {
    lines.push(`$radius-${k}: ${v};`);
  }
  for (const [k, v] of Object.entries(theme.shadow)) {
    lines.push(`$shadow-${k}: ${v};`);
  }
  return lines.join("\n");
}

export function generateJSObject(theme: ThemeTokens): string {
  return `const theme = ${JSON.stringify(theme, null, 2)}`;
}

export function generateStyleMap(theme: ThemeTokens): string {
  const stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
  const colors: Record<string, string> = {};
  for (const stop of stops) {
    colors[`primary${stop}`] = theme.color.primary[stop];
    colors[`neutral${stop}`] = theme.color.neutral[stop];
    colors[`accent${stop}`] = theme.color.accent[stop];
  }
  Object.assign(colors, theme.color.semantic, theme.color.surface, theme.color.text);

  return `const colors = ${JSON.stringify(colors, null, 2)}

const radius = ${JSON.stringify(theme.radius, null, 2)}

const shadows = ${JSON.stringify(theme.shadow, null, 2)}`;
}

export function generateTailwindExtend(theme: ThemeTokens): string {
  const stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
  const primary: Record<string, string> = {};
  const accent: Record<string, string> = {};
  const neutral: Record<string, string> = {};
  for (const s of stops) {
    primary[s] = theme.color.primary[s];
    accent[s] = theme.color.accent[s];
    neutral[s] = theme.color.neutral[s];
  }

  const obj = {
    colors: {
      primary,
      accent,
      neutral,
      ...theme.color.semantic,
    },
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    borderRadius: theme.radius,
    boxShadow: theme.shadow,
    spacing: theme.spacing,
  };

  return `// tailwind.config.js  →  theme.extend
extend: ${JSON.stringify(obj, null, 2)}`;
}

export function generateW3CTokens(theme: ThemeTokens): string {
  const stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
  const tokens: Record<string, unknown> = {
    color: {
      primary: Object.fromEntries(stops.map((s) => [s, { $value: theme.color.primary[s], $type: "color" }])),
      accent: Object.fromEntries(stops.map((s) => [s, { $value: theme.color.accent[s], $type: "color" }])),
      neutral: Object.fromEntries(stops.map((s) => [s, { $value: theme.color.neutral[s], $type: "color" }])),
      semantic: Object.fromEntries(Object.entries(theme.color.semantic).map(([k, v]) => [k, { $value: v, $type: "color" }])),
      surface: Object.fromEntries(Object.entries(theme.color.surface).map(([k, v]) => [k, { $value: v, $type: "color" }])),
      text: Object.fromEntries(Object.entries(theme.color.text).map(([k, v]) => [k, { $value: v, $type: "color" }])),
    },
    typography: {
      fontFamily: Object.fromEntries(Object.entries(theme.typography.fontFamily).map(([k, v]) => [k, { $value: v, $type: "fontFamily" }])),
      fontSize: Object.fromEntries(Object.entries(theme.typography.fontSize).map(([k, v]) => [k, { $value: v, $type: "dimension" }])),
    },
    spacing: Object.fromEntries(Object.entries(theme.spacing).map(([k, v]) => [k, { $value: v, $type: "dimension" }])),
    radius: Object.fromEntries(Object.entries(theme.radius).map(([k, v]) => [k, { $value: v, $type: "dimension" }])),
    shadow: Object.fromEntries(Object.entries(theme.shadow).map(([k, v]) => [k, { $value: v, $type: "shadow" }])),
  };
  return JSON.stringify(tokens, null, 2);
}

export function generateFigmaTokens(theme: ThemeTokens): string {
  const stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
  const tokens = {
    global: {
      color: {
        primary: Object.fromEntries(stops.map((s) => [s, { value: theme.color.primary[s], type: "color" }])),
        accent: Object.fromEntries(stops.map((s) => [s, { value: theme.color.accent[s], type: "color" }])),
        neutral: Object.fromEntries(stops.map((s) => [s, { value: theme.color.neutral[s], type: "color" }])),
        semantic: Object.fromEntries(Object.entries(theme.color.semantic).map(([k, v]) => [k, { value: v, type: "color" }])),
        surface: Object.fromEntries(Object.entries(theme.color.surface).map(([k, v]) => [k, { value: v, type: "color" }])),
        text: Object.fromEntries(Object.entries(theme.color.text).map(([k, v]) => [k, { value: v, type: "color" }])),
      },
      typography: {
        fontFamily: Object.fromEntries(Object.entries(theme.typography.fontFamily).map(([k, v]) => [k, { value: v, type: "fontFamilies" }])),
        fontSize: Object.fromEntries(Object.entries(theme.typography.fontSize).map(([k, v]) => [k, { value: v, type: "fontSizes" }])),
        fontWeight: Object.fromEntries(Object.entries(theme.typography.fontWeight).map(([k, v]) => [k, { value: v, type: "fontWeights" }])),
      },
      spacing: Object.fromEntries(Object.entries(theme.spacing).map(([k, v]) => [k, { value: v, type: "spacing" }])),
      borderRadius: Object.fromEntries(Object.entries(theme.radius).map(([k, v]) => [k, { value: v, type: "borderRadius" }])),
      boxShadow: Object.fromEntries(Object.entries(theme.shadow).map(([k, v]) => [k, { value: v, type: "boxShadow" }])),
    },
  };
  return JSON.stringify(tokens, null, 2);
}
