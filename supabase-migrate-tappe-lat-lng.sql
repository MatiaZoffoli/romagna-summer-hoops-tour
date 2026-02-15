-- Add coordinates to tappe for map
alter table public.tappe
  add column if not exists lat double precision,
  add column if not exists lng double precision;
