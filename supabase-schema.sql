-- ============================================
-- ROMAGNA SUMMER HOOPS TOUR - Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- SQUADRE (Teams)
-- ============================================
create table public.squadre (
  id uuid default uuid_generate_v4() primary key,
  auth_user_id uuid references auth.users(id) on delete cascade unique,
  nome text not null,
  motto text,
  instagram text,
  email text not null,
  telefono text,
  created_at timestamp with time zone default now()
);

-- ============================================
-- GIOCATORI (Players)
-- ============================================
create table public.giocatori (
  id uuid default uuid_generate_v4() primary key,
  squadra_id uuid references public.squadre(id) on delete cascade not null,
  nome text not null,
  cognome text not null,
  ruolo text,
  instagram text,
  created_at timestamp with time zone default now()
);

-- ============================================
-- TAPPE (Tour Stops)
-- ============================================
create table public.tappe (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  nome text not null,
  nome_completo text,
  data text not null,
  orario text default '16:00',
  luogo text not null,
  indirizzo text,
  provincia text,
  organizzatore text,
  contatto_organizzatore text,
  instagram text,
  descrizione text,
  stato text default 'in-arrivo' check (stato in ('prossima', 'completata', 'in-arrivo')),
  created_at timestamp with time zone default now()
);

-- ============================================
-- RISULTATI (Results per team per tappa)
-- ============================================
create table public.risultati (
  id uuid default uuid_generate_v4() primary key,
  tappa_id uuid references public.tappe(id) on delete cascade not null,
  squadra_id uuid references public.squadre(id) on delete cascade not null,
  posizione integer not null,
  punti integer not null default 0,
  created_at timestamp with time zone default now(),
  unique(tappa_id, squadra_id)
);

-- ============================================
-- NEWS
-- ============================================
create table public.news (
  id uuid default uuid_generate_v4() primary key,
  titolo text not null,
  contenuto text not null,
  anteprima text not null,
  data text not null,
  created_at timestamp with time zone default now()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
alter table public.squadre enable row level security;
alter table public.giocatori enable row level security;
alter table public.tappe enable row level security;
alter table public.risultati enable row level security;
alter table public.news enable row level security;

-- SQUADRE policies
create policy "Squadre are viewable by everyone"
  on public.squadre for select using (true);

create policy "Users can update own team"
  on public.squadre for update using (auth.uid() = auth_user_id);

create policy "Users can insert own team"
  on public.squadre for insert with check (auth.uid() = auth_user_id);

-- GIOCATORI policies
create policy "Giocatori are viewable by everyone"
  on public.giocatori for select using (true);

create policy "Team owners can manage their players"
  on public.giocatori for insert
  with check (
    exists (
      select 1 from public.squadre
      where squadre.id = squadra_id and squadre.auth_user_id = auth.uid()
    )
  );

create policy "Team owners can update their players"
  on public.giocatori for update
  using (
    exists (
      select 1 from public.squadre
      where squadre.id = squadra_id and squadre.auth_user_id = auth.uid()
    )
  );

create policy "Team owners can delete their players"
  on public.giocatori for delete
  using (
    exists (
      select 1 from public.squadre
      where squadre.id = squadra_id and squadre.auth_user_id = auth.uid()
    )
  );

-- TAPPE policies (public read, admin manages via Supabase dashboard)
create policy "Tappe are viewable by everyone"
  on public.tappe for select using (true);

-- RISULTATI policies (public read, admin manages via Supabase dashboard)
create policy "Risultati are viewable by everyone"
  on public.risultati for select using (true);

-- NEWS policies (public read, admin manages via Supabase dashboard)
create policy "News are viewable by everyone"
  on public.news for select using (true);

-- ============================================
-- SEED DATA: Initial tappe
-- ============================================
insert into public.tappe (slug, nome, nome_completo, data, orario, luogo, indirizzo, provincia, organizzatore, descrizione, stato)
values
  ('kotg-cesenatico', 'KOTG', 'Kings of the Ghetto - Tappa ufficiale del Romagna Summer Hoops Tour', 'Sabato 11 Luglio 2026', '16:00', 'Cesenatico', 'Cesenatico (FC)', 'Forli-Cesena', 'Ghetto Ponente', 'Kings of the Ghetto - il torneo 3x3 di Cesenatico organizzato dal team Ghetto Ponente. Streetball, musica e good vibes sulla riviera.', 'prossima'),
  ('torneo-san-piero', 'San Piero', 'Torneo di San Piero - Tappa ufficiale del Romagna Summer Hoops Tour', 'Sabato 25 Luglio 2026', '16:00', 'San Piero', 'San Piero (FC)', 'Forli-Cesena', '', 'Il Torneo di San Piero entra nel circuito del Romagna Summer Hoops Tour. Un appuntamento fisso per gli appassionati del 3x3.', 'in-arrivo');

-- SEED DATA: Initial news
insert into public.news (titolo, contenuto, anteprima, data)
values
  ('Nasce il Romagna Summer Hoops Tour!', 'E'' con grande entusiasmo che annunciamo la nascita del Romagna Summer Hoops Tour, il primo circuito estivo di basket 3x3 che unisce i tornei della Romagna in un''unica grande esperienza. Da Rimini a Ravenna, da Cesena a Forli, l''estate 2026 sara'' all''insegna dello streetball. Preparatevi a vivere un''estate indimenticabile tra canestri, musica e buone vibes. Restate sintonizzati per tutte le novita''!', 'Il primo circuito estivo di basket 3x3 in Romagna e'' ufficiale. Un''estate di canestri, musica e street culture ti aspetta.', '9 Febbraio 2026'),
  ('Le prime tappe sono confermate!', 'Il calendario del Romagna Summer Hoops Tour inizia a prendere forma! Siamo felici di annunciare le prime due tappe ufficiali: il KOTG (Kings of the Ghetto) a Cesenatico (11 Luglio) e il Torneo di San Piero (25 Luglio). Altre tappe saranno annunciate nelle prossime settimane. Seguite i nostri canali per non perdere nessun aggiornamento!', 'KOTG a Cesenatico e il Torneo di San Piero aprono il calendario ufficiale del Tour.', '9 Febbraio 2026');
