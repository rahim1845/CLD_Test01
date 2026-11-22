"use client";

import type { ThemeTokens } from "@/types/theme";

interface Props {
  theme: ThemeTokens;
}

export default function TypographySection({ theme }: Props) {
  const { typography } = theme;

  const fontSizeOrder = ["xs", "sm", "base", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"] as const;
  const weightOrder = ["light", "regular", "medium", "semibold", "bold", "extrabold"] as const;

  return (
    <div className="space-y-8">
      {/* Font families */}
      <div>
        <p className="text-xs font-semibold text-[#ddddf0] mb-3">Font Families</p>
        <div className="space-y-3">
          {(["display", "body", "mono"] as const).map((k) => (
            <div key={k} className="p-4 rounded-xl bg-[#0a0a14] border border-[#12122a]">
              <p className="text-[10px] text-[#5a5a80] mb-1 capitalize">--font-family-{k}</p>
              <p
                className="text-xl font-bold"
                style={{ fontFamily: typography.fontFamily[k], color: "#ddddf0" }}
              >
                The quick brown fox
              </p>
              <p className="text-[10px] text-[#5a5a80] mt-1 font-mono truncate">{typography.fontFamily[k]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Type scale */}
      <div>
        <p className="text-xs font-semibold text-[#ddddf0] mb-3">Type Scale</p>
        <div className="space-y-2">
          {fontSizeOrder.map((key) => (
            <div key={key} className="flex items-baseline gap-4">
              <div className="w-12 flex-shrink-0">
                <span className="text-[10px] font-mono text-[#5a5a80]">{key}</span>
              </div>
              <div className="w-14 flex-shrink-0 text-right">
                <span className="text-[10px] font-mono text-[#5a5a80]">{typography.fontSize[key]}</span>
              </div>
              <p
                className="text-[#ddddf0] leading-none"
                style={{ fontSize: typography.fontSize[key], fontFamily: typography.fontFamily.display }}
              >
                Heading
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Font weights */}
      <div>
        <p className="text-xs font-semibold text-[#ddddf0] mb-3">Font Weights</p>
        <div className="flex flex-wrap gap-3">
          {weightOrder.map((key) => (
            <div key={key} className="p-3 rounded-xl bg-[#0a0a14] border border-[#12122a] text-center min-w-[80px]">
              <p
                className="text-2xl text-[#ddddf0] leading-none mb-1"
                style={{ fontWeight: typography.fontWeight[key], fontFamily: typography.fontFamily.display }}
              >
                Aa
              </p>
              <p className="text-[9px] text-[#5a5a80]">{key}</p>
              <p className="text-[9px] font-mono text-[#3a3a58]">{typography.fontWeight[key]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Line height + letter spacing */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-semibold text-[#ddddf0] mb-3">Line Heights</p>
          <table className="w-full text-xs">
            <tbody>
              {Object.entries(typography.lineHeight).map(([k, v]) => (
                <tr key={k} className="border-b border-[#12122a]">
                  <td className="py-2 font-mono text-[#9090b8]">{k}</td>
                  <td className="py-2 text-right font-mono text-[#5a5a80]">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <p className="text-xs font-semibold text-[#ddddf0] mb-3">Letter Spacing</p>
          <table className="w-full text-xs">
            <tbody>
              {Object.entries(typography.letterSpacing).map(([k, v]) => (
                <tr key={k} className="border-b border-[#12122a]">
                  <td className="py-2 font-mono text-[#9090b8]">{k}</td>
                  <td className="py-2 text-right font-mono text-[#5a5a80]">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
