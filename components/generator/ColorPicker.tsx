"use client";

import { useThemeStore } from "@/store/themeStore";
import { isValidHex } from "@/lib/colorUtils";

const PRESETS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#ef4444",
  "#f97316", "#eab308", "#22c55e", "#14b8a6",
  "#3b82f6", "#06b6d4",
];

export default function ColorPicker() {
  const { seedColor, setSeedColor } = useThemeStore();

  const handleInput = (val: string) => {
    setSeedColor(val);
  };

  const handleBlur = (val: string) => {
    if (!isValidHex(val)) setSeedColor("#6366f1");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <input
            type="color"
            value={isValidHex(seedColor) ? seedColor : "#6366f1"}
            onChange={(e) => handleInput(e.target.value)}
            className="w-10 h-10 rounded-lg cursor-pointer border-2 border-[#12122a] bg-transparent"
            style={{ padding: "2px" }}
          />
        </div>
        <input
          type="text"
          value={seedColor}
          onChange={(e) => handleInput(e.target.value)}
          onBlur={(e) => handleBlur(e.target.value)}
          placeholder="#6366f1"
          maxLength={7}
          className="flex-1 px-3 py-2 rounded-lg bg-[#0a0a14] border border-[#12122a] text-[#ddddf0] text-sm font-mono placeholder-[#3a3a58] focus:outline-none focus:border-indigo-500"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((color) => (
          <button
            key={color}
            onClick={() => setSeedColor(color)}
            title={color}
            className={`w-7 h-7 rounded-md transition-transform hover:scale-110 ${
              seedColor === color ? "ring-2 ring-white ring-offset-1 ring-offset-[#050509]" : ""
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}
