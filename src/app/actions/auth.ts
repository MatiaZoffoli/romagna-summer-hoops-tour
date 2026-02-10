"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface GiocatoreInput {
  nome: string;
  cognome: string;
  ruolo: string;
  instagram: string;
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const nomeSquadra = formData.get("nomeSquadra") as string;
  const motto = formData.get("motto") as string;
  const instagram = formData.get("instagram") as string;
  const telefono = formData.get("telefono") as string;
  const giocatoriJson = formData.get("giocatori") as string;

  if (!email || !password || !nomeSquadra) {
    return { error: "Email, password e nome squadra sono obbligatori." };
  }

  if (password.length < 8) {
    return { error: "La password deve avere almeno 8 caratteri." };
  }

  let giocatori: GiocatoreInput[] = [];
  try {
    giocatori = JSON.parse(giocatoriJson);
  } catch {
    return { error: "Errore nei dati dei giocatori." };
  }

  if (giocatori.length < 3) {
    return { error: "Servono almeno 3 giocatori." };
  }

  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    if (authError.message.includes("already registered")) {
      return { error: "Questa email e' gia' registrata." };
    }
    return { error: authError.message };
  }

  if (!authData.user) {
    return { error: "Errore nella creazione dell'account." };
  }

  // 2. Create team
  const { data: squadra, error: squadraError } = await supabase
    .from("squadre")
    .insert({
      auth_user_id: authData.user.id,
      nome: nomeSquadra,
      motto: motto || null,
      instagram: instagram || null,
      email,
      telefono: telefono || null,
    })
    .select()
    .single();

  if (squadraError) {
    return { error: "Errore nella creazione della squadra: " + squadraError.message };
  }

  // 3. Create players
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
      return { error: "Errore nell'inserimento dei giocatori: " + giocatoriError.message };
    }
  }

  redirect("/dashboard");
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email e password sono obbligatori." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Email o password non corretti." };
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
