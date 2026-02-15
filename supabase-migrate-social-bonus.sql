-- ============================================
-- SOCIAL BONUS: +5 points per tappa when team shares on social
-- ============================================

-- Granted bonuses (one row per squadra per tappa)
create table if not exists public.social_bonus (
  id uuid default uuid_generate_v4() primary key,
  squadra_id uuid references public.squadre(id) on delete cascade not null,
  tappa_id uuid references public.tappe(id) on delete cascade not null,
  granted_at timestamp with time zone default now(),
  unique(squadra_id, tappa_id)
);

-- Requests from dashboard (team requests, admin approves)
create table if not exists public.social_bonus_requests (
  id uuid default uuid_generate_v4() primary key,
  squadra_id uuid references public.squadre(id) on delete cascade not null,
  tappa_id uuid references public.tappe(id) on delete cascade not null,
  link_to_post text,
  stato text default 'pending' check (stato in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default now(),
  reviewed_at timestamp with time zone,
  unique(squadra_id, tappa_id)
);

create index if not exists social_bonus_squadra_id on public.social_bonus(squadra_id);
create index if not exists social_bonus_tappa_id on public.social_bonus(tappa_id);
create index if not exists social_bonus_requests_stato on public.social_bonus_requests(stato);

alter table public.social_bonus enable row level security;
alter table public.social_bonus_requests enable row level security;

create policy "Social bonus is viewable by everyone"
  on public.social_bonus for select using (true);

create policy "Social bonus requests: team can insert own"
  on public.social_bonus_requests for insert
  with check (
    exists (
      select 1 from public.squadre
      where squadre.id = squadra_id and squadre.auth_user_id = auth.uid()
    )
  );

create policy "Social bonus requests: team can select own"
  on public.social_bonus_requests for select
  using (
    exists (
      select 1 from public.squadre
      where squadre.id = squadra_id and squadre.auth_user_id = auth.uid()
    )
  );

-- Admin read/write via service role (no policy for admin; use service role in actions)
