-- ============================================
-- Gallery photos: up to 5 Instagram post URLs per tappa
-- Run in Supabase SQL Editor
-- ============================================

create table if not exists public.gallery_photos (
  id uuid default uuid_generate_v4() primary key,
  tappa_id uuid references public.tappe(id) on delete cascade not null,
  instagram_post_url text not null,
  ordine integer not null default 0,
  created_at timestamp with time zone default now(),
  unique(tappa_id, instagram_post_url)
);

-- Max 5 rows per tappa: ordine 0-4 unique per tappa
alter table public.gallery_photos
  add constraint gallery_photos_ordine_range check (ordine >= 0 and ordine <= 4);

create unique index gallery_photos_tappa_ordine_key
  on public.gallery_photos (tappa_id, ordine);

create index gallery_photos_tappa_id on public.gallery_photos(tappa_id);

alter table public.gallery_photos enable row level security;

create policy "Gallery photos are viewable by everyone"
  on public.gallery_photos for select using (true);

comment on table public.gallery_photos is 'Up to 5 Instagram post URLs per tappa for the Gallery page; ordine 0-4. INSERT/UPDATE/DELETE via service role (admin).';
