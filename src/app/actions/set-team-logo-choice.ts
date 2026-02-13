"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function setTeamLogoChoice(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non autenticato." };

  const choice = (formData.get("choice") as string) || "";
  const logoUrl = (formData.get("logo_url") as string)?.trim() || null;
  const avatarIcon = (formData.get("avatar_icon") as string)?.trim() || null;
  const avatarColor = (formData.get("avatar_color") as string)?.trim() || null;

  const service = createServiceRoleClient();
  const { data: squadra } = await service
    .from("squadre")
    .select("id, generated_logo_url")
    .eq("auth_user_id", user.id)
    .single();
  if (!squadra) return { error: "Squadra non trovata." };

  let update: { logo_url: string | null; avatar_icon: string | null; avatar_color: string | null } = {
    logo_url: null,
    avatar_icon: null,
    avatar_color: null,
  };
  if (choice === "generated" && squadra.generated_logo_url) {
    update.logo_url = squadra.generated_logo_url;
  } else if (choice === "url" && logoUrl) {
    update.logo_url = logoUrl;
  } else if (choice === "preset") {
    update.avatar_icon = avatarIcon;
    update.avatar_color = avatarColor;
  }

  const { error } = await service.from("squadre").update(update).eq("id", squadra.id);
  if (error) return { error: "Errore: " + error.message };
  revalidatePath("/dashboard");
  revalidatePath("/squadre");
  revalidatePath("/");
  return { success: true };
}
