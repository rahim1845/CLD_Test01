"use client";

import { memo, useEffect, useRef, useState, type ComponentType } from "react";
import { LayoutDashboard, Lock, Moon, PanelTop, Settings2, Smartphone, Sun, type LucideIcon } from "lucide-react";
import { useThemeStore, type PreviewScreen } from "@/store/themeStore";
import { SegmentedControl, type SegmentedOption } from "@/components/ui/SegmentedControl";
import { PREVIEW_CSS, type ScreenProps } from "./kit";
import DashboardScreen from "./screens/DashboardScreen";
import SettingsScreen from "./screens/SettingsScreen";
import MobileScreen from "./screens/MobileScreen";
import LandingScreen from "./screens/LandingScreen";

type Appearance = "light" | "dark";

interface ScreenMeta {
  label: string;
  tooltip: string;
  icon: LucideIcon;
  /** Size the composition is designed for; narrower artboards scale it down to fit. */
  fit: { width: number; height?: number };
  host?: string;
  path?: string;
  Screen: ComponentType<ScreenProps>;
}

const SCREENS: Record<PreviewScreen, ScreenMeta> = {
  dashboard: {
    label: "Dashboard",
    tooltip: "Analytics dashboard",
    icon: LayoutDashboard,
    fit: { width: 980 },
    host: "app.lumen.so",
    path: "/overview",
    Screen: DashboardScreen,
  },
  settings: {
    label: "Settings",
    tooltip: "Account settings",
    icon: Settings2,
    fit: { width: 960 },
    host: "app.lumen.so",
    path: "/settings/profile",
    Screen: SettingsScreen,
  },
  mobile: {
    label: "Mobile",
    tooltip: "Mobile app",
    icon: Smartphone,
    fit: { width: 760, height: 736 },
    Screen: MobileScreen,
  },
  landing: {
    label: "Landing",
    tooltip: "Marketing site",
    icon: PanelTop,
    fit: { width: 960 },
    host: "lumen.so",
    path: "",
    Screen: LandingScreen,
  },
};

/** Below this, scaled text stops being legible, so the artboard scrolls at 100% instead. */
const MIN_SCALE = 0.62;

function fitScale(fit: ScreenMeta["fit"], size: { width: number; height: number } | null): number {
  if (!size || size.width === 0) return 1;
  const scale = Math.min(1, size.width / fit.width, fit.height ? size.height / fit.height : 1);
  // Near-1 transforms only blur text, and tiny overflow is cheaper to scroll than to scale away.
  if (scale < MIN_SCALE || scale > 0.98) return 1;
  return Math.floor(scale * 1000) / 1000;
}

const SCREEN_OPTIONS: SegmentedOption<PreviewScreen>[] = (Object.keys(SCREENS) as PreviewScreen[]).map((id) => ({
  value: id,
  icon: SCREENS[id].icon,
  tooltip: SCREENS[id].tooltip,
  label: <span className="sr-only @xl/toolbar:not-sr-only">{SCREENS[id].label}</span>,
}));

const APPEARANCE_OPTIONS: SegmentedOption<Appearance>[] = [
  { value: "light", icon: Sun, tooltip: "Light", label: <span className="sr-only">Light</span> },
  { value: "dark", icon: Moon, tooltip: "Dark", label: <span className="sr-only">Dark</span> },
];

function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((prev) =>
        prev && prev.width === Math.round(width) && prev.height === Math.round(height)
          ? prev
          : { width: Math.round(width), height: Math.round(height) },
      );
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, size] as const;
}

function BrowserChrome({ host, path }: { host: string; path: string }) {
  return (
    <div className="flex h-9 shrink-0 items-center gap-3 border-b border-[var(--shell-border)] bg-[var(--shell-panel)] px-3.5">
      <div aria-hidden className="flex w-12 shrink-0 gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-2.5 rounded-full bg-[var(--shell-hover)] shadow-[inset_0_0_0_1px_var(--shell-border)]"
          />
        ))}
      </div>
      <div className="mx-auto flex h-[22px] min-w-0 max-w-[360px] flex-1 items-center justify-center gap-1.5 rounded-[var(--shell-radius-sm)] bg-[rgba(255,255,255,0.035)] px-3 text-[11.5px] text-[var(--shell-text-subtle)] shadow-[inset_0_0_0_1px_var(--shell-border)]">
        <Lock size={10} strokeWidth={2} aria-hidden className="shrink-0" />
        <span className="truncate tracking-[-0.005em]">
          <span className="text-[var(--shell-text-muted)]">{host}</span>
          {path}
        </span>
      </div>
      <div aria-hidden className="w-12 shrink-0" />
    </div>
  );
}

const PreviewContainer = memo(function PreviewContainer() {
  const theme = useThemeStore((s) => s.currentTheme);
  const activeScreen = useThemeStore((s) => s.activeScreen);
  const setActiveScreen = useThemeStore((s) => s.setActiveScreen);
  const dark = useThemeStore((s) => s.darkMode);
  const setDarkMode = useThemeStore((s) => s.setDarkMode);
  const [viewportRef, viewport] = useElementSize<HTMLDivElement>();

  const screen = SCREENS[activeScreen];
  const Screen = screen.Screen;
  const scale = fitScale(screen.fit, viewport);
  const scaled = scale < 1;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <style href="themeforge-preview" precedence="default">
        {PREVIEW_CSS}
      </style>

      <div className="@container/toolbar shrink-0 border-b border-[var(--shell-border)]">
        <div className="flex h-12 items-center justify-between gap-3 px-3 sm:px-4 lg:px-5">
          <SegmentedControl
            aria-label="Preview screen"
            options={SCREEN_OPTIONS}
            value={activeScreen}
            onChange={setActiveScreen}
            className="[&_button]:gap-0 @xl/toolbar:[&_button]:gap-1.5"
          />
          <div className="flex items-center gap-3">
            {viewport && (
              <span
                aria-hidden
                className="hidden items-center gap-2 whitespace-nowrap font-[family-name:var(--font-mono)] text-[11px] tabular-nums text-[var(--shell-text-subtle)] @3xl/toolbar:flex"
              >
                <span>
                  {Math.round(viewport.width / scale)}
                  <span className="px-1 opacity-60">×</span>
                  {Math.round(viewport.height / scale)}
                </span>
                {scaled && (
                  <span className="rounded-[4px] border border-[var(--shell-border)] px-1.5 py-px text-[var(--shell-text-muted)]">
                    {Math.round(scale * 100)}%
                  </span>
                )}
              </span>
            )}
            <SegmentedControl
              aria-label="Preview appearance"
              options={APPEARANCE_OPTIONS}
              value={dark ? "dark" : "light"}
              onChange={(v) => setDarkMode(v === "dark")}
              className="[&_button]:gap-0 [&_button]:px-2"
            />
          </div>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 p-3 sm:p-4 lg:p-5">
        <div
          className={
            "theme-preview relative mx-auto flex h-full max-w-[1600px] flex-col overflow-hidden " +
            "rounded-[var(--shell-radius-lg)] border border-[var(--shell-border-strong)] bg-[var(--shell-panel)] " +
            "shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_24px_64px_-24px_rgba(0,0,0,0.75),0_8px_20px_-8px_rgba(0,0,0,0.5)]"
          }
        >
          {screen.host !== undefined && <BrowserChrome host={screen.host} path={screen.path ?? ""} />}
          <div ref={viewportRef} className="relative min-h-0 flex-1">
            <div
              role="img"
              aria-label={`${screen.tooltip} preview in ${dark ? "dark" : "light"} mode`}
              className={
                "preview-scroll absolute inset-0 " + (scaled ? "overflow-hidden" : "overflow-x-auto overflow-y-hidden")
              }
            >
              <div
                className="h-full origin-top-left"
                style={
                  scaled
                    ? { width: `${100 / scale}%`, height: `${100 / scale}%`, transform: `scale(${scale})` }
                    : undefined
                }
              >
                <Screen theme={theme} dark={dark} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PreviewContainer;
