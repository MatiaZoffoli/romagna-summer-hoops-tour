"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { notifyAdminNewTeamApplication } from "@/lib/email";

export async function submitTeamApplication(formData: FormData) {
  const supabase = await createClient();

  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const nomeSquadra = (formData.get("nomeSquadra") as string)?.trim();
  const motto = (formData.get("motto") as string)?.trim() || null;
  const instagram = (formData.get("instagram") as string)?.trim() || null;
  const telefono = (formData.get("telefono") as string)?.trim() || null;
  const giocatoriJson = formData.get("giocatori") as string;

  if (!email || !password || !nomeSquadra) {
    return { error: "Email, password e nome squadra sono obbligatori." };
  }

  if (password.length < 8) {
    return { error: "La password deve avere almeno 8 caratteri." };
  }

  let giocatori: { nome: string; cognome: string; ruolo?: string; instagram?: string }[] = [];
  try {
    giocatori = JSON.parse(giocatoriJson || "[]");
  } catch {
    return { error: "Errore nei dati dei giocatori." };
  }

  const validGiocatori = giocatori.filter((g) => g.nome?.trim() && g.cognome?.trim());
  if (validGiocatori.length < 3) {
    return { error: "Servono almeno 3 giocatori con nome e cognome." };
  }

  const { error } = await supabase.from("team_applications").insert({
    email,
    password_plain: password,
    nome_squadra: nomeSquadra,
    motto,
    instagram,
    telefono,
    giocatori: validGiocatori.map((g) => ({
      nome: g.nome.trim(),
      cognome: g.cognome.trim(),
      ruolo: g.ruolo?.trim() || null,
      instagram: g.instagram?.trim() || null,
    })),
    stato: "pending",
  });

  if (error) {
    return { error: "Errore nell'invio della richiesta: " + error.message };
  }

  try {
    await notifyAdminNewTeamApplication({
      nome_squadra: nomeSquadra,
      email,
      telefono,
      instagram,
      motto,
      giocatori_count: validGiocatori.length,
    });
  } catch (emailError) {
    console.error("Failed to send admin team application email:", emailError);
  }

  revalidatePath("/admin");
  return { success: true };
}
