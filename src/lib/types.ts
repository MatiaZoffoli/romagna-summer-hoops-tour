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
  logo_url: string | null;
  avatar_icon: string | null;
  avatar_color: string | null;
  generated_logo_url: string | null;
  logo_generated_at: string | null;
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
  lat: number | null;
  lng: number | null;
  logo_url: string | null;
  created_at: string;
}

export interface DbRisultato {
  id: string;
  tappa_id: string;
  squadra_id: string;
  posizione: number;
  punti: number;
  partite_giocate?: number | null;
  partite_vinte?: number | null;
  punti_fatti?: number | null;
  punti_subiti?: number | null;
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

export interface DbMvp {
  id: string;
  tappa_id: string;
  nome: string;
  cognome: string;
  photo_url: string | null;
  bio: string | null;
  carriera: string | null;
  stats: Record<string, unknown>;
  ordine: number;
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
  /** Number of tappe for which the team received the +5 social bonus */
  bonus_social_count?: number;
  /** Aggregated match stats (when available) */
  partite_giocate?: number;
  partite_vinte?: number;
  punti_fatti?: number;
  punti_subiti?: number;
}

export interface TappaConRisultati extends DbTappa {
  risultati: (DbRisultato & { squadra_nome: string })[];
}
