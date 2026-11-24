"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { AudioWaveform, Droplet, Layers, Palette, Ruler, SquareRoundCorner, SquareStack, Type } from "lucide-react";
import type { ThemeTokens } from "@/types/theme";
import { useThemeStore } from "@/store/themeStore";
import { cn } from "@/components/ui/cn";
import { PANEL_TOOLBAR_CLASS } from "@/components/ui/panel";
import { SECTION_LABEL_CLASS } from "@/components/ui/SectionLabel";
import { ROLE_KEYS, countTokens, primaryFamily, tokenGroups } from "@/components/exports/tokenModel";
import ColorSection from "./ColorSection";
import TypographySection from "./TypographySection";
import { RadiusSection, SpacingSection } from "./SpacingSection";
import { BlurSection, ShadowSection, ZIndexSection } from "./EffectsSection";
import { MotionSection } from "./MotionSection";
import { CopyProvider, CountBadge, MONO, Section } from "./shared";

type SectionId = "colors" | "typography" | "spacing" | "radius" | "shadows" | "motion" | "layers" | "blur";

type IconType = ComponentType<{ size?: number; strokeWidth?: number; "aria-hidden"?: boolean }>;

const NAV: { id: SectionId; label: string; icon: IconType; description: string; Body: ComponentType<{ theme: ThemeTokens }> }[] = [
  {
    id: "colors",
    label: "Colors",
    icon: Palette,
    description: "Three 11-stop scales, plus semantic roles derived for light and dark with WCAG contrast checks.",
    Body: ColorSection,
  },
  {
    id: "typography",
    label: "Typography",
    icon: Type,
    description: "Specimens render in the theme's own font stacks, across the full size ramp, weights, leading and tracking.",
    Body: TypographySection,
  },
  {
    id: "spacing",
    label: "Spacing",
    icon: Ruler,
    description: "The layout rhythm. Bars are drawn to scale relative to the largest step.",
    Body: SpacingSection,
  },
  {
    id: "radius",
    label: "Radius",
    icon: SquareRoundCorner,
    description: "Corner rounding from sharp to pill, shown at actual size.",
    Body: RadiusSection,
  },
  {
    id: "shadows",
    label: "Shadows",
    icon: SquareStack,
    description: "Elevation on both a light and a dark surface, so you can judge depth in either mode.",
    Body: ShadowSection,
  },
  {
    id: "motion",
    label: "Motion",
    icon: AudioWaveform,
    description: "Durations and easing curves, played live. Demos pause when your system asks for reduced motion.",
    Body: MotionSection,
  },
  {
    id: "layers",
    label: "Z-index",
    icon: Layers,
    description: "A fixed stacking order so menus, dialogs, toasts and tooltips never fight.",
    Body: ZIndexSection,
  },
  {
    id: "blur",
    label: "Blur",
    icon: Droplet,
    description: "Backdrop blur strengths for glass surfaces, sheets and overlays.",
    Body: BlurSection,
  },
];

const SECTION_OF: Record<string, SectionId> = {
  color: "colors",
  font: "typography",
  lineHeight: "typography",
  letterSpacing: "typography",
  spacing: "spacing",
  radius: "radius",
  shadow: "shadows",
  duration: "motion",
  easing: "motion",
  zIndex: "layers",
  blur: "blur",
};

const SPY_OFFSET = 120;

/** The long-form reference. Memoized so scroll-spy updates in the panel only re-render the nav. */
const TokenReference = memo(function TokenReference({ theme, themeName }: { theme: ThemeTokens; themeName: string }) {
  const counts = useMemo(() => countTokens(theme), [theme]);
  const perSection = useMemo(() => {
    const tally = { colors: ROLE_KEYS.length * 2 } as Record<SectionId, number>;
    for (const g of tokenGroups(theme)) {
      const id = SECTION_OF[g.path[0]];
      tally[id] = (tally[id] ?? 0) + g.tokens.length;
    }
    return tally;
  }, [theme]);
  const fonts = theme.typography.fontFamily;
  const facts = [
    { term: "Primitives", detail: String(counts.primitives) },
    { term: "Mode roles", detail: `${counts.roles / 2} × light, dark` },
    { term: "Display", detail: primaryFamily(fonts.display) },
    { term: "Body", detail: primaryFamily(fonts.body) },
    { term: "Mono", detail: primaryFamily(fonts.mono) },
  ];

  return (
    <div className="mx-auto w-full max-w-[1120px] px-5 pb-28 sm:px-8 lg:px-10">
      <header className="pb-2 pt-10">
        <p className={SECTION_LABEL_CLASS}>Token reference</p>
        <h1 className="mt-2 truncate text-[26px] font-semibold leading-8 tracking-[-0.02em] text-[var(--shell-text)]">{themeName}</h1>
        <p className="mt-2 max-w-[620px] text-[13.5px] leading-[22px] text-[var(--shell-text-muted)]">
          Every value in this theme, named exactly as the exports name it. Click any swatch, row or card to copy its value.
        </p>
        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-[12px]">
          {facts.map((d) => (
            <div key={d.term} className="flex min-w-0 flex-col gap-1">
              <dt className="text-[var(--shell-text-subtle)]">{d.term}</dt>
              <dd className={cn(MONO, "truncate text-[12px] text-[var(--shell-text)]")}>{d.detail}</dd>
            </div>
          ))}
        </dl>
      </header>

      {NAV.map(({ id, label, description, Body }) => (
        <Section key={id} id={id} title={label} description={description} meta={<CountBadge>{perSection[id] ?? 0} tokens</CountBadge>}>
          <Body theme={theme} />
        </Section>
      ))}
    </div>
  );
});

export default function TokensPanel() {
  const theme = useThemeStore((s) => s.currentTheme);
  const themeName = useThemeStore((s) => s.themeName);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const jumpTarget = useRef<SectionId | null>(null);
  const [active, setActive] = useState<SectionId>("colors");

  const counts = useMemo(() => countTokens(theme), [theme]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      if (jumpTarget.current) return;
      const sections = root.querySelectorAll<HTMLElement>("[data-section]");
      const rootTop = root.getBoundingClientRect().top;
      let current = (sections[0]?.dataset.section as SectionId) ?? "colors";
      for (const s of sections) {
        if (s.getBoundingClientRect().top - rootTop <= SPY_OFFSET) current = s.dataset.section as SectionId;
      }
      if (root.scrollTop > 0 && root.scrollTop + root.clientHeight >= root.scrollHeight - 2) {
        current = (sections[sections.length - 1]?.dataset.section as SectionId) ?? current;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onScrollEnd = () => {
      jumpTarget.current = null;
      update();
    };

    update();
    root.addEventListener("scroll", onScroll, { passive: true });
    root.addEventListener("scrollend", onScrollEnd);
    return () => {
      root.removeEventListener("scroll", onScroll);
      root.removeEventListener("scrollend", onScrollEnd);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    const item = nav?.querySelector<HTMLElement>(`[data-nav="${active}"]`);
    if (!nav || !item) return;
    const left = item.offsetLeft - 16;
    const right = item.offsetLeft + item.offsetWidth + 16;
    if (left < nav.scrollLeft) nav.scrollTo({ left });
    else if (right > nav.scrollLeft + nav.clientWidth) nav.scrollTo({ left: right - nav.clientWidth });
  }, [active]);

  const jump = useCallback((id: SectionId) => {
    const root = scrollRef.current;
    const el = root?.querySelector<HTMLElement>(`#tk-${id}`);
    if (!root || !el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // The first section also brings the page intro back; the rest land with their title just under the nav.
    const top = id === NAV[0].id ? 0 : el.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop + 20;
    const max = root.scrollHeight - root.clientHeight;
    setActive(id);
    if (Math.abs(Math.min(top, max) - root.scrollTop) < 2) return;
    jumpTarget.current = id;
    root.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    window.setTimeout(() => {
      if (jumpTarget.current === id) jumpTarget.current = null;
    }, 1200);
  }, []);

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-[var(--shell-bg)]">
      <nav
        ref={navRef}
        aria-label="Token sections"
        className={cn(
          PANEL_TOOLBAR_CLASS,
          "gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {NAV.map(({ id, label, icon: Icon }) => {
          const on = id === active;
          return (
            <button
              key={id}
              type="button"
              data-nav={id}
              aria-current={on ? "location" : undefined}
              onClick={() => jump(id)}
              className={cn(
                "inline-flex h-7 shrink-0 items-center gap-1.5 rounded-[var(--shell-radius-sm)] px-2.5 text-[12.5px] font-medium",
                "outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[var(--shell-accent)]",
                on
                  ? "bg-[var(--shell-raised)] text-[var(--shell-text)] shadow-[inset_0_0_0_1px_var(--shell-border-strong)]"
                  : "text-[var(--shell-text-subtle)] hover:bg-[var(--shell-hover)] hover:text-[var(--shell-text)]",
              )}
            >
              <Icon size={14} strokeWidth={1.75} aria-hidden />
              {label}
            </button>
          );
        })}
        <span className="ml-auto hidden shrink-0 pl-4 md:block">
          <CountBadge>{counts.total} tokens</CountBadge>
        </span>
      </nav>

      <CopyProvider>
        <div ref={scrollRef} data-tokens-scroll className="@container relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <TokenReference theme={theme} themeName={themeName} />
        </div>
      </CopyProvider>
    </div>
  );
}
