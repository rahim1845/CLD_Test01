"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** True on Apple platforms. Renders as Mac on the server, then corrects itself after hydration. */
export function useIsMac(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent),
    () => true,
  );
}
