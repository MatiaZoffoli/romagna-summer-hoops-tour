-- ============================================
-- Migrate tappe.stato to new 5-state workflow
-- Run this in Supabase SQL Editor if you already have the tappe table
-- ============================================

-- 1. Drop old check constraint first (so we can write new values)
ALTER TABLE public.tappe DROP CONSTRAINT IF EXISTS tappe_stato_check;

-- 2. Map existing values to new enum
UPDATE public.tappe SET stato = 'confermata' WHERE stato IN ('in-arrivo', 'prossima');
UPDATE public.tappe SET stato = 'conclusa' WHERE stato = 'completata';

-- 3. Add new check constraint and default
ALTER TABLE public.tappe
  ADD CONSTRAINT tappe_stato_check
  CHECK (stato IN ('pending', 'confermata', 'in_corso', 'in_attesa_risultati', 'conclusa'));

ALTER TABLE public.tappe ALTER COLUMN stato SET DEFAULT 'confermata';
