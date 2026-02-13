-- ============================================
-- Team (squadra) applications for approval workflow
-- Run in Supabase SQL Editor
-- ============================================

create table if not exists public.team_applications (
  id uuid default uuid_generate_v4() primary key,
  -- Contact & auth (password used once on approve, then cleared)
  email text not null,
  password_plain text,
  -- Squadra
  nome_squadra text not null,
  motto text,
  instagram text,
  telefono text,
  -- Giocatori as JSON: [{ nome, cognome, ruolo?, instagram? }]
  giocatori jsonb not null default '[]',
  -- Status
  stato text default 'pending' check (stato in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default now(),
  reviewed_at timestamp with time zone,
  reviewed_by text
);

alter table public.team_applications enable row level security;

-- Anyone can submit (public form)
create policy "Anyone can submit team application"
  on public.team_applications for insert with check (true);

-- No public select; admin reads via service role in server actions
comment on table public.team_applications is 'Team registration applications; admin approves to create auth user + squadra + giocatori.';
