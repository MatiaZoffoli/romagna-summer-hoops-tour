"use server";

import { createServiceRoleClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendEmail, notifyOrganizerApproved, notifyOrganizerRejected, sendWelcomeToTeam, notifyTeamRejected, notifyTeamChangeRequestApproved, notifyTeamChangeRequestRejected } from "@/lib/email";
import { generateNewsFromEvent } from "@/lib/news-llm";

// Simple password check - uses env var
function verifyAdmin(password: string): boolean {
  const adminPwd = process.env.ADMIN_PASSWORD;
  if (!adminPwd) return false;
  return password === adminPwd;
}

export async function addTappaResult(formData: FormData) {
  const password = formData.get("adminPassword") as string;
  if (!verifyAdmin(password)) {
    return { error: "Password admin non valida." };
  }

  const supabase = createServiceRoleClient();
  const tappaId = formData.get("tappaId") as string;
  const squadraId = formData.get("squadraId") as string;
  const posizione = parseInt(formData.get("posizione") as string);
  const punti = parseInt(formData.get("punti") as string);

  if (!tappaId || !squadraId || isNaN(posizione) || isNaN(punti)) {
    return { error: "Tutti i campi sono obbligatori." };
  }

  const { error } = await supabase.from("risultati").upsert(
    {
      tappa_id: tappaId,
      squadra_id: squadraId,
      posizione,
      punti,
    },
    { onConflict: "tappa_id,squadra_id" }
  );

  if (error) {
    return { error: "Errore: " + error.message };
  }

  // Auto-set tappa to "conclusa" when results are added
  await supabase.from("tappe").update({ stato: "conclusa" }).eq("id", tappaId);

  revalidatePath("/classifica");
  revalidatePath("/tappe");
  revalidatePath("/squadre");
  revalidatePath("/");
  return { success: true };
}

export async function updateTappaStatus(formData: FormData) {
  const password = formData.get("adminPassword") as string;
  if (!verifyAdmin(password)) {
    return { error: "Password admin non valida." };
  }

  const supabase = createServiceRoleClient();
  const tappaId = formData.get("tappaId") as string;
  const stato = formData.get("stato") as string;

  const { error } = await supabase
    .from("tappe")
    .update({ stato })
    .eq("id", tappaId);

  if (error) {
    return { error: "Errore: " + error.message };
  }

  revalidatePath("/tappe");
  revalidatePath("/");
  return { success: true };
}

export async function addNews(formData: FormData) {
  const password = formData.get("adminPassword") as string;
  if (!verifyAdmin(password)) {
    return { error: "Password admin non valida." };
  }

  const supabase = createServiceRoleClient();
  const titolo = formData.get("titolo") as string;
  const contenuto = formData.get("contenuto") as string;
  const anteprima = formData.get("anteprima") as string;
  const imageUrl = (formData.get("image_url") as string)?.trim() || null;
  const instagramCaption = (formData.get("instagram_caption") as string)?.trim() || null;

  if (!titolo || !contenuto || !anteprima) {
    return { error: "Tutti i campi sono obbligatori." };
  }

  const now = new Date();
  const data = now.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const { error } = await supabase.from("news").insert({
    titolo,
    contenuto,
    anteprima,
    data,
    image_url: imageUrl,
    instagram_caption: instagramCaption,
  });

  if (error) {
    return { error: "Errore: " + error.message };
  }

  revalidatePath("/news");
  revalidatePath("/");
  return { success: true };
}

export async function addTappa(formData: FormData) {
  const password = formData.get("adminPassword") as string;
  if (!verifyAdmin(password)) {
    return { error: "Password admin non valida." };
  }

  const supabase = createServiceRoleClient();
  const nome = formData.get("nome") as string;
  const nomeCompleto = formData.get("nomeCompleto") as string;
  const data = formData.get("data") as string;
  const orario = formData.get("orario") as string;
  const luogo = formData.get("luogo") as string;
  const indirizzo = formData.get("indirizzo") as string;
  const provincia = formData.get("provincia") as string;
  const organizzatore = formData.get("organizzatore") as string;
  const contattoOrganizzatore = formData.get("contattoOrganizzatore") as string;
  const instagram = formData.get("instagram") as string;
  const descrizione = formData.get("descrizione") as string;
  const stato = formData.get("stato") as string;

  if (!nome || !data || !luogo) {
    return { error: "Nome, data e luogo sono obbligatori." };
  }

  const slug = nome.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const { error } = await supabase.from("tappe").insert({
    slug,
    nome,
    nome_completo: nomeCompleto || null,
    data,
    orario: orario || "16:00",
    luogo,
    indirizzo: indirizzo || null,
    provincia: provincia || null,
    organizzatore: organizzatore || null,
    contatto_organizzatore: contattoOrganizzatore || null,
    instagram: instagram || null,
    descrizione: descrizione || null,
    stato: stato || "confermata",
  });

  if (error) {
    return { error: "Errore: " + error.message };
  }

  revalidatePath("/tappe");
  revalidatePath("/");
  return { success: true };
}

/** Send a test email to the admin address to verify SES is working. */
export async function sendTestEmail(password: string) {
  if (!verifyAdmin(password)) {
    return { error: "Password admin non valida." };
  }
  const result = await sendEmail({
    to: "matiazoffoli@gmail.com",
    subject: "RSHT – Test email SES",
    html: "<p>Questa email conferma che l'invio tramite Amazon SES funziona correttamente.</p><p>Romagna Summer Hoops Tour</p>",
  });
  if (result.success) return { success: true };
  return { error: result.error instanceof Error ? result.error.message : "Errore invio email." };
}

// Fetch data for admin page
export async function getAdminData(password: string) {
  if (!verifyAdmin(password)) {
    return null;
  }

  const supabase = createServiceRoleClient();

  const [tappeRes, squadreRes, risultatiRes, newsRes, applicationsRes, teamApplicationsRes, teamChangeRequestsRes] = await Promise.all([
    supabase.from("tappe").select("*").order("created_at"),
    supabase.from("squadre").select("*, giocatori(*)").order("nome"),
    supabase.from("risultati").select("*, tappe(nome), squadre(nome)").order("created_at", { ascending: false }),
    supabase.from("news").select("*").order("created_at", { ascending: false }),
    supabase.from("tappa_applications").select("*").order("created_at", { ascending: false }),
    Promise.resolve(supabase.from("team_applications").select("*").order("created_at", { ascending: false })).catch(() => ({ data: [] })),
    Promise.resolve(supabase.from("team_change_requests").select("*").order("created_at", { ascending: false })).catch(() => ({ data: [] })),
  ]);

  return {
    tappe: tappeRes.data || [],
    squadre: squadreRes.data || [],
    risultati: risultatiRes.data || [],
    news: newsRes.data || [],
    applications: applicationsRes.data || [],
    teamApplications: (teamApplicationsRes as { data?: unknown[] }).data || [],
    teamChangeRequests: (teamChangeRequestsRes as { data?: unknown[] }).data || [],
  };
}

export async function approveTappaApplication(formData: FormData) {
  const password = formData.get("adminPassword") as string;
  if (!verifyAdmin(password)) {
    return { error: "Password admin non valida." };
  }

  const supabase = createServiceRoleClient();
  const applicationId = formData.get("applicationId") as string;

  // Get the application
  const { data: application, error: fetchError } = await supabase
    .from("tappa_applications")
    .select("*")
    .eq("id", applicationId)
    .single();

  if (fetchError || !application) {
    return { error: "Applicazione non trovata." };
  }

  if (application.stato !== "pending") {
    return { error: "Questa applicazione è già stata processata." };
  }

  // Allow editing - use form data if provided, otherwise use application data
  const nome = (formData.get("nome") as string) || application.nome_torneo;
  const nomeCompleto = (formData.get("nomeCompleto") as string) || application.nome_completo_torneo || null;
  const data = (formData.get("data") as string) || application.data_proposta;
  const orario = (formData.get("orario") as string) || application.orario_proposto || "16:00";
  const luogo = (formData.get("luogo") as string) || application.luogo;
  const indirizzo = (formData.get("indirizzo") as string) || application.indirizzo || null;
  const provincia = (formData.get("provincia") as string) || application.provincia || null;
  const organizzatore = (formData.get("organizzatore") as string) || application.nome_organizzatore;
  const contattoOrganizzatore = (formData.get("contattoOrganizzatore") as string) || application.email_organizzatore;
  const instagram = (formData.get("instagram") as string) || application.instagram_torneo || null;
  const descrizione = (formData.get("descrizione") as string) || application.descrizione || null;
  const stato = (formData.get("stato") as string) || "confermata";

  // Create slug from nome
  const slug = nome.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  // Create the tappa
  const { error: tappaError } = await supabase.from("tappe").insert({
    slug,
    nome,
    nome_completo: nomeCompleto,
    data,
    orario,
    luogo,
    indirizzo,
    provincia,
    organizzatore,
    contatto_organizzatore: contattoOrganizzatore,
    instagram,
    descrizione,
    stato,
  });

  if (tappaError) {
    return { error: "Errore nella creazione della tappa: " + tappaError.message };
  }

  // Update application status
  const { error: updateError } = await supabase
    .from("tappa_applications")
    .update({
      stato: "approved",
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", applicationId);

  if (updateError) {
    return { error: "Errore nell'aggiornamento: " + updateError.message };
  }

  // Send email notification to organizer (don't fail if email fails)
  try {
    await notifyOrganizerApproved({
      email_organizzatore: application.email_organizzatore,
      nome_organizzatore: application.nome_organizzatore,
      nome_torneo: application.nome_torneo,
    });
  } catch (emailError) {
    console.error("Failed to send approval email:", emailError);
    // Don't fail the approval if email fails
  }

  // Auto-generate a news article for the new tappa (non-blocking)
  try {
    const generated = await generateNewsFromEvent("tappa_approved", {
      nomeTappa: nome,
      nomeCompleto: nomeCompleto ?? null,
      luogo,
      data,
      organizzatore: organizzatore || null,
    });
    if (generated) {
      const dataNews = new Date().toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      await supabase.from("news").insert({
        titolo: generated.titolo,
        contenuto: generated.contenuto,
        anteprima: generated.anteprima,
        data: dataNews,
        image_url: null,
        instagram_caption: null,
      });
      revalidatePath("/news");
      revalidatePath("/");
    }
  } catch (newsError) {
    console.error("Failed to generate or insert auto-news for tappa:", newsError);
  }

  revalidatePath("/admin");
  revalidatePath("/tappe");
  revalidatePath("/");
  return { success: true };
}

export async function rejectTappaApplication(formData: FormData) {
  const password = formData.get("adminPassword") as string;
  if (!verifyAdmin(password)) {
    return { error: "Password admin non valida." };
  }

  const supabase = createServiceRoleClient();
  const applicationId = formData.get("applicationId") as string;
  const reason = formData.get("reason") as string;

  // Get application data for email
  const { data: application } = await supabase
    .from("tappa_applications")
    .select("*")
    .eq("id", applicationId)
    .single();

  const { error } = await supabase
    .from("tappa_applications")
    .update({
      stato: "rejected",
      reviewed_at: new Date().toISOString(),
      reviewed_by: reason || null,
    })
    .eq("id", applicationId);

  if (error) {
    return { error: "Errore: " + error.message };
  }

  // Send email notification to organizer (don't fail if email fails)
  if (application) {
    try {
      await notifyOrganizerRejected({
        email_organizzatore: application.email_organizzatore,
        nome_organizzatore: application.nome_organizzatore,
        nome_torneo: application.nome_torneo,
        reason: reason || null,
      });
    } catch (emailError) {
      console.error("Failed to send rejection email:", emailError);
      // Don't fail the rejection if email fails
    }
  }

  revalidatePath("/admin");
  return { success: true };
}

// ============================================
// TEAM APPLICATIONS (approve / reject)
// ============================================

export async function approveTeamApplication(formData: FormData) {
  const password = formData.get("adminPassword") as string;
  if (!verifyAdmin(password)) {
    return { error: "Password admin non valida." };
  }

  const supabase = createServiceRoleClient();
  const applicationId = formData.get("applicationId") as string;

  const { data: application, error: fetchError } = await supabase
    .from("team_applications")
    .select("*")
    .eq("id", applicationId)
    .single();

  if (fetchError || !application) {
    return { error: "Richiesta non trovata." };
  }

  if (application.stato !== "pending") {
    return { error: "Questa richiesta è già stata processata." };
  }

  const pwd = application.password_plain;
  if (!pwd || pwd.length < 8) {
    return { error: "Password non disponibile o non valida per questa richiesta." };
  }

  // Editable fields from form (or keep from application)
  const nomeSquadra = (formData.get("nome_squadra") as string)?.trim() || application.nome_squadra;
  const motto = (formData.get("motto") as string)?.trim() || application.motto || null;
  const instagram = (formData.get("instagram") as string)?.trim() || application.instagram || null;
  const telefono = (formData.get("telefono") as string)?.trim() || application.telefono || null;
  const email = (formData.get("email") as string)?.trim() || application.email;
  const giocatoriRaw = formData.get("giocatori");
  let giocatori: { nome: string; cognome: string; ruolo?: string; instagram?: string }[];
  try {
    giocatori = giocatoriRaw
      ? (JSON.parse(giocatoriRaw as string) as { nome: string; cognome: string; ruolo?: string; instagram?: string }[])
      : (application.giocatori as { nome: string; cognome: string; ruolo?: string; instagram?: string }[]) || [];
  } catch {
    return { error: "JSON giocatori non valido. Controlla la formattazione." };
  }

  const validGiocatori = Array.isArray(giocatori)
    ? giocatori.filter((g) => g.nome?.trim() && g.cognome?.trim())
    : [];

  const linkToSquadraId = (formData.get("link_to_squadra_id") as string)?.trim() || null;

  // 1. Create auth user (service role has auth.admin)
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password: pwd,
    email_confirm: true,
  });

  if (authError) {
    if (authError.message.includes("already been registered") || authError.message.includes("already exists")) {
      return { error: "Questa email è già registrata. Usa un'altra email o rifiuta la richiesta." };
    }
    return { error: "Errore creazione account: " + authError.message };
  }

  if (!authData.user) {
    return { error: "Errore nella creazione dell'account." };
  }

  let squadra: { id: string };

  if (linkToSquadraId) {
    // Claim flow: link new user to existing unclaimed squadra
    const { data: existing, error: fetchSq } = await supabase
      .from("squadre")
      .select("id, auth_user_id")
      .eq("id", linkToSquadraId)
      .single();

    if (fetchSq || !existing) {
      return { error: "Squadra da collegare non trovata." };
    }
    if (existing.auth_user_id) {
      return { error: "Questa squadra è già collegata a un account. Scegli 'Crea nuova squadra' o un'altra squadra." };
    }

    const { error: updateError } = await supabase
      .from("squadre")
      .update({
        auth_user_id: authData.user.id,
        email: email,
        nome: nomeSquadra,
        motto: motto ?? null,
        instagram: instagram ?? null,
        telefono: telefono ?? null,
      })
      .eq("id", linkToSquadraId);

    if (updateError) {
      return { error: "Errore nel collegamento alla squadra: " + updateError.message };
    }
    squadra = { id: linkToSquadraId };

    // Replace giocatori for claimed squadra with application data
    await supabase.from("giocatori").delete().eq("squadra_id", linkToSquadraId);
    if (validGiocatori.length > 0) {
      const giocatoriData = validGiocatori.map((g) => ({
        squadra_id: linkToSquadraId,
        nome: String(g.nome).trim(),
        cognome: String(g.cognome).trim(),
        ruolo: g.ruolo?.trim() || null,
        instagram: g.instagram?.trim() || null,
      }));
      await supabase.from("giocatori").insert(giocatoriData);
    }
  } else {
    // 2. Create new squadra
    const { data: newSquadra, error: squadraError } = await supabase
      .from("squadre")
      .insert({
        auth_user_id: authData.user.id,
        nome: nomeSquadra,
        motto,
        instagram,
        email,
        telefono,
      })
      .select()
      .single();

    if (squadraError) {
      return { error: "Errore nella creazione della squadra: " + squadraError.message };
    }
    squadra = newSquadra;

    // 3. Create giocatori
    if (validGiocatori.length > 0) {
      const giocatoriData = validGiocatori.map((g) => ({
        squadra_id: squadra.id,
        nome: String(g.nome).trim(),
        cognome: String(g.cognome).trim(),
        ruolo: g.ruolo?.trim() || null,
        instagram: g.instagram?.trim() || null,
      }));
      const { error: giocError } = await supabase.from("giocatori").insert(giocatoriData);
      if (giocError) {
        return { error: "Errore nell'inserimento dei giocatori: " + giocError.message };
      }
    }
  }

  // 4. Update application (clear password, set approved)
  await supabase
    .from("team_applications")
    .update({
      stato: "approved",
      reviewed_at: new Date().toISOString(),
      password_plain: null,
    })
    .eq("id", applicationId);

  try {
    await sendWelcomeToTeam({ nome: nomeSquadra, email });
  } catch (e) {
    console.error("Welcome email error:", e);
  }

  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

export async function rejectTeamApplication(formData: FormData) {
  const password = formData.get("adminPassword") as string;
  if (!verifyAdmin(password)) {
    return { error: "Password admin non valida." };
  }

  const supabase = createServiceRoleClient();
  const applicationId = formData.get("applicationId") as string;
  const reason = (formData.get("reason") as string)?.trim() || null;

  const { data: application } = await supabase
    .from("team_applications")
    .select("*")
    .eq("id", applicationId)
    .single();

  const { error } = await supabase
    .from("team_applications")
    .update({
      stato: "rejected",
      reviewed_at: new Date().toISOString(),
      reviewed_by: reason,
      password_plain: null,
    })
    .eq("id", applicationId);

  if (error) {
    return { error: "Errore: " + error.message };
  }

  if (application) {
    try {
      await notifyTeamRejected({
        email: application.email,
        nome_squadra: application.nome_squadra,
        reason,
      });
    } catch (e) {
      console.error("Rejection email error:", e);
    }
  }

  revalidatePath("/admin");
  return { success: true };
}

// ============================================
// GESTIONE SQUADRE (admin create / update)
// ============================================

export async function createSquadraAdmin(formData: FormData) {
  const password = formData.get("adminPassword") as string;
  if (!verifyAdmin(password)) {
    return { error: "Password admin non valida." };
  }

  const supabase = createServiceRoleClient();
  const nome = (formData.get("nome") as string)?.trim();
  if (!nome) return { error: "Nome squadra obbligatorio." };

  const email = (formData.get("email") as string)?.trim() || null;
  const telefono = (formData.get("telefono") as string)?.trim() || null;
  const instagram = (formData.get("instagram") as string)?.trim() || null;
  const motto = (formData.get("motto") as string)?.trim() || null;
  const adminNotes = (formData.get("admin_notes") as string)?.trim() || null;
  const giocatoriJson = formData.get("giocatori") as string;

  const { data: squadra, error: squadraError } = await supabase
    .from("squadre")
    .insert({
      auth_user_id: null,
      nome,
      email,
      telefono,
      instagram,
      motto,
      admin_notes: adminNotes,
    })
    .select()
    .single();

  if (squadraError) {
    return { error: "Errore creazione squadra: " + squadraError.message };
  }

  if (giocatoriJson) {
    let giocatori: { nome: string; cognome: string; ruolo?: string; instagram?: string }[] = [];
    try {
      giocatori = JSON.parse(giocatoriJson);
    } catch {
      // optional
    }
    const valid = giocatori.filter((g) => g.nome?.trim() && g.cognome?.trim());
    if (valid.length > 0) {
      const rows = valid.map((g) => ({
        squadra_id: squadra.id,
        nome: String(g.nome).trim(),
        cognome: String(g.cognome).trim(),
        ruolo: g.ruolo?.trim() || null,
        instagram: g.instagram?.trim() || null,
      }));
      await supabase.from("giocatori").insert(rows);
    }
  }

  revalidatePath("/admin");
  revalidatePath("/classifica");
  revalidatePath("/squadre");
  revalidatePath("/");
  return { success: true };
}

export async function updateSquadraAdmin(formData: FormData) {
  const password = formData.get("adminPassword") as string;
  if (!verifyAdmin(password)) {
    return { error: "Password admin non valida." };
  }

  const supabase = createServiceRoleClient();
  const squadraId = formData.get("squadraId") as string;
  if (!squadraId) return { error: "Squadra non specificata." };

  const nome = (formData.get("nome") as string)?.trim();
  if (!nome) return { error: "Nome squadra obbligatorio." };

  const email = (formData.get("email") as string)?.trim() || null;
  const telefono = (formData.get("telefono") as string)?.trim() || null;
  const instagram = (formData.get("instagram") as string)?.trim() || null;
  const motto = (formData.get("motto") as string)?.trim() || null;
  const adminNotes = (formData.get("admin_notes") as string)?.trim() || null;
  const giocatoriJson = formData.get("giocatori") as string;

  const { error: updateError } = await supabase
    .from("squadre")
    .update({
      nome,
      email,
      telefono,
      instagram,
      motto,
      admin_notes: adminNotes,
    })
    .eq("id", squadraId);

  if (updateError) {
    return { error: "Errore aggiornamento: " + updateError.message };
  }

  if (giocatoriJson !== undefined && giocatoriJson !== null) {
    let giocatori: { nome: string; cognome: string; ruolo?: string; instagram?: string }[] = [];
    try {
      giocatori = JSON.parse(giocatoriJson);
    } catch {
      return { error: "JSON giocatori non valido." };
    }
    await supabase.from("giocatori").delete().eq("squadra_id", squadraId);
    const valid = giocatori.filter((g) => g.nome?.trim() && g.cognome?.trim());
    if (valid.length > 0) {
      const rows = valid.map((g) => ({
        squadra_id: squadraId,
        nome: String(g.nome).trim(),
        cognome: String(g.cognome).trim(),
        ruolo: g.ruolo?.trim() || null,
        instagram: g.instagram?.trim() || null,
      }));
      const { error: giocError } = await supabase.from("giocatori").insert(rows);
      if (giocError) return { error: "Errore giocatori: " + giocError.message };
    }
  }

  revalidatePath("/admin");
  revalidatePath("/classifica");
  revalidatePath("/squadre");
  revalidatePath("/");
  return { success: true };
}

export async function deleteRisultatoAdmin(formData: FormData) {
  const password = formData.get("adminPassword") as string;
  if (!verifyAdmin(password)) {
    return { error: "Password admin non valida." };
  }
  const supabase = createServiceRoleClient();
  const risultatoId = formData.get("risultatoId") as string;
  if (!risultatoId) return { error: "Risultato non specificato." };
  const { error } = await supabase.from("risultati").delete().eq("id", risultatoId);
  if (error) return { error: "Errore: " + error.message };
  revalidatePath("/admin");
  revalidatePath("/classifica");
  revalidatePath("/");
  return { success: true };
}

// ============================================
// TEAM CHANGE REQUESTS (approve / reject)
// ============================================

export async function approveTeamChangeRequest(formData: FormData) {
  const password = formData.get("adminPassword") as string;
  if (!verifyAdmin(password)) {
    return { error: "Password admin non valida." };
  }

  const supabase = createServiceRoleClient();
  const requestId = formData.get("requestId") as string;
  if (!requestId) return { error: "Richiesta non specificata." };

  const { data: req, error: fetchErr } = await supabase
    .from("team_change_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (fetchErr || !req || req.stato !== "pending") {
    return { error: "Richiesta non trovata o già processata." };
  }

  const payload = (formData.get("payload") as string)
    ? JSON.parse(formData.get("payload") as string)
    : (req.payload as { nome?: string; motto?: string; instagram?: string; telefono?: string; giocatori?: { nome: string; cognome: string; ruolo?: string; instagram?: string }[] });

  const nome = payload.nome ?? req.payload?.nome;
  if (!nome) return { error: "Nome squadra obbligatorio." };

  const { error: updateErr } = await supabase
    .from("squadre")
    .update({
      nome,
      motto: payload.motto ?? null,
      instagram: payload.instagram ?? null,
      telefono: payload.telefono ?? null,
    })
    .eq("id", req.squadra_id);

  if (updateErr) return { error: "Errore aggiornamento squadra: " + updateErr.message };

  const giocatori = Array.isArray(payload.giocatori) ? payload.giocatori : [];
  const valid = giocatori.filter((g: { nome?: string; cognome?: string }) => g.nome?.trim() && g.cognome?.trim());
  await supabase.from("giocatori").delete().eq("squadra_id", req.squadra_id);
  if (valid.length > 0) {
    const rows = valid.map((g: { nome: string; cognome: string; ruolo?: string; instagram?: string }) => ({
      squadra_id: req.squadra_id,
      nome: String(g.nome).trim(),
      cognome: String(g.cognome).trim(),
      ruolo: g.ruolo?.trim() || null,
      instagram: g.instagram?.trim() || null,
    }));
    await supabase.from("giocatori").insert(rows);
  }

  await supabase
    .from("team_change_requests")
    .update({ stato: "approved", reviewed_at: new Date().toISOString() })
    .eq("id", requestId);

  const { data: squadraRow } = await supabase.from("squadre").select("nome, email").eq("id", req.squadra_id).single();
  if (squadraRow?.email) {
    try {
      await notifyTeamChangeRequestApproved({ squadra_nome: squadraRow.nome ?? nome, email: squadraRow.email });
    } catch (e) {
      console.error("Change request approved email error:", e);
    }
  }

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath("/squadre");
  revalidatePath("/");
  return { success: true };
}

export async function rejectTeamChangeRequest(formData: FormData) {
  const password = formData.get("adminPassword") as string;
  if (!verifyAdmin(password)) {
    return { error: "Password admin non valida." };
  }

  const supabase = createServiceRoleClient();
  const requestId = formData.get("requestId") as string;
  const adminNotes = (formData.get("admin_notes") as string)?.trim() || null;

  const { data: req } = await supabase.from("team_change_requests").select("squadra_id").eq("id", requestId).single();
  const { data: squadraRow } = req ? await supabase.from("squadre").select("nome, email").eq("id", req.squadra_id).single() : { data: null };

  const { error } = await supabase
    .from("team_change_requests")
    .update({ stato: "rejected", reviewed_at: new Date().toISOString(), admin_notes: adminNotes })
    .eq("id", requestId);

  if (error) return { error: "Errore: " + error.message };

  if (squadraRow?.email) {
    try {
      await notifyTeamChangeRequestRejected({ squadra_nome: squadraRow.nome ?? "Squadra", email: squadraRow.email, admin_notes: adminNotes });
    } catch (e) {
      console.error("Change request rejected email error:", e);
    }
  }

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: true };
}
