import { themeTokensSchema, type ThemeTokens } from "@/types/theme";

const HEX = /^#[0-9a-f]{3,8}$/i;

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * Parses the complete part of a JSON document that is still streaming in. The text is cut after the last
 * finished value (only at commas and closing brackets outside strings, so no half-written string survives),
 * and the brackets still open at that point are closed.
 */
export function parsePartialJson(text: string): unknown {
  const start = text.indexOf("{");
  if (start === -1) return null;

  const closers: string[] = [];
  let inString = false;
  let escaped = false;
  let cut = -1;
  let cutClosers: string[] = [];

  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === "{") closers.push("}");
    else if (ch === "[") closers.push("]");
    else if (ch === "}" || ch === "]") {
      closers.pop();
      cut = i + 1;
      cutClosers = closers.slice();
      if (closers.length === 0) break;
    } else if (ch === ",") {
      cut = i;
      cutClosers = closers.slice();
    }
  }

  if (cut === -1) return null;
  try {
    return JSON.parse(text.slice(start, cut) + cutClosers.reverse().join(""));
  } catch {
    return null;
  }
}

/** Overlays only known keys with values of the same type; colors must be complete hex codes. */
function overlay(base: unknown, patch: unknown): unknown {
  if (isPlainObject(base)) {
    if (!isPlainObject(patch)) return base;
    const out: Record<string, unknown> = { ...base };
    for (const key of Object.keys(base)) {
      if (key in patch) out[key] = overlay(base[key], patch[key]);
    }
    return out;
  }
  if (typeof base !== typeof patch) return base;
  if (typeof base === "string" && HEX.test(base) && !HEX.test(patch as string)) return base;
  return patch;
}

/** The base theme with every token the stream has finished so far, or null when nothing usable arrived yet. */
export function mergePartialTheme(base: ThemeTokens, streamedText: string): ThemeTokens | null {
  const partial = parsePartialJson(streamedText);
  if (!isPlainObject(partial)) return null;
  const parsed = themeTokensSchema.safeParse(overlay(base, partial));
  return parsed.success ? parsed.data : null;
}
