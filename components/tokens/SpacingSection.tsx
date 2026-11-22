"use client";

import type { ThemeTokens } from "@/types/theme";

interface Props {
  theme: ThemeTokens;
}

export default function SpacingSection({ theme }: Props) {
  const { spacing, radius } = theme;

  const spacingEntries = Object.entries(spacing) as [string, string][];
  const maxPx = Math.max(...spacingEntries.map(([, v]) => parseInt(v)));

  return (
    <div className="space-y-8">
      {/* Spacing bars */}
      <div>
        <p className="text-xs font-semibold text-[#ddddf0] mb-4">Spacing Scale</p>
        <div className="space-y-2">
          {spacingEntries.map(([key, val]) => {
            const px = parseInt(val);
            const pct = Math.max((px / maxPx) * 100, 2);
            return (
              <div key={key} className="flex items-center gap-3">
                <div className="w-6 flex-shrink-0 text-right">
                  <span className="text-[10px] font-mono text-[#5a5a80]">{key}</span>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div
                    className="h-4 rounded transition-all"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${theme.color.primary[600]}, ${theme.color.primary[400]})`,
                      borderRadius: radius.sm,
                      minWidth: "4px",
                    }}
                  />
                  <span className="text-[10px] font-mono text-[#5a5a80] flex-shrink-0">{val}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Border radius */}
      <div>
        <p className="text-xs font-semibold text-[#ddddf0] mb-4">Border Radius</p>
        <div className="flex flex-wrap gap-4">
          {Object.entries(radius).map(([key, val]) => (
            <div key={key} className="flex flex-col items-center gap-2">
              <div
                className="w-12 h-12 border-2"
                style={{
                  borderRadius: val,
                  borderColor: theme.color.primary[500],
                  background: `${theme.color.primary[500]}15`,
                }}
              />
              <p className="text-[9px] font-mono text-[#9090b8]">{key}</p>
              <p className="text-[9px] text-[#5a5a80]">{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Z-index */}
      <div>
        <p className="text-xs font-semibold text-[#ddddf0] mb-3">Z-Index Scale</p>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#12122a]">
              <th className="text-left py-2 text-[#5a5a80] font-medium">Token</th>
              <th className="text-right py-2 text-[#5a5a80] font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(theme.zIndex).map(([k, v]) => (
              <tr key={k} className="border-b border-[#0d0d20]">
                <td className="py-2 font-mono text-[#9090b8]">--z-{k}</td>
                <td className="py-2 text-right font-mono text-[#5a5a80]">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
