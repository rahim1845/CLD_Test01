import type { ThemeTokens } from "@/types/theme";

const STYLE_ID = "theme-vars";
const STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

function push(vars: string[], prefix: string, group: Record<string, string>) {
  for (const [k, v] of Object.entries(group)) vars.push(`  --${prefix}-${k}: ${v};`);
}

/** Serialises the theme as CSS custom properties scoped to `.theme-preview`. */
export function themeVarsCss(theme: ThemeTokens): string {
  const { color, typography } = theme;
  const vars: string[] = [];

  for (const stop of STOPS) {
    vars.push(`  --color-primary-${stop}: ${color.primary[stop]};`);
    vars.push(`  --color-neutral-${stop}: ${color.neutral[stop]};`);
    vars.push(`  --color-accent-${stop}: ${color.accent[stop]};`);
  }
  push(vars, "color-semantic", color.semantic);
  push(vars, "color-surface", color.surface);
  push(vars, "color-text", color.text);

  push(vars, "font-family", typography.fontFamily);
  push(vars, "font-size", typography.fontSize);
  push(vars, "font-weight", typography.fontWeight);
  push(vars, "line-height", typography.lineHeight);
  push(vars, "letter-spacing", typography.letterSpacing);

  push(vars, "spacing", theme.spacing);
  push(vars, "radius", theme.radius);
  push(vars, "shadow", theme.shadow);
  push(vars, "duration", theme.animation.duration);
  push(vars, "easing", theme.animation.easing);
  push(vars, "z", theme.zIndex);
  push(vars, "blur", theme.blur);

  return `.theme-preview {\n${vars.join("\n")}\n}`;
}

export function injectThemeVars(theme: ThemeTokens): void {
  if (typeof document === "undefined") return;

  const css = themeVarsCss(theme);
  let styleEl = document.getElementById(STYLE_ID);
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = STYLE_ID;
    document.head.appendChild(styleEl);
  }
  if (styleEl.textContent !== css) styleEl.textContent = css;
}
