"use server";

import { createServiceRoleClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendEmail, notifyOrganizerApproved, notifyOrganizerRejected } from "@/lib/email";
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

  const [tappeRes, squadreRes, risultatiRes, newsRes, applicationsRes] = await Promise.all([
    supabase.from("tappe").select("*").order("created_at"),
    supabase.from("squadre").select("*").order("nome"),
    supabase.from("risultati").select("*, tappe(nome), squadre(nome)").order("created_at", { ascending: false }),
    supabase.from("news").select("*").order("created_at", { ascending: false }),
    supabase.from("tappa_applications").select("*").order("created_at", { ascending: false }),
  ]);

  return {
    tappe: tappeRes.data || [],
    squadre: squadreRes.data || [],
    risultati: risultatiRes.data || [],
    news: newsRes.data || [],
    applications: applicationsRes.data || [],
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
