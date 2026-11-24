"use client";

import { useEffect, useMemo, useRef, useState, type ComponentType, type KeyboardEvent } from "react";
import { Atom, Braces, Check, Component, Copy, Download, FileCode, Globe, Info, TextWrap, Variable, DollarSign, Wind } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { cn } from "@/components/ui/cn";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { PANEL_TOOLBAR_CLASS } from "@/components/ui/panel";
import { SECTION_LABEL_CLASS } from "@/components/ui/SectionLabel";
import { copyText } from "@/components/ui/clipboard";
import { CodeViewer } from "./CodeViewer";
import { EXPORT_FORMATS, getExportFormat, type ExportFormatId } from "./exportGenerators";
import { countTokens } from "./tokenModel";

type Icon = ComponentType<{ size?: number; strokeWidth?: number; className?: string; "aria-hidden"?: boolean }>;

const ICONS: Record<ExportFormatId, Icon> = {
  css: Variable,
  scss: DollarSign,
  js: Braces,
  stylemap: Atom,
  tailwind: Wind,
  w3c: Globe,
  figma: Component,
};

const LANGUAGE_LABEL = { css: "CSS", scss: "SCSS", js: "JavaScript", json: "JSON" } as const;

const NAMING: { label: string; formats: ExportFormatId[]; example: string }[] = [
  { label: "CSS", formats: ["css"], example: "--color-primary-500" },
  { label: "SCSS", formats: ["scss"], example: "$color-primary-500" },
  { label: "JS", formats: ["js", "stylemap"], example: "theme.color.primary[500]" },
  { label: "Tailwind", formats: ["tailwind"], example: "bg-primary-500" },
  { label: "JSON", formats: ["w3c", "figma"], example: "color.primary.500" },
];

function formatBytes(bytes: number): string {
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
}

function downloadFile(content: string, fileName: string, mime: string) {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const TAB_PREFIX = "tf-export";

export default function ExportsPanel() {
  const theme = useThemeStore((s) => s.currentTheme);
  const themeName = useThemeStore((s) => s.themeName);
  const [formatId, setFormatId] = useState<ExportFormatId>("css");
  const [wrap, setWrap] = useState(false);
  const [done, setDone] = useState<{ action: "copy" | "download"; ok: boolean } | null>(null);
  const timer = useRef<number | null>(null);
  const tabRefs = useRef(new Map<ExportFormatId, HTMLButtonElement>());

  const format = getExportFormat(formatId);
  const code = useMemo(() => format.generate({ theme, name: themeName }), [format, theme, themeName]);
  const stats = useMemo(
    () => ({ lines: code.replace(/\n$/, "").split("\n").length, bytes: new TextEncoder().encode(code).length }),
    [code],
  );
  const counts = useMemo(() => countTokens(theme), [theme]);

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  const flash = (action: "copy" | "download", ok: boolean) => {
    setDone({ action, ok });
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setDone(null), 1800);
  };

  const select = (id: ExportFormatId, focus = false) => {
    setFormatId(id);
    setDone(null);
    if (focus) tabRefs.current.get(id)?.focus();
  };

  const onListKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const idx = EXPORT_FORMATS.findIndex((f) => f.id === formatId);
    const n = EXPORT_FORMATS.length;
    let next = idx;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (idx + 1) % n;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (idx - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    select(EXPORT_FORMATS[next].id, true);
  };

  const onCopy = async () => flash("copy", await copyText(code));
  const onDownload = () => {
    try {
      downloadFile(code, format.fileName, format.mime);
      flash("download", true);
    } catch {
      flash("download", false);
    }
  };

  const copied = done?.action === "copy" && done.ok;
  const downloaded = done?.action === "download" && done.ok;

  return (
    <div className="@container flex h-full min-h-0 flex-col bg-[var(--shell-bg)]">
      <div className="flex min-h-0 flex-1 flex-col @3xl:flex-row">
        <aside className="flex shrink-0 flex-col border-b border-[var(--shell-border)] @3xl:w-[300px] @3xl:overflow-y-auto @3xl:border-b-0 @3xl:border-r">
          <div className={cn(PANEL_TOOLBAR_CLASS, "hidden justify-between px-5 sm:px-5 @3xl:flex")}>
            <h2 className={SECTION_LABEL_CLASS}>Formats</h2>
            <span className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums text-[var(--shell-text-subtle)]">
              {counts.total} tokens
            </span>
          </div>

          <div
            role="tablist"
            aria-label="Export format"
            aria-orientation="vertical"
            onKeyDown={onListKey}
            className={cn(
              "flex gap-1 overflow-x-auto px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              "@3xl:flex-col @3xl:gap-0.5 @3xl:overflow-visible @3xl:px-2.5 @3xl:py-3",
            )}
          >
            {EXPORT_FORMATS.map((f) => {
              const on = f.id === formatId;
              const Icon = ICONS[f.id];
              return (
                <button
                  key={f.id}
                  ref={(el) => {
                    if (el) tabRefs.current.set(f.id, el);
                    else tabRefs.current.delete(f.id);
                  }}
                  type="button"
                  role="tab"
                  id={`${TAB_PREFIX}-tab-${f.id}`}
                  aria-controls={`${TAB_PREFIX}-panel`}
                  aria-selected={on}
                  tabIndex={on ? 0 : -1}
                  onClick={() => select(f.id)}
                  className={cn(
                    "group/fmt flex shrink-0 items-center gap-3 rounded-[var(--shell-radius)] text-left outline-none transition-colors duration-150",
                    "h-9 px-2.5 @3xl:h-auto @3xl:px-2.5 @3xl:py-2",
                    "focus-visible:ring-2 focus-visible:ring-[var(--shell-accent)]",
                    on
                      ? "bg-[var(--shell-raised)] shadow-[inset_0_0_0_1px_var(--shell-border-strong)]"
                      : "hover:bg-[rgba(255,255,255,0.03)]",
                  )}
                >
                  <span
                    className={cn(
                      "grid shrink-0 place-items-center rounded-[7px] border transition-colors duration-150",
                      "size-6 @3xl:size-8",
                      on
                        ? "border-[var(--shell-border-strong)] bg-[var(--shell-hover)] text-[var(--shell-text)]"
                        : "border-[var(--shell-border)] bg-[var(--shell-panel)] text-[var(--shell-text-subtle)] group-hover/fmt:text-[var(--shell-text-muted)]",
                    )}
                  >
                    <Icon size={15} strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "whitespace-nowrap text-[13px] font-medium tracking-[-0.005em] transition-colors duration-150",
                          on ? "text-[var(--shell-text)]" : "text-[var(--shell-text-muted)] group-hover/fmt:text-[var(--shell-text)]",
                        )}
                      >
                        {f.label}
                      </span>
                      <span className="hidden font-[family-name:var(--font-mono)] text-[10.5px] text-[var(--shell-text-subtle)] @3xl:inline">
                        .{f.fileName.split(".").pop()}
                      </span>
                    </span>
                    <span className="hidden truncate pt-0.5 text-[12px] leading-4 text-[var(--shell-text-subtle)] @3xl:block">
                      {f.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mx-5 mb-5 mt-auto hidden pt-6 @3xl:block">
            <div className="rounded-[var(--shell-radius)] border border-[var(--shell-border)] bg-[var(--shell-panel)]">
              <div className="border-b border-[var(--shell-border)] px-3.5 py-2.5">
                <p className="text-[12px] font-medium text-[var(--shell-text)]">One name, every format</p>
                <p className="mt-0.5 text-[11.5px] leading-4 text-[var(--shell-text-subtle)]">The same token, as each file spells it.</p>
              </div>
              <dl className="space-y-px p-1.5">
                {NAMING.map((row) => {
                  const on = row.formats.includes(formatId);
                  return (
                    <div
                      key={row.label}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-[6px] px-2 py-1.5 transition-colors duration-150",
                        on && "bg-[var(--shell-accent-soft)]",
                      )}
                    >
                      <dt className={cn("text-[11.5px]", on ? "text-[var(--shell-text)]" : "text-[var(--shell-text-subtle)]")}>{row.label}</dt>
                      <dd
                        className={cn(
                          "truncate font-[family-name:var(--font-mono)] text-[11px]",
                          on ? "text-[#c9c2ff]" : "text-[var(--shell-text-muted)]",
                        )}
                      >
                        {row.example}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </div>
        </aside>

        <section
          id={`${TAB_PREFIX}-panel`}
          role="tabpanel"
          aria-labelledby={`${TAB_PREFIX}-tab-${formatId}`}
          className="flex min-h-0 min-w-0 flex-1 flex-col"
        >
          <header className={cn(PANEL_TOOLBAR_CLASS, "justify-between gap-4")}>
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <span className="hidden size-7 shrink-0 place-items-center rounded-[7px] border border-[var(--shell-border)] bg-[var(--shell-panel)] text-[var(--shell-text-muted)] sm:grid">
                <FileCode size={14} strokeWidth={1.75} aria-hidden />
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="flex min-w-0 items-center gap-2">
                  <h2 className="truncate font-[family-name:var(--font-mono)] text-[13px] font-medium leading-[18px] text-[var(--shell-text)]">
                    {format.fileName}
                  </h2>
                  <span className="shrink-0 rounded-[4px] border border-[var(--shell-border)] px-1.5 py-px text-[10.5px] font-medium text-[var(--shell-text-subtle)]">
                    {LANGUAGE_LABEL[format.language]}
                  </span>
                </span>
                <span className="truncate text-[11.5px] leading-4 tabular-nums text-[var(--shell-text-subtle)]">
                  {format.label} · {stats.lines.toLocaleString()} lines · {formatBytes(stats.bytes)}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <IconButton
                icon={TextWrap}
                label={wrap ? "Disable line wrap" : "Wrap long lines"}
                active={wrap}
                onClick={() => setWrap((w) => !w)}
                tooltipSide="bottom"
              />
              <span aria-hidden className="mx-1 hidden h-5 w-px bg-[var(--shell-border)] sm:block" />
              <Button
                variant="secondary"
                icon={copied ? Check : Copy}
                onClick={onCopy}
                className={cn(copied && "border-[rgba(62,207,142,0.35)] bg-[rgba(62,207,142,0.08)] text-[#7ee0b5] hover:bg-[rgba(62,207,142,0.08)]")}
              >
                <span className="w-[46px] text-left">{copied ? "Copied" : done?.action === "copy" ? "Failed" : "Copy"}</span>
              </Button>
              <Button
                variant="primary"
                icon={downloaded ? Check : Download}
                onClick={onDownload}
                aria-label={`Download ${format.fileName}`}
                className="max-sm:w-8 max-sm:px-0"
              >
                <span className="max-sm:sr-only">Download</span>
              </Button>
            </div>
          </header>

          <div className="flex min-h-10 shrink-0 items-center gap-3 border-b border-[var(--shell-border)] bg-[rgba(255,255,255,0.012)] px-3 py-2 sm:px-4 lg:px-5">
            <Info size={14} strokeWidth={1.75} aria-hidden className="shrink-0 text-[var(--shell-text-subtle)]" />
            <p className="min-w-0 flex-1 text-[12.5px] leading-[18px] text-[var(--shell-text-muted)]">{format.hint}</p>
            <code className="hidden shrink-0 rounded-[5px] border border-[var(--shell-border)] bg-[var(--shell-panel)] px-2 py-0.5 font-[family-name:var(--font-mono)] text-[11.5px] text-[var(--shell-text-muted)] @5xl:block">
              {format.usage}
            </code>
          </div>

          <CodeViewer code={code} language={format.language} label={`${format.fileName} source`} wrap={wrap} />

          <p aria-live="polite" className="sr-only">
            {copied ? `${format.fileName} copied to clipboard` : downloaded ? `${format.fileName} downloaded` : ""}
          </p>
        </section>
      </div>
    </div>
  );
}
