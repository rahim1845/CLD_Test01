import { generateTheme, type EngineInput, type EngineResult } from "@/lib/engine";
import type { ThemeTokens } from "@/types/theme";

/** An empty brief yields the engine's canonical theme: cornflower primary, champagne accent, Inter, crisp corners. */
export const DEFAULT_INPUT: EngineInput = { mode: "prompt", prompt: "", variation: 0 };

export const defaultResult: EngineResult = generateTheme(DEFAULT_INPUT);

export const defaultTheme: ThemeTokens = defaultResult.theme;

export const defaultThemeName: string = defaultResult.name;

export const defaultSeedColor: string = defaultTheme.color.primary[500];
