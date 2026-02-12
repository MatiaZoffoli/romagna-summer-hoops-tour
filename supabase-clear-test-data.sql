-- ============================================
-- Clear all test data from public tables
-- Run this in Supabase SQL Editor when you want to wipe data and start fresh.
-- Schema and RLS policies are left intact.
-- ============================================

-- Delete in order to respect foreign keys (children first)
delete from public.risultati;
delete from public.giocatori;
delete from public.tappe;
delete from public.squadre;
-- delete from public.news;
delete from public.tappa_applications;

-- Optional: reset sequences if you use serials (this schema uses uuid, so no sequences to reset)
