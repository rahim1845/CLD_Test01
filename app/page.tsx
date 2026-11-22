"use client";

import { useThemeStore } from "@/store/themeStore";
import type { PreviewTab } from "@/store/themeStore";
import ThemeSync from "@/components/ThemeSync";
import ThemeNameEditor from "@/components/ThemeNameEditor";
import InputPanel from "@/components/generator/InputPanel";
import PreviewContainer from "@/components/preview/PreviewContainer";
import TokensPanel from "@/components/tokens/TokensPanel";
import ExportsPanel from "@/components/exports/ExportsPanel";

const TABS: { id: PreviewTab; label: string }[] = [
  { id: "preview", label: "Live Preview" },
  { id: "tokens", label: "All Tokens" },
  { id: "exports", label: "Export" },
];

export default function Home() {
  const { activeTab, setActiveTab } = useThemeStore();

  return (
    <>
      <ThemeSync />
      <div className="h-screen flex flex-col overflow-hidden" style={{ background: "#050509", color: "#ddddf0" }}>
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-5 py-3 flex-shrink-0 border-b"
          style={{ background: "#0a0a14", borderColor: "#12122a" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-bold"
              style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
            >
              T
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#ddddf0]">ThemeForge</span>
              <span className="text-[#3a3a58] text-sm">/</span>
              <ThemeNameEditor />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-[#5a5a80] px-2 py-1 rounded-full border border-[#12122a]">
              AI-Powered
            </span>
          </div>
        </header>

        {/* Main layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left panel — generator */}
          <aside
            className="w-72 flex-shrink-0 flex flex-col border-r overflow-hidden"
            style={{ background: "#070710", borderColor: "#12122a" }}
          >
            <div className="px-4 py-3 border-b" style={{ borderColor: "#12122a" }}>
              <h2 className="text-xs font-semibold text-[#ddddf0] uppercase tracking-wider">Theme Generator</h2>
            </div>
            <div className="flex-1 overflow-hidden p-4">
              <InputPanel />
            </div>
          </aside>

          {/* Right panel */}
          <main className="flex-1 flex flex-col overflow-hidden">
            {/* Tab bar */}
            <div
              className="flex items-center gap-1 px-4 py-2 border-b flex-shrink-0"
              style={{ background: "#0a0a14", borderColor: "#12122a" }}
            >
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                      : "text-[#9090b8] hover:text-[#ddddf0] hover:bg-[#12122a]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === "preview" && <PreviewContainer />}
              {activeTab === "tokens" && <TokensPanel />}
              {activeTab === "exports" && <ExportsPanel />}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
