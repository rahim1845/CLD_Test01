"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { EngineAnalysis, EngineResult } from "@/lib/engine";
import { themeTokensSchema, type GenerateMode, type HistoryItem, type ThemeTokens } from "@/types/theme";
import { defaultResult, defaultSeedColor } from "./defaultTheme";

export type PreviewScreen = "dashboard" | "settings" | "mobile" | "landing";
export type PreviewTab = "preview" | "tokens" | "exports";
export type Engine = "local" | "ai";

/** A history entry plus the recipe that produced it. Extra fields are optional so pre-engine entries still load. */
export interface ThemeHistoryItem extends HistoryItem {
  engine?: Engine;
  mode?: GenerateMode;
  seedColor?: string;
  variation?: number;
  analysis?: EngineAnalysis | null;
}

export const HISTORY_LIMIT = 8;

interface ThemeState {
  currentTheme: ThemeTokens;
  themeName: string;
  analysis: EngineAnalysis | null;
  themeHistory: ThemeHistoryItem[];
  activeHistoryId: string | null;
  activeScreen: PreviewScreen;
  activeTab: PreviewTab;
  isGenerating: boolean;
  darkMode: boolean;
  engine: Engine;
  generateMode: GenerateMode;
  promptText: string;
  seedColor: string;
  variation: number;
  error: string | null;

  setCurrentTheme: (theme: ThemeTokens) => void;
  setThemeName: (name: string) => void;
  /** Shows a freshly generated theme. It is not in history until it is committed. */
  applyResult: (result: Pick<EngineResult, "theme" | "name"> & { analysis: EngineAnalysis | null }) => void;
  addToHistory: (item: ThemeHistoryItem) => void;
  updateHistoryItem: (id: string, patch: Partial<Omit<ThemeHistoryItem, "id">>) => void;
  restoreFromHistory: (id: string) => void;
  clearHistory: () => void;
  setActiveScreen: (screen: PreviewScreen) => void;
  setActiveTab: (tab: PreviewTab) => void;
  setIsGenerating: (v: boolean) => void;
  setDarkMode: (v: boolean) => void;
  setEngine: (engine: Engine) => void;
  setGenerateMode: (mode: GenerateMode) => void;
  setPromptText: (text: string) => void;
  setSeedColor: (color: string) => void;
  setVariation: (variation: number) => void;
  setError: (error: string | null) => void;
}

type PersistedState = Pick<
  ThemeState,
  | "currentTheme"
  | "themeName"
  | "analysis"
  | "themeHistory"
  | "activeHistoryId"
  | "darkMode"
  | "engine"
  | "generateMode"
  | "promptText"
  | "seedColor"
  | "variation"
>;

const MODES: GenerateMode[] = ["prompt", "color", "both"];
const ENGINES: Engine[] = ["local", "ai"];

const isString = (v: unknown): v is string => typeof v === "string";
const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

function parseTheme(value: unknown): ThemeTokens | null {
  const parsed = themeTokensSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

function parseAnalysis(value: unknown): EngineAnalysis | null {
  if (!isObject(value) || !Array.isArray(value.tags) || !isString(value.summary)) return null;
  return value as unknown as EngineAnalysis;
}

function parseHistoryItem(value: unknown): ThemeHistoryItem | null {
  if (!isObject(value) || !isString(value.id)) return null;
  const theme = parseTheme(value.theme);
  if (!theme) return null;
  return {
    id: value.id,
    theme,
    prompt: isString(value.prompt) ? value.prompt : "",
    name: isString(value.name) ? value.name : "Untitled theme",
    timestamp: typeof value.timestamp === "number" ? value.timestamp : 0,
    engine: ENGINES.includes(value.engine as Engine) ? (value.engine as Engine) : "ai",
    mode: MODES.includes(value.mode as GenerateMode) ? (value.mode as GenerateMode) : undefined,
    seedColor: isString(value.seedColor) ? value.seedColor : undefined,
    variation: Number.isInteger(value.variation) ? (value.variation as number) : undefined,
    analysis: parseAnalysis(value.analysis),
  };
}

/** localStorage is user-editable and may predate the current schema, so every field is checked before it reaches the UI. */
function sanitize(raw: unknown): Partial<PersistedState> {
  if (!isObject(raw)) return {};
  const out: Partial<PersistedState> = {};
  const theme = parseTheme(raw.currentTheme);
  if (theme) {
    out.currentTheme = theme;
    if (isString(raw.themeName) && raw.themeName.trim()) out.themeName = raw.themeName;
    out.analysis = parseAnalysis(raw.analysis);
  }
  if (Array.isArray(raw.themeHistory)) {
    out.themeHistory = raw.themeHistory
      .map(parseHistoryItem)
      .filter((item): item is ThemeHistoryItem => item !== null)
      .slice(0, HISTORY_LIMIT);
  }
  if (isString(raw.activeHistoryId) && out.themeHistory?.some((h) => h.id === raw.activeHistoryId)) {
    out.activeHistoryId = raw.activeHistoryId;
  }
  if (typeof raw.darkMode === "boolean") out.darkMode = raw.darkMode;
  if (ENGINES.includes(raw.engine as Engine)) out.engine = raw.engine as Engine;
  if (MODES.includes(raw.generateMode as GenerateMode)) out.generateMode = raw.generateMode as GenerateMode;
  if (isString(raw.promptText)) out.promptText = raw.promptText;
  if (isString(raw.seedColor)) out.seedColor = raw.seedColor;
  if (Number.isInteger(raw.variation) && (raw.variation as number) >= 0) out.variation = raw.variation as number;
  return out;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: defaultResult.theme,
      themeName: defaultResult.name,
      analysis: defaultResult.analysis,
      themeHistory: [],
      activeHistoryId: null,
      activeScreen: "dashboard",
      activeTab: "preview",
      isGenerating: false,
      darkMode: true,
      engine: "local",
      generateMode: "prompt",
      promptText: "",
      seedColor: defaultSeedColor,
      variation: 0,
      error: null,

      setCurrentTheme: (theme) => set({ currentTheme: theme }),
      setThemeName: (name) =>
        set((state) => ({
          themeName: name,
          themeHistory: state.activeHistoryId
            ? state.themeHistory.map((h) => (h.id === state.activeHistoryId ? { ...h, name } : h))
            : state.themeHistory,
        })),
      applyResult: ({ theme, name, analysis }) =>
        set({ currentTheme: theme, themeName: name, analysis, activeHistoryId: null }),
      addToHistory: (item) =>
        set((state) => ({
          themeHistory: [item, ...state.themeHistory.filter((h) => h.id !== item.id)].slice(0, HISTORY_LIMIT),
          activeHistoryId: item.id,
        })),
      updateHistoryItem: (id, patch) =>
        set((state) => ({
          themeHistory: state.themeHistory.map((h) => (h.id === id ? { ...h, ...patch } : h)),
        })),
      restoreFromHistory: (id) => {
        const item = get().themeHistory.find((h) => h.id === id);
        if (!item) return;
        set({
          currentTheme: item.theme,
          themeName: item.name,
          analysis: item.analysis ?? null,
          activeHistoryId: item.id,
          ...(item.mode ? { generateMode: item.mode } : {}),
          ...(item.mode && item.mode !== "color" ? { promptText: item.prompt } : {}),
          ...(item.seedColor ? { seedColor: item.seedColor } : {}),
          variation: item.variation ?? 0,
        });
      },
      clearHistory: () => set({ themeHistory: [], activeHistoryId: null }),
      setActiveScreen: (screen) => set({ activeScreen: screen }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setIsGenerating: (v) => set({ isGenerating: v }),
      setDarkMode: (v) => set({ darkMode: v }),
      setEngine: (engine) => set({ engine }),
      setGenerateMode: (mode) => set({ generateMode: mode }),
      setPromptText: (text) => set({ promptText: text }),
      setSeedColor: (color) => set({ seedColor: color }),
      setVariation: (variation) => set({ variation: Math.max(0, Math.floor(variation)) }),
      setError: (error) => set({ error }),
    }),
    {
      name: "themeforge-state",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      // Rehydrated by ThemeSync after mount, so the first client render matches the server HTML.
      skipHydration: true,
      partialize: (state): PersistedState => ({
        currentTheme: state.currentTheme,
        themeName: state.themeName,
        analysis: state.analysis,
        themeHistory: state.themeHistory,
        activeHistoryId: state.activeHistoryId,
        darkMode: state.darkMode,
        engine: state.engine,
        generateMode: state.generateMode,
        promptText: state.promptText,
        seedColor: state.seedColor,
        variation: state.variation,
      }),
      migrate: (persisted, version) => {
        // v0 stored only AI-made history plus a name that did not match the theme shown on load.
        if (version < 2 && isObject(persisted)) return { themeHistory: persisted.themeHistory };
        return persisted;
      },
      merge: (persisted, current) => ({ ...current, ...sanitize(persisted) }),
    },
  ),
);
