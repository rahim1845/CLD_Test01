"use client";

import { useState } from "react";

interface Props {
  code: string;
  hint: string;
  language?: string;
}

export default function CodeBlock({ code, hint, language = "css" }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-[#12122a]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#0a0a14] border-b border-[#12122a]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-[10px] text-[#5a5a80] font-mono ml-1">{language}</span>
        </div>
        <button
          onClick={copy}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
            copied
              ? "bg-green-900/50 text-green-400"
              : "bg-[#12122a] text-[#9090b8] hover:text-[#ddddf0] hover:bg-[#1e1e3a]"
          }`}
        >
          {copied ? "✓ Copied!" : "Copy"}
        </button>
      </div>
      <p className="px-4 py-2 text-[10px] text-[#9090b8] bg-[#070710] border-b border-[#0d0d20]">
        {hint}
      </p>
      <div className="overflow-auto max-h-[300px] preview-scroll">
        <pre className="p-4 text-[11px] leading-relaxed font-mono" style={{ background: "#050509" }}>
          <code className={`language-${language}`} style={{ color: "#c9d1d9" }}>
            {highlightCode(code, language)}
          </code>
        </pre>
      </div>
    </div>
  );
}

function highlightCode(code: string, language: string) {
  if (language === "json" || language === "js") {
    return code
      .split("\n")
      .map((line, i) => <Line key={i} line={line} language={language} />);
  }
  return code.split("\n").map((line, i) => <Line key={i} line={line} language={language} />);
}

function Line({ line, language }: { line: string; language: string }) {
  if (language === "css" || language === "scss") {
    return (
      <div>
        {line
          .split(/(--[\w-]+|#[0-9a-fA-F]{3,8}|:\s|[{}]|\/\/.*$)/g)
          .map((part, i) => {
            if (/^--[\w-]+$/.test(part)) return <span key={i} style={{ color: "#79c0ff" }}>{part}</span>;
            if (/^#[0-9a-fA-F]{3,8}$/.test(part)) return <span key={i} style={{ color: "#f0883e" }}>{part}</span>;
            if (part === "{" || part === "}") return <span key={i} style={{ color: "#e3b341" }}>{part}</span>;
            if (/^\/\//.test(part)) return <span key={i} style={{ color: "#8b949e" }}>{part}</span>;
            return <span key={i}>{part}</span>;
          })}
      </div>
    );
  }

  if (language === "json") {
    return (
      <div>
        {line
          .split(/("[\w-]+"(?=\s*:)|"[^"]*"|:\s*|[{}\[\],])/g)
          .map((part, i) => {
            if (/^"[\w-]+"$/.test(part) && line.includes(`${part}:`)) return <span key={i} style={{ color: "#79c0ff" }}>{part}</span>;
            if (/^"#[0-9a-fA-F]/.test(part)) return <span key={i} style={{ color: "#f0883e" }}>{part}</span>;
            if (/^"/.test(part)) return <span key={i} style={{ color: "#a5d6ff" }}>{part}</span>;
            if (part === "{" || part === "}" || part === "[" || part === "]") return <span key={i} style={{ color: "#e3b341" }}>{part}</span>;
            return <span key={i}>{part}</span>;
          })}
      </div>
    );
  }

  return (
    <div>
      {line
        .split(/(const|let|var|#[0-9a-fA-F]{3,8}|"[^"]*"|'[^']*'|\/\/.*$)/g)
        .map((part, i) => {
          if (part === "const" || part === "let" || part === "var") return <span key={i} style={{ color: "#ff7b72" }}>{part}</span>;
          if (/^#[0-9a-fA-F]/.test(part)) return <span key={i} style={{ color: "#f0883e" }}>{part}</span>;
          if (/^["']/.test(part)) return <span key={i} style={{ color: "#a5d6ff" }}>{part}</span>;
          if (/^\/\//.test(part)) return <span key={i} style={{ color: "#8b949e" }}>{part}</span>;
          return <span key={i}>{part}</span>;
        })}
    </div>
  );
}
