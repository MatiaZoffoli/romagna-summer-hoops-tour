-- ============================================
-- Gallery tappa images: up to 3 uploaded images per tappa (manual, square crop on frontend)
-- Run in Supabase SQL Editor
-- ============================================

create table if not exists public.gallery_tappa_images (
  id uuid default uuid_generate_v4() primary key,
  tappa_id uuid references public.tappe(id) on delete cascade not null,
  image_url text not null,
  ordine integer not null default 0,
  created_at timestamp with time zone default now(),
  constraint gallery_tappa_images_ordine_range check (ordine >= 0 and ordine <= 2)
);

create unique index gallery_tappa_images_tappa_ordine_key
  on public.gallery_tappa_images (tappa_id, ordine);

create index gallery_tappa_images_tappa_id on public.gallery_tappa_images(tappa_id);

alter table public.gallery_tappa_images enable row level security;

create policy "Gallery tappa images are viewable by everyone"
  on public.gallery_tappa_images for select using (true);

comment on table public.gallery_tappa_images is 'Up to 3 uploaded images per tappa for Gallery page; displayed as uniform squares with center crop. INSERT/UPDATE/DELETE via service role (admin).';
