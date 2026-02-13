// ============================================
// Database types matching Supabase schema
// ============================================

export interface DbSquadra {
  id: string;
  auth_user_id: string | null;
  nome: string;
  motto: string | null;
  instagram: string | null;
  email: string | null;
  telefono: string | null;
  admin_notes: string | null;
  created_at: string;
}

export interface DbTeamChangeRequest {
  id: string;
  squadra_id: string;
  requested_by: string | null;
  payload: Record<string, unknown>;
  stato: "pending" | "approved" | "rejected";
  created_at: string;
  reviewed_at: string | null;
  admin_notes: string | null;
}

export interface DbGiocatore {
  id: string;
  squadra_id: string;
  nome: string;
  cognome: string;
  ruolo: string | null;
  instagram: string | null;
  created_at: string;
}

export interface DbTappa {
  id: string;
  slug: string;
  nome: string;
  nome_completo: string | null;
  data: string;
  orario: string;
  luogo: string;
  indirizzo: string | null;
  provincia: string | null;
  organizzatore: string | null;
  contatto_organizzatore: string | null;
  instagram: string | null;
  descrizione: string | null;
  stato: "pending" | "confermata" | "in_corso" | "in_attesa_risultati" | "conclusa";
  created_at: string;
}

export interface DbRisultato {
  id: string;
  tappa_id: string;
  squadra_id: string;
  posizione: number;
  punti: number;
  created_at: string;
}

export interface DbNews {
  id: string;
  titolo: string;
  contenuto: string;
  anteprima: string;
  data: string;
  image_url: string | null;
  instagram_caption: string | null;
  created_at: string;
}

// ============================================
// Frontend types (enriched for display)
// ============================================

export interface SquadraConPunti extends DbSquadra {
  giocatori: DbGiocatore[];
  punti_totali: number;
  tappe_giocate: number;
  risultati: (DbRisultato & { tappa_slug: string })[];
}

export interface TappaConRisultati extends DbTappa {
  risultati: (DbRisultato & { squadra_nome: string })[];
}
