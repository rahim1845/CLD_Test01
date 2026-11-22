"use client";

import { useEffect, useRef } from "react";

export function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return target.closest("input, textarea, select, [contenteditable='true'], [role='textbox']") !== null;
}

/**
 * Single-key shortcuts (no modifiers) that stay out of the way while the user is typing.
 * Keys are matched against KeyboardEvent.key, e.g. { "1": () => ..., "?": () => ... }.
 */
export function useHotkeys(bindings: Record<string, () => void>, enabled = true) {
  const ref = useRef(bindings);

  useEffect(() => {
    ref.current = bindings;
  });

  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      if (isEditableTarget(e.target)) return;
      const handler = ref.current[e.key];
      if (!handler) return;
      e.preventDefault();
      handler();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled]);
}
