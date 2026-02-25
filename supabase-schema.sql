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
  auth_user_id uuid references auth.users(id) on delete set null unique,
  nome text not null,
  motto text,
  instagram text,
  email text,
  telefono text,
  admin_notes text,
  logo_url text,
  avatar_icon text,
  avatar_color text,
  generated_logo_url text,
  logo_generated_at timestamp with time zone,
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
  stato text default 'confermata' check (stato in ('pending', 'confermata', 'in_corso', 'in_attesa_risultati', 'conclusa')),
  lat double precision,
  lng double precision,
  logo_url text,
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
  partite_giocate integer,
  partite_vinte integer,
  punti_fatti integer,
  punti_subiti integer,
  created_at timestamp with time zone default now(),
  unique(tappa_id, squadra_id)
);

-- ============================================
-- SOCIAL BONUS (+5 points per tappa when team shares)
-- ============================================
create table public.social_bonus (
  id uuid default uuid_generate_v4() primary key,
  squadra_id uuid references public.squadre(id) on delete cascade not null,
  tappa_id uuid references public.tappe(id) on delete cascade not null,
  granted_at timestamp with time zone default now(),
  unique(squadra_id, tappa_id)
);

create table public.social_bonus_requests (
  id uuid default uuid_generate_v4() primary key,
  squadra_id uuid references public.squadre(id) on delete cascade not null,
  tappa_id uuid references public.tappe(id) on delete cascade not null,
  link_to_post text,
  stato text default 'pending' check (stato in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default now(),
  reviewed_at timestamp with time zone,
  unique(squadra_id, tappa_id)
);

-- ============================================
-- MVPs (Most Valuable Player per tappa)
-- ============================================
create table public.mvps (
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

-- ============================================
-- NEWS
-- ============================================
create table public.news (
  id uuid default uuid_generate_v4() primary key,
  titolo text not null,
  contenuto text not null,
  anteprima text not null,
  data text not null,
  image_url text,
  instagram_caption text,
  created_at timestamp with time zone default now()
);

-- ============================================
-- GALLERY PHOTOS (up to 5 Instagram post URLs per tappa)
-- ============================================
create table if not exists public.gallery_photos (
  id uuid default uuid_generate_v4() primary key,
  tappa_id uuid references public.tappe(id) on delete cascade not null,
  instagram_post_url text not null,
  ordine integer not null default 0 check (ordine >= 0 and ordine <= 4),
  created_at timestamp with time zone default now(),
  unique(tappa_id, instagram_post_url)
);
create unique index if not exists gallery_photos_tappa_ordine_key on public.gallery_photos (tappa_id, ordine);
create index if not exists gallery_photos_tappa_id on public.gallery_photos(tappa_id);
alter table public.gallery_photos enable row level security;
create policy "Gallery photos are viewable by everyone" on public.gallery_photos for select using (true);

-- ============================================
-- TAPPA APPLICATIONS (Organizer submissions)
-- ============================================
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
  logo_url text,
  -- Status
  stato text default 'pending' check (stato in ('pending', 'approved', 'rejected')),
  -- Timestamps
  created_at timestamp with time zone default now(),
  reviewed_at timestamp with time zone,
  reviewed_by text
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
alter table public.tappa_applications enable row level security;

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

-- TAPPA_APPLICATIONS policies
create policy "Anyone can submit applications"
  on public.tappa_applications for insert with check (true);

-- ============================================
-- TEAM APPLICATIONS (Squadra registration for approval)
-- ============================================
create table public.team_applications (
  id uuid default uuid_generate_v4() primary key,
  email text not null,
  password_plain text,
  nome_squadra text not null,
  motto text,
  instagram text,
  telefono text,
  giocatori jsonb not null default '[]',
  stato text default 'pending' check (stato in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default now(),
  reviewed_at timestamp with time zone,
  reviewed_by text
);

alter table public.team_applications enable row level security;

create policy "Anyone can submit team application"
  on public.team_applications for insert with check (true);

-- ============================================
-- TEAM CHANGE REQUESTS (team requests change, admin approves)
-- ============================================
create table public.team_change_requests (
  id uuid default uuid_generate_v4() primary key,
  squadra_id uuid references public.squadre(id) on delete cascade not null,
  requested_by uuid references auth.users(id) on delete set null,
  payload jsonb not null default '{}',
  stato text default 'pending' check (stato in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default now(),
  reviewed_at timestamp with time zone,
  admin_notes text
);

create index team_change_requests_squadra_id on public.team_change_requests(squadra_id);
create index team_change_requests_stato on public.team_change_requests(stato);

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

-- Note: Reading applications requires admin access (handled via admin password in server actions)

-- ============================================
-- SEED DATA: Initial tappe
-- ============================================
insert into public.tappe (slug, nome, nome_completo, data, orario, luogo, indirizzo, provincia, organizzatore, descrizione, stato)
values
  ('kotg-cesenatico', 'KOTG', 'Kings of the Ghetto - Tappa ufficiale del Romagna Summer Hoops Tour', 'Sabato 11 Luglio 2026', '16:00', 'Cesenatico', 'Cesenatico (FC)', 'Forli-Cesena', 'Ghetto Ponente', 'Kings of the Ghetto - il torneo 3x3 di Cesenatico organizzato dal team Ghetto Ponente. Streetball, musica e good vibes sulla riviera.', 'confermata'),
  ('torneo-san-piero', 'San Piero', 'Torneo di San Piero - Tappa ufficiale del Romagna Summer Hoops Tour', 'Sabato 25 Luglio 2026', '16:00', 'San Piero', 'San Piero (FC)', 'Forli-Cesena', '', 'Il Torneo di San Piero entra nel circuito del Romagna Summer Hoops Tour. Un appuntamento fisso per gli appassionati del 3x3.', 'confermata');

-- SEED DATA: Initial news
insert into public.news (titolo, contenuto, anteprima, data)
values
  ('Nasce il Romagna Summer Hoops Tour!', 'E'' con grande entusiasmo che annunciamo la nascita del Romagna Summer Hoops Tour, il primo circuito estivo di basket 3x3 che unisce i tornei della Romagna in un''unica grande esperienza. Da Rimini a Ravenna, da Cesena a Forli, l''estate 2026 sara'' all''insegna dello streetball. Preparatevi a vivere un''estate indimenticabile tra canestri, musica e buone vibes. Restate sintonizzati per tutte le novita''!', 'Il primo circuito estivo di basket 3x3 in Romagna e'' ufficiale. Un''estate di canestri, musica e street culture ti aspetta.', '9 Febbraio 2026'),
  ('Abbiamo la prima tappa confermata!', 'Il calendario del Romagna Summer Hoops Tour inizia a prendere forma! Siamo felici di annunciare la prima tappa ufficiale: il KOTG, la seconda edizione del Kings of the Ghetto, organizzato dal team Ghetto Ponente, si volgerà a Cesenatico, l'11 Luglio. Altre tappe saranno annunciate nelle prossime settimane. Seguite i nostri canali per non perdere nessun aggiornamento!', 'Il KOTG 2nd Edition a Cesenatico apre il calendario ufficiale del Tour.', '12 Febbraio 2026');
