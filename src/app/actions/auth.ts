"use server";

import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getSiteUrl } from "@/lib/site-url";
import { notifyAdminNewTeam, sendWelcomeToTeam } from "@/lib/email";

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
  // Use service role client to bypass RLS during signup (session may not be available yet)
  let serviceRoleClient;
  try {
    serviceRoleClient = createServiceRoleClient();
  } catch (error) {
    serviceRoleClient = supabase;
  }

  // One team per auth user: if this user already has a team (e.g. same email registered before), redirect to dashboard
  const { data: existingSquadra } = await serviceRoleClient
    .from("squadre")
    .select("id")
    .eq("auth_user_id", authData.user.id)
    .maybeSingle();

  if (existingSquadra) {
    // Already registered – send them to dashboard instead of failing
    redirect("/dashboard");
  }

  const { data: squadra, error: squadraError } = await serviceRoleClient
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
    if (squadraError.code === "23505" && squadraError.message?.includes("squadre_auth_user_id_key")) {
      return { error: "Questa email è già associata a una squadra. Accedi per andare alla dashboard." };
    }
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
    const { error: giocatoriError } = await serviceRoleClient
      .from("giocatori")
      .insert(giocatoriData);

    if (giocatoriError) {
      return { error: "Errore nell'inserimento dei giocatori: " + giocatoriError.message };
    }
  }

  // Send emails (don't block signup if they fail)
  try {
    await notifyAdminNewTeam({
      nome: nomeSquadra,
      email,
      telefono: telefono || null,
      instagram: instagram || null,
      motto: motto || null,
      giocatoriCount: giocatoriData.length,
    });
  } catch (e) {
    console.error("Admin new-team email error:", e);
  }
  try {
    await sendWelcomeToTeam({ nome: nomeSquadra, email });
  } catch (e) {
    console.error("Welcome email error:", e);
  }

  redirect("/dashboard");
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = (formData.get("email") as string)?.trim()?.toLowerCase() ?? "";
  const password = (formData.get("password") as string)?.trim() ?? "";

  if (!email || !password) {
    return { error: "Email e password sono obbligatori." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const hint =
      " Se la tua richiesta è stata appena approvata, usa la password indicata nella richiesta. Altrimenti prova con \"Password dimenticata?\" per reimpostarla.";
    return { error: "Email o password non corretti." + hint };
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email obbligatoria." };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getSiteUrl()}/reset-password/confirm`,
  });

  if (error) {
    return { error: "Errore nell'invio dell'email di reset. Riprova più tardi." };
  }

  return { success: true };
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return { error: "Password obbligatoria." };
  }

  if (password.length < 8) {
    return { error: "La password deve avere almeno 8 caratteri." };
  }

  if (password !== confirmPassword) {
    return { error: "Le password non corrispondono." };
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return { error: "Errore nell'aggiornamento della password. Il link potrebbe essere scaduto." };
  }

  redirect("/dashboard");
}
