import type { ThemeTokens } from "@/types/theme";

export function injectThemeVars(theme: ThemeTokens): void {
  if (typeof document === "undefined") return;

  const vars: string[] = [];

  // Color scales
  for (const stop of [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const) {
    vars.push(`--color-primary-${stop}: ${theme.color.primary[stop]};`);
    vars.push(`--color-neutral-${stop}: ${theme.color.neutral[stop]};`);
    vars.push(`--color-accent-${stop}: ${theme.color.accent[stop]};`);
  }

  // Semantic
  for (const [k, v] of Object.entries(theme.color.semantic)) {
    vars.push(`--color-semantic-${k}: ${v};`);
  }

  // Surface
  for (const [k, v] of Object.entries(theme.color.surface)) {
    vars.push(`--color-surface-${k}: ${v};`);
  }

  // Text
  for (const [k, v] of Object.entries(theme.color.text)) {
    vars.push(`--color-text-${k}: ${v};`);
  }

  // Typography
  for (const [k, v] of Object.entries(theme.typography.fontFamily)) {
    vars.push(`--font-family-${k}: ${v};`);
  }
  for (const [k, v] of Object.entries(theme.typography.fontSize)) {
    vars.push(`--font-size-${k}: ${v};`);
  }
  for (const [k, v] of Object.entries(theme.typography.fontWeight)) {
    vars.push(`--font-weight-${k}: ${v};`);
  }
  for (const [k, v] of Object.entries(theme.typography.lineHeight)) {
    vars.push(`--line-height-${k}: ${v};`);
  }
  for (const [k, v] of Object.entries(theme.typography.letterSpacing)) {
    vars.push(`--letter-spacing-${k}: ${v};`);
  }

  // Spacing
  for (const [k, v] of Object.entries(theme.spacing)) {
    vars.push(`--spacing-${k}: ${v};`);
  }

  // Radius
  for (const [k, v] of Object.entries(theme.radius)) {
    vars.push(`--radius-${k}: ${v};`);
  }

  // Shadow
  for (const [k, v] of Object.entries(theme.shadow)) {
    vars.push(`--shadow-${k}: ${v};`);
  }

  // Animation
  for (const [k, v] of Object.entries(theme.animation.duration)) {
    vars.push(`--duration-${k}: ${v};`);
  }
  for (const [k, v] of Object.entries(theme.animation.easing)) {
    vars.push(`--easing-${k}: ${v};`);
  }

  // Z-index
  for (const [k, v] of Object.entries(theme.zIndex)) {
    vars.push(`--z-${k}: ${v};`);
  }

  // Blur
  for (const [k, v] of Object.entries(theme.blur)) {
    vars.push(`--blur-${k}: ${v};`);
  }

  let styleEl = document.getElementById("theme-vars");
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "theme-vars";
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = `.theme-preview {\n${vars.join("\n")}\n}`;
}
