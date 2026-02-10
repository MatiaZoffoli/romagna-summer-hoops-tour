"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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

  const supabase = await createClient();
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

  const supabase = await createClient();
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

  const supabase = await createClient();
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

  const supabase = await createClient();
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
    stato: stato || "in-arrivo",
  });

  if (error) {
    return { error: "Errore: " + error.message };
  }

  revalidatePath("/tappe");
  revalidatePath("/");
  return { success: true };
}

// Fetch data for admin page
export async function getAdminData(password: string) {
  if (!verifyAdmin(password)) {
    return null;
  }

  const supabase = await createClient();

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

  const supabase = await createClient();
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

  // Create slug from nome_torneo
  const slug = application.nome_torneo.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  // Create the tappa
  const { error: tappaError } = await supabase.from("tappe").insert({
    slug,
    nome: application.nome_torneo,
    nome_completo: application.nome_completo_torneo || null,
    data: application.data_proposta,
    orario: application.orario_proposto || "16:00",
    luogo: application.luogo,
    indirizzo: application.indirizzo || null,
    provincia: application.provincia || null,
    organizzatore: application.nome_organizzatore,
    contatto_organizzatore: application.email_organizzatore,
    instagram: application.instagram_torneo || null,
    descrizione: application.descrizione || null,
    stato: "in-arrivo",
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

  const supabase = await createClient();
  const applicationId = formData.get("applicationId") as string;
  const reason = formData.get("reason") as string;

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

  revalidatePath("/admin");
  return { success: true };
}
