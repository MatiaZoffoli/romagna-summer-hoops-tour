-- Optional match-level stats per team per tappa (for win %, media punti fatti/subiti)
alter table public.risultati
  add column if not exists partite_giocate integer,
  add column if not exists partite_vinte integer,
  add column if not exists punti_fatti integer,
  add column if not exists punti_subiti integer;
