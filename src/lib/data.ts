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

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tappe")
    .select("*")
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data;
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

  const supabase = await createClient();
  const { data: tappa } = await supabase
    .from("tappe")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!tappa) return null;

  const { data: risultati } = await supabase
    .from("risultati")
    .select("*, squadre(nome)")
    .eq("tappa_id", tappa.id)
    .order("posizione", { ascending: true });

  return {
    ...tappa,
    risultati: (risultati || []).map((r: DbRisultato & { squadre: { nome: string } }) => ({
      ...r,
      squadra_nome: r.squadre?.nome || "Sconosciuta",
    })),
  };
}

// ============================================
// SQUADRE
// ============================================
export async function getSquadreConPunti(): Promise<SquadraConPunti[]> {
  if (!isSupabaseConfigured()) {
    return placeholderSquadre.map((s) => ({
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
      punti_totali: s.puntiTotali,
      tappe_giocate: s.tappeGiocate,
      risultati: [],
    }));
  }

  const supabase = await createClient();

  const { data: squadre } = await supabase
    .from("squadre")
    .select("*, giocatori(*)")
    .order("nome", { ascending: true });

  if (!squadre) return [];

  const { data: risultati } = await supabase
    .from("risultati")
    .select("*, tappe(slug)");

  const BONUS_COSTANZA = 5;

  return squadre.map((s: DbSquadra & { giocatori: DbGiocatore[] }) => {
    const teamResults = (risultati || []).filter(
      (r: DbRisultato) => r.squadra_id === s.id
    );
    const tappeGiocate = teamResults.length;
    const puntiBase = teamResults.reduce((sum: number, r: DbRisultato) => sum + r.punti, 0);
    const bonus = tappeGiocate > 1 ? (tappeGiocate - 1) * BONUS_COSTANZA : 0;

    return {
      ...s,
      punti_totali: puntiBase + bonus,
      tappe_giocate: tappeGiocate,
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
      created_at: new Date().toISOString(),
    }));
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  return data || [];
}

// ============================================
// CLASSIFICA (Rankings)
// ============================================
export async function getClassifica() {
  const squadre = await getSquadreConPunti();
  const tappe = await getTappe();

  const classificaOrdinata = [...squadre].sort(
    (a, b) => b.punti_totali - a.punti_totali
  );

  return { squadre: classificaOrdinata, tappe };
}

// Re-export static data that doesn't need Supabase
export { placeholderPunteggio as sistemaPunteggio, placeholderCrew as crew };
