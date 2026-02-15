-- Tappa logo: one logo per tappa (and per application). Shown on map and tappa page.
-- Organizers can set it when applying; admin can set/edit from admin portal.

alter table public.tappe add column if not exists logo_url text;
alter table public.tappa_applications add column if not exists logo_url text;

-- Storage bucket for tappa logos (public read; uploads via service role from server)
insert into storage.buckets (id, name, public)
values ('tappa-logos', 'tappa-logos', true)
on conflict (id) do update set public = true;

-- Allow public read for tappa-logos
create policy "Tappa logos are publicly readable"
  on storage.objects for select
  using (bucket_id = 'tappa-logos');

-- Server uploads with service role (no RLS policy needed for insert/update from backend)
