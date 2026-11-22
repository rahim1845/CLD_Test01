"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/themeStore";
import { injectThemeVars } from "@/lib/injectThemeVars";

export default function ThemeSync() {
  const currentTheme = useThemeStore((s) => s.currentTheme);

  useEffect(() => {
    injectThemeVars(currentTheme);
  }, [currentTheme]);

  return null;
}
