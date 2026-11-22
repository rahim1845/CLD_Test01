"use client";

import { useState, useRef } from "react";
import { useThemeStore } from "@/store/themeStore";

export default function ThemeNameEditor() {
  const { themeName, setThemeName } = useThemeStore();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const startEdit = () => {
    setDraft(themeName);
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const commit = () => {
    if (draft.trim()) setThemeName(draft.trim());
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") setEditing(false);
        }}
        className="bg-transparent border-b border-indigo-500 text-[#ddddf0] text-sm font-semibold outline-none w-40"
        autoFocus
      />
    );
  }

  return (
    <button
      onClick={startEdit}
      className="text-sm font-semibold text-[#ddddf0] hover:text-indigo-300 transition-colors cursor-text"
      title="Click to rename"
    >
      {themeName}
      <span className="ml-1.5 text-[#3a3a58] text-xs">✎</span>
    </button>
  );
}
