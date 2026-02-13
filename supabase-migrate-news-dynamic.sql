-- ============================================
-- Add dynamic news fields + Instagram draft caption
-- Run in Supabase SQL Editor if you already have the news table
-- ============================================

-- Optional image for the news article (displayed on site)
alter table public.news
  add column if not exists image_url text;

-- Draft caption for Instagram (copy in admin, no Meta API)
alter table public.news
  add column if not exists instagram_caption text;

comment on column public.news.image_url is 'Optional image URL for the news article';
comment on column public.news.instagram_caption is 'Draft caption for Instagram post; copy manually (no Meta API)';
