-- ============================================
-- Team management: unclaimed squadre, change requests, admin_notes
-- Run in Supabase SQL Editor after team_applications if needed
-- ============================================

-- 1. Allow unclaimed squadre: nullable auth_user_id and email
alter table public.squadre
  alter column auth_user_id drop not null;

alter table public.squadre
  alter column email drop not null;

-- 2. Admin notes for tracking
alter table public.squadre
  add column if not exists admin_notes text;

-- 3. Team change requests (team requests change, admin approves)
create table if not exists public.team_change_requests (
  id uuid default uuid_generate_v4() primary key,
  squadra_id uuid references public.squadre(id) on delete cascade not null,
  requested_by uuid references auth.users(id) on delete set null,
  payload jsonb not null default '{}',
  stato text default 'pending' check (stato in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default now(),
  reviewed_at timestamp with time zone,
  admin_notes text
);

create index if not exists team_change_requests_squadra_id on public.team_change_requests(squadra_id);
create index if not exists team_change_requests_stato on public.team_change_requests(stato);

alter table public.team_change_requests enable row level security;

create policy "Users can insert own team change request"
  on public.team_change_requests for insert
  with check (
    exists (
      select 1 from public.squadre
      where squadre.id = squadra_id and squadre.auth_user_id = auth.uid()
    )
  );

create policy "Users can select own team change requests"
  on public.team_change_requests for select
  using (
    exists (
      select 1 from public.squadre
      where squadre.id = squadra_id and squadre.auth_user_id = auth.uid()
    )
  );

-- Admin reads/updates via service role (no public policy for update)
