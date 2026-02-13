import OpenAI from "openai";

const NO_WORDING_RULES =
  "Absolutely no text, letters, numbers, words, or typography of any kind. Only shapes, symbols, and abstract or geometric art.";
const MINIMAL_BORDER =
  "Minimal or no border; no thick frames. The image is the logo itself, not a logo inside a heavy frame.";

const STYLE_OPTIONS = [
  "minimalist",
  "geometric",
  "fluid",
  "bold",
  "retro-futuristic",
  "organic",
  "sharp",
  "soft gradient",
  "monochrome accent",
  "duotone",
];

const COMPOSITION_OPTIONS = [
  "centered symbol",
  "radial composition",
  "asymmetric layout",
  "layered shapes",
  "single focal element",
];

const THEME_OPTIONS = [
  "motion",
  "unity",
  "strength",
  "precision",
  "energy",
  "hoop",
  "ball",
  "abstract shape",
];

const COLOR_OPTIONS = [
  "orange and blue",
  "warm tones",
  "cool tones",
  "high contrast",
  "muted palette",
];

const TECHNIQUE_OPTIONS = [
  "flat design",
  "subtle gradient",
  "line art",
  "silhouette",
];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export type TeamLogoContext = {
  nome: string;
  motto?: string | null;
};

function buildLogoPrompt(ctx: TeamLogoContext): string {
  const style = pick(STYLE_OPTIONS);
  const composition = pick(COMPOSITION_OPTIONS);
  const theme = pick(THEME_OPTIONS);
  const color = pick(COLOR_OPTIONS);
  const technique = pick(TECHNIQUE_OPTIONS);

  const teamPart = `Inspired by a basketball 3x3 team (name: ${ctx.nome}).${ctx.motto ? ` Vibe: ${ctx.motto}.` : ""}`;
  const artPart = `Square logo/badge: ${style}, ${composition}, ${theme}. ${technique}. ${color}. Authentic, beautiful, abstract or geometric or futuristic.`;
  return `${NO_WORDING_RULES} ${MINIMAL_BORDER} ${teamPart} ${artPart}`;
}

function getOpenAIClient(): OpenAI | null {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  return new OpenAI({ apiKey: key });
}

export async function generateTeamLogoImage(ctx: TeamLogoContext): Promise<Buffer | null> {
  const openai = getOpenAIClient();
  if (!openai) return null;

  const prompt = buildLogoPrompt(ctx);

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
      style: "vivid",
    });

    const b64 = response.data?.[0]?.b64_json;
    if (!b64) return null;
    return Buffer.from(b64, "base64");
  } catch (e) {
    console.error("DALL-E team logo error:", e);
    return null;
  }
}
