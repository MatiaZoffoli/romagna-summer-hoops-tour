"use server";

import { createServiceRoleClient } from "@/lib/supabase/server";

const BUCKET = "tappa-logos";

/** Upload a logo file to tappa-logos bucket; returns public URL or error. Call from admin or application form. */
export async function uploadTappaLogoFile(formData: FormData): Promise<{ url?: string; error?: string }> {
  const file = formData.get("logo") as File | null;
  if (!file || file.size === 0) return { error: "Nessun file selezionato." };

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) return { error: "Formato non supportato. Usa JPG, PNG, WebP o GIF." };

  const maxMb = 2;
  if (file.size > maxMb * 1024 * 1024) return { error: `File troppo grande (max ${maxMb} MB).` };

  const service = createServiceRoleClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const { error: uploadErr } = await service.storage.from(BUCKET).upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

    if (uploadErr) {
      if (uploadErr.message?.includes("Bucket not found") || uploadErr.message?.includes("not found")) {
        await service.storage.createBucket(BUCKET, { public: true });
        const { error: retry } = await service.storage.from(BUCKET).upload(path, buffer, {
          contentType: file.type,
          upsert: false,
        });
        if (retry) return { error: "Errore upload: " + retry.message };
      } else {
        return { error: "Errore upload: " + uploadErr.message };
      }
    }

    const { data: urlData } = service.storage.from(BUCKET).getPublicUrl(path);
    return { url: urlData.publicUrl };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Errore upload." };
  }
}
