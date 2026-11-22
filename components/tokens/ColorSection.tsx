"use client";

import { useState } from "react";
import type { ThemeTokens } from "@/types/theme";

interface Props {
  theme: ThemeTokens;
}

function CopyHex({ hex, name }: { hex: string; name: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={copy}
      title={`${name}: ${hex}`}
      className="group relative flex flex-col items-center gap-1"
    >
      <div className="w-8 h-8 rounded-lg ring-1 ring-white/10 transition-transform group-hover:scale-110" style={{ background: hex }} />
      <span className="text-[8px] font-mono text-[#5a5a80] group-hover:text-[#9090b8]">
        {copied ? "✓" : hex.slice(1)}
      </span>
    </button>
  );
}

function ColorChip({ label, hex }: { label: string; hex: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0a0a14] border border-[#12122a] hover:border-[#1e1e3a] transition-colors text-left"
    >
      <div className="w-5 h-5 rounded flex-shrink-0 ring-1 ring-white/10" style={{ background: hex }} />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#ddddf0] capitalize">{label}</p>
        <p className="text-[10px] font-mono text-[#5a5a80]">{typeof hex === 'string' ? hex : ''}</p>
      </div>
      <span className="text-[9px] text-[#5a5a80]">{copied ? "✓" : "copy"}</span>
    </button>
  );
}

export default function ColorSection({ theme }: Props) {
  const { color } = theme;
  const stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

  return (
    <div className="space-y-8">
      {/* Primary, Neutral, Accent scales */}
      {(["primary", "neutral", "accent"] as const).map((scale) => (
        <div key={scale}>
          <p className="text-xs font-semibold text-[#ddddf0] mb-3 capitalize">{scale}</p>
          <div className="flex flex-wrap gap-2">
            {stops.map((stop) => (
              <CopyHex key={stop} hex={color[scale][stop]} name={`${scale}-${stop}`} />
            ))}
          </div>
          <div className="mt-2 h-8 flex rounded-lg overflow-hidden">
            {stops.map((stop) => (
              <div key={stop} className="flex-1" style={{ background: color[scale][stop] }} />
            ))}
          </div>
        </div>
      ))}

      {/* Semantic */}
      <div>
        <p className="text-xs font-semibold text-[#ddddf0] mb-3">Semantic</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(color.semantic).map(([k, v]) => (
            <ColorChip key={k} label={k} hex={v as string} />
          ))}
        </div>
      </div>

      {/* Surface */}
      <div>
        <p className="text-xs font-semibold text-[#ddddf0] mb-3">Surface</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(color.surface).map(([k, v]) => (
            <ColorChip key={k} label={k} hex={v as string} />
          ))}
        </div>
      </div>

      {/* Text */}
      <div>
        <p className="text-xs font-semibold text-[#ddddf0] mb-3">Text</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(color.text).map(([k, v]) => (
            <ColorChip key={k} label={k} hex={v as string} />
          ))}
        </div>
      </div>
    </div>
  );
}
