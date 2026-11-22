"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type ComponentType,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "./cn";
import { Tooltip } from "./Tooltip";

export interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
  icon?: ComponentType<{ size?: number; strokeWidth?: number; className?: string; "aria-hidden"?: boolean }>;
  tooltip?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: SegmentedOption<T>[];
  "aria-label": string;
  size?: "sm" | "md";
  fullWidth?: boolean;
  /** "tablist" when the control switches views (pair with idPrefix), "radiogroup" when it picks a value. */
  semantics?: "tablist" | "radiogroup";
  /** Tab ids become `${idPrefix}-tab-${value}` and point at panels `${idPrefix}-panel-${value}`. */
  idPrefix?: string;
  tooltipSide?: "top" | "bottom";
  className?: string;
}

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const SIZES = {
  sm: { root: "h-7 p-[2px] rounded-[8px]", item: "h-[22px] px-2.5 text-[12px] gap-1.5 rounded-[6px]", icon: 13 },
  md: { root: "h-8 p-[3px] rounded-[9px]", item: "h-[24px] px-3 text-[12.5px] gap-1.5 rounded-[6px]", icon: 14 },
} as const;

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  "aria-label": ariaLabel,
  size = "md",
  fullWidth = false,
  semantics = "radiogroup",
  idPrefix,
  tooltipSide = "bottom",
  className,
}: SegmentedControlProps<T>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef(new Map<T, HTMLButtonElement>());
  const s = SIZES[size];
  const isTabs = semantics === "tablist";

  const positionIndicator = useCallback(() => {
    const item = itemRefs.current.get(value);
    const indicator = indicatorRef.current;
    const root = rootRef.current;
    if (!item || !indicator || !root) return;
    const x = item.getBoundingClientRect().left - root.getBoundingClientRect().left - root.clientLeft;
    indicator.style.width = `${item.offsetWidth}px`;
    indicator.style.transform = `translateX(${x}px)`;
    if (root.dataset.ready !== "true") {
      // Enable the slide transition only after the first placement so the pill never animates in from 0.
      requestAnimationFrame(() => {
        root.dataset.ready = "true";
      });
    }
  }, [value]);

  useIsoLayoutEffect(positionIndicator, [positionIndicator]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(positionIndicator);
    ro.observe(root);
    itemRefs.current.forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [positionIndicator, options.length]);

  const enabled = options.filter((o) => !o.disabled);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(e.key) || enabled.length === 0) return;
    e.preventDefault();
    const idx = enabled.findIndex((o) => o.value === value);
    let next = idx;
    if (e.key === "ArrowRight") next = (idx + 1) % enabled.length;
    if (e.key === "ArrowLeft") next = (idx - 1 + enabled.length) % enabled.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = enabled.length - 1;
    const target = enabled[next];
    onChange(target.value);
    itemRefs.current.get(target.value)?.focus();
  };

  return (
    <div
      ref={rootRef}
      role={semantics}
      aria-label={ariaLabel}
      aria-orientation={isTabs ? "horizontal" : undefined}
      onKeyDown={onKeyDown}
      className={cn(
        "group/seg relative isolate auto-cols-fr grid-flow-col items-center",
        "border border-[var(--shell-border)] bg-[rgba(255,255,255,0.025)]",
        fullWidth ? "grid w-full" : "inline-grid",
        s.root,
        className,
      )}
    >
      <span
        ref={indicatorRef}
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-0 -z-10 opacity-0 group-data-[ready=true]/seg:opacity-100",
          size === "sm" ? "top-[2px] bottom-[2px]" : "top-[3px] bottom-[3px]",
          "rounded-[6px] border border-[var(--shell-border-strong)] bg-[var(--shell-hover)]",
          "shadow-[0_1px_2px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.05)]",
          "group-data-[ready=true]/seg:transition-[transform,width] group-data-[ready=true]/seg:duration-200",
          "group-data-[ready=true]/seg:ease-[cubic-bezier(0.32,0.72,0,1)]",
        )}
      />
      {options.map((opt) => {
        const selected = opt.value === value;
        const Icon = opt.icon;
        const button = (
          <button
            key={opt.value}
            ref={(el) => {
              if (el) itemRefs.current.set(opt.value, el);
              else itemRefs.current.delete(opt.value);
            }}
            type="button"
            role={isTabs ? "tab" : "radio"}
            id={isTabs && idPrefix ? `${idPrefix}-tab-${opt.value}` : undefined}
            aria-controls={isTabs && idPrefix ? `${idPrefix}-panel-${opt.value}` : undefined}
            aria-selected={isTabs ? selected : undefined}
            aria-checked={isTabs ? undefined : selected}
            aria-keyshortcuts={opt.shortcut}
            tabIndex={selected ? 0 : -1}
            disabled={opt.disabled}
            data-state={selected ? "on" : "off"}
            onClick={() => !selected && onChange(opt.value)}
            className={cn(
              "relative inline-flex min-w-0 select-none items-center justify-center whitespace-nowrap font-medium",
              "outline-none transition-colors duration-150",
              "focus-visible:ring-2 focus-visible:ring-[var(--shell-accent)] focus-visible:ring-offset-0",
              "disabled:pointer-events-none disabled:opacity-40",
              s.item,
              selected
                ? "text-[var(--shell-text)] bg-[var(--shell-hover)] group-data-[ready=true]/seg:bg-transparent"
                : "text-[var(--shell-text-subtle)] hover:text-[var(--shell-text)]",
            )}
          >
            {Icon && (
              <Icon
                size={s.icon}
                strokeWidth={1.75}
                aria-hidden
                className={cn("shrink-0 transition-colors duration-150", selected ? "text-[var(--shell-text)]" : "")}
              />
            )}
            <span className="truncate">{opt.label}</span>
          </button>
        );

        if (!opt.tooltip && !opt.shortcut) return button;
        return (
          <Tooltip
            key={opt.value}
            content={opt.tooltip ?? opt.label}
            shortcut={opt.shortcut}
            side={tooltipSide}
            className="min-w-0 [&>button]:flex-1"
          >
            {button}
          </Tooltip>
        );
      })}
    </div>
  );
}
