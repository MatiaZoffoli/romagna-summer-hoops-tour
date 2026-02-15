"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { notifyAdminNewApplication } from "@/lib/email";
import { uploadTappaLogoFile } from "@/app/actions/tappa-logo";

export async function submitTappaApplication(formData: FormData) {
  const supabase = await createClient();

  const nomeOrganizzatore = formData.get("nomeOrganizzatore") as string;
  const emailOrganizzatore = formData.get("emailOrganizzatore") as string;
  const telefonoOrganizzatore = formData.get("telefonoOrganizzatore") as string;
  const nomeTorneo = formData.get("nomeTorneo") as string;
  const nomeCompletoTorneo = formData.get("nomeCompletoTorneo") as string;
  const dataProposta = formData.get("dataProposta") as string;
  const orarioProposto = formData.get("orarioProposto") as string;
  const luogo = formData.get("luogo") as string;
  const indirizzo = formData.get("indirizzo") as string;
  const provincia = formData.get("provincia") as string;
  const instagramTorneo = formData.get("instagramTorneo") as string;
  const descrizione = formData.get("descrizione") as string;
  const numeroSquadrePreviste = formData.get("numeroSquadrePreviste") as string;
  const noteAggiuntive = formData.get("noteAggiuntive") as string;
  let logoUrl = (formData.get("logoUrl") as string)?.trim() || null;
  const logoFile = formData.get("logo") as File | null;
  if (logoFile && logoFile.size > 0) {
    const fd = new FormData();
    fd.append("logo", logoFile);
    const up = await uploadTappaLogoFile(fd);
    if (up.error) return { error: up.error };
    if (up.url) logoUrl = up.url;
  }

  if (!nomeOrganizzatore || !emailOrganizzatore || !nomeTorneo || !dataProposta || !luogo) {
    return { error: "I campi obbligatori devono essere compilati." };
  }

  const { error } = await supabase.from("tappa_applications").insert({
    nome_organizzatore: nomeOrganizzatore,
    email_organizzatore: emailOrganizzatore,
    telefono_organizzatore: telefonoOrganizzatore || null,
    nome_torneo: nomeTorneo,
    nome_completo_torneo: nomeCompletoTorneo || null,
    data_proposta: dataProposta,
    orario_proposto: orarioProposto || "16:00",
    luogo,
    indirizzo: indirizzo || null,
    provincia: provincia || null,
    instagram_torneo: instagramTorneo || null,
    descrizione: descrizione || null,
    numero_squadre_previste: numeroSquadrePreviste ? parseInt(numeroSquadrePreviste) : null,
    note_aggiuntive: noteAggiuntive || null,
    logo_url: logoUrl,
    stato: "pending",
  });

  if (error) {
    return { error: "Errore nell'invio della domanda: " + error.message };
  }

  // Send email notification to admin (don't fail if email fails)
  try {
    await notifyAdminNewApplication({
      nome_organizzatore: nomeOrganizzatore,
      email_organizzatore: emailOrganizzatore,
      telefono_organizzatore: telefonoOrganizzatore || null,
      nome_torneo: nomeTorneo,
      nome_completo_torneo: nomeCompletoTorneo || null,
      data_proposta: dataProposta,
      orario_proposto: orarioProposto || "16:00",
      luogo,
      provincia: provincia || null,
      descrizione: descrizione || null,
    });
  } catch (emailError) {
    console.error("Failed to send admin notification email:", emailError);
    // Don't fail the submission if email fails
  }

  revalidatePath("/admin");
  return { success: true };
}
