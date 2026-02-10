"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateTeamProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Non autenticato." };
  }

  const nome = formData.get("nome") as string;
  const motto = formData.get("motto") as string;
  const instagram = formData.get("instagram") as string;
  const telefono = formData.get("telefono") as string;
  const giocatoriJson = formData.get("giocatori") as string;

  if (!nome) {
    return { error: "Il nome squadra e' obbligatorio." };
  }

  // Update team
  const { error: squadraError } = await supabase
    .from("squadre")
    .update({
      nome,
      motto: motto || null,
      instagram: instagram || null,
      telefono: telefono || null,
    })
    .eq("auth_user_id", user.id);

  if (squadraError) {
    return { error: "Errore nell'aggiornamento: " + squadraError.message };
  }

  // Get the team ID
  const { data: squadra } = await supabase
    .from("squadre")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (!squadra) {
    return { error: "Squadra non trovata." };
  }

  // Update players: delete all and re-insert
  if (giocatoriJson) {
    let giocatori: { nome: string; cognome: string; ruolo: string; instagram: string }[] = [];
    try {
      giocatori = JSON.parse(giocatoriJson);
    } catch {
      return { error: "Errore nei dati dei giocatori." };
    }

    // Delete existing players
    await supabase.from("giocatori").delete().eq("squadra_id", squadra.id);

    // Insert new players
    const giocatoriData = giocatori
      .filter((g) => g.nome && g.cognome)
      .map((g) => ({
        squadra_id: squadra.id,
        nome: g.nome,
        cognome: g.cognome,
        ruolo: g.ruolo || null,
        instagram: g.instagram || null,
      }));

    if (giocatoriData.length > 0) {
      const { error: giocatoriError } = await supabase
        .from("giocatori")
        .insert(giocatoriData);

      if (giocatoriError) {
        return { error: "Errore nell'aggiornamento giocatori: " + giocatoriError.message };
      }
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/squadre");
  return { success: true };
}
