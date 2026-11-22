import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { themeTokensSchema } from "@/types/theme";
import type { GenerateThemeRequest } from "@/types/theme";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert design system engineer. Generate a complete design token set as a single valid JSON object. Return ONLY the JSON — no markdown, no code fences, no explanation.

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
  "shadow": { "none":"none","xs":"...", "sm":"...","md":"...","lg":"...","xl":"...","2xl":"...","inner":"..." },
  "animation": {
    "duration": { "fast":"100ms","normal":"200ms","slow":"300ms","slower":"500ms" },
    "easing": { "linear":"linear","ease":"ease","easeIn":"cubic-bezier(0.4,0,1,1)","easeOut":"cubic-bezier(0,0,0.2,1)","easeInOut":"cubic-bezier(0.4,0,0.2,1)","spring":"cubic-bezier(0.34,1.56,0.64,1)" }
  },
  "zIndex": { "hide":"-1","auto":"auto","base":"0","dropdown":"1000","sticky":"1100","overlay":"1200","modal":"1300","popover":"1400","toast":"1500","tooltip":"1600" },
  "blur": { "none":"0px","sm":"4px","md":"8px","lg":"16px","xl":"24px","2xl":"40px" }
}

Design rules:
- All colors must be valid 6-digit hex codes (e.g. #1a2b3c), except overlay which uses rgba()
- Colors must form coherent, aesthetically pleasing palettes
- Primary scale: 11 stops from near-white (50) to near-black (950), using the brand hue
- Neutral: desaturated version of primary, or warm/cool grays
- Accent: complementary or analogous color to primary
- Semantic colors: must be clearly distinguishable (green/yellow/red/blue)
- Surface + text colors must have proper contrast ratios for readability
- Typography: use Google Fonts names or system font stacks
- Shadow values: CSS box-shadow strings using rgba with appropriate darkness`;

function buildUserPrompt(req: GenerateThemeRequest): string {
  if (req.mode === "prompt" && req.prompt) {
    return `Generate a design system theme for this brand personality: "${req.prompt}". Make it cohesive, beautiful, and professionally crafted.`;
  }
  if (req.mode === "color" && req.seedColor) {
    return `Generate a design system theme where the primary color is ${req.seedColor}. Build a complete, harmonious palette using this seed color as primary-500. Use complementary/analogous colors for accent. Create semantic colors that work well with this palette.`;
  }
  if (req.mode === "both") {
    return `Generate a design system theme for: "${req.prompt || "modern app"}". Use ${req.seedColor || "#6366f1"} as the primary-500 anchor color for the primary scale.`;
  }
  return "Generate a beautiful, modern design system theme with deep blue-indigo primary colors.";
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateThemeRequest = await request.json();

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const anthropicStream = await client.messages.stream({
            model: "claude-sonnet-4-5",
            max_tokens: 4096,
            system: SYSTEM_PROMPT,
            messages: [{ role: "user", content: buildUserPrompt(body) }],
          });

          let fullText = "";

          for await (const chunk of anthropicStream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              fullText += chunk.delta.text;
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: "delta", text: chunk.delta.text })}\n\n`
                )
              );
            }
          }

          // Validate and send final result
          try {
            const jsonStart = fullText.indexOf("{");
            const jsonEnd = fullText.lastIndexOf("}");
            if (jsonStart === -1 || jsonEnd === -1) throw new Error("No JSON found");
            const jsonStr = fullText.slice(jsonStart, jsonEnd + 1);
            const parsed = JSON.parse(jsonStr);
            const validated = themeTokensSchema.parse(parsed);
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "complete", theme: validated })}\n\n`
              )
            );
          } catch (e) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "error", message: e instanceof Error ? e.message : "Validation failed" })}\n\n`
              )
            );
          }

          controller.close();
        } catch (e) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", message: e instanceof Error ? e.message : "Stream error" })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// Separate endpoint for theme naming
export async function PUT(request: NextRequest) {
  try {
    const { theme, prompt } = await request.json();
    const context = prompt
      ? `Brand description: "${prompt}"`
      : `Primary color: ${theme?.color?.primary?.[500] || "#6366f1"}`;

    const msg = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 20,
      messages: [
        {
          role: "user",
          content: `Generate a creative 2-word theme name (adjective + noun, like "Cobalt Dusk" or "Ember Grid") for a design system with this context: ${context}. Return ONLY the two words, nothing else.`,
        },
      ],
    });

    const name = (msg.content[0] as { type: string; text: string }).text
      ?.trim()
      ?.replace(/[^a-zA-Z\s]/g, "")
      ?.trim() || "Custom Theme";

    return Response.json({ name });
  } catch {
    return Response.json({ name: "Custom Theme" });
  }
}
