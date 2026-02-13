import { createClient } from "@/lib/supabase/server";
import type { DbTappa, DbSquadra, DbGiocatore, DbRisultato, DbNews, SquadraConPunti, TappaConRisultati } from "@/lib/types";
import { tappe as placeholderTappe, squadre as placeholderSquadre, news as placeholderNews, sistemaPunteggio as placeholderPunteggio, crew as placeholderCrew } from "@/data/placeholder";

// Helper to check if Supabase is configured
function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project")
  );
}

// ============================================
// TAPPE
// ============================================
const VALID_STATI = ["pending", "confermata", "in_corso", "in_attesa_risultati", "conclusa"] as const;
type Stato = (typeof VALID_STATI)[number];

function normalizeStato(raw: unknown): Stato {
  return typeof raw === "string" && VALID_STATI.includes(raw as Stato) ? (raw as Stato) : "pending";
}

function normalizeTappa(row: Record<string, unknown>): DbTappa {
  return {
    id: String(row?.id ?? ""),
    slug: String(row?.slug ?? row?.id ?? ""),
    nome: String(row?.nome ?? ""),
    nome_completo: row?.nome_completo != null ? String(row.nome_completo) : null,
    data: String(row?.data ?? ""),
    orario: String(row?.orario ?? "16:00"),
    luogo: String(row?.luogo ?? ""),
    indirizzo: row?.indirizzo != null ? String(row.indirizzo) : null,
    provincia: row?.provincia != null ? String(row.provincia) : null,
    organizzatore: row?.organizzatore != null ? String(row.organizzatore) : null,
    contatto_organizzatore: row?.contatto_organizzatore != null ? String(row.contatto_organizzatore) : null,
    instagram: row?.instagram != null ? String(row.instagram) : null,
    descrizione: row?.descrizione != null ? String(row.descrizione) : null,
    stato: normalizeStato(row?.stato),
    created_at: row?.created_at != null ? String(row.created_at) : new Date().toISOString(),
  };
}

export async function getTappe(): Promise<DbTappa[]> {
  if (!isSupabaseConfigured()) {
    return placeholderTappe.map((t) => ({
      id: t.id,
      slug: t.id,
      nome: t.nome,
      nome_completo: t.nomeCompleto,
      data: t.data,
      orario: t.orario,
      luogo: t.luogo,
      indirizzo: t.indirizzo,
      provincia: t.provincia,
      organizzatore: t.organizzatore,
      contatto_organizzatore: t.contattoOrganizzatore,
      instagram: t.instagram,
      descrizione: t.descrizione,
      stato: t.stato,
      created_at: new Date().toISOString(),
    }));
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tappe")
      .select("*")
      .order("created_at", { ascending: true });

    if (error || !data) return [];
    const rows = Array.isArray(data) ? data : [];
    return rows.map((row) => normalizeTappa(row as Record<string, unknown>));
  } catch {
    return placeholderTappe.map((t) => ({
      id: t.id,
      slug: t.id,
      nome: t.nome,
      nome_completo: t.nomeCompleto,
      data: t.data,
      orario: t.orario,
      luogo: t.luogo,
      indirizzo: t.indirizzo,
      provincia: t.provincia,
      organizzatore: t.organizzatore,
      contatto_organizzatore: t.contattoOrganizzatore,
      instagram: t.instagram,
      descrizione: t.descrizione,
      stato: t.stato,
      created_at: new Date().toISOString(),
    }));
  }
}

export async function getTappaBySlug(slug: string): Promise<TappaConRisultati | null> {
  if (!isSupabaseConfigured()) {
    const t = placeholderTappe.find((t) => t.id === slug);
    if (!t) return null;
    return {
      id: t.id,
      slug: t.id,
      nome: t.nome,
      nome_completo: t.nomeCompleto,
      data: t.data,
      orario: t.orario,
      luogo: t.luogo,
      indirizzo: t.indirizzo,
      provincia: t.provincia,
      organizzatore: t.organizzatore,
      contatto_organizzatore: t.contattoOrganizzatore,
      instagram: t.instagram,
      descrizione: t.descrizione,
      stato: t.stato,
      created_at: new Date().toISOString(),
      risultati: [],
    };
  }

  try {
    const supabase = await createClient();
    const { data: tappaRow } = await supabase
      .from("tappe")
      .select("*")
      .eq("slug", slug)
      .single();

    if (!tappaRow) return null;

    const tappa = normalizeTappa(tappaRow as Record<string, unknown>);

    const { data: risultati } = await supabase
      .from("risultati")
      .select("*, squadre(nome)")
      .eq("tappa_id", tappa.id)
      .order("posizione", { ascending: true });

    const risList = Array.isArray(risultati) ? risultati : [];

    return {
      ...tappa,
      risultati: risList.map((r: DbRisultato & { squadre?: { nome?: string } }) => ({
        id: r.id,
        tappa_id: r.tappa_id,
        squadra_id: r.squadra_id,
        posizione: r.posizione,
        punti: r.punti,
        created_at: r.created_at,
        squadra_nome: r.squadre?.nome ?? "Sconosciuta",
      })),
    };
  } catch {
    return null;
  }
}

// Bonus costanza: 10 punti per ogni tappa consecutiva (serie) disputata.
// Es: 2 tappe di fila = 10*2 = 20 pt bonus, 3 di fila = 10*3 = 30 pt.
function longestConsecutiveStreak(orderedTappaIds: string[], teamTappaIds: string[]): number {
  if (teamTappaIds.length === 0) return 0;
  const indexOf = (id: string) => orderedTappaIds.indexOf(id);
  const indices = teamTappaIds.map(indexOf).filter((i) => i >= 0);
  if (indices.length === 0) return 0;
  indices.sort((a, b) => a - b);
  let maxRun = 1;
  let currentRun = 1;
  for (let i = 1; i < indices.length; i++) {
    if (indices[i] === indices[i - 1] + 1) {
      currentRun++;
    } else {
      maxRun = Math.max(maxRun, currentRun);
      currentRun = 1;
    }
  }
  return Math.max(maxRun, currentRun);
}

const BONUS_PER_TAPPA_SERIE = 10;

// ============================================
// SQUADRE
// ============================================
export async function getSquadreConPunti(): Promise<SquadraConPunti[]> {
  if (!isSupabaseConfigured()) {
    const orderedTappaIds = placeholderTappe.map((t) => t.id);
    return placeholderSquadre.map((s) => {
      const teamTappaIds = s.risultatiPerTappa.map((r) => r.tappaId);
      const streak = longestConsecutiveStreak(orderedTappaIds, teamTappaIds);
      const puntiBase = s.risultatiPerTappa.reduce((sum, r) => sum + r.punti, 0);
      const bonus = streak * BONUS_PER_TAPPA_SERIE;
      return {
        id: s.id,
        auth_user_id: "",
        nome: s.nome,
        motto: s.motto || null,
        instagram: s.instagram || null,
        email: "",
        telefono: null,
        created_at: new Date().toISOString(),
        giocatori: s.giocatori.map((g) => ({
          id: "",
          squadra_id: s.id,
          nome: g.nome,
          cognome: g.cognome,
          ruolo: g.ruolo || null,
          instagram: g.instagram || null,
          created_at: new Date().toISOString(),
        })),
        punti_totali: puntiBase + bonus,
        tappe_giocate: s.tappeGiocate,
        risultati: [],
      };
    });
  }

  const supabase = await createClient();

  const [squadreRes, risultatiRes, tappeRes] = await Promise.all([
    supabase.from("squadre").select("*, giocatori(*)").order("nome", { ascending: true }),
    supabase.from("risultati").select("*, tappe(slug)"),
    supabase.from("tappe").select("id").order("created_at", { ascending: true }),
  ]);

  const squadre = squadreRes.data;
  if (!squadre) return [];

  const risultati = risultatiRes.data || [];
  const tappeOrdered = tappeRes.data || [];
  const orderedTappaIds = tappeOrdered.map((t: { id: string }) => t.id);

  return squadre.map((s: DbSquadra & { giocatori: DbGiocatore[] }) => {
    const teamResults = risultati.filter((r: DbRisultato) => r.squadra_id === s.id);
    const teamTappaIds = teamResults.map((r: DbRisultato) => r.tappa_id);
    const streak = longestConsecutiveStreak(orderedTappaIds, teamTappaIds);
    const puntiBase = teamResults.reduce((sum: number, r: DbRisultato) => sum + r.punti, 0);
    const bonus = streak * BONUS_PER_TAPPA_SERIE;

    return {
      ...s,
      punti_totali: puntiBase + bonus,
      tappe_giocate: teamResults.length,
      risultati: teamResults.map((r: DbRisultato & { tappe: { slug: string } }) => ({
        ...r,
        tappa_slug: r.tappe?.slug || "",
      })),
    };
  });
}

export async function getSquadraBySlug(slug: string): Promise<SquadraConPunti | null> {
  const squadre = await getSquadreConPunti();
  return squadre.find((s) => s.id === slug || s.nome.toLowerCase().replace(/\s+/g, "-") === slug) || null;
}

// ============================================
// NEWS
// ============================================
export async function getNews(): Promise<DbNews[]> {
  if (!isSupabaseConfigured()) {
    return placeholderNews.map((n) => ({
      id: n.id,
      titolo: n.titolo,
      contenuto: n.contenuto,
      anteprima: n.anteprima,
      data: n.data,
      image_url: null,
      instagram_caption: null,
      created_at: new Date().toISOString(),
    }));
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = data ?? [];
  return rows.map((row: Record<string, unknown>) => ({
    id: String(row.id),
    titolo: String(row.titolo ?? ""),
    contenuto: String(row.contenuto ?? ""),
    anteprima: String(row.anteprima ?? ""),
    data: String(row.data ?? ""),
    image_url: row.image_url != null ? String(row.image_url) : null,
    instagram_caption: row.instagram_caption != null ? String(row.instagram_caption) : null,
    created_at: row.created_at != null ? String(row.created_at) : new Date().toISOString(),
  }));
}

// ============================================
// CLASSIFICA (Rankings)
// ============================================
export async function getClassifica() {
  const squadre = await getSquadreConPunti();
  const tappe = await getTappe();

  const lastTappaId = tappe.length > 0 ? tappe[tappe.length - 1].id : null;
  const classificaOrdinata = [...squadre].sort((a, b) => {
    if (b.punti_totali !== a.punti_totali) return b.punti_totali - a.punti_totali;
    if (b.tappe_giocate !== a.tappe_giocate) return b.tappe_giocate - a.tappe_giocate;
    const avgPos = (s: SquadraConPunti) =>
      s.risultati?.length ? s.risultati.reduce((s, r) => s + (r.posizione ?? 0), 0) / s.risultati.length : 999;
    if (avgPos(a) !== avgPos(b)) return avgPos(a) - avgPos(b);
    const lastPos = (s: SquadraConPunti) =>
      lastTappaId && s.risultati ? (s.risultati.find((r) => r.tappa_id === lastTappaId)?.posizione ?? 999) : 999;
    return lastPos(a) - lastPos(b);
  });

  // Main table: only teams with at least 2 tappe (qualification rule)
  const squadreQualificate = classificaOrdinata.filter((s) => s.tappe_giocate >= 2);
  const squadreConUnaTappa = classificaOrdinata.filter((s) => s.tappe_giocate === 1);
  const squadreSenzaRisultati = classificaOrdinata.filter((s) => s.tappe_giocate === 0);

  return {
    squadre: squadreQualificate,
    squadreConUnaTappa,
    squadreSenzaRisultati,
    tappe,
  };
}

// Re-export static data that doesn't need Supabase
export { placeholderPunteggio as sistemaPunteggio, placeholderCrew as crew };
