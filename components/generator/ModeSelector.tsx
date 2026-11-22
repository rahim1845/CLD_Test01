"use client";

import { useThemeStore } from "@/store/themeStore";
import type { GenerateMode } from "@/types/theme";

const MODES: { value: GenerateMode; label: string }[] = [
  { value: "prompt", label: "Prompt" },
  { value: "color", label: "Color" },
  { value: "both", label: "Both" },
];

export default function ModeSelector() {
  const { generateMode, setGenerateMode } = useThemeStore();

  return (
    <div className="flex rounded-lg overflow-hidden border border-[#12122a] bg-[#0a0a14]">
      {MODES.map((m) => (
        <button
          key={m.value}
          onClick={() => setGenerateMode(m.value)}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            generateMode === m.value
              ? "bg-indigo-600 text-white"
              : "text-[#9090b8] hover:text-[#ddddf0] hover:bg-[#12122a]"
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
