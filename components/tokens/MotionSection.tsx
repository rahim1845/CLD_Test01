"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { Pause, Play } from "lucide-react";
import type { ThemeTokens } from "@/types/theme";
import { cn } from "@/components/ui/cn";
import { DURATION_KEYS, EASING_KEYS, cssVar, parseEasing, toMs } from "@/components/exports/tokenModel";
import { useReducedMotion } from "@/components/ui/useReducedMotion";
import { CopyGlyph, HAIRLINE_GRID, MONO, SubHeading, cellButton, useCopy } from "./shared";

function useInView<T extends Element>(ref: RefObject<T | null>): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}

/** A dot that crosses its track whenever `phase` flips, taking exactly `duration` with `easing`. */
function Runner({ phase, duration, easing }: { phase: boolean; duration: string; easing: string }) {
  return (
    <span aria-hidden className="relative block h-5">
      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[var(--shell-border-strong)]" />
      <span className="absolute inset-y-0 left-0 right-2.5">
        <span
          className="absolute inset-y-0 left-0 flex w-full items-center"
          style={{ transform: `translateX(${phase ? "100%" : "0%"})`, transition: `transform ${duration} ${easing}` }}
        >
          <span className="size-2.5 rounded-full bg-[var(--shell-text)] shadow-[0_0_0_3px_rgba(237,237,240,0.1)]" />
        </span>
      </span>
    </span>
  );
}

function DurationRow({ k, value, easing, phase }: { k: string; value: string; easing: string; phase: boolean }) {
  const { copy, copiedKey } = useCopy();
  const name = cssVar(["duration", k]);
  return (
    <button
      type="button"
      onClick={() => copy(value, name)}
      aria-label={`Copy ${name}: ${value}`}
      className={cellButton("grid h-12 grid-cols-[minmax(120px,160px)_64px_minmax(0,1fr)_auto] items-center gap-5 px-5 @xl:gap-6")}
    >
      <code className={cn(MONO, "truncate text-[12px] text-[var(--shell-text)]")}>{name}</code>
      <span className={cn(MONO, "text-[11.5px] tabular-nums text-[var(--shell-text-muted)]")}>{value}</span>
      <Runner phase={phase} duration={value} easing={easing} />
      <CopyGlyph copied={copiedKey === name} />
    </button>
  );
}

const W = 200;
const H = 112;
const PAD = 10;

function EasingCurve({ value }: { value: string }) {
  const bezier = parseEasing(value);
  if (!bezier) {
    return (
      <span className={cn(MONO, "flex h-[112px] items-center justify-center text-[11px] text-[var(--shell-text-subtle)]")}>
        Custom timing function
      </span>
    );
  }
  const [x1, y1, x2, y2] = bezier;
  const minY = Math.min(0, y1, y2);
  const maxY = Math.max(1, y1, y2);
  const px = (x: number) => PAD + x * (W - PAD * 2);
  const py = (y: number) => PAD + ((maxY - y) / (maxY - minY)) * (H - PAD * 2);
  const p = (x: number, y: number) => `${px(x).toFixed(2)},${py(y).toFixed(2)}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-[112px] w-full" aria-hidden>
      <rect
        x={px(0)}
        y={py(1)}
        width={px(1) - px(0)}
        height={py(0) - py(1)}
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeDasharray="2 3"
        vectorEffect="non-scaling-stroke"
      />
      <line x1={px(0)} y1={py(0)} x2={px(1)} y2={py(1)} stroke="rgba(255,255,255,0.06)" vectorEffect="non-scaling-stroke" />
      <line x1={px(0)} y1={py(0)} x2={px(x1)} y2={py(y1)} stroke="rgba(139,124,255,0.55)" vectorEffect="non-scaling-stroke" />
      <line x1={px(1)} y1={py(1)} x2={px(x2)} y2={py(y2)} stroke="rgba(139,124,255,0.55)" vectorEffect="non-scaling-stroke" />
      <path
        d={`M${p(0, 0)} C${p(x1, y1)} ${p(x2, y2)} ${p(1, 1)}`}
        fill="none"
        stroke="#ededf0"
        strokeWidth={1.75}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={px(x1)} cy={py(y1)} r={3} fill="#0d0d11" stroke="#8b7cff" strokeWidth={1.5} />
      <circle cx={px(x2)} cy={py(y2)} r={3} fill="#0d0d11" stroke="#8b7cff" strokeWidth={1.5} />
      <circle cx={px(0)} cy={py(0)} r={2} fill="#6c6c78" />
      <circle cx={px(1)} cy={py(1)} r={2} fill="#6c6c78" />
    </svg>
  );
}

function EasingCard({ k, value, duration, phase }: { k: string; value: string; duration: string; phase: boolean }) {
  const { copy, copiedKey } = useCopy();
  const name = cssVar(["easing", k]);
  return (
    <button
      type="button"
      onClick={() => copy(value, name)}
      aria-label={`Copy ${name}: ${value}`}
      className={cellButton("flex min-w-0 flex-col gap-3 px-4 pb-4 pt-3.5")}
    >
      <span className="flex items-start justify-between gap-3">
        <span className="flex min-w-0 flex-col gap-0.5">
          <code className={cn(MONO, "truncate text-[12px] text-[var(--shell-text)]")}>{name}</code>
          <span className={cn(MONO, "truncate text-[11px] text-[var(--shell-text-subtle)]")}>{value}</span>
        </span>
        <CopyGlyph copied={copiedKey === name} />
      </span>
      <EasingCurve value={value} />
      <Runner phase={phase} duration={duration} easing={value} />
    </button>
  );
}

export function MotionSection({ theme }: { theme: ThemeTokens }) {
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState<boolean | null>(null);
  const [phase, setPhase] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const { duration, easing } = theme.animation;
  const active = (playing ?? !reduced) && inView;

  const longest = Math.max(...DURATION_KEYS.map((k) => toMs(duration[k]) ?? 0), 300);
  const cycle = Math.min(Math.max(longest + 900, 1400), 4000);

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setPhase((p) => !p), cycle);
    const kick = window.setTimeout(() => setPhase((p) => !p), 250);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(kick);
    };
  }, [active, cycle]);

  return (
    <div ref={ref} className="space-y-10">
      <div>
        <SubHeading
          aside={
            <>
              {reduced && playing === null && <span className="hidden @2xl:inline">Paused for reduced motion</span>}
              <button
                type="button"
                onClick={() => setPlaying(!(playing ?? !reduced))}
                aria-pressed={!!(playing ?? !reduced)}
                className={cn(
                  "inline-flex h-7 items-center gap-1.5 rounded-[var(--shell-radius-sm)] border border-[var(--shell-border)] px-2.5",
                  "text-[12px] font-medium text-[var(--shell-text-muted)] outline-none transition-colors duration-150",
                  "hover:border-[var(--shell-border-strong)] hover:text-[var(--shell-text)] focus-visible:ring-2 focus-visible:ring-[var(--shell-accent)]",
                )}
              >
                {(playing ?? !reduced) ? <Pause size={13} strokeWidth={1.75} aria-hidden /> : <Play size={13} strokeWidth={1.75} aria-hidden />}
                {(playing ?? !reduced) ? "Pause" : "Play"}
              </button>
            </>
          }
        >
          Durations · ease-in-out
        </SubHeading>
        <div className={HAIRLINE_GRID}>
          {DURATION_KEYS.map((k) => (
            <DurationRow key={k} k={k} value={duration[k]} easing={easing.easeInOut} phase={phase} />
          ))}
        </div>
      </div>

      <div>
        <SubHeading aside={<span className={cn(MONO, "hidden @2xl:inline")}>played at --duration-slower ({duration.slower})</span>}>Easing curves</SubHeading>
        <div className={cn(HAIRLINE_GRID, "grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-3")}>
          {EASING_KEYS.map((k) => (
            <EasingCard key={k} k={k} value={easing[k]} duration={duration.slower} phase={phase} />
          ))}
        </div>
      </div>
    </div>
  );
}
