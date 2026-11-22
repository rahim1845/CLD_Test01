"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ThemeTokens, HistoryItem, GenerateMode } from "@/types/theme";
import { defaultTheme } from "./defaultTheme";

export type PreviewScreen = "dashboard" | "settings" | "mobile" | "landing";
export type PreviewTab = "preview" | "tokens" | "exports";

interface ThemeState {
  currentTheme: ThemeTokens;
  themeName: string;
  themeHistory: HistoryItem[];
  activeScreen: PreviewScreen;
  activeTab: PreviewTab;
  isGenerating: boolean;
  darkMode: boolean;
  generateMode: GenerateMode;
  promptText: string;
  seedColor: string;
  error: string | null;

  setCurrentTheme: (theme: ThemeTokens) => void;
  setThemeName: (name: string) => void;
  addToHistory: (item: HistoryItem) => void;
  restoreFromHistory: (id: string) => void;
  setActiveScreen: (screen: PreviewScreen) => void;
  setActiveTab: (tab: PreviewTab) => void;
  setIsGenerating: (v: boolean) => void;
  setDarkMode: (v: boolean) => void;
  setGenerateMode: (mode: GenerateMode) => void;
  setPromptText: (text: string) => void;
  setSeedColor: (color: string) => void;
  setError: (error: string | null) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: defaultTheme,
      themeName: "Indigo Void",
      themeHistory: [],
      activeScreen: "dashboard",
      activeTab: "preview",
      isGenerating: false,
      darkMode: true,
      generateMode: "prompt",
      promptText: "",
      seedColor: "#6366f1",
      error: null,

      setCurrentTheme: (theme) => set({ currentTheme: theme }),
      setThemeName: (name) => set({ themeName: name }),
      addToHistory: (item) =>
        set((state) => ({
          themeHistory: [item, ...state.themeHistory].slice(0, 5),
        })),
      restoreFromHistory: (id) => {
        const item = get().themeHistory.find((h) => h.id === id);
        if (item) {
          set({ currentTheme: item.theme, themeName: item.name });
        }
      },
      setActiveScreen: (screen) => set({ activeScreen: screen }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setIsGenerating: (v) => set({ isGenerating: v }),
      setDarkMode: (v) => set({ darkMode: v }),
      setGenerateMode: (mode) => set({ generateMode: mode }),
      setPromptText: (text) => set({ promptText: text }),
      setSeedColor: (color) => set({ seedColor: color }),
      setError: (error) => set({ error }),
    }),
    {
      name: "themeforge-state",
      partialize: (state) => ({
        themeHistory: state.themeHistory,
        themeName: state.themeName,
      }),
    }
  )
);
