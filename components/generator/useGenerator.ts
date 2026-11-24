"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { generateTheme, type EngineInput } from "@/lib/engine";
import { useThemeStore, type Engine, type ThemeHistoryItem } from "@/store/themeStore";
import { themeTokensSchema, type GenerateMode, type ThemeTokens } from "@/types/theme";
import { mergePartialTheme } from "./partialTheme";

export const LOCAL_STAGES = ["Reading brief", "Building palette", "Pairing type", "Checking contrast"] as const;

const STAGE_MS = 175;
const LIVE_DEBOUNCE_MS = 200;
const LIVE_MAX_WAIT_MS = 600;
const PARTIAL_INTERVAL_MS = 150;
const STALL_TIMEOUT_MS = 60_000;
const SAVED_FLASH_MS = 1800;
const ENDPOINT = "/api/generate-theme";

export type GeneratorStatus =
  | { kind: "idle" }
  | { kind: "composing"; stage: number }
  | { kind: "streaming"; tokens: number }
  | { kind: "saved" };

export interface GeneratorFailure {
  code: string;
  message: string;
}

class GenerationError extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

const getState = () => useThemeStore.getState();

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
}

function engineInput(s = getState()): EngineInput {
  return { mode: s.generateMode, prompt: s.promptText, seedColor: s.seedColor, variation: s.variation };
}

function recipeKey(engine: Engine | undefined, mode: GenerateMode | undefined, prompt: string, seed?: string, variation = 0) {
  return [engine, mode, prompt.trim().toLowerCase(), mode === "prompt" ? "" : seed, variation].join("|");
}

/** Adds the theme on screen to history, or moves its existing entry to the top. Returns the entry id. */
function commitCurrent(engine: Engine): string {
  const s = getState();
  const prompt = s.generateMode === "color" ? s.seedColor : s.promptText.trim();
  const key = recipeKey(engine, s.generateMode, prompt, s.seedColor, s.variation);
  const existing =
    s.themeHistory.find((h) => h.id === s.activeHistoryId) ??
    (engine === "local"
      ? s.themeHistory.find((h) => recipeKey(h.engine, h.mode, h.prompt, h.seedColor, h.variation) === key)
      : undefined);

  if (existing) {
    s.addToHistory({ ...existing, name: s.themeName, timestamp: Date.now() });
    return existing.id;
  }

  const item: ThemeHistoryItem = {
    id: newId(),
    theme: s.currentTheme,
    name: s.themeName,
    prompt,
    timestamp: Date.now(),
    engine,
    mode: s.generateMode,
    seedColor: s.generateMode === "prompt" ? undefined : s.seedColor,
    variation: s.variation,
    analysis: s.analysis,
  };
  s.addToHistory(item);
  return item.id;
}

async function readError(res: Response): Promise<GenerationError> {
  const data = (await res.json().catch(() => null)) as { code?: unknown; error?: unknown } | null;
  return new GenerationError(
    typeof data?.code === "string" ? data.code : "api_error",
    typeof data?.error === "string" ? data.error : `The theme service responded with ${res.status}.`,
  );
}

async function nameWithClaude(id: string, theme: ThemeTokens, prompt: string) {
  try {
    const res = await fetch(ENDPOINT, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme, prompt }),
    });
    if (!res.ok) return;
    const { name } = (await res.json()) as { name?: unknown };
    if (typeof name !== "string" || !name) return;
    const s = getState();
    if (s.activeHistoryId === id) s.setThemeName(name);
    else s.updateHistoryItem(id, { name });
  } catch {
    // The engine-made name stays in place.
  }
}

/**
 * Drives the sidebar. The local engine regenerates live while inputs change and "Generate" commits the
 * result to history behind a short staged sequence. The AI engine streams from the API route and morphs the
 * preview as tokens arrive.
 */
export function useGenerator() {
  const engine = useThemeStore((s) => s.engine);
  const [status, setStatusState] = useState<GeneratorStatus>({ kind: "idle" });
  const [failure, setFailure] = useState<GeneratorFailure | null>(null);

  const statusRef = useRef(status);
  const liveTimer = useRef<number | null>(null);
  const liveSince = useRef<number | null>(null);
  const stageTimers = useRef<number[]>([]);
  const aiAbort = useRef<AbortController | null>(null);

  const setStatus = useCallback((next: GeneratorStatus) => {
    statusRef.current = next;
    setStatusState(next);
  }, []);

  const clearStageTimers = useCallback(() => {
    stageTimers.current.forEach((t) => window.clearTimeout(t));
    stageTimers.current = [];
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    stageTimers.current.push(window.setTimeout(fn, ms));
  }, []);

  const runLocal = useCallback(() => {
    getState().applyResult(generateTheme(engineInput()));
    if (statusRef.current.kind === "saved") {
      clearStageTimers();
      setStatus({ kind: "idle" });
    }
  }, [clearStageTimers, setStatus]);

  const cancelLive = useCallback(() => {
    if (liveTimer.current !== null) window.clearTimeout(liveTimer.current);
    liveTimer.current = null;
    liveSince.current = null;
  }, []);

  const flushLive = useCallback(() => {
    if (liveTimer.current === null) return;
    cancelLive();
    runLocal();
  }, [cancelLive, runLocal]);

  /** Trailing debounce with a ceiling, so a fast typist still sees the theme follow along. */
  const scheduleLive = useCallback(() => {
    if (getState().engine !== "local") return;
    const now = performance.now();
    if (liveTimer.current !== null) window.clearTimeout(liveTimer.current);
    liveSince.current ??= now;
    const wait = Math.max(0, Math.min(LIVE_DEBOUNCE_MS, liveSince.current + LIVE_MAX_WAIT_MS - now));
    liveTimer.current = window.setTimeout(() => {
      liveTimer.current = null;
      liveSince.current = null;
      runLocal();
    }, wait);
  }, [runLocal]);

  const refreshNow = useCallback(() => {
    cancelLive();
    if (getState().engine === "local") runLocal();
  }, [cancelLive, runLocal]);

  const setPrompt = useCallback(
    (text: string) => {
      const s = getState();
      s.setPromptText(text);
      s.setVariation(0);
      scheduleLive();
    },
    [scheduleLive],
  );

  const applyExample = useCallback(
    (text: string) => {
      const s = getState();
      s.setPromptText(text);
      s.setVariation(0);
      refreshNow();
    },
    [refreshNow],
  );

  const setMode = useCallback(
    (mode: GenerateMode) => {
      const s = getState();
      if (s.generateMode === mode) return;
      s.setGenerateMode(mode);
      s.setVariation(0);
      refreshNow();
    },
    [refreshNow],
  );

  const setSeed = useCallback(
    (hex: string, immediate = false) => {
      const s = getState();
      if (s.seedColor === hex) return;
      s.setSeedColor(hex);
      s.setVariation(0);
      if (immediate) refreshNow();
      else scheduleLive();
    },
    [refreshNow, scheduleLive],
  );

  const shuffle = useCallback(() => {
    const s = getState();
    if (s.engine !== "local") return;
    s.setVariation(s.variation + 1);
    refreshNow();
  }, [refreshNow]);

  const commitLocal = useCallback(() => {
    if (statusRef.current.kind === "composing") return;
    flushLive();
    clearStageTimers();
    setFailure(null);
    getState().setIsGenerating(true);
    setStatus({ kind: "composing", stage: 0 });
    for (let i = 1; i < LOCAL_STAGES.length; i++) later(() => setStatus({ kind: "composing", stage: i }), i * STAGE_MS);
    later(() => {
      flushLive();
      commitCurrent("local");
      getState().setIsGenerating(false);
      setStatus({ kind: "saved" });
      later(() => setStatus({ kind: "idle" }), SAVED_FLASH_MS);
    }, LOCAL_STAGES.length * STAGE_MS);
  }, [clearStageTimers, flushLive, later, setStatus]);

  const generateWithClaude = useCallback(async () => {
    if (aiAbort.current) return;
    cancelLive();
    clearStageTimers();

    const s = getState();
    const snapshot = {
      currentTheme: s.currentTheme,
      themeName: s.themeName,
      analysis: s.analysis,
      activeHistoryId: s.activeHistoryId,
    };
    const request = { mode: s.generateMode, prompt: s.promptText.trim(), seedColor: s.seedColor };
    const controller = new AbortController();
    aiAbort.current = controller;

    setFailure(null);
    s.setError(null);
    s.setIsGenerating(true);
    useThemeStore.setState({ analysis: null, activeHistoryId: null });
    setStatus({ kind: "streaming", tokens: 0 });

    let text = "";
    let chunks = 0;
    let partialTimer: number | null = null;
    let stalled = false;
    let stallTimer = 0;
    const armStallTimer = () => {
      window.clearTimeout(stallTimer);
      stallTimer = window.setTimeout(() => {
        stalled = true;
        controller.abort();
      }, STALL_TIMEOUT_MS);
    };
    armStallTimer();
    const applyPartial = () => {
      partialTimer = null;
      const merged = mergePartialTheme(snapshot.currentTheme, text);
      if (merged && !controller.signal.aborted) getState().setCurrentTheme(merged);
      setStatus({ kind: "streaming", tokens: chunks });
    };

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) throw await readError(res);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let pending = "";
      let theme: ThemeTokens | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        armStallTimer();
        pending += decoder.decode(value, { stream: true });
        const events = pending.split("\n\n");
        pending = events.pop() ?? "";

        for (const event of events) {
          const data = event
            .split("\n")
            .filter((line) => line.startsWith("data:"))
            .map((line) => line.slice(5).trimStart())
            .join("\n");
          if (!data) continue;
          let payload: { type?: string; text?: unknown; theme?: unknown; code?: unknown; message?: unknown };
          try {
            payload = JSON.parse(data);
          } catch {
            continue;
          }
          if (payload.type === "delta" && typeof payload.text === "string") {
            text += payload.text;
            chunks += 1;
            partialTimer ??= window.setTimeout(applyPartial, PARTIAL_INTERVAL_MS);
          } else if (payload.type === "complete") {
            const parsed = themeTokensSchema.safeParse(payload.theme);
            if (parsed.success) theme = parsed.data;
          } else if (payload.type === "error") {
            throw new GenerationError(
              typeof payload.code === "string" ? payload.code : "api_error",
              typeof payload.message === "string" ? payload.message : "Generation failed.",
            );
          }
        }
      }

      if (partialTimer !== null) window.clearTimeout(partialTimer);
      if (!theme) throw new GenerationError("incomplete", "The response ended before the theme was complete. Try again.");

      const name = generateTheme({ mode: request.mode, prompt: request.prompt, seedColor: request.seedColor }).name;
      getState().applyResult({ theme, name, analysis: null });
      const id = commitCurrent("ai");
      setStatus({ kind: "saved" });
      later(() => setStatus({ kind: "idle" }), SAVED_FLASH_MS);
      void nameWithClaude(id, theme, request.prompt);
    } catch (e) {
      if (partialTimer !== null) window.clearTimeout(partialTimer);
      // After a switch to the Instant engine, its fresh theme is already showing and must not be overwritten.
      if (getState().engine === "ai") useThemeStore.setState(snapshot);
      if (stalled || !controller.signal.aborted) {
        const next = stalled
          ? { code: "timeout", message: "Claude stopped responding, so the request was cancelled. Try again." }
          : e instanceof GenerationError
            ? { code: e.code, message: e.message }
            : { code: "network", message: "Could not reach the theme service. Check your connection and try again." };
        setFailure(next);
        getState().setError(next.message);
      }
      if (statusRef.current.kind === "streaming") setStatus({ kind: "idle" });
    } finally {
      window.clearTimeout(stallTimer);
      if (aiAbort.current === controller) aiAbort.current = null;
      getState().setIsGenerating(false);
    }
  }, [cancelLive, clearStageTimers, later, setStatus]);

  const cancel = useCallback(() => {
    aiAbort.current?.abort();
  }, []);

  const generate = useCallback(() => {
    if (getState().engine === "local") commitLocal();
    else void generateWithClaude();
  }, [commitLocal, generateWithClaude]);

  const setEngine = useCallback(
    (next: Engine) => {
      const s = getState();
      if (s.engine === next) return;
      aiAbort.current?.abort();
      clearStageTimers();
      setFailure(null);
      s.setError(null);
      s.setIsGenerating(false);
      setStatus({ kind: "idle" });
      s.setEngine(next);
      if (next === "local") refreshNow();
      else cancelLive();
    },
    [cancelLive, clearStageTimers, refreshNow, setStatus],
  );

  const dismissFailure = useCallback(() => {
    setFailure(null);
    getState().setError(null);
  }, []);

  const generateRef = useRef(generate);
  useEffect(() => {
    generateRef.current = generate;
  }, [generate]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey) {
        if (e.repeat || e.isComposing) return;
        e.preventDefault();
        generateRef.current();
      } else if (e.key === "Escape" && aiAbort.current) {
        aiAbort.current.abort();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(
    () => () => {
      aiAbort.current?.abort();
      cancelLive();
      clearStageTimers();
      getState().setIsGenerating(false);
    },
    [cancelLive, clearStageTimers],
  );

  return {
    engine,
    status,
    failure,
    setEngine,
    setMode,
    setPrompt,
    applyExample,
    setSeed,
    shuffle,
    generate,
    cancel,
    dismissFailure,
  };
}

export type Generator = ReturnType<typeof useGenerator>;
