"use client";

import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "./cn";
import { Kbd } from "./Kbd";

type Side = "top" | "bottom";
type Align = "start" | "center" | "end";

export interface TooltipProps {
  content: ReactNode;
  shortcut?: string;
  side?: Side;
  align?: Align;
  delay?: number;
  disabled?: boolean;
  className?: string;
  children: ReactElement<{ "aria-describedby"?: string }>;
}

// Moving between adjacent triggers right after one closes should feel instant, like native menus.
const WARM_WINDOW_MS = 400;
let lastClosedAt = 0;

const SIDE_CLASSES: Record<Side, string> = {
  bottom: "top-full mt-2 data-[open=false]:-translate-y-0.5",
  top: "bottom-full mb-2 data-[open=false]:translate-y-0.5",
};

const ALIGN_CLASSES: Record<Align, string> = {
  start: "left-0",
  center: "left-1/2 -translate-x-1/2",
  end: "right-0",
};

export function Tooltip({
  content,
  shortcut,
  side = "bottom",
  align = "center",
  delay = 450,
  disabled = false,
  className,
  children,
}: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const timer = useRef<number | null>(null);

  const clearTimer = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const show = (immediate: boolean) => {
    if (disabled) return;
    clearTimer();
    if (immediate || Date.now() - lastClosedAt < WARM_WINDOW_MS) {
      setOpen(true);
    } else {
      timer.current = window.setTimeout(() => setOpen(true), delay);
    }
  };

  const hide = useCallback(() => {
    clearTimer();
    setOpen((wasOpen) => {
      if (wasOpen) lastClosedAt = Date.now();
      return false;
    });
  }, []);

  useEffect(() => clearTimer, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") hide();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, hide]);

  const trigger = isValidElement(children)
    ? cloneElement(children, { "aria-describedby": disabled ? undefined : id })
    : children;

  return (
    <span
      className={cn("relative inline-flex", className)}
      onPointerEnter={(e) => e.pointerType === "mouse" && show(false)}
      onPointerLeave={hide}
      onPointerDown={hide}
      onFocus={(e) => {
        if ((e.target as HTMLElement).matches?.(":focus-visible")) show(true);
      }}
      onBlur={hide}
    >
      {trigger}
      {!disabled && (
        <span
          role="tooltip"
          id={id}
          aria-hidden
          data-open={open}
          className={cn(
            "pointer-events-none absolute z-50 flex w-max max-w-[min(280px,calc(100vw-32px))] items-center gap-2",
            "rounded-[var(--shell-radius-sm)] border border-[var(--shell-border-strong)] bg-[#1c1c23]",
            "px-2 py-1 text-[12px] font-medium leading-[18px] text-[var(--shell-text)]",
            "shadow-[0_8px_24px_-6px_rgba(0,0,0,0.6),0_2px_6px_rgba(0,0,0,0.35)]",
            "transition-[opacity,translate,visibility] duration-150 ease-out",
            "data-[open=false]:invisible data-[open=false]:opacity-0",
            SIDE_CLASSES[side],
            ALIGN_CLASSES[align],
          )}
        >
          {content}
          {shortcut && <Kbd className="-mr-0.5">{shortcut}</Kbd>}
        </span>
      )}
    </span>
  );
}
