import type { ExportLanguage } from "./exportGenerators";

export type TokenKind =
  | "text"
  | "comment"
  | "keyword"
  | "selector"
  | "property"
  | "variable"
  | "string"
  | "number"
  | "color"
  | "func"
  | "punct";

export interface CodeToken {
  kind: TokenKind;
  text: string;
  /** Hex color the token spells out, for an inline swatch. */
  swatch?: string;
}

type Rule = [TokenKind, RegExp];

const STRING = String.raw`"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'`;

const CSS_RULES: Rule[] = [
  ["comment", /\/\*[\s\S]*?(?:\*\/|$)/y],
  ["property", new RegExp(`(?:${STRING})(?=\\s*:)`, "y")],
  ["string", new RegExp(STRING, "y")],
  ["keyword", /@[\w-]+|!important\b/y],
  ["variable", /\$[\w-]+/y],
  ["punct", /#\{/y],
  ["property", /--[\w-]+/y],
  ["color", /#[0-9a-fA-F]{3,8}(?![\w-])/y],
  ["selector", /::?[a-zA-Z][\w-]*/y],
  ["selector", /[\w-]+(?==)/y],
  ["number", /-?(?:\d+\.?\d*|\.\d+)(?:px|rem|em|ms|s|%|deg|vh|vw|fr)?(?![\w-])/y],
  ["func", /[\w-]+(?=\()/y],
  ["property", /[a-zA-Z-]+(?=\s*:(?!:))/y],
  ["text", /[\w-]+/y],
  ["punct", /[{}()[\];:,=]/y],
];

const SCSS_RULES: Rule[] = [["comment", /\/\/[^\n]*/y], ...CSS_RULES];

const JS_RULES: Rule[] = [
  ["comment", /\/\*[\s\S]*?(?:\*\/|$)/y],
  ["comment", /\/\/[^\n]*/y],
  ["string", /`(?:[^`\\]|\\.)*`/y],
  ["property", new RegExp(`(?:${STRING})(?=\\s*:)`, "y")],
  ["string", new RegExp(STRING, "y")],
  ["keyword", /\b(?:const|let|var|export|default|function|return|import|from|as|new|typeof|if|else|module)\b/y],
  ["number", /\b(?:true|false|null|undefined)\b/y],
  ["number", /-?\b\d+(?:\.\d+)?\b/y],
  ["property", /[A-Za-z_$][\w$]*(?=\s*:)/y],
  ["func", /[A-Za-z_$][\w$]*(?=\()/y],
  ["text", /[A-Za-z_$][\w$]*/y],
  ["punct", /\.\.\.|[{}()[\];:,.=?<>+*\/-]/y],
];

const JSON_RULES: Rule[] = [
  ["property", /"(?:[^"\\]|\\.)*"(?=\s*:)/y],
  ["string", /"(?:[^"\\]|\\.)*"/y],
  ["number", /-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/y],
  ["number", /\b(?:true|false|null)\b/y],
  ["punct", /[{}[\],:]/y],
];

const RULES: Record<ExportLanguage, Rule[]> = { css: CSS_RULES, scss: SCSS_RULES, js: JS_RULES, json: JSON_RULES };

const HEX_IN_STRING = /^["'`](#[0-9a-fA-F]{3}|#[0-9a-fA-F]{6}|#[0-9a-fA-F]{8})["'`]$/;
const ALIAS_IN_STRING = /^"\{[\w.-]+\}"$/;

function classify(kind: TokenKind, text: string): CodeToken {
  if (kind === "color") return { kind, text, swatch: text };
  if (kind === "string") {
    const hex = HEX_IN_STRING.exec(text);
    if (hex) return { kind: "color", text, swatch: hex[1] };
    if (ALIAS_IN_STRING.test(text)) return { kind: "variable", text };
  }
  return { kind, text };
}

/** Tokenizes `code` and splits it into lines; multi-line tokens (block comments) are split per line. */
export function highlight(code: string, language: ExportLanguage): CodeToken[][] {
  const rules = RULES[language];
  const lines: CodeToken[][] = [[]];
  const push = (token: CodeToken) => {
    const parts = token.text.split("\n");
    parts.forEach((part, i) => {
      if (i > 0) lines.push([]);
      if (!part) return;
      const line = lines[lines.length - 1];
      const prev = line[line.length - 1];
      if (prev && prev.kind === token.kind && !prev.swatch && !token.swatch && token.kind === "text") prev.text += part;
      else line.push({ ...token, text: part });
    });
  };

  let i = 0;
  while (i < code.length) {
    let matched = false;
    for (const [kind, re] of rules) {
      re.lastIndex = i;
      const m = re.exec(code);
      if (m && m[0].length) {
        push(classify(kind, m[0]));
        i += m[0].length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      push({ kind: "text", text: code[i] });
      i++;
    }
  }
  if (lines.length > 1 && lines[lines.length - 1].length === 0 && code.endsWith("\n")) lines.pop();
  return lines;
}
