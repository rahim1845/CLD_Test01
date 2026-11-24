"use client";

import { useEffect, useLayoutEffect, useMemo } from "react";
import { googleFontsHref } from "@/lib/engine";
import { injectThemeVars } from "@/lib/injectThemeVars";
import { useThemeStore } from "@/store/themeStore";

const FONT_LINK_ID = "theme-fonts";

/**
 * Keeps exactly one <link id="theme-fonts"> for the current theme. A new stylesheet only replaces the old one
 * once it has loaded, so text never drops back to fallback fonts mid-change; superseded requests are discarded.
 */
function useThemeFonts(href: string | null) {
  useEffect(() => {
    const current = document.getElementById(FONT_LINK_ID);
    if (!href) {
      current?.remove();
      return;
    }
    if (current?.getAttribute("href") === href) return;

    const next = document.createElement("link");
    next.rel = "stylesheet";
    next.href = href;
    let settled = false;
    const promote = () => {
      if (settled) return;
      settled = true;
      document.querySelectorAll(`link#${FONT_LINK_ID}`).forEach((el) => el !== next && el.remove());
      next.id = FONT_LINK_ID;
    };
    next.addEventListener("load", promote);
    next.addEventListener("error", promote);
    document.head.appendChild(next);

    return () => {
      next.removeEventListener("load", promote);
      next.removeEventListener("error", promote);
      if (!settled) next.remove();
    };
  }, [href]);
}

export default function ThemeSync() {
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const fontsHref = useMemo(() => googleFontsHref(currentTheme), [currentTheme]);

  useLayoutEffect(() => {
    void useThemeStore.persist.rehydrate();
  }, []);

  useLayoutEffect(() => {
    injectThemeVars(currentTheme);
  }, [currentTheme]);

  useThemeFonts(fontsHref);

  return null;
}
