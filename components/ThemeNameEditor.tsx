"use client";

import { useEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { cn } from "@/components/ui/cn";
import { useMounted } from "@/components/ui/useMounted";

export const THEME_NAME_MAX_LENGTH = 40;

function normalizeName(value: string) {
  return value.replace(/\s+/g, " ").trim().slice(0, THEME_NAME_MAX_LENGTH);
}

export default function ThemeNameEditor({ className }: { className?: string }) {
  const themeName = useThemeStore((s) => s.themeName);
  const setThemeName = useThemeStore((s) => s.setThemeName);
  const mounted = useMounted();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const settled = useRef(false);

  useEffect(() => {
    if (!editing) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [editing]);

  const startEditing = () => {
    settled.current = false;
    setDraft(themeName);
    setEditing(true);
  };

  const finish = (commit: boolean, restoreFocus: boolean) => {
    if (settled.current) return;
    settled.current = true;
    if (commit) {
      const next = normalizeName(draft);
      if (next && next !== themeName) setThemeName(next);
    }
    setEditing(false);
    if (restoreFocus) requestAnimationFrame(() => buttonRef.current?.focus());
  };

  if (!mounted) {
    return (
      <span className={cn("inline-flex h-7 items-center px-2", className)} aria-hidden>
        <span className="h-2.5 w-24 rounded-full bg-[var(--shell-raised)]" />
      </span>
    );
  }

  if (editing) {
    return (
      <span className={cn("inline-grid min-w-0 max-w-full", className)}>
        <span
          aria-hidden
          className="invisible col-start-1 row-start-1 h-7 overflow-hidden whitespace-pre px-2 text-[13px] font-medium tracking-[-0.01em]"
        >
          {draft || " "}
          {"  "}
        </span>
        <input
          ref={inputRef}
          value={draft}
          maxLength={THEME_NAME_MAX_LENGTH}
          spellCheck={false}
          autoComplete="off"
          aria-label="Theme name"
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => finish(true, false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              finish(true, true);
            } else if (e.key === "Escape") {
              e.preventDefault();
              finish(false, true);
            }
          }}
          className={cn(
            "col-start-1 row-start-1 h-7 w-full min-w-[6ch] rounded-[var(--shell-radius-sm)] px-2",
            "bg-[var(--shell-raised)] text-[13px] font-medium tracking-[-0.01em] text-[var(--shell-text)]",
            "outline-none ring-1 ring-[var(--shell-accent)] shadow-[0_0_0_4px_var(--shell-accent-soft)]",
            "selection:bg-[rgba(139,124,255,0.35)]",
          )}
        />
      </span>
    );
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={startEditing}
      title="Rename theme"
      aria-label={`Theme name: ${themeName}. Press Enter to rename.`}
      className={cn(
        "group inline-flex h-7 min-w-0 max-w-full items-center gap-1.5 rounded-[var(--shell-radius-sm)] px-2",
        "text-[13px] font-medium tracking-[-0.01em] text-[var(--shell-text)]",
        "outline-none transition-colors duration-150 hover:bg-[var(--shell-hover)]",
        "focus-visible:ring-2 focus-visible:ring-[var(--shell-accent)]",
        "cursor-text",
        className,
      )}
    >
      <span className="truncate">{themeName}</span>
      <Pencil
        size={12}
        strokeWidth={1.75}
        aria-hidden
        className={cn(
          "shrink-0 text-[var(--shell-text-subtle)] opacity-0 transition-opacity duration-150",
          "group-hover:opacity-100 group-focus-visible:opacity-100",
        )}
      />
    </button>
  );
}
