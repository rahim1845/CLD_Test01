"use client";

import type { ThemeTokens } from "@/types/theme";

interface Props {
  theme: ThemeTokens;
}

export default function EffectsSection({ theme }: Props) {
  const { shadow, animation, blur, color, radius } = theme;

  return (
    <div className="space-y-8">
      {/* Shadows */}
      <div>
        <p className="text-xs font-semibold text-[#ddddf0] mb-4">Shadows</p>
        <div className="flex flex-wrap gap-4">
          {Object.entries(shadow).map(([key, val]) => (
            <div key={key} className="flex flex-col items-center gap-2">
              <div
                className="w-16 h-16 rounded-xl bg-[#0a0a14] flex items-center justify-center"
                style={{ boxShadow: val, borderRadius: radius.xl, border: `1px solid #12122a` }}
              >
                <span className="text-[9px] text-[#5a5a80]">{key}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Animation */}
      <div>
        <p className="text-xs font-semibold text-[#ddddf0] mb-3">Animation Duration</p>
        <div className="flex flex-wrap gap-3">
          {Object.entries(animation.duration).map(([key, val]) => (
            <div key={key} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-[#0a0a14] border border-[#12122a]">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs"
                style={{
                  background: color.primary[600],
                  animation: `spin ${val} linear infinite`,
                  borderRadius: radius.full,
                }}
              >
                ↻
              </div>
              <p className="text-[9px] font-mono text-[#9090b8]">{key}</p>
              <p className="text-[9px] text-[#5a5a80]">{val}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-[#ddddf0] mb-3">Easing Functions</p>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#12122a]">
              <th className="text-left py-2 text-[#5a5a80] font-medium">Name</th>
              <th className="text-right py-2 text-[#5a5a80] font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(animation.easing).map(([k, v]) => (
              <tr key={k} className="border-b border-[#0d0d20]">
                <td className="py-2 font-mono text-[#9090b8]">{k}</td>
                <td className="py-2 text-right font-mono text-[#5a5a80] text-[10px]">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Blur */}
      <div>
        <p className="text-xs font-semibold text-[#ddddf0] mb-4">Blur</p>
        <div className="flex flex-wrap gap-4">
          {Object.entries(blur).map(([key, val]) => (
            <div key={key} className="flex flex-col items-center gap-2">
              <div
                className="w-14 h-14 rounded-xl overflow-hidden relative"
                style={{ borderRadius: radius.xl }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${color.primary[500]}, ${color.accent[500]})`,
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{ backdropFilter: val !== "0px" ? `blur(${val})` : "none" }}
                />
                <div
                  className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold"
                >
                  Aa
                </div>
              </div>
              <p className="text-[9px] font-mono text-[#9090b8]">{key}</p>
              <p className="text-[9px] text-[#5a5a80]">{val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
