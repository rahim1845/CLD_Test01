"use client";

import { Blend, Pipette, Type } from "lucide-react";
import { SegmentedControl, type SegmentedOption } from "@/components/ui/SegmentedControl";
import type { GenerateMode } from "@/types/theme";
import { SectionLabel } from "@/components/ui/SectionLabel";

const MODES: SegmentedOption<GenerateMode>[] = [
  { value: "prompt", label: "Prompt", icon: Type },
  { value: "color", label: "Color", icon: Pipette },
  { value: "both", label: "Both", icon: Blend },
];

export default function ModeSelector({
  value,
  onChange,
}: {
  value: GenerateMode;
  onChange: (mode: GenerateMode) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <SectionLabel id="tf-source-label">Start from</SectionLabel>
      <SegmentedControl aria-label="Start from" options={MODES} value={value} onChange={onChange} fullWidth />
    </div>
  );
}
