import OpenAI from "openai";
import { NEWS_VIBES } from "./news-vibes";

export type NewsEventType = "tappa_approved";

export type TappaApprovedContext = {
  nomeTappa: string;
  nomeCompleto: string | null;
  luogo: string;
  data: string;
  organizzatore: string | null;
};

export type NewsEventContext = TappaApprovedContext;

export type GeneratedNews = {
  titolo: string;
  contenuto: string;
  anteprima: string;
};

function getOpenAIClient(): OpenAI | null {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  return new OpenAI({ apiKey: key });
}

function buildTappaApprovedPrompt(ctx: TappaApprovedContext): string {
  const org = ctx.organizzatore ? ` organizzato da ${ctx.organizzatore}` : "";
  return `Scrivi una breve notizia (in italiano) per il sito del Romagna Summer Hoops Tour: è stata confermata una nuova tappa ufficiale del circuito.

Dati della tappa:
- Nome torneo: ${ctx.nomeTappa}
${ctx.nomeCompleto ? `- Nome completo: ${ctx.nomeCompleto}` : ""}
- Luogo: ${ctx.luogo}
- Data: ${ctx.data}${org}

Rispondi SOLO con un JSON valido, senza altro testo prima o dopo, con esattamente queste chiavi (stringhe):
- "titolo": titolo breve e accattivante per la news (max 80 caratteri)
- "anteprima": una frase di anteprima per liste/card (max 120 caratteri)
- "contenuto": 2-4 frasi per il corpo dell'articolo, che annunciano la nuova tappa e invitano a seguirla`;
}

export async function generateNewsFromEvent(
  eventType: NewsEventType,
  context: NewsEventContext
): Promise<GeneratedNews | null> {
  const openai = getOpenAIClient();
  if (!openai) {
    console.warn("OPENAI_API_KEY not set, skipping news generation");
    return null;
  }

  let prompt = "";
  if (eventType === "tappa_approved") {
    prompt = buildTappaApprovedPrompt(context as TappaApprovedContext);
  } else {
    return null;
  }

  const systemContent = `Sei un redattore per il sito del Romagna Summer Hoops Tour. ${NEWS_VIBES}\n\nOutput: restituisci solo un oggetto JSON con le chiavi richieste, niente markdown o spiegazioni.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const raw = completion.choices[0]?.message?.content?.trim();
    if (!raw) return null;

    // Strip possible markdown code block
    const jsonStr = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsed = JSON.parse(jsonStr) as { titolo?: string; contenuto?: string; anteprima?: string };

    const titolo = typeof parsed.titolo === "string" ? parsed.titolo.trim() : "";
    const contenuto = typeof parsed.contenuto === "string" ? parsed.contenuto.trim() : "";
    const anteprima = typeof parsed.anteprima === "string" ? parsed.anteprima.trim() : "";

    if (!titolo || !contenuto || !anteprima) return null;

    return { titolo, contenuto, anteprima };
  } catch (err) {
    console.error("News LLM generation failed:", err);
    return null;
  }
}
