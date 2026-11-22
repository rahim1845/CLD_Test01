"use client";

import { useThemeStore } from "@/store/themeStore";

export default function HistoryStrip() {
  const { themeHistory, restoreFromHistory } = useThemeStore();

  if (themeHistory.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs text-[#5a5a80] uppercase tracking-wider">Recent Themes</p>
      <div className="flex flex-col gap-1.5">
        {themeHistory.map((item) => (
          <button
            key={item.id}
            onClick={() => restoreFromHistory(item.id)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#0a0a14] border border-[#12122a] hover:border-indigo-500/40 transition-colors text-left group"
          >
            <div className="flex gap-1 flex-shrink-0">
              <div
                className="w-4 h-4 rounded-full ring-1 ring-white/10"
                style={{ backgroundColor: item.theme.color.primary[500] }}
              />
              <div
                className="w-4 h-4 rounded-full ring-1 ring-white/10 -ml-1.5"
                style={{ backgroundColor: item.theme.color.accent[500] }}
              />
            </div>
            <span className="text-xs text-[#9090b8] group-hover:text-[#ddddf0] truncate transition-colors">
              {item.name || item.prompt || "Unnamed theme"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
