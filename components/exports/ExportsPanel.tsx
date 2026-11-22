"use client";

import { useState } from "react";
import { useThemeStore } from "@/store/themeStore";
import CodeBlock from "./CodeBlock";
import {
  generateCSSVars,
  generateSCSSTokens,
  generateJSObject,
  generateStyleMap,
  generateTailwindExtend,
  generateW3CTokens,
  generateFigmaTokens,
} from "./exportGenerators";

type ExportFormat = "css" | "scss" | "js" | "stylemap" | "tailwind" | "w3c" | "figma";

const FORMATS: { id: ExportFormat; label: string; description: string; lang: string; hint: string }[] = [
  {
    id: "css",
    label: "CSS Variables",
    description: "Standard CSS custom properties — works in any browser",
    lang: "css",
    hint: "Paste inside your global stylesheet (e.g. globals.css or styles/tokens.css).",
  },
  {
    id: "scss",
    label: "SCSS Tokens",
    description: "$variable format compatible with any SCSS project",
    lang: "scss",
    hint: "Paste into _tokens.scss, then @use 'tokens' in your components.",
  },
  {
    id: "js",
    label: "JS Object",
    description: "Plain JavaScript constant — import and use anywhere",
    lang: "js",
    hint: "Save as theme.js and import it: import { theme } from './theme'.",
  },
  {
    id: "stylemap",
    label: "Style Map",
    description: "Ready-to-use objects for React inline styles",
    lang: "js",
    hint: "Import colors, radius, or shadows directly in your React components for inline styles.",
  },
  {
    id: "tailwind",
    label: "Tailwind Extend",
    description: "Drop into tailwind.config.js → theme.extend",
    lang: "js",
    hint: "Copy the extend block into tailwind.config.js under module.exports.theme.",
  },
  {
    id: "w3c",
    label: "W3C Design Tokens",
    description: "{$value, $type} format — works with any token pipeline",
    lang: "json",
    hint: "Use with Style Dictionary, Theo, or any W3C-compatible token tool.",
  },
  {
    id: "figma",
    label: "Figma Tokens JSON",
    description: "Tokens Studio (formerly Figma Tokens) plugin format",
    lang: "json",
    hint: "Import in Figma via Tokens Studio plugin → Import/Export → JSON.",
  },
];

export default function ExportsPanel() {
  const { currentTheme } = useThemeStore();
  const [activeFormat, setActiveFormat] = useState<ExportFormat>("css");

  const getCode = (id: ExportFormat) => {
    switch (id) {
      case "css": return generateCSSVars(currentTheme);
      case "scss": return generateSCSSTokens(currentTheme);
      case "js": return generateJSObject(currentTheme);
      case "stylemap": return generateStyleMap(currentTheme);
      case "tailwind": return generateTailwindExtend(currentTheme);
      case "w3c": return generateW3CTokens(currentTheme);
      case "figma": return generateFigmaTokens(currentTheme);
    }
  };

  const active = FORMATS.find((f) => f.id === activeFormat)!;

  return (
    <div className="flex h-full">
      {/* Format list */}
      <div className="w-48 flex-shrink-0 border-r border-[#12122a] p-3 space-y-1 overflow-y-auto preview-scroll">
        {FORMATS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFormat(f.id)}
            className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
              activeFormat === f.id
                ? "bg-indigo-600/20 border border-indigo-500/30"
                : "hover:bg-[#12122a] border border-transparent"
            }`}
          >
            <p className={`text-xs font-medium ${activeFormat === f.id ? "text-indigo-300" : "text-[#ddddf0]"}`}>
              {f.label}
            </p>
            <p className="text-[10px] text-[#5a5a80] mt-0.5 leading-snug">{f.description}</p>
          </button>
        ))}
      </div>

      {/* Code area */}
      <div className="flex-1 overflow-y-auto p-4 preview-scroll">
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-[#ddddf0]">{active.label}</h3>
          <p className="text-xs text-[#9090b8] mt-0.5">{active.description}</p>
        </div>
        <CodeBlock
          code={getCode(activeFormat)}
          hint={active.hint}
          language={active.lang}
        />
      </div>
    </div>
  );
}
