"use client";

import { memo } from "react";
import { primaryFamily } from "@/lib/engine/typography";
import { mix, pickReadable, withAlpha } from "@/lib/modePalette";
import { useThemeStore } from "@/store/themeStore";
import type { ThemeTokens } from "@/types/theme";
import { SectionLabel } from "@/components/ui/SectionLabel";

const STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
const SCALES = ["primary", "accent", "neutral"] as const;
const SEMANTICS = ["success", "warning", "error", "info"] as const;
const RADII = ["sm", "md", "lg", "xl", "2xl", "full"] as const;
const SHELL_PANEL = "#0d0d11";

function PaletteRow({ theme, scale }: { theme: ThemeTokens; scale: (typeof SCALES)[number] }) {
  const colors = theme.color[scale];
  return (
    <div className="grid grid-cols-[52px_minmax(0,1fr)_58px] items-center gap-2.5">
      <span className="text-[11.5px] capitalize text-[var(--shell-text-muted)]">{scale}</span>
      <div
        role="img"
        aria-label={`${scale} scale from ${colors[50]} to ${colors[950]}`}
        className="flex h-5 overflow-hidden rounded-[5px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
      >
        {STOPS.map((stop) => (
          <span
            key={stop}
            title={`${scale}-${stop}  ${colors[stop]}`}
            className="h-full flex-1 transition-colors duration-300"
            style={{ backgroundColor: colors[stop] }}
          />
        ))}
      </div>
      <span className="text-right font-mono text-[10.5px] tabular-nums text-[var(--shell-text-subtle)]">
        {colors[500]}
      </span>
    </div>
  );
}

function SemanticChip({ name, color }: { name: string; color: string }) {
  const text = pickReadable([color, mix(color, "#ffffff", 0.3), mix(color, "#ffffff", 0.55)], SHELL_PANEL, 4.5);
  return (
    <span
      title={`${name}  ${color}`}
      className="inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full px-2 text-[11px] font-medium capitalize transition-colors duration-300"
      style={{ backgroundColor: withAlpha(color, 0.13), color: text, boxShadow: `inset 0 0 0 1px ${withAlpha(color, 0.22)}` }}
    >
      <span aria-hidden className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      {name}
    </span>
  );
}

const MiniPreview = memo(function MiniPreview() {
  const theme = useThemeStore((s) => s.currentTheme);
  const { fontFamily } = theme.typography;
  const display = primaryFamily(fontFamily.display);
  const body = primaryFamily(fontFamily.body);
  const mono = primaryFamily(fontFamily.mono);

  return (
    <section aria-labelledby="tf-specimen" className="flex flex-col gap-2">
      <SectionLabel id="tf-specimen">Specimen</SectionLabel>
      <div className="divide-y divide-[var(--shell-border)] rounded-[var(--shell-radius)] border border-[var(--shell-border)] bg-[rgba(255,255,255,0.02)]">
        <div className="flex flex-col gap-2 p-3">
          {SCALES.map((scale) => (
            <PaletteRow key={scale} theme={theme} scale={scale} />
          ))}
          <div className="mt-1 flex flex-wrap justify-between gap-1.5">
            {SEMANTICS.map((name) => (
              <SemanticChip key={name} name={name} color={theme.color.semantic[name]} />
            ))}
          </div>
        </div>

        <div className="p-3">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="w-[52px] shrink-0 text-[34px] font-semibold leading-[40px] tracking-[-0.02em] text-[var(--shell-text)]"
              style={{ fontFamily: fontFamily.display }}
            >
              Aa
            </span>
            <dl className="grid min-w-0 flex-1 grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-0.5 text-[11.5px] leading-[17px]">
              <dt className="text-[var(--shell-text-subtle)]">Display</dt>
              <dd className="truncate font-medium text-[var(--shell-text)]">{display}</dd>
              <dt className="text-[var(--shell-text-subtle)]">Body</dt>
              <dd className="truncate text-[var(--shell-text-muted)]">{body}</dd>
              <dt className="text-[var(--shell-text-subtle)]">Mono</dt>
              <dd className="truncate text-[var(--shell-text-muted)]">{mono}</dd>
            </dl>
          </div>
          <p
            className="mt-3 text-[13.5px] leading-[20px] text-[var(--shell-text-muted)]"
            style={{ fontFamily: fontFamily.body }}
          >
            Sphinx of black quartz, judge my vow.
          </p>
          <p className="mt-1 truncate text-[11px] text-[var(--shell-text-subtle)]" style={{ fontFamily: fontFamily.mono }}>
            {`const base = "${theme.typography.fontSize.base}";`}
          </p>
        </div>

        <div className="flex items-end justify-between gap-2 p-3">
          {RADII.map((key) => (
            <div key={key} className="flex flex-col items-center gap-1.5" title={`radius-${key}  ${theme.radius[key]}`}>
              <span
                aria-hidden
                className="size-8 border border-[var(--shell-border-strong)] bg-[rgba(255,255,255,0.03)] transition-[border-radius] duration-300"
                style={{ borderRadius: theme.radius[key] }}
              />
              <span className="font-mono text-[10px] text-[var(--shell-text-subtle)]">{key}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default MiniPreview;
