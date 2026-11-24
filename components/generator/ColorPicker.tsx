"use client";

import { useMemo, useState } from "react";
import { nearestColorName, normalizeHex } from "@/lib/engine/color";
import { cn } from "@/components/ui/cn";
import { SectionLabel } from "@/components/ui/SectionLabel";

const SWATCHES = [
  { name: "Iris", hex: "#5b5bd6" },
  { name: "Violet", hex: "#6e56cf" },
  { name: "Plum", hex: "#ab4aba" },
  { name: "Crimson", hex: "#e93d82" },
  { name: "Tomato", hex: "#e54d2e" },
  { name: "Orange", hex: "#f76b15" },
  { name: "Amber", hex: "#ffc53d" },
  { name: "Grass", hex: "#46a758" },
  { name: "Jade", hex: "#29a383" },
  { name: "Teal", hex: "#12a594" },
  { name: "Cyan", hex: "#00a2c7" },
  { name: "Blue", hex: "#0090ff" },
];

const FULL_HEX = /^#?[0-9a-f]{6}$/i;

function titleCase(name: string): string {
  return name.replace(/\b\w/g, (c) => c.toUpperCase());
}

interface ColorPickerProps {
  value: string;
  /** `immediate` is true for discrete picks (swatches, committed hex); dragging the native picker streams values. */
  onChange: (hex: string, immediate?: boolean) => void;
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  const seed = normalizeHex(value) ?? "#5b5bd6";
  const [draft, setDraft] = useState(seed.slice(1));
  const [lastSeed, setLastSeed] = useState(seed);

  if (seed !== lastSeed) {
    setLastSeed(seed);
    if (normalizeHex(draft) !== seed) setDraft(seed.slice(1));
  }

  const incomplete = draft.length !== 3 && draft.length !== 6;
  const colorName = useMemo(() => titleCase(nearestColorName(seed)), [seed]);

  const editDraft = (raw: string) => {
    const next = raw.replace(/^#/, "").replace(/[^0-9a-f]/gi, "").slice(0, 6);
    setDraft(next);
    if (FULL_HEX.test(next)) onChange(normalizeHex(next) as string);
  };

  const commitDraft = () => {
    const hex = normalizeHex(draft);
    if (hex) {
      setDraft(hex.slice(1));
      onChange(hex, true);
    } else {
      setDraft(seed.slice(1));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <SectionLabel
        htmlFor="tf-seed-hex"
        aside={
          <span
            aria-live="polite"
            className={cn(
              "truncate text-[11.5px]",
              incomplete ? "text-[var(--shell-danger)]" : "text-[var(--shell-text-muted)]",
            )}
          >
            {incomplete ? "Needs 3 or 6 hex digits" : colorName}
          </span>
        }
      >
        Brand color
      </SectionLabel>

      <div className="flex items-center gap-2">
        <label
          className={cn(
            "relative size-9 shrink-0 cursor-pointer overflow-hidden rounded-[var(--shell-radius)]",
            "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)] transition-shadow duration-150",
            "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--shell-accent)] has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-[var(--shell-panel)]",
          )}
          style={{ backgroundColor: seed }}
        >
          <span className="sr-only">Open color picker</span>
          <input
            type="color"
            value={seed}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 size-full cursor-pointer opacity-0"
          />
        </label>

        <div
          className={cn(
            "flex h-9 min-w-0 flex-1 items-center rounded-[var(--shell-radius)] border bg-[rgba(255,255,255,0.02)] pl-3 pr-2",
            "transition-[border-color,box-shadow] duration-150",
            "border-[var(--shell-border)] hover:border-[var(--shell-border-strong)]",
            "focus-within:border-[rgba(139,124,255,0.55)] focus-within:shadow-[0_0_0_3px_var(--shell-accent-soft)] focus-within:hover:border-[rgba(139,124,255,0.55)]",
          )}
        >
          <span aria-hidden className="select-none font-mono text-[12.5px] text-[var(--shell-text-subtle)]">
            #
          </span>
          <input
            id="tf-seed-hex"
            value={draft}
            inputMode="text"
            autoComplete="off"
            spellCheck={false}
            aria-invalid={incomplete || undefined}
            onChange={(e) => editDraft(e.target.value)}
            onPaste={(e) => {
              const text = e.clipboardData.getData("text");
              const hex = normalizeHex(text.trim());
              if (!hex) return;
              e.preventDefault();
              setDraft(hex.slice(1));
              onChange(hex, true);
            }}
            onBlur={commitDraft}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                commitDraft();
              }
            }}
            className="h-full min-w-0 flex-1 bg-transparent pl-0.5 font-mono text-[12.5px] lowercase tracking-[0.02em] text-[var(--shell-text)] outline-none focus-visible:outline-none"
          />
        </div>
      </div>

      <div role="group" aria-label="Suggested brand colors" className="grid grid-cols-12 gap-1.5 pt-1">
        {SWATCHES.map((swatch) => {
          const selected = swatch.hex === seed;
          return (
            <button
              key={swatch.hex}
              type="button"
              aria-label={`${swatch.name} ${swatch.hex}`}
              aria-pressed={selected}
              title={`${swatch.name} ${swatch.hex}`}
              onClick={() => onChange(swatch.hex, true)}
              className={cn(
                "aspect-square w-full rounded-[5px] outline-none transition-[transform,box-shadow] duration-150",
                "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] hover:scale-110",
                "focus-visible:ring-2 focus-visible:ring-[var(--shell-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--shell-panel)]",
                selected &&
                  "ring-[1.5px] ring-[var(--shell-text)] ring-offset-2 ring-offset-[var(--shell-panel)] hover:scale-100",
              )}
              style={{ backgroundColor: swatch.hex }}
            />
          );
        })}
      </div>
    </div>
  );
}
