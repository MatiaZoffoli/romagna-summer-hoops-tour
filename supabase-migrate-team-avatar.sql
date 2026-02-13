-- ============================================
-- Team avatar: logo_url, preset icon/color, generated logo
-- Run in Supabase SQL Editor after team management migration
-- ============================================

alter table public.squadre
  add column if not exists logo_url text;

alter table public.squadre
  add column if not exists avatar_icon text;

alter table public.squadre
  add column if not exists avatar_color text;

alter table public.squadre
  add column if not exists generated_logo_url text;

alter table public.squadre
  add column if not exists logo_generated_at timestamp with time zone;

comment on column public.squadre.logo_url is 'Custom team logo image URL (or Supabase Storage URL after upload).';
comment on column public.squadre.avatar_icon is 'Preset icon id for avatar when no logo (e.g. basketball, trophy).';
comment on column public.squadre.avatar_color is 'Preset color id or hex for avatar background.';
comment on column public.squadre.generated_logo_url is 'One-time LLM-generated logo URL (stored after generation).';
comment on column public.squadre.logo_generated_at is 'When AI logo was generated; presence means no regenerate.';

-- Optional: create Storage bucket for generated team logos (or create in Supabase Dashboard: Storage > New bucket > "team-logos", Public).
-- The server action createBucket is called automatically if the bucket is missing when uploading.
