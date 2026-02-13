"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { generateTeamLogoImage } from "@/lib/team-logo-llm";

const BUCKET = "team-logos";

export async function generateTeamLogo(context: { nome: string; motto?: string | null }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non autenticato." };

  const { data: squadra } = await supabase
    .from("squadre")
    .select("id, logo_generated_at")
    .eq("auth_user_id", user.id)
    .single();
  if (!squadra) return { error: "Squadra non trovata." };
  if (squadra.logo_generated_at) return { error: "Logo già generato." };

  const buffer = await generateTeamLogoImage({
    nome: context.nome || "Squadra",
    motto: context.motto ?? null,
  });
  if (!buffer) return { error: "Impossibile generare l'immagine." };

  const service = createServiceRoleClient();
  const path = `generated/${squadra.id}.png`;
  const { error: uploadErr } = await service.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: "image/png", upsert: true });
  if (uploadErr) {
    if (uploadErr.message?.includes("Bucket not found") || uploadErr.message?.includes("not found")) {
      try {
        await service.storage.createBucket(BUCKET, { public: true });
        const { error: retry } = await service.storage
          .from(BUCKET)
          .upload(path, buffer, { contentType: "image/png", upsert: true });
        if (retry) return { error: "Errore upload: " + retry.message };
      } catch (e) {
        return { error: "Crea il bucket 'team-logos' in Supabase Storage (pubblico)." };
      }
    } else {
      return { error: "Errore upload: " + uploadErr.message };
    }
  }

  const { data: urlData } = service.storage.from(BUCKET).getPublicUrl(path);
  const publicUrl = urlData.publicUrl;

  const { error: updateErr } = await service
    .from("squadre")
    .update({
      generated_logo_url: publicUrl,
      logo_generated_at: new Date().toISOString(),
    })
    .eq("id", squadra.id);
  if (updateErr) return { error: "Errore aggiornamento: " + updateErr.message };

  revalidatePath("/dashboard");
  revalidatePath("/squadre");
  revalidatePath("/");
  return { success: true, generated_logo_url: publicUrl };
}
