"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { EXAMPLE_PROMPTS } from "@/lib/engine";
import { cn } from "@/components/ui/cn";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const BRIEF_MAX_LENGTH = 400;
const MIN_HEIGHT = 84;
const MAX_HEIGHT = 196;

const EXAMPLES = EXAMPLE_PROMPTS.map((prompt) => ({
  prompt,
  label: prompt.split(/[,:]| with /)[0].trim(),
}));

interface BriefInputProps {
  value: string;
  onChange: (value: string) => void;
  onExample: (prompt: string) => void;
}

function ExampleRail({ current, onPick }: { current: string; onPick: (prompt: string) => void }) {
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = (el: HTMLDivElement) => {
    const start = el.scrollLeft <= 1;
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
    setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
  };

  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    // Vertical wheels scroll the rail sideways until it reaches an end, then hand back to the sidebar.
    const onWheel = (e: globalThis.WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX) || el.scrollWidth <= el.clientWidth) return;
      const atStart = el.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 && e.deltaY > 0;
      if (atStart || atEnd) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const fade = !edges.start && !edges.end ? "both" : !edges.end ? "end" : !edges.start ? "start" : "none";

  return (
    <div
      role="group"
      aria-label="Example briefs"
      ref={railRef}
      onScroll={(e) => measure(e.currentTarget)}
      className={cn(
        "-mx-1 flex gap-1.5 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        fade === "end" && "[mask-image:linear-gradient(to_right,#000_80%,transparent)]",
        fade === "start" && "[mask-image:linear-gradient(to_left,#000_80%,transparent)]",
        fade === "both" &&
          "[mask-image:linear-gradient(to_right,transparent,#000_14%,#000_86%,transparent)]",
      )}
    >
      {EXAMPLES.map(({ prompt, label }) => {
        const active = current.trim() === prompt;
        return (
          <button
            key={prompt}
            type="button"
            title={prompt}
            aria-pressed={active}
            onClick={() => onPick(prompt)}
            onFocus={(e) => e.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" })}
            className={cn(
              "inline-flex h-6 shrink-0 items-center rounded-full border px-2.5 text-[11.5px] font-medium",
              "outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[var(--shell-accent)]",
              active
                ? "border-[var(--shell-border-strong)] bg-[var(--shell-raised)] text-[var(--shell-text)]"
                : "border-[var(--shell-border)] text-[var(--shell-text-muted)] hover:border-[var(--shell-border-strong)] hover:bg-[var(--shell-hover)] hover:text-[var(--shell-text)]",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default function BriefInput({ value, onChange, onExample }: BriefInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    const next = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, el.scrollHeight));
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > MAX_HEIGHT ? "auto" : "hidden";
  }, [value]);

  const nearLimit = value.length > BRIEF_MAX_LENGTH * 0.9;

  return (
    <div className="flex flex-col gap-2">
      <SectionLabel
        htmlFor="tf-brief"
        aside={
          <span
            aria-hidden
            className={cn(
              "font-mono text-[10.5px] tabular-nums",
              nearLimit ? "text-[var(--shell-text-muted)]" : "text-[var(--shell-text-subtle)]",
            )}
          >
            {value.length}/{BRIEF_MAX_LENGTH}
          </span>
        }
      >
        Brief
      </SectionLabel>
      <div
        className={cn(
          "rounded-[var(--shell-radius)] border border-[var(--shell-border)] bg-[rgba(255,255,255,0.02)]",
          "transition-[border-color,box-shadow] duration-150 hover:border-[var(--shell-border-strong)]",
          "focus-within:border-[rgba(139,124,255,0.55)] focus-within:shadow-[0_0_0_3px_var(--shell-accent-soft)]",
          "focus-within:hover:border-[rgba(139,124,255,0.55)]",
        )}
      >
        <textarea
          ref={ref}
          id="tf-brief"
          value={value}
          maxLength={BRIEF_MAX_LENGTH}
          spellCheck
          placeholder="Describe the product, who it's for and how it should feel…"
          onChange={(e) => onChange(e.target.value)}
          style={{ height: MIN_HEIGHT }}
          className={cn(
            "block w-full resize-none bg-transparent px-3 py-2.5 text-[13px] leading-[20px] text-[var(--shell-text)]",
            "outline-none placeholder:text-[var(--shell-text-subtle)] focus-visible:outline-none",
          )}
        />
      </div>
      <ExampleRail current={value} onPick={onExample} />
    </div>
  );
}
