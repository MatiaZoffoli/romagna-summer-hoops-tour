"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/** Team requests social bonus for a tappa (admin will approve). */
export async function requestSocialBonus(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Devi essere loggato." };

  const tappaId = (formData.get("tappa_id") as string)?.trim();
  const linkToPost = (formData.get("link_to_post") as string)?.trim() || null;

  if (!tappaId) return { error: "Seleziona una tappa." };

  const { data: squadra } = await supabase
    .from("squadre")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (!squadra) return { error: "Squadra non trovata." };

  const { error } = await supabase.from("social_bonus_requests").insert({
    squadra_id: squadra.id,
    tappa_id: tappaId,
    link_to_post: linkToPost,
    stato: "pending",
  });

  if (error) {
    if (error.code === "23505") return { error: "Hai già richiesto il bonus per questa tappa." };
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/classifica");
  return { success: true };
}
