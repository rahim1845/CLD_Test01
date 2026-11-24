"use client";

import { Sparkles, Zap } from "lucide-react";
import { SegmentedControl, type SegmentedOption } from "@/components/ui/SegmentedControl";
import type { Engine } from "@/store/themeStore";

const OPTIONS: SegmentedOption<Engine>[] = [
  { value: "local", label: "Instant", icon: Zap },
  { value: "ai", label: "Claude AI", icon: Sparkles },
];

const CAPTIONS: Record<Engine, string> = {
  local: "Computed on your device in about a millisecond. Free, private and works offline.",
  ai: "Claude composes the theme through the Anthropic API. Takes a few seconds; needs a key.",
};

export default function EngineSwitch({ value, onChange }: { value: Engine; onChange: (engine: Engine) => void }) {
  return (
    <div className="flex flex-col gap-2.5">
      <SegmentedControl aria-label="Generation engine" options={OPTIONS} value={value} onChange={onChange} fullWidth />
      <p aria-live="polite" className="min-h-9 text-[12px] leading-[18px] text-[var(--shell-text-muted)]">
        {CAPTIONS[value]}
      </p>
    </div>
  );
}
