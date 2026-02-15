-- ============================================
-- MVPs (Most Valuable Player per tappa)
-- ============================================

create table if not exists public.mvps (
  id uuid default uuid_generate_v4() primary key,
  tappa_id uuid references public.tappe(id) on delete cascade not null,
  nome text not null,
  cognome text not null,
  photo_url text,
  bio text,
  carriera text,
  stats jsonb default '{}',
  ordine integer default 0,
  created_at timestamp with time zone default now()
);

create index if not exists mvps_tappa_id on public.mvps(tappa_id);

alter table public.mvps enable row level security;

create policy "MVPs are viewable by everyone"
  on public.mvps for select using (true);

-- Admin insert/update/delete via service role
