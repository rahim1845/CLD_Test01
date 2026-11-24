"use client";

import { memo, useMemo } from "react";
import { cn } from "@/components/ui/cn";
import type { ExportLanguage } from "./exportGenerators";
import { highlight, type TokenKind } from "./highlight";

const KIND_CLASS: Record<TokenKind, string> = {
  text: "text-[#d6d6de]",
  comment: "text-[#5f5f6b] italic",
  keyword: "text-[#f2a7cb]",
  selector: "text-[#f2a7cb]",
  property: "text-[#b9b0ff]",
  variable: "text-[#8fd0ff]",
  string: "text-[#9fdcb2]",
  number: "text-[#f5c68e]",
  color: "text-[#f5c68e]",
  func: "text-[#7fd6cb]",
  punct: "text-[#6f6f7b]",
};

interface Props {
  code: string;
  language: ExportLanguage;
  label: string;
  wrap?: boolean;
}

export const CodeViewer = memo(function CodeViewer({ code, language, label, wrap = false }: Props) {
  const lines = useMemo(() => highlight(code, language), [code, language]);
  const gutter = `${String(lines.length).length + 4}ch`;

  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className="relative min-h-0 flex-1 overflow-auto overscroll-contain bg-[var(--shell-panel)] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--shell-accent)]"
    >
      <pre
        className={cn(
          "py-4 font-[family-name:var(--font-mono)] text-[12.5px] leading-5 [font-variant-ligatures:none] [tab-size:2]",
          wrap ? "min-w-0" : "min-w-max",
        )}
      >
        <code>
          {lines.map((tokens, i) => (
            <div key={i} className="group/line flex">
              <span
                aria-hidden
                className={cn(
                  "sticky left-0 z-[1] shrink-0 select-none bg-[var(--shell-panel)] pl-4 pr-5 text-right tabular-nums",
                  "text-[#45454f] transition-colors duration-100 group-hover/line:bg-[#111116] group-hover/line:text-[var(--shell-text-subtle)]",
                )}
                style={{ width: gutter }}
              >
                {i + 1}
              </span>
              <span
                className={cn(
                  "min-w-0 flex-1 pr-8 transition-colors duration-100 group-hover/line:bg-[#111116]",
                  wrap ? "whitespace-pre-wrap break-words [overflow-wrap:anywhere]" : "whitespace-pre",
                )}
              >
                {tokens.map((t, j) => (
                  <span key={j} className={KIND_CLASS[t.kind]}>
                    {t.swatch && (
                      <span
                        aria-hidden
                        className="mr-1.5 inline-block size-[9px] translate-y-[0.5px] rounded-[2px] align-baseline shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]"
                        style={{ background: t.swatch }}
                      />
                    )}
                    {t.text}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
});
