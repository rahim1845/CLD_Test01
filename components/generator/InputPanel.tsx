"use client";

import { useHotkeys } from "@/components/ui/useHotkeys";
import { useThemeStore } from "@/store/themeStore";
import AnalysisCard from "./AnalysisCard";
import BriefInput from "./BriefInput";
import ColorPicker from "./ColorPicker";
import EngineSwitch from "./EngineSwitch";
import GenerateBar from "./GenerateBar";
import HistoryStrip from "./HistoryStrip";
import MiniPreview from "./MiniPreview";
import ModeSelector from "./ModeSelector";
import { useGenerator } from "./useGenerator";
import { useIsMac } from "@/components/ui/useIsMac";

function Divider() {
  return <div aria-hidden className="-mx-4 h-px bg-[var(--shell-border)] sm:-mx-5" />;
}

export default function InputPanel() {
  const generator = useGenerator();
  const { engine, status, failure } = generator;

  const mode = useThemeStore((s) => s.generateMode);
  const promptText = useThemeStore((s) => s.promptText);
  const seedColor = useThemeStore((s) => s.seedColor);
  const variation = useThemeStore((s) => s.variation);
  const analysis = useThemeStore((s) => s.analysis);
  const darkMode = useThemeStore((s) => s.darkMode);
  const setDarkMode = useThemeStore((s) => s.setDarkMode);

  const shortcut = useIsMac() ? "⌘↵" : "Ctrl+Enter";

  useHotkeys({ s: generator.shuffle }, engine === "local");

  return (
    <div className="flex flex-col gap-6">
      <EngineSwitch value={engine} onChange={generator.setEngine} />

      <div className="flex flex-col gap-5">
        <ModeSelector value={mode} onChange={generator.setMode} />
        {mode !== "color" && (
          <BriefInput value={promptText} onChange={generator.setPrompt} onExample={generator.applyExample} />
        )}
        {mode !== "prompt" && <ColorPicker value={seedColor} onChange={generator.setSeed} />}
        <GenerateBar
          engine={engine}
          mode={mode}
          status={status}
          failure={failure}
          onGenerate={generator.generate}
          onCancel={generator.cancel}
          onShuffle={generator.shuffle}
          onUseInstant={() => generator.setEngine("local")}
          onDismissFailure={generator.dismissFailure}
        />
      </div>

      <Divider />

      <AnalysisCard
        analysis={analysis}
        variation={variation}
        darkMode={darkMode}
        composing={status.kind === "streaming"}
        onPreviewMode={setDarkMode}
      />
      <MiniPreview />
      <HistoryStrip shortcut={shortcut} />
    </div>
  );
}
