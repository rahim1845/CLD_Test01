"use client";

import React, { memo } from "react";
import { useThemeStore } from "@/store/themeStore";
import type { PreviewScreen } from "@/store/themeStore";
import DashboardScreen from "./screens/DashboardScreen";
import SettingsScreen from "./screens/SettingsScreen";
import MobileScreen from "./screens/MobileScreen";
import LandingScreen from "./screens/LandingScreen";

const SCREENS: { id: PreviewScreen; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "settings", label: "App Settings" },
  { id: "mobile", label: "Mobile App" },
  { id: "landing", label: "Landing Page" },
];

const PreviewContainer = memo(function PreviewContainer() {
  const { currentTheme, activeScreen, setActiveScreen, darkMode, setDarkMode } = useThemeStore();

  const renderScreen = () => {
    const props = { theme: currentTheme, dark: darkMode };
    switch (activeScreen) {
      case "dashboard": return <DashboardScreen {...props} />;
      case "settings": return <SettingsScreen {...props} />;
      case "mobile": return <MobileScreen {...props} />;
      case "landing": return <LandingScreen {...props} />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#12122a] flex-shrink-0">
        <div className="flex gap-1">
          {SCREENS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveScreen(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeScreen === s.id
                  ? "bg-indigo-600/20 text-indigo-400"
                  : "text-[#9090b8] hover:text-[#ddddf0] hover:bg-[#12122a]"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors text-[#9090b8] hover:text-[#ddddf0] hover:bg-[#12122a] border border-[#12122a]"
        >
          {darkMode ? "☀ Light" : "☾ Dark"}
        </button>
      </div>

      {/* Screen */}
      <div className="flex-1 overflow-hidden rounded-b-xl">
        {renderScreen()}
      </div>
    </div>
  );
});

export default PreviewContainer;
