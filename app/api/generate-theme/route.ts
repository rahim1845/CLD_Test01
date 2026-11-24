import Anthropic from "@anthropic-ai/sdk";
import type { NextRequest } from "next/server";
import { normalizeHex } from "@/lib/engine/color";
import { GOOGLE_FONTS } from "@/lib/engine/typography";
import { themeTokensSchema, type GenerateMode, type GenerateThemeRequest } from "@/types/theme";

const GENERATION_MODEL = "claude-sonnet-5-5";
const NAMING_MODEL = "claude-haiku-5-5";
const MAX_PROMPT_LENGTH = 1000;
const MODES: GenerateMode[] = ["prompt", "color", "both"];

export type GenerateErrorCode =
  | "missing_api_key"
  | "invalid_request"
  | "invalid_api_key"
  | "rate_limited"
  | "overloaded"
  | "network"
  | "refusal"
  | "truncated"
  | "invalid_output"
  | "api_error";

function hasCredentials(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
}

let client: Anthropic | null = null;
function getClient(): Anthropic {
  client ??= new Anthropic();
  return client;
}

function errorResponse(status: number, code: GenerateErrorCode, error: string) {
  return Response.json({ error, code }, { status, headers: { "Cache-Control": "no-store" } });
}

const missingKeyResponse = () =>
  errorResponse(
    503,
    "missing_api_key",
    "Claude AI mode needs an Anthropic API key on the server. Set ANTHROPIC_API_KEY in .env.local and restart the dev server.",
  );

function familiesIn(category: string): string {
  return Object.entries(GOOGLE_FONTS)
    .filter(([, info]) => info.category === category)
    .map(([family]) => family)
    .join(", ");
}

const SYSTEM_PROMPT = `You are an expert design system engineer. Generate a complete design token set as a single valid JSON object. Return ONLY the JSON: no markdown, no code fences, no explanation.

The JSON must match this exact structure:
{
  "color": {
    "primary": { "50":"#hex","100":"#hex","200":"#hex","300":"#hex","400":"#hex","500":"#hex","600":"#hex","700":"#hex","800":"#hex","900":"#hex","950":"#hex" },
    "neutral": { same 11 stops },
    "accent":  { same 11 stops },
    "semantic": { "success":"#hex","warning":"#hex","error":"#hex","info":"#hex","successBg":"#hex","warningBg":"#hex","errorBg":"#hex","infoBg":"#hex" },
    "surface":  { "background":"#hex","card":"#hex","border":"#hex","borderSubtle":"#hex","overlay":"rgba(...)" },
    "text":     { "primary":"#hex","secondary":"#hex","tertiary":"#hex","disabled":"#hex","onPrimary":"#hex","inverse":"#hex" }
  },
  "typography": {
    "fontFamily": { "display":"...", "body":"...", "mono":"..." },
    "fontSize":   { "xs":"11px","sm":"13px","base":"14px","md":"15px","lg":"16px","xl":"18px","2xl":"20px","3xl":"24px","4xl":"30px","5xl":"36px","6xl":"48px" },
    "fontWeight": { "light":"300","regular":"400","medium":"500","semibold":"600","bold":"700","extrabold":"800" },
    "lineHeight": { "tight":"1.1","snug":"1.25","normal":"1.5","relaxed":"1.625","loose":"2" },
    "letterSpacing": { "tighter":"-0.05em","tight":"-0.025em","normal":"0em","wide":"0.025em","wider":"0.05em","widest":"0.1em" }
  },
  "spacing": { "0":"0px","1":"4px","2":"8px","3":"12px","4":"16px","5":"20px","6":"24px","8":"32px","10":"40px","12":"48px","16":"64px","20":"80px","24":"96px","32":"128px" },
  "radius": { "none":"0px","xs":"2px","sm":"4px","md":"6px","lg":"8px","xl":"12px","2xl":"16px","3xl":"24px","full":"9999px" },
  "shadow": { "none":"none","xs":"...","sm":"...","md":"...","lg":"...","xl":"...","2xl":"...","inner":"..." },
  "animation": {
    "duration": { "fast":"100ms","normal":"200ms","slow":"300ms","slower":"500ms" },
    "easing": { "linear":"linear","ease":"ease","easeIn":"cubic-bezier(0.4,0,1,1)","easeOut":"cubic-bezier(0,0,0.2,1)","easeInOut":"cubic-bezier(0.4,0,0.2,1)","spring":"cubic-bezier(0.34,1.56,0.64,1)" }
  },
  "zIndex": { "hide":"-1","auto":"auto","base":"0","dropdown":"1000","sticky":"1100","overlay":"1200","modal":"1300","popover":"1400","toast":"1500","tooltip":"1600" },
  "blur": { "none":"0px","sm":"4px","md":"8px","lg":"16px","xl":"24px","2xl":"40px" }
}

Design rules:
- Write the "color" object first, in the order shown, so the preview can update while you stream.
- Every color is a 6-digit lowercase hex code (e.g. #1a2b3c), except overlay, which uses rgba().
- Primary, neutral and accent are 11-stop scales from near-white (50) to near-black (950) that get steadily darker, with even perceptual steps.
- Neutral is a gray tinted slightly toward the primary hue (or warm/cool to suit the brand). Accent is a deliberate harmony with primary (complementary, split-complementary, analogous or triadic).
- Semantic colors are clearly green / amber / red / blue, tuned to sit well with the palette; the *Bg variants are deep, low-chroma tints for dark surfaces.
- "surface" and "text" describe the DARK mode UI: background is a near-black tinted by the neutral hue, card is slightly lighter, borders are subtle. Light mode is derived from the neutral scale, so do not invert them.
- Contrast: text.primary on surface.card at least 7:1, text.secondary at least 4.5:1, text.tertiary at least 3:1, text.onPrimary on primary-500 at least 4.5:1.
- Typography: each fontFamily is a CSS stack that starts with one quoted Google Fonts family from these lists, then generic fallbacks, e.g. "\\"Inter\\", ui-sans-serif, system-ui, sans-serif".
  Sans: ${familiesIn("sans")}.
  Display: ${familiesIn("display")}.
  Serif: ${familiesIn("serif")}.
  Mono (for "mono" only): ${familiesIn("mono")}.
- Font sizes may be tuned (base 14-16px, 6xl 44-72px). Radius and shadows should express the brand (sharp and flat for technical or brutalist brands, rounded and soft for friendly ones; shadows use rgba tinted toward the primary hue).`;

function buildUserPrompt(req: GenerateThemeRequest): string {
  const brief = req.prompt ? `<brief>\n${req.prompt}\n</brief>` : "";
  if (req.mode === "color" && req.seedColor) {
    return `Generate a design system theme whose primary-500 is exactly ${req.seedColor}. Read the personality from the color itself and build a harmonious palette, type pairing and shape language around it.`;
  }
  if (req.mode === "both" && req.seedColor) {
    return `Generate a design system theme for the brand below. primary-500 must be exactly ${req.seedColor}; let the brief drive everything else.\n\n${brief || "<brief>A modern product</brief>"}`;
  }
  if (brief) {
    return `Generate a design system theme for the brand below. Make it cohesive and professionally crafted.\n\n${brief}`;
  }
  return "Generate a refined, modern design system theme with a deep indigo primary and a warm accent.";
}

function parseGenerateRequest(body: unknown): GenerateThemeRequest | null {
  if (typeof body !== "object" || body === null) return null;
  const { mode, prompt, seedColor } = body as Record<string, unknown>;
  if (!MODES.includes(mode as GenerateMode)) return null;
  if (prompt !== undefined && typeof prompt !== "string") return null;
  if (seedColor !== undefined && typeof seedColor !== "string") return null;
  const seed = seedColor ? normalizeHex(seedColor) : null;
  if (mode !== "prompt" && !seed) return null;
  return {
    mode: mode as GenerateMode,
    prompt: prompt?.trim().slice(0, MAX_PROMPT_LENGTH) || undefined,
    seedColor: mode === "prompt" ? undefined : (seed ?? undefined),
  };
}

function describeError(e: unknown): { code: GenerateErrorCode; message: string } {
  if (e instanceof Anthropic.AuthenticationError || e instanceof Anthropic.PermissionDeniedError) {
    return { code: "invalid_api_key", message: "The Anthropic API key was rejected. Check ANTHROPIC_API_KEY on the server." };
  }
  if (e instanceof Anthropic.RateLimitError) {
    return { code: "rate_limited", message: "Claude is rate limited right now. Try again in a moment." };
  }
  if (e instanceof Anthropic.APIConnectionError) {
    return { code: "network", message: "Could not reach the Anthropic API. Check the server's network connection." };
  }
  if (e instanceof Anthropic.APIError) {
    if (e.status === 529 || e.status === 503) {
      return { code: "overloaded", message: "Claude is busy right now. Try again in a moment." };
    }
    return { code: "api_error", message: `The Anthropic API returned an error${e.status ? ` (${e.status})` : ""}.` };
  }
  return { code: "api_error", message: e instanceof Error ? e.message : "Generation failed." };
}

function extractTheme(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try {
    const parsed = themeTokensSchema.safeParse(JSON.parse(text.slice(start, end + 1)));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  if (!hasCredentials()) return missingKeyResponse();

  let req: GenerateThemeRequest | null = null;
  try {
    req = parseGenerateRequest(await request.json());
  } catch {
    req = null;
  }
  if (!req) return errorResponse(400, "invalid_request", "Send a mode plus a brief and/or a valid hex seed color.");

  const encoder = new TextEncoder();
  const anthropicStream = getClient().beta.messages.stream(
    {
      model: GENERATION_MODEL,
      max_tokens: 16000,
      output_config: { effort: "low" },
      betas: ["server-side-fallback-2026-07-01"],
      // Not yet typed in this SDK version; the SDK forwards unknown body fields unchanged.
      fallbacks: "default",
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: buildUserPrompt(req) }],
    },
    { signal: request.signal },
  );

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let open = true;
      const send = (payload: Record<string, unknown>) => {
        if (!open) return;
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
        } catch {
          open = false;
        }
      };
      const fail = (code: GenerateErrorCode, message: string) => send({ type: "error", code, message });

      try {
        let fullText = "";
        for await (const event of anthropicStream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            fullText += event.delta.text;
            send({ type: "delta", text: event.delta.text });
          }
        }
        const final = await anthropicStream.finalMessage();
        if (final.stop_reason === "refusal") {
          fail("refusal", "Claude declined this brief. Try rephrasing it, or use the Instant engine.");
        } else if (final.stop_reason === "max_tokens") {
          fail("truncated", "Claude's response was cut off before the theme was complete. Try again.");
        } else {
          const theme = extractTheme(fullText);
          if (theme) send({ type: "complete", theme });
          else fail("invalid_output", "Claude returned a theme that did not match the token schema. Try again.");
        }
      } catch (e) {
        if (!(e instanceof Anthropic.APIUserAbortError)) {
          const { code, message } = describeError(e);
          fail(code, message);
        }
      } finally {
        if (open) {
          open = false;
          try {
            controller.close();
          } catch {}
        }
      }
    },
    cancel() {
      anthropicStream.abort();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

function cleanName(raw: string): string | null {
  const words = raw
    .replace(/[^a-zA-Z\s'-]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
  const name = words.join(" ").slice(0, 40).trim();
  return name.length >= 3 ? name : null;
}

/** Names a finished theme. Responds with { name: null } when no name could be produced. */
export async function PUT(request: NextRequest) {
  if (!hasCredentials()) return missingKeyResponse();

  let context: string;
  try {
    const { theme, prompt } = (await request.json()) as { theme?: unknown; prompt?: unknown };
    const primary = themeTokensSchema.shape.color.safeParse((theme as { color?: unknown } | undefined)?.color);
    const brief = typeof prompt === "string" ? prompt.trim().slice(0, MAX_PROMPT_LENGTH) : "";
    if (!brief && !primary.success) return errorResponse(400, "invalid_request", "Send a theme or a brief to name.");
    context = brief
      ? `Brand brief:\n<brief>\n${brief}\n</brief>`
      : `Primary color: ${primary.data?.primary[500]}, accent color: ${primary.data?.accent[500]}`;
  } catch {
    return errorResponse(400, "invalid_request", "Send a theme or a brief to name.");
  }

  try {
    const msg = await getClient().messages.create(
      {
        model: NAMING_MODEL,
        max_tokens: 1024,
        output_config: { effort: "low" },
        messages: [
          {
            role: "user",
            content: `Name this design system theme with an evocative two-word name (adjective + noun, like "Cobalt Dusk" or "Ember Grid").\n\n${context}\n\nReply with only the two words.`,
          },
        ],
      },
      { signal: request.signal },
    );
    if (msg.stop_reason === "refusal") return Response.json({ name: null });
    const text = msg.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join(" ");
    return Response.json({ name: cleanName(text) });
  } catch (e) {
    const { code, message } = describeError(e);
    return errorResponse(502, code, message);
  }
}
