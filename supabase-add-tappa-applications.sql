-- ============================================
-- ADD TAPPA APPLICATIONS TABLE
-- Run this in Supabase SQL Editor
-- (Only run this if you already have the main tables)
-- ============================================

-- Create the table
create table public.tappa_applications (
  id uuid default uuid_generate_v4() primary key,
  -- Organizer info
  nome_organizzatore text not null,
  email_organizzatore text not null,
  telefono_organizzatore text,
  -- Tournament info
  nome_torneo text not null,
  nome_completo_torneo text,
  data_proposta text not null,
  orario_proposto text default '16:00',
  luogo text not null,
  indirizzo text,
  provincia text,
  instagram_torneo text,
  descrizione text,
  -- Additional info
  numero_squadre_previste integer,
  note_aggiuntive text,
  -- Status
  stato text default 'pending' check (stato in ('pending', 'approved', 'rejected')),
  -- Timestamps
  created_at timestamp with time zone default now(),
  reviewed_at timestamp with time zone,
  reviewed_by text
);

-- Enable RLS
alter table public.tappa_applications enable row level security;

-- RLS Policy: Anyone can submit applications
create policy "Anyone can submit applications"
  on public.tappa_applications for insert with check (true);

-- Note: Reading applications requires admin access (handled via admin password in server actions)
-- No public select policy - only admins can view via admin panel
