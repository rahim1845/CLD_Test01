"use client";

import { useCallback, useRef } from "react";
import { useThemeStore } from "@/store/themeStore";
import { injectThemeVars } from "@/lib/injectThemeVars";
import { themeTokensSchema } from "@/types/theme";
import type { ThemeTokens } from "@/types/theme";
import ModeSelector from "./ModeSelector";
import ColorPicker from "./ColorPicker";
import MiniPreview from "./MiniPreview";
import HistoryStrip from "./HistoryStrip";

export default function InputPanel() {
  const {
    generateMode, promptText, seedColor, isGenerating, error, themeName,
    setCurrentTheme, setThemeName, setIsGenerating, setError,
    addToHistory, setPromptText,
  } = useThemeStore();

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const bufferRef = useRef("");

  const applyPartialTheme = useCallback((text: string) => {
    try {
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");
      if (jsonStart === -1 || jsonEnd === -1) return;
      const jsonStr = text.slice(jsonStart, jsonEnd + 1);
      const parsed = JSON.parse(jsonStr);
      const result = themeTokensSchema.safeParse(parsed);
      if (result.success) {
        setCurrentTheme(result.data);
        injectThemeVars(result.data);
      }
    } catch {
      // partial JSON — keep buffering
    }
  }, [setCurrentTheme]);

  const fetchThemeName = useCallback(async (theme: ThemeTokens, prompt: string) => {
    try {
      const res = await fetch("/api/generate-theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, prompt }),
      });
      const data = await res.json();
      if (data.name) setThemeName(data.name);
    } catch {
      // ignore
    }
  }, [setThemeName]);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    bufferRef.current = "";

    try {
      const res = await fetch("/api/generate-theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: generateMode,
          prompt: promptText,
          seedColor,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;

          try {
            const event = JSON.parse(jsonStr);

            if (event.type === "delta") {
              bufferRef.current += event.text;

              if (debounceRef.current) clearTimeout(debounceRef.current);
              debounceRef.current = setTimeout(() => {
                applyPartialTheme(bufferRef.current);
              }, 150);
            } else if (event.type === "complete" && event.theme) {
              if (debounceRef.current) clearTimeout(debounceRef.current);
              setCurrentTheme(event.theme);
              injectThemeVars(event.theme);

              const id = Math.random().toString(36).slice(2);
              addToHistory({
                id,
                theme: event.theme,
                prompt: promptText || seedColor || "Generated theme",
                name: themeName,
                timestamp: Date.now(),
              });

              fetchThemeName(event.theme, promptText);
            } else if (event.type === "error") {
              setError(event.message);
            }
          } catch {
            // skip malformed SSE line
          }
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  }, [generateMode, promptText, seedColor, setCurrentTheme, setIsGenerating, setError, addToHistory, applyPartialTheme, fetchThemeName, themeName]);

  return (
    <div className="flex flex-col gap-5 h-full overflow-y-auto pr-1">
      <HistoryStrip />

      <div className="space-y-4">
        <ModeSelector />

        {(generateMode === "prompt" || generateMode === "both") && (
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Describe your brand: e.g. 'A fintech startup that feels trustworthy yet modern, with deep navy and electric blue accents...'"
            rows={4}
            className="w-full px-3 py-2.5 rounded-lg bg-[#0a0a14] border border-[#12122a] text-[#ddddf0] text-sm placeholder-[#3a3a58] focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
          />
        )}

        {(generateMode === "color" || generateMode === "both") && (
          <ColorPicker />
        )}

        {error && (
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-red-950/30 border border-red-500/30">
            <p className="text-xs text-red-400">{error}</p>
            <button
              onClick={handleGenerate}
              className="text-xs text-red-300 hover:text-red-200 ml-2 underline"
            >
              Try again
            </button>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden"
          style={{
            background: isGenerating
              ? "linear-gradient(135deg, #3730a3, #4338ca)"
              : "linear-gradient(135deg, #4f46e5, #7c3aed)",
          }}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </span>
          ) : (
            "Generate Theme"
          )}
        </button>
      </div>

      <MiniPreview />
    </div>
  );
}
