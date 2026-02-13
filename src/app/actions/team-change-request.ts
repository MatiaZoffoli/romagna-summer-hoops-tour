"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { notifyAdminNewTeamChangeRequest } from "@/lib/email";

export async function submitTeamChangeRequest(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Non autenticato." };
  }

  const { data: squadra } = await supabase
    .from("squadre")
    .select("id, nome")
    .eq("auth_user_id", user.id)
    .single();

  if (!squadra) {
    return { error: "Squadra non trovata." };
  }

  const nome = (formData.get("nome") as string)?.trim();
  const motto = (formData.get("motto") as string)?.trim() || null;
  const instagram = (formData.get("instagram") as string)?.trim() || null;
  const telefono = (formData.get("telefono") as string)?.trim() || null;
  const logoUrl = (formData.get("logo_url") as string)?.trim() || null;
  const avatarIcon = (formData.get("avatar_icon") as string)?.trim() || null;
  const avatarColor = (formData.get("avatar_color") as string)?.trim() || null;
  const giocatoriJson = formData.get("giocatori") as string;

  if (!nome) {
    return { error: "Il nome squadra è obbligatorio." };
  }

  let giocatori: { nome: string; cognome: string; ruolo?: string; instagram?: string }[] = [];
  if (giocatoriJson) {
    try {
      giocatori = JSON.parse(giocatoriJson);
    } catch {
      return { error: "Errore nei dati dei giocatori." };
    }
  }

  const payload = {
    nome,
    motto,
    instagram,
    telefono,
    logo_url: logoUrl,
    avatar_icon: avatarIcon,
    avatar_color: avatarColor,
    giocatori: giocatori.filter((g) => g.nome?.trim() && g.cognome?.trim()),
  };

  const { error } = await supabase.from("team_change_requests").insert({
    squadra_id: squadra.id,
    requested_by: user.id,
    payload,
    stato: "pending",
  });

  if (error) {
    return { error: "Errore nell'invio della richiesta: " + error.message };
  }

  try {
    const payloadSummary = [payload.nome && `Nome: ${payload.nome}`, payload.motto && `Motto: ${payload.motto}`, Array.isArray(payload.giocatori) && payload.giocatori.length > 0 && `${payload.giocatori.length} giocatori`].filter(Boolean).join(" · ") || undefined;
    await notifyAdminNewTeamChangeRequest({
      squadra_nome: squadra.nome ?? "Squadra",
      squadra_id: squadra.id,
      payload_summary: payloadSummary,
    });
  } catch (e) {
    console.error("Failed to send admin change request email:", e);
  }

  revalidatePath("/dashboard");
  revalidatePath("/admin");
  return { success: true };
}
