"use client";

import { useThemeStore } from "@/store/themeStore";

export default function MiniPreview() {
  const { currentTheme } = useThemeStore();
  const { color, radius } = currentTheme;

  const primaryScale = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
  const accentScale = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

  const radiusStops: Array<{ key: keyof typeof radius; label: string }> = [
    { key: "sm", label: "sm" },
    { key: "md", label: "md" },
    { key: "lg", label: "lg" },
    { key: "xl", label: "xl" },
    { key: "2xl", label: "2xl" },
    { key: "full", label: "full" },
  ];

  return (
    <div className="space-y-4 p-4 rounded-xl bg-[#0a0a14] border border-[#12122a]">
      <div className="space-y-1.5">
        <p className="text-xs text-[#5a5a80]">Primary</p>
        <div className="flex h-6 rounded-lg overflow-hidden">
          {primaryScale.map((stop) => (
            <div
              key={stop}
              className="flex-1"
              style={{ backgroundColor: color.primary[stop] }}
              title={`primary-${stop}: ${color.primary[stop]}`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-[#5a5a80]">Accent</p>
        <div className="flex h-6 rounded-lg overflow-hidden">
          {accentScale.map((stop) => (
            <div
              key={stop}
              className="flex-1"
              style={{ backgroundColor: color.accent[stop] }}
              title={`accent-${stop}: ${color.accent[stop]}`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-[#5a5a80]">Typography</p>
        <div className="space-y-1">
          <p
            className="font-bold leading-tight"
            style={{
              fontFamily: currentTheme.typography.fontFamily.display,
              fontSize: "18px",
              color: color.primary[400],
            }}
          >
            Heading Aa
          </p>
          <p
            className="leading-normal"
            style={{
              fontFamily: currentTheme.typography.fontFamily.body,
              fontSize: "12px",
              color: color.text.secondary,
            }}
          >
            The quick brown fox jumps over the lazy dog.
          </p>
          <p
            className="leading-normal"
            style={{
              fontFamily: currentTheme.typography.fontFamily.mono,
              fontSize: "11px",
              color: color.accent[400],
            }}
          >
            const theme = generate();
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-[#5a5a80]">Semantic</p>
        <div className="flex gap-2">
          {(["success", "warning", "error", "info"] as const).map((k) => (
            <div
              key={k}
              className="flex-1 py-1 rounded text-xs text-center capitalize font-medium"
              style={{
                backgroundColor: color.semantic[`${k}Bg`],
                color: color.semantic[k],
                border: `1px solid ${color.semantic[k]}33`,
              }}
            >
              {k}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-[#5a5a80]">Radius</p>
        <div className="flex items-end gap-2">
          {radiusStops.map((r) => (
            <div key={r.key} className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 bg-indigo-600"
                style={{ borderRadius: radius[r.key] }}
              />
              <span className="text-[9px] text-[#5a5a80]">{r.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
