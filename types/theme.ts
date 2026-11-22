import { z } from "zod";

const hexColor = z.string().regex(/^#[0-9a-fA-F]{3,8}$/, "Invalid hex color");

const colorScaleSchema = z.object({
  50: hexColor,
  100: hexColor,
  200: hexColor,
  300: hexColor,
  400: hexColor,
  500: hexColor,
  600: hexColor,
  700: hexColor,
  800: hexColor,
  900: hexColor,
  950: hexColor,
});

const semanticColorsSchema = z.object({
  success: hexColor,
  warning: hexColor,
  error: hexColor,
  info: hexColor,
  successBg: hexColor,
  warningBg: hexColor,
  errorBg: hexColor,
  infoBg: hexColor,
});

const surfaceColorsSchema = z.object({
  background: hexColor,
  card: hexColor,
  border: hexColor,
  borderSubtle: hexColor,
  overlay: hexColor,
});

const textColorsSchema = z.object({
  primary: hexColor,
  secondary: hexColor,
  tertiary: hexColor,
  disabled: hexColor,
  onPrimary: hexColor,
  inverse: hexColor,
});

export const themeTokensSchema = z.object({
  color: z.object({
    primary: colorScaleSchema,
    neutral: colorScaleSchema,
    accent: colorScaleSchema,
    semantic: semanticColorsSchema,
    surface: surfaceColorsSchema,
    text: textColorsSchema,
  }),
  typography: z.object({
    fontFamily: z.object({
      display: z.string(),
      body: z.string(),
      mono: z.string(),
    }),
    fontSize: z.object({
      xs: z.string(),
      sm: z.string(),
      base: z.string(),
      md: z.string(),
      lg: z.string(),
      xl: z.string(),
      "2xl": z.string(),
      "3xl": z.string(),
      "4xl": z.string(),
      "5xl": z.string(),
      "6xl": z.string(),
    }),
    fontWeight: z.object({
      light: z.string(),
      regular: z.string(),
      medium: z.string(),
      semibold: z.string(),
      bold: z.string(),
      extrabold: z.string(),
    }),
    lineHeight: z.object({
      tight: z.string(),
      snug: z.string(),
      normal: z.string(),
      relaxed: z.string(),
      loose: z.string(),
    }),
    letterSpacing: z.object({
      tighter: z.string(),
      tight: z.string(),
      normal: z.string(),
      wide: z.string(),
      wider: z.string(),
      widest: z.string(),
    }),
  }),
  spacing: z.object({
    0: z.string(),
    1: z.string(),
    2: z.string(),
    3: z.string(),
    4: z.string(),
    5: z.string(),
    6: z.string(),
    8: z.string(),
    10: z.string(),
    12: z.string(),
    16: z.string(),
    20: z.string(),
    24: z.string(),
    32: z.string(),
  }),
  radius: z.object({
    none: z.string(),
    xs: z.string(),
    sm: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string(),
    "2xl": z.string(),
    "3xl": z.string(),
    full: z.string(),
  }),
  shadow: z.object({
    none: z.string(),
    xs: z.string(),
    sm: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string(),
    "2xl": z.string(),
    inner: z.string(),
  }),
  animation: z.object({
    duration: z.object({
      fast: z.string(),
      normal: z.string(),
      slow: z.string(),
      slower: z.string(),
    }),
    easing: z.object({
      linear: z.string(),
      ease: z.string(),
      easeIn: z.string(),
      easeOut: z.string(),
      easeInOut: z.string(),
      spring: z.string(),
    }),
  }),
  zIndex: z.object({
    hide: z.string(),
    auto: z.string(),
    base: z.string(),
    dropdown: z.string(),
    sticky: z.string(),
    overlay: z.string(),
    modal: z.string(),
    popover: z.string(),
    toast: z.string(),
    tooltip: z.string(),
  }),
  blur: z.object({
    none: z.string(),
    sm: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string(),
    "2xl": z.string(),
  }),
});

export type ThemeTokens = z.infer<typeof themeTokensSchema>;
export type ColorScale = z.infer<typeof colorScaleSchema>;
export type SemanticColors = z.infer<typeof semanticColorsSchema>;
export type SurfaceColors = z.infer<typeof surfaceColorsSchema>;
export type TextColors = z.infer<typeof textColorsSchema>;

export type GenerateMode = "prompt" | "color" | "both";

export interface GenerateThemeRequest {
  prompt?: string;
  seedColor?: string;
  mode: GenerateMode;
}

export interface HistoryItem {
  id: string;
  theme: ThemeTokens;
  prompt: string;
  name: string;
  timestamp: number;
}
