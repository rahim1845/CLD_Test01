"use client";

import { useState } from "react";
import { useThemeStore } from "@/store/themeStore";
import ColorSection from "./ColorSection";
import TypographySection from "./TypographySection";
import SpacingSection from "./SpacingSection";
import EffectsSection from "./EffectsSection";

type SubTab = "colors" | "typography" | "spacing" | "effects";

const SUB_TABS: { id: SubTab; label: string }[] = [
  { id: "colors", label: "Colors" },
  { id: "typography", label: "Typography" },
  { id: "spacing", label: "Spacing" },
  { id: "effects", label: "Effects" },
];

export default function TokensPanel() {
  const { currentTheme } = useThemeStore();
  const [subTab, setSubTab] = useState<SubTab>("colors");

  return (
    <div className="flex flex-col h-full">
      {/* Sub tabs */}
      <div className="flex gap-1 px-4 pt-3 pb-2 border-b border-[#12122a] flex-shrink-0">
        {SUB_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              subTab === t.id
                ? "bg-indigo-600/20 text-indigo-400"
                : "text-[#9090b8] hover:text-[#ddddf0] hover:bg-[#12122a]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 preview-scroll">
        {subTab === "colors" && <ColorSection theme={currentTheme} />}
        {subTab === "typography" && <TypographySection theme={currentTheme} />}
        {subTab === "spacing" && <SpacingSection theme={currentTheme} />}
        {subTab === "effects" && <EffectsSection theme={currentTheme} />}
      </div>
    </div>
  );
}
